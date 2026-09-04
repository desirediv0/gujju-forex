import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState, StatCard } from "@/components/admin/ui";
import Filters from "@/components/admin/Filters";
import Pagination from "@/components/admin/Pagination";
import LeadCard, { type LeadRow } from "@/components/admin/LeadCard";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

const statuses = [
  { value: "", label: "All" },
  { value: "PAID", label: "Paid" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "UNPAID", label: "All unpaid" },
  { value: "UNCONTACTED", label: "Not contacted" },
];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const q = params.q?.trim() ?? "";
  const status = params.status ?? "";

  const where: Prisma.LeadWhereInput = {};

  if (status === "UNPAID") where.status = { not: "PAID" };
  else if (status === "UNCONTACTED") {
    where.status = { not: "PAID" };
    where.contacted = false;
  } else if (status) where.status = status;

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, leads, paidCount, unpaidCount] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { orders: { orderBy: { createdAt: "desc" } } },
    }),
    prisma.lead.count({ where: { status: "PAID" } }),
    prisma.lead.count({ where: { status: { not: "PAID" } } }),
  ]);

  const rows: LeadRow[] = leads.map((lead) => ({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
    orders: lead.orders.map((order) => ({
      id: order.id,
      status: order.status,
      amount: order.amount,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      failureReason: order.failureReason,
      createdAt: order.createdAt.toISOString(),
    })),
  }));

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle="Everyone who submitted the enrollment form — paid or not."
        action={
          <a
            href="/api/admin/export?type=leads"
            className="rounded-xl border border-gold-300/30 px-4 py-2.5 text-[13px] font-semibold text-gold-100 transition hover:bg-gold-300/10"
          >
            Export CSV
          </a>
        }
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-3">
        <StatCard label="Matching this filter" value={total} />
        <StatCard label="Paid" value={paidCount} tone="green" />
        <StatCard
          label="Unpaid (follow up)"
          value={unpaidCount}
          tone="red"
          hint="Form filled, payment never completed"
        />
      </div>

      <Filters
        statuses={statuses}
        placeholder="Search by name, phone, email or city…"
      />

      {rows.length === 0 ? (
        <EmptyState
          message={
            q || status
              ? "No leads match this filter."
              : "No one has submitted the form yet."
          }
        />
      ) : (
        <ul className="space-y-3">
          {rows.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        pageCount={Math.ceil(total / PAGE_SIZE)}
        basePath="/admin/leads"
        params={{ q, status }}
      />
    </>
  );
}
