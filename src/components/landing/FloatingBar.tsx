"use client";

import { useEffect, useState } from "react";
import EnrollButton from "@/components/EnrollButton";
import { site, whatsappLink } from "@/lib/site";
import { formatINR } from "@/lib/utils";

export default function FloatingBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp floating action button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label={`Chat with Gujju Forex on WhatsApp at ${site.contact.whatsapp}`}
        className="fixed bottom-24 right-4 z-40 grid h-13 w-13 place-items-center rounded-full bg-[#25D366] p-3.5 text-black shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition hover:scale-105 sm:bottom-6"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.06c-.25.69-1.44 1.32-1.98 1.4-.53.08-1.02.28-3.43-.72-2.88-1.2-4.7-4.13-4.84-4.32-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07 1-2.36.25-.28.55-.35.73-.35h.53c.17 0 .4-.06.63.48.25.6.83 2.07.9 2.22.07.14.12.31.02.5-.1.19-.15.31-.29.48l-.44.51c-.14.14-.29.3-.13.59.17.28.74 1.22 1.59 1.98 1.09.97 2.01 1.28 2.3 1.42.28.14.45.12.62-.07.17-.19.71-.83.9-1.12.19-.28.38-.23.63-.14.26.09 1.63.77 1.91.91.28.14.47.21.53.33.07.11.07.66-.18 1.35z" />
        </svg>
      </a>

      {/* Sticky mobile enroll bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-gold-300/20 bg-ink/95 px-4 py-3 backdrop-blur-xl transition-transform duration-500 sm:hidden ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {site.course.codename} · launch price
            </p>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-xl font-black text-white">
                {formatINR(site.course.pricePaise)}
              </span>
              <span className="text-xs text-neutral-600 line-through">
                ₹{site.course.strikePriceRupees.toLocaleString("en-IN")}
              </span>
            </p>
          </div>
          <EnrollButton source="sticky-bar" className="px-6 py-3 text-[13px]">
            Enroll now
          </EnrollButton>
        </div>
      </div>
    </>
  );
}
