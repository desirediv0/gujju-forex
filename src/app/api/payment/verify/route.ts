import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchRazorpayPayment, verifyPaymentSignature } from "@/lib/razorpay";
import { verifySchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = verifySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = parsed.data;

  // 1. Cryptographic HMAC-SHA256 signature verification
  if (!verifyPaymentSignature(orderId, paymentId, signature)) {
    console.warn(`[verify] Signature mismatch for order ${orderId}, payment ${paymentId}`);
    await prisma.order
      .updateMany({
        where: { razorpayOrderId: orderId, status: { not: "PAID" } },
        data: { status: "FAILED", failureReason: "Signature verification failed" },
      })
      .catch(() => null);
    return NextResponse.json(
      { error: "Payment could not be verified (invalid signature)" },
      { status: 400 },
    );
  }

  try {
    // 2. Fetch order from DB
    const order = await prisma.order.findUnique({
      where: { razorpayOrderId: orderId },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3. IDEMPOTENCY: If order is ALREADY paid (e.g. processed by webhook or concurrent call), return immediately
    if (order.status === "PAID") {
      return NextResponse.json({
        ok: true,
        leadId: order.leadId,
        paymentId: order.razorpayPaymentId ?? paymentId,
        alreadyProcessed: true,
      });
    }

    // 4. FRAUD & SCAM PROTECTION: Verify with Razorpay API directly
    let paymentMethod: string | null = null;
    const rzpPayment = await fetchRazorpayPayment(paymentId);
    if (rzpPayment) {
      // Must match our order id
      if (rzpPayment.order_id !== orderId) {
        console.error(`[verify] FRAUD ALERT: payment ${paymentId} order_id (${rzpPayment.order_id}) != expected (${orderId})`);
        return NextResponse.json({ error: "Payment does not match this order" }, { status: 400 });
      }

      // Must match exact expected amount (e.g. 1900 paise = Rs 19)
      if (Number(rzpPayment.amount) !== order.amount) {
        console.error(`[verify] FRAUD ALERT: payment ${paymentId} amount (${rzpPayment.amount}) != expected (${order.amount})`);
        return NextResponse.json({ error: "Payment amount does not match expected amount" }, { status: 400 });
      }

      // Must be authorized or captured
      if (rzpPayment.status !== "captured" && rzpPayment.status !== "authorized") {
        console.error(`[verify] Payment ${paymentId} is in status ${rzpPayment.status}`);
        return NextResponse.json({ error: "Payment is not marked as completed by Razorpay" }, { status: 400 });
      }

      paymentMethod = (rzpPayment.method as string) ?? null;
    }

    // 5. ATOMIC STATUS TRANSITION (Race-condition safe under 10-20 req/s)
    await prisma.$transaction(async (tx) => {
      const current = await tx.order.findUnique({
        where: { id: order.id },
      });

      // If another concurrent request already marked it PAID, exit cleanly
      if (current?.status === "PAID") return;

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
          method: paymentMethod ?? current?.method,
          paidAt: current?.paidAt ?? new Date(),
          failureReason: null,
        },
      });

      await tx.lead.update({
        where: { id: order.leadId },
        data: { status: "PAID" },
      });
    });

    return NextResponse.json({ ok: true, leadId: order.leadId, paymentId });
  } catch (error) {
    console.error("[verify] Database error while confirming order", error);
    return NextResponse.json(
      { error: "Could not confirm order in database. Please contact support." },
      { status: 500 }
    );
  }
}
