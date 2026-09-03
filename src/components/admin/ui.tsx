import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-[13.5px] text-neutral-500">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "gold" | "green" | "red";
}) {
  return (
    <div className="card-gold rounded-2xl p-5">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </p>
      <p
        className={cn(
          "mt-2.5 text-3xl font-black leading-none tabular-nums tracking-tight",
          tone === "gold" && "text-gold-200",
          tone === "green" && "text-emerald-400",
          tone === "red" && "text-red-400",
          tone === "default" && "text-white",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-[12px] text-neutral-600">{hint}</p>}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  PAID: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  FAILED: "border-red-500/30 bg-red-500/10 text-red-300",
  CREATED: "border-sky-500/30 bg-sky-500/10 text-sky-300",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em]",
        statusStyles[status] ?? "border-white/15 bg-white/5 text-neutral-400",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/12 px-6 py-16 text-center">
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}
