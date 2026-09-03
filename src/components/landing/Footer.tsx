import Image from "next/image";
import { site, whatsappLink } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/8 bg-ink-2/60 pb-28 pt-16 sm:pb-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image
              src="/images/logo-sm.png"
              alt="Gujju Forex"
              width={110}
              height={98}
              className="h-14 w-auto"
            />
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-neutral-500">
              An education-first trading community teaching market structure,
              institutional strategy and professional risk management to Indian
              traders.
            </p>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-300/80">
              {site.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-white">
              Course
            </h3>
            <ul className="mt-5 space-y-3 text-[13.5px] text-neutral-500">
              <li>
                <a href="#curriculum" className="transition hover:text-gold-200">
                  Curriculum
                </a>
              </li>
              <li>
                <a href="#mastery" className="transition hover:text-gold-200">
                  Risk &amp; money mastery
                </a>
              </li>
              <li>
                <a href="#mentor" className="transition hover:text-gold-200">
                  Mentors
                </a>
              </li>
              <li>
                <a href="#pricing" className="transition hover:text-gold-200">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="transition hover:text-gold-200">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-white">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-[13.5px] text-neutral-500">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="flex items-center gap-2.5 transition hover:text-gold-200"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-400/80" aria-hidden>
                    <path
                      d="M3 6h18v12H3zM3 7l9 6 9-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 transition hover:text-gold-200"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-400/80" fill="currentColor" aria-hidden>
                    <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2z" />
                  </svg>
                  +91 {site.contact.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`tel:+91${site.contact.whatsapp}`}
                  className="flex items-center gap-2.5 transition hover:text-gold-200"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-400/80" aria-hidden>
                    <path
                      d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Call us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/8 bg-black/30 p-5">
          <p className="text-[11.5px] leading-relaxed text-neutral-600">
            <strong className="text-neutral-500">Risk disclaimer:</strong>{" "}
            Trading in forex, crypto and derivatives carries a high level of
            risk and may not be suitable for every investor. Gujju Forex
            provides educational content only — we do not provide investment
            advice, portfolio management or buy/sell recommendations, and we do
            not guarantee any returns. Past performance is not indicative of
            future results. Please trade with capital you can afford to lose.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-6 sm:flex-row">
          <p className="text-[12px] text-neutral-600">
            © {year} {site.brand}. All rights reserved.
          </p>
          <p className="text-[12px] text-neutral-600">
            Payments secured by Razorpay
          </p>
        </div>
      </div>
    </footer>
  );
}
