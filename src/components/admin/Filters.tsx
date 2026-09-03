"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

export default function Filters({
  statuses,
  placeholder,
}: {
  statuses: { value: string; label: string }[];
  placeholder: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const activeStatus = params.get("status") ?? "";

  function push(next: URLSearchParams) {
    next.delete("page");
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  }

  // Debounced search.
  useEffect(() => {
    const current = params.get("q") ?? "";
    if (query === current) return;
    const t = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (query) next.set("q", query);
      else next.delete("q");
      push(next);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1">
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600"
          aria-hidden
        >
          <circle
            cx="11"
            cy="11"
            r="6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M16 16l4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-[13.5px] text-white outline-none transition placeholder:text-neutral-600 focus:border-gold-300/50"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {statuses.map((status) => {
          const active = activeStatus === status.value;
          return (
            <button
              key={status.value || "all"}
              type="button"
              onClick={() => {
                const next = new URLSearchParams(params.toString());
                if (status.value) next.set("status", status.value);
                else next.delete("status");
                push(next);
              }}
              className={cn(
                "rounded-lg border px-3 py-2 text-[12.5px] font-semibold transition",
                active
                  ? "border-gold-300/60 bg-gold-300/12 text-gold-100"
                  : "border-white/10 text-neutral-400 hover:border-white/25 hover:text-white",
              )}
            >
              {status.label}
            </button>
          );
        })}
      </div>

      {pending && (
        <span className="text-[12px] text-neutral-600">Updating…</span>
      )}
    </div>
  );
}
