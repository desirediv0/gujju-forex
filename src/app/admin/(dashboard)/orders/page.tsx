import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState, StatCard, StatusPill } from "@/components/admin/ui";
import Filters from "@/components/admin/Filters";
import Pagination from "@/components/admin/Pagination";
import { formatDateTime, formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

const statuses = [
  { value: "", label: "All" },
  { value: "PAID", label: "Paid" },
  { value: "CREATED", label: "Started" },
  { value: "FAILED", label: "Failed" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const q = params.q?.trim() ?? "";
  const status = params.status ?? "";

  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { razorpayOrderId: { contains: q, mode: "insensitive" } },
      { razorpayPaymentId: { contains: q, mode: "insensitive" } },
      { receipt: { contains: q, mode: "insensitive" } },
      { lead: { name: { contains: q, mode: "insensitive" } } },
      { lead: { phone: { contains: q, mode: "insensitive" } } },
      { lead: { email: { contains: q, mode: "insensitive" } } },
    ];
  }

  const [total, orders, paidAgg, failedCount, createdCount] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { lead: true },
    }),
    prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.order.count({ where: { status: "FAILED" } }),
    prisma.order.count({ where: { status: "CREATED" } }),
  ]);

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Every Razorpay order created from the enrollment form."
        action={
          <a
            href="/api/admin/export?type=orders"
            className="rounded-xl border border-gold-300/30 px-4 py-2.5 text-[13px] font-semibold text-gold-100 transition hover:bg-gold-300/10"
          >
            Export CSV
          </a>
        }
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-4">
        <StatCard
          label="Collected"
          value={formatINR(paidAgg._sum.amount ?? 0)}
          tone="gold"
        />
        <StatCard label="Successful" value={paidAgg._count} tone="green" />
        <StatCard label="Abandoned at checkout" value={createdCount} />
        <StatCard label="Failed" value={failedCount} tone="red" />
      </div>

      <Filters
        statuses={statuses}
        placeholder="Search by payment ID, order ID, name or phone…"
      />

      {orders.length === 0 ? (
        <EmptyState
          message={
            q || status
              ? "No orders match this filter."
              : "No payment has been attempted yet."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/8">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/8 bg-ink-2/60">
                {[
                  "Customer",
                  "Payment ID",
                  "Order ID",
                  "Amount",
                  "Status",
                  "Date",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {orders.map((order) => (
                <tr key={order.id} className="bg-ink-2/25 hover:bg-ink-3/50">
                  <td className="px-4 py-3.5">
                    <p className="text-[13.5px] font-semibold text-white">
                      {order.lead.name}
                    </p>
                    <p className="text-[12px] text-neutral-500">
                      +91 {order.lead.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[12px] text-neutral-400">
                    {order.razorpayPaymentId ?? "—"}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[12px] text-neutral-500">
                    {order.razorpayOrderId}
                  </td>
                  <td className="px-4 py-3.5 text-[13.5px] font-semibold text-white">
                    {formatINR(order.amount)}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusPill status={order.status} />
                    {order.failureReason && (
                      <p className="mt-1 max-w-[180px] text-[11px] text-red-400/80">
                        {order.failureReason}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-[12px] text-neutral-500">
                    {formatDateTime(order.paidAt ?? order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={page}
        pageCount={Math.ceil(total / PAGE_SIZE)}
        basePath="/admin/orders"
        params={{ q, status }}
      />
    </>
  );
}
