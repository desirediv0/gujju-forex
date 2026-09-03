import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaymentSignature } from "@/lib/razorpay";
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

  if (!verifyPaymentSignature(orderId, paymentId, signature)) {
    // Only flag orders that have not already been settled. A forged or replayed
    // request must never be able to downgrade a genuinely paid order.
    await prisma.order
      .updateMany({
        where: { razorpayOrderId: orderId, status: { not: "PAID" } },
        data: { status: "FAILED", failureReason: "Signature verification failed" },
      })
      .catch(() => null);
    return NextResponse.json(
      { error: "Payment could not be verified" },
      { status: 400 },
    );
  }

  const order = await prisma.order.findUnique({
    where: { razorpayOrderId: orderId },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        paidAt: new Date(),
        failureReason: null,
      },
    }),
    prisma.lead.update({
      where: { id: order.leadId },
      data: { status: "PAID" },
    }),
  ]);

  return NextResponse.json({ ok: true, leadId: order.leadId, paymentId });
}
