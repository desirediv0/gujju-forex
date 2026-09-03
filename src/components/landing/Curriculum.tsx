import Reveal from "@/components/Reveal";
import SectionHeading from "./SectionHeading";
import { pillars } from "@/lib/site";

const icons: Record<string, React.ReactNode> = {
  "01": (
    <path d="M4 20V9m5 11V4m5 16v-7m5 7V7" strokeWidth="1.8" strokeLinecap="round" />
  ),
  "02": (
    <path
      d="M12 3s6 6.4 6 10.4a6 6 0 1 1-12 0C6 9.4 12 3 12 3z"
      strokeWidth="1.7"
    />
  ),
  "03": (
    <path
      d="M3 9l9-5 9 5M5 9v10m4-10v10m6-10v10m4-10v10M3 20h18"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  ),
  "04": (
    <path
      d="M20 4c-8 0-12 3.6-12 8a4 4 0 0 0 7 2.7C17 12.6 20 9 20 4zM4 20c4-4 6-7 6-10"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  ),
  "05": (
    <path
      d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6M17 3v4h-4M7 21v-4h4"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "06": (
    <path
      d="M3 18c4 0 5-9 9-9s4 5 8 1M21 5v5h-5"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "07": (
    <path
      d="M3 16l4-6 3 3 4-7 3 5 4-3"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "08": (
    <path
      d="M12 3l8 3.5v5.2c0 4.6-3.3 8.3-8 9.3-4.7-1-8-4.7-8-9.3V6.5L12 3zm0 5.5v7M9.5 11h5"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

export default function Curriculum() {
  return (
    <section id="curriculum" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Master the complete trading system"
            title={
              <>
                Eight modules. <span className="gold-text">One blueprint.</span>
              </>
            }
            subtitle="Divyashtra is built in three pillars — how the market really moves, the exact strategies to trade it, and the risk system that keeps you profitable over years, not weeks."
          />
        </Reveal>

        <div className="mt-16 space-y-14">
          {pillars.map((pillar, pi) => (
            <Reveal key={pillar.title} delay={pi * 80}>
              <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
                <div className="lg:sticky lg:top-24 lg:h-fit">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-4xl font-black text-gold-400/35">
                      {pillar.numeral}
                    </span>
                    <span className="h-px flex-1 bg-gold-400/25 lg:hidden" aria-hidden />
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                    {pillar.blurb}
                  </p>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300/80">
                    {pillar.modules.length}{" "}
                    {pillar.modules.length === 1 ? "module" : "modules"}
                  </p>
                </div>

                <ul className="grid gap-4 sm:grid-cols-2">
                  {pillar.modules.map((module, mi) => (
                    <Reveal
                      as="li"
                      key={module.n}
                      delay={mi * 70}
                      className={
                        pillar.modules.length === 1 ? "sm:col-span-2" : ""
                      }
                    >
                      <div className="card-gold group h-full rounded-2xl p-6 transition-all duration-400 hover:-translate-y-1">
                        <div className="flex items-start justify-between gap-4">
                          <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold-300/25 bg-gold-300/[0.07] text-gold-200 transition group-hover:border-gold-300/50">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              aria-hidden
                            >
                              {icons[module.n]}
                            </svg>
                          </span>
                          <span className="font-display text-2xl font-black text-white/[0.07] transition group-hover:text-gold-300/25">
                            {module.n}
                          </span>
                        </div>
                        <h4 className="mt-5 text-[15px] font-bold leading-snug text-white">
                          {module.title}
                        </h4>
                        <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-500">
                          {module.desc}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
