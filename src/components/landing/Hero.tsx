import Image from "next/image";
import EnrollButton from "@/components/EnrollButton";
import { site, whatsappLink } from "@/lib/site";
import { formatINR } from "@/lib/utils";

const trust = [
  "8 Structured Modules",
  "Forex + Crypto",
  "Lifetime Access",
  "Hindi / Gujarati",
];

export default function Hero() {
  return (
    <section
      id="top"
      className="noise relative isolate overflow-hidden pb-20 pt-28 sm:pb-24 lg:pb-28 lg:pt-32"
    >
      {/* atmosphere */}
      <div className="grid-bg absolute inset-0 -z-10 opacity-60" aria-hidden />
      <div
        className="absolute left-1/2 top-[-18rem] -z-10 h-[38rem] w-[62rem] -translate-x-1/2 rounded-full opacity-45 blur-[130px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(217,169,52,0.34), transparent)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-ink to-transparent"
        aria-hidden
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-300/25 bg-gold-300/[0.07] px-3.5 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-300 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-300" />
            </span>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-gold-200">
              Launch batch open · limited seats
            </span>
          </div>

          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.42em] text-neutral-500">
            Gujju Forex presents
          </p>

          <h1 className="mt-3">
            <span className="gold-text block font-display text-[12.5vw] font-black leading-[0.9] tracking-tight sm:text-7xl sm:leading-[0.86] lg:text-8xl">
              {site.course.codename}
            </span>
            <span className="mt-4 block max-w-xl text-2xl font-semibold leading-tight text-white sm:text-[2.1rem]">
              {site.course.name}
            </span>
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-10 bg-gold-400/60" aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-200/90">
              {site.course.subtitle}
            </p>
          </div>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-neutral-400">
            Eight modules that take you from reading raw market structure to
            executing institutional-grade setups — with a risk framework built
            to keep your capital alive. Everything the pros use, taught in plain
            language.
          </p>

          {/* price block */}
          <div className="mt-9 flex flex-wrap items-end gap-x-5 gap-y-3">
            <div className="flex items-end gap-3">
              <span className="font-display text-6xl font-black leading-none text-white">
                {formatINR(site.course.pricePaise)}
              </span>
              <span className="pb-2 text-lg text-neutral-600 line-through">
                ₹{site.course.strikePriceRupees.toLocaleString("en-IN")}
              </span>
            </div>
            <span className="mb-1.5 rounded-full border border-gold-300/30 bg-gold-300/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-gold-200">
              Save 99% · one-time payment
            </span>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <EnrollButton source="hero" className="px-8 py-4 text-[15px]">
              Enroll now for {formatINR(site.course.pricePaise)}
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </EnrollButton>
            <a
              href="#curriculum"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 px-7 py-4 text-sm font-semibold text-neutral-300 transition hover:border-gold-300/45 hover:text-gold-100"
            >
              See what&apos;s inside
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5">
            {trust.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-[12.5px] text-neutral-500"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 text-gold-400"
                  aria-hidden
                >
                  <path
                    d="M5 13l4.5 4.5L19 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* mentor visual */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            className="absolute -inset-6 -z-10 rounded-[2.5rem] opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 40%, rgba(217,169,52,0.3), transparent)",
            }}
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-gold-300/25 bg-ink-2">
            <Image
              src="/images/mentors-duo.jpg"
              alt="The Gujju Forex mentors"
              width={900}
              height={1200}
              priority
              sizes="(max-width: 1024px) 90vw, 44vw"
              className="h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-gold-300">
                Taught by
              </p>
              <p className="mt-1 font-display text-xl font-bold text-white">
                The Gujju Forex Mentors
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Full-time traders · {site.tagline}
              </p>
            </div>
          </div>

          <div className="animate-float absolute -left-4 top-10 hidden rounded-2xl border border-gold-300/25 bg-ink-2/95 px-4 py-3 backdrop-blur sm:block">
            <p className="font-display text-2xl font-black text-gold-200">08</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              Core modules
            </p>
          </div>
          <div
            className="animate-float absolute -right-3 bottom-24 hidden rounded-2xl border border-gold-300/25 bg-ink-2/95 px-4 py-3 backdrop-blur sm:block"
            style={{ animationDelay: "1.4s" }}
          >
            <p className="font-display text-2xl font-black text-gold-200">3</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              Complete strategies
            </p>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-full border border-white/10 py-3 text-xs font-medium text-neutral-400 transition hover:border-gold-300/40 hover:text-gold-100 lg:hidden"
          >
            Questions? WhatsApp +91 {site.contact.whatsapp}
          </a>
        </div>
      </div>
    </section>
  );
}
