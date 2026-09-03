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
  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(raw) as {
    event: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          method?: string;
          error_description?: string;
        };
      };
    };
  };

  const payment = event.payload?.payment?.entity;
  const orderId = payment?.order_id;
  if (!orderId) return NextResponse.json({ ok: true, ignored: event.event });

  const order = await prisma.order.findUnique({
    where: { razorpayOrderId: orderId },
  });
  if (!order) return NextResponse.json({ ok: true, unknownOrder: orderId });

  if (event.event === "payment.captured") {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          razorpayPaymentId: payment?.id ?? order.razorpayPaymentId,
          method: payment?.method ?? order.method,
          paidAt: order.paidAt ?? new Date(),
          failureReason: null,
        },
      }),
      prisma.lead.update({
        where: { id: order.leadId },
        data: { status: "PAID" },
      }),
    ]);
  } else if (event.event === "payment.failed" && order.status !== "PAID") {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: "FAILED",
          razorpayPaymentId: payment?.id ?? order.razorpayPaymentId,
          method: payment?.method ?? order.method,
          failureReason: payment?.error_description ?? "Payment failed",
        },
      }),
      prisma.lead.update({
        where: { id: order.leadId },
        data: { status: "FAILED" },
      }),
    ]);
  }

  return NextResponse.json({ ok: true });
}
