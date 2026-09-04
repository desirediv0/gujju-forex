import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server-to-server source of truth. Configure this URL in the Razorpay
 * dashboard (Settings -> Webhooks) for `payment.captured` and
 * `payment.failed`, and set RAZORPAY_WEBHOOK_SECRET to the same secret.
 */
export async function POST(request: Request) {
  const raw = await request.text().catch(() => "");
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(raw, signature)) {
    console.warn("[webhook] Invalid Razorpay webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          amount?: number;
          currency?: string;
          method?: string;
          error_description?: string;
        };
      };
    };
  };

  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const eventName = event?.event;
  const payment = event?.payload?.payment?.entity;
  const orderId = payment?.order_id;

  if (!orderId) {
    return NextResponse.json({ ok: true, ignored: eventName ?? "unknown_event" });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { razorpayOrderId: orderId },
    });
    if (!order) {
      console.warn(`[webhook] Order not found for razorpay order ${orderId}`);
      return NextResponse.json({ ok: true, unknownOrder: orderId });
    }

    if (eventName === "payment.captured") {
      // 1. If already paid, acknowledge without redundant DB write
      if (order.status === "PAID") {
        return NextResponse.json({ ok: true, alreadySettled: true });
      }

      // 2. Fraud check: amount paid must be >= expected course price
      if (payment?.amount && payment.amount < order.amount) {
        console.error(
          `[webhook] FRAUD ALERT: received amount ${payment.amount} < expected ${order.amount} for order ${orderId}`
        );
        return NextResponse.json({ ok: true, flag: "amount_mismatch" });
      }

      // 3. Atomic interactive transaction
      await prisma.$transaction(async (tx) => {
        const current = await tx.order.findUnique({ where: { id: order.id } });
        if (current?.status === "PAID") return;

        await tx.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            razorpayPaymentId: payment?.id ?? order.razorpayPaymentId,
            method: payment?.method ?? order.method,
            paidAt: current?.paidAt ?? new Date(),
            failureReason: null,
          },
        });

        await tx.lead.update({
          where: { id: order.leadId },
          data: { status: "PAID" },
        });
      });
    } else if (eventName === "payment.failed") {
      // NEVER downgrade an order that was settled as PAID
      if (order.status === "PAID") {
        return NextResponse.json({ ok: true, alreadyPaid: true });
      }

      await prisma.$transaction([
        prisma.order.updateMany({
          where: { id: order.id, status: { not: "PAID" } },
          data: {
            status: "FAILED",
            razorpayPaymentId: payment?.id ?? order.razorpayPaymentId,
            method: payment?.method ?? order.method,
            failureReason: payment?.error_description ?? "Payment failed at gateway",
          },
        }),
        prisma.lead.updateMany({
          where: { id: order.leadId, status: { not: "PAID" } },
          data: { status: "FAILED" },
        }),
      ]);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[webhook] Error processing razorpay event in database", error);
    return NextResponse.json({ error: "Database processing failed" }, { status: 500 });
  }
}

