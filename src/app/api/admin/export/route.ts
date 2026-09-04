import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvCell(value: unknown) {
  const str = value === null || value === undefined ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const type = new URL(request.url).searchParams.get("type") ?? "leads";
  const stamp = new Date().toISOString().slice(0, 10);

  try {
    if (type === "orders") {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { lead: true },
      });
      const rows = [
        [
          "Order ID",
          "Razorpay Order",
          "Payment ID",
          "Status",
          "Amount (INR)",
          "Method",
          "Name",
          "Phone",
          "Email",
          "Paid at",
          "Created at",
          "Failure reason",
        ],
        ...orders.map((o) => [
          o.id,
          o.razorpayOrderId,
          o.razorpayPaymentId,
          o.status,
          (o.amount / 100).toFixed(2),
          o.method,
          o.lead.name,
          o.lead.phone,
          o.lead.email,
          o.paidAt?.toISOString(),
          o.createdAt.toISOString(),
          o.failureReason,
        ]),
      ];
      return csvResponse(rows, `gujju-forex-orders-${stamp}.csv`);
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    });
    const rows = [
      [
        "Lead ID",
        "Name",
        "Phone",
        "Email",
        "City",
        "Experience",
        "Status",
        "Contacted",
        "Latest payment ID",
        "Source",
        "Notes",
        "Created at",
      ],
      ...leads.map((l) => [
        l.id,
        l.name,
        l.phone,
        l.email,
        l.city,
        l.experience,
        l.status,
        l.contacted ? "Yes" : "No",
        l.orders[0]?.razorpayPaymentId,
        l.source,
        l.notes,
        l.createdAt.toISOString(),
      ]),
    ];
    return csvResponse(rows, `gujju-forex-leads-${stamp}.csv`);
  } catch (error) {
    console.error("[export] Error exporting data", error);
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 });
  }
}

function csvResponse(rows: unknown[][], filename: string) {
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
