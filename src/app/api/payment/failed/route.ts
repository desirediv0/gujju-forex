import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Called by the checkout when Razorpay reports a failure or the user bails. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    orderId?: string;
    reason?: string;
  } | null;

  if (!body?.orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { razorpayOrderId: body.orderId },
    });
    // Never downgrade an order that already went through.
    if (!order || order.status === "PAID") {
      return NextResponse.json({ ok: true });
    }

    await prisma.$transaction([
      prisma.order.updateMany({
        where: { id: order.id, status: { not: "PAID" } },
        data: {
          status: "FAILED",
          failureReason: (body.reason ?? "Payment not completed").slice(0, 300),
        },
      }),
      prisma.lead.updateMany({
        where: { id: order.leadId, status: { not: "PAID" } },
        data: { status: "FAILED" },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[failed] Error updating failed order", error);
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
  }
}
