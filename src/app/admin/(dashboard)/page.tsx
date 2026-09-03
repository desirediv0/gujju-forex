import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, StatCard, StatusPill, EmptyState } from "@/components/admin/ui";
import {
  daysAgo,
  formatDateTime,
  formatINR,
  startOfTodayIST,
} from "@/lib/utils";
import { site } from "@/lib/site";
import { isRazorpayConfigured } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const startOfToday = startOfTodayIST();
  const weekAgo = daysAgo(7);

  const [
    totalLeads,
    paidLeads,
    pendingLeads,
    failedLeads,
    leadsToday,
    leadsThisWeek,
    revenue,
    revenueToday,
    uncontactedUnpaid,
    recentLeads,
    recentOrders,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "PAID" } }),
    prisma.lead.count({ where: { status: "PENDING" } }),
    prisma.lead.count({ where: { status: "FAILED" } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.lead.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.order.aggregate({
      where: { status: "PAID", paidAt: { gte: startOfToday } },
      _sum: { amount: true },
    }),
    prisma.lead.count({
      where: { status: { not: "PAID" }, contacted: false },
    }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { lead: true },
    }),
  ]);

  const conversion = totalLeads ? (paidLeads / totalLeads) * 100 : 0;

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle={`${site.course.codename} — ${site.course.name} · ${formatINR(site.course.pricePaise)} per enrollment`}
        action={
          <a
            href="/api/admin/export?type=leads"
            className="rounded-xl border border-gold-300/30 px-4 py-2.5 text-[13px] font-semibold text-gold-100 transition hover:bg-gold-300/10"
          >
            Export leads CSV
          </a>
        }
      />

      {!isRazorpayConfigured() && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/[0.07] p-4">
          <svg
            viewBox="0 0 24 24"
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-400"
            aria-hidden
          >
            <path
              d="M12 8v5M12 16.5v.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          </svg>
          <div>
            <p className="text-[13.5px] font-bold text-amber-200">
              Razorpay is not configured — no payments can be collected
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-amber-200/70">
              Add <code className="font-mono">RAZORPAY_KEY_ID</code> and{" "}
              <code className="font-mono">RAZORPAY_KEY_SECRET</code> to your{" "}
              <code className="font-mono">.env</code> file and restart the
              server. Until then the enrollment form saves the lead but shows
              visitors an error instead of opening checkout.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={formatINR(revenue._sum.amount ?? 0)}
          tone="gold"
          hint={`${formatINR(revenueToday._sum.amount ?? 0)} collected today`}
        />
        <StatCard
          label="Paid enrollments"
          value={paidLeads}
          tone="green"
          hint={`${conversion.toFixed(1)}% of all form submissions`}
        />
        <StatCard
          label="Total leads"
          value={totalLeads}
          hint={`${leadsToday} today · ${leadsThisWeek} this week`}
        />
        <StatCard
          label="Unpaid leads"
          value={pendingLeads + failedLeads}
          tone="red"
          hint={`${uncontactedUnpaid} not contacted yet`}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Pending (never paid)"
          value={pendingLeads}
          hint="Filled the form, checkout not completed"
        />
        <StatCard
          label="Failed payments"
          value={failedLeads}
          hint="Started checkout, payment did not go through"
        />
        <StatCard
          label="Conversion rate"
          value={`${conversion.toFixed(1)}%`}
          hint="Paid ÷ total form submissions"
        />
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.16em] text-white">
              Latest leads
            </h2>
            <Link
              href="/admin/leads"
              className="text-[12.5px] font-semibold text-gold-300 hover:text-gold-100"
            >
              View all →
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <EmptyState message="No form submissions yet." />
          ) : (
            <ul className="divide-y divide-white/6 overflow-hidden rounded-2xl border border-white/8">
              {recentLeads.map((lead) => (
                <li
                  key={lead.id}
                  className="flex items-center justify-between gap-4 bg-ink-2/40 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-semibold text-white">
                      {lead.name}
                    </p>
                    <p className="truncate text-[12px] text-neutral-500">
                      +91 {lead.phone} · {formatDateTime(lead.createdAt)}
                    </p>
                  </div>
                  <StatusPill status={lead.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.16em] text-white">
              Latest orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-[12.5px] font-semibold text-gold-300 hover:text-gold-100"
            >
              View all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <EmptyState message="No payment attempts yet." />
          ) : (
            <ul className="divide-y divide-white/6 overflow-hidden rounded-2xl border border-white/8">
              {recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between gap-4 bg-ink-2/40 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-semibold text-white">
                      {order.lead.name}
                    </p>
                    <p className="truncate font-mono text-[11.5px] text-neutral-500">
                      {order.razorpayPaymentId ?? order.razorpayOrderId}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-[13px] font-semibold text-white">
                      {formatINR(order.amount)}
                    </span>
                    <StatusPill status={order.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
