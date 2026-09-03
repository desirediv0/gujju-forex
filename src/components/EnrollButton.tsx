"use client";

import { cn } from "@/lib/utils";

export const ENROLL_EVENT = "gf:enroll";

export function openEnroll(source?: string) {
  window.dispatchEvent(new CustomEvent(ENROLL_EVENT, { detail: { source } }));
}

export default function EnrollButton({
  children,
  source,
  className,
  variant = "gold",
}: {
  children: React.ReactNode;
  source?: string;
  className?: string;
  variant?: "gold" | "outline";
}) {
  return (
    <button
      type="button"
      onClick={() => openEnroll(source)}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 active:scale-[0.98]",
        variant === "gold"
          ? "btn-gold px-7 py-3.5 hover:-translate-y-0.5"
          : "border border-gold-300/35 bg-white/[0.02] px-7 py-3.5 text-gold-100 hover:border-gold-300/70 hover:bg-gold-300/10",
        className,
      )}
    >
      {children}
    </button>
  );
}
