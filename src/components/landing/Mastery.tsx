import Reveal from "@/components/Reveal";
import SectionHeading from "./SectionHeading";
import { highlights, mastery } from "@/lib/site";

export default function Mastery() {
  return (
    <section
      id="mastery"
      className="relative border-y border-white/5 bg-ink-2/40 py-24 sm:py-28"
    >
      <div
        className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 gold-rule"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="What you will master"
            title={
              <>
                Risk &amp; money management,{" "}
                <span className="gold-text">the way funds do it</span>
              </>
            }
            subtitle="Most traders lose not because their analysis is wrong, but because their risk is. This is the part of the course that decides whether you are still trading a year from now."
          />
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.45fr_1fr]">
          <ul className="grid gap-4 sm:grid-cols-2">
            {mastery.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 60}>
                <div className="card-gold flex h-full items-start gap-4 rounded-2xl p-5 transition-all duration-400">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-gold-300/25 bg-gold-300/[0.07] text-[11px] font-bold text-gold-200">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[14.5px] font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={120}>
            <div className="card-gold relative h-full overflow-hidden rounded-2xl p-7">
              <div
                className="absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-30 blur-3xl"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(217,169,52,0.55), transparent)",
                }}
                aria-hidden
              />
              <p className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-gold-300">
                Course highlights
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-white">
                Everything included
              </h3>
              <ul className="mt-6 space-y-3.5">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-gold-300/40 bg-gold-300/10">
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
                    <span className="text-[13.5px] leading-relaxed text-neutral-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 rounded-xl border border-gold-300/15 bg-black/30 p-4">
                <p className="text-[12.5px] leading-relaxed text-neutral-400">
                  Taught with live market examples on real charts — every
                  concept is shown being applied, not just explained.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
