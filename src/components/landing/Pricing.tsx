import Reveal from "@/components/Reveal";
import SectionHeading from "./SectionHeading";
import EnrollButton from "@/components/EnrollButton";
import { highlights, site, whatsappLink } from "@/lib/site";
import { formatINR } from "@/lib/utils";

const included = [
  "All 8 modules across 3 pillars",
  ...highlights.slice(0, 4),
  "Direct WhatsApp support from the team",
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-24 sm:py-28"
    >
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(217,169,52,0.35), transparent)",
        }}
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Enrollment"
            title={
              <>
                A complete trading education for{" "}
                <span className="gold-text">
                  {formatINR(site.course.pricePaise)}
                </span>
              </>
            }
            subtitle="One payment. No subscription, no upsell wall, no hidden charges."
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="relative mx-auto mt-14 max-w-lg">
            <div
              className="absolute -inset-px rounded-[1.6rem] opacity-70"
              style={{
                background:
                  "linear-gradient(160deg, rgba(242,217,138,0.55), rgba(150,105,15,0.05) 45%, rgba(242,217,138,0.35))",
              }}
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-[1.55rem] bg-ink-2 p-8 sm:p-10">
              <div
                className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-25 blur-3xl"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(217,169,52,0.7), transparent)",
                }}
                aria-hidden
              />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.26em] text-gold-300">
                    {site.course.codename}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold leading-tight text-white">
                    {site.course.name}
                  </h3>
                </div>
                <span className="shrink-0 rounded-full border border-gold-300/35 bg-gold-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-200">
                  Launch price
                </span>
              </div>

              <div className="mt-8 flex items-end gap-3">
                <span className="font-display text-6xl font-black leading-none text-white">
                  {formatINR(site.course.pricePaise)}
                </span>
                <div className="pb-1.5">
                  <span className="block text-base text-neutral-600 line-through">
                    ₹{site.course.strikePriceRupees.toLocaleString("en-IN")}
                  </span>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-gold-300">
                    One-time
                  </span>
                </div>
              </div>

              <div className="my-7 h-px w-full bg-white/8" aria-hidden />

              <ul className="space-y-3.5">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-300/12">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3 w-3 text-gold-200"
                        aria-hidden
                      >
                        <path
                          d="M5 13l4.5 4.5L19 7"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-[13.5px] text-neutral-300">{item}</span>
                  </li>
                ))}
              </ul>

              <EnrollButton
                source="pricing"
                className="mt-9 w-full rounded-xl py-4 text-[15px]"
              >
                Enroll now — {formatINR(site.course.pricePaise)}
              </EnrollButton>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-neutral-500">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
                  <path
                    d="M6 11V8a6 6 0 1 1 12 0v3M5 11h14v9H5z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
                256-bit secure checkout · UPI, cards, netbanking, wallets
              </p>

              <p className="mt-5 text-center text-[12px] text-neutral-500">
                Prefer to pay over WhatsApp?{" "}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-gold-200 underline underline-offset-4 hover:text-gold-100"
                >
                  Message +91 {site.contact.whatsapp}
                </a>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
