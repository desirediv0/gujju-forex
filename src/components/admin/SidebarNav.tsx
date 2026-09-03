"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  {
    href: "/admin",
    label: "Overview",
    icon: (
      <path
        d="M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6v-9h-6v9zm0-16v5h6V4h-6z"
        fill="currentColor"
      />
    ),
  },
  {
    href: "/admin/leads",
    label: "Leads",
    icon: (
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 8a8 8 0 0 1 16 0z"
        fill="currentColor"
      />
    ),
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: (
      <path
        d="M4 5h16v4H4zM4 11h16v8H4zm4 3h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function SidebarNav({ username }: { username?: string | null }) {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1.5 lg:mt-8 lg:flex-col lg:items-stretch lg:gap-1">
      {items.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition",
              active
                ? "bg-gold-300/12 text-gold-100"
                : "text-neutral-400 hover:bg-white/5 hover:text-white",
            )}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
              {item.icon}
            </svg>
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        );
      })}

      {username && (
        <div className="hidden items-center gap-2.5 rounded-xl border border-white/8 px-3 py-2.5 lg:mt-auto lg:flex">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-300/15 text-[11px] font-bold uppercase text-gold-200">
            {username.slice(0, 2)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[12.5px] font-semibold text-white">
              {username}
            </span>
            <span className="block text-[10px] uppercase tracking-[0.16em] text-neutral-600">
              Signed in
            </span>
          </span>
        </div>
      )}

      <form
        action="/api/admin/logout"
        method="post"
        className={username ? "lg:pt-2" : "lg:mt-auto lg:pt-6"}
      >
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-neutral-500 transition hover:bg-white/5 hover:text-red-300"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
            <path
              d="M15 12H4m0 0l3.5-3.5M4 12l3.5 3.5M10 5h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="hidden sm:inline">Log out</span>
        </button>
      </form>
    </nav>
  );
}
