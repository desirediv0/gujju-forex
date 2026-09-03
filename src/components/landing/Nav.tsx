"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import EnrollButton from "@/components/EnrollButton";
import { formatINR } from "@/lib/utils";
import { site } from "@/lib/site";

const links = [
  { href: "#curriculum", label: "Curriculum" },
  { href: "#mastery", label: "Risk Mastery" },
  { href: "#mentor", label: "Mentors" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-gold-300/12 bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <Image
            src="/images/logo-sm.png"
            alt="Gujju Forex"
            width={52}
            height={46}
            priority
            className="h-9 w-auto"
          />
          <span className="hidden text-sm font-bold uppercase tracking-[0.28em] text-white sm:block">
            Gujju<span className="text-gold-300">Forex</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] font-medium text-neutral-400 transition hover:text-gold-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <EnrollButton
            source="navbar"
            className="hidden px-5 py-2.5 text-[13px] sm:inline-flex"
          >
            Enroll at {formatINR(site.course.pricePaise)}
          </EnrollButton>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-neutral-300 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              {menuOpen ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 8h16M4 16h16"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-gold-300/12 bg-ink/97 px-5 pb-8 pt-4 backdrop-blur-xl lg:hidden">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-white/5 py-3.5 text-sm font-medium text-neutral-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <EnrollButton
            source="mobile-menu"
            className="mt-5 w-full rounded-xl py-3.5"
          >
            Enroll now — {formatINR(site.course.pricePaise)}
          </EnrollButton>
        </div>
      )}
    </header>
  );
}
