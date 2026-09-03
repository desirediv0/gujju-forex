import Reveal from "@/components/Reveal";
import EnrollButton from "@/components/EnrollButton";
import { site, whatsappLink } from "@/lib/site";
import { formatINR } from "@/lib/utils";

export default function FinalCta() {
  return (
    <section className="noise relative overflow-hidden py-24 sm:py-28">
      <div className="grid-bg absolute inset-0 -z-10 opacity-40" aria-hidden />
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[110px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(217,169,52,0.4), transparent)",
        }}
        aria-hidden
      />
      <Reveal>
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.3em] text-gold-300">
            Your edge starts today
          </p>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl">
            Stop guessing the market.{" "}
            <span className="gold-text">Start reading it.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-neutral-400">
            The complete {site.course.name} — eight modules, three strategies
            and a professional risk system — for the price of a chai.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <EnrollButton source="final-cta" className="px-8 py-4 text-[15px]">
              Enroll for {formatINR(site.course.pricePaise)}
            </EnrollButton>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 px-7 py-4 text-sm font-semibold text-neutral-300 transition hover:border-gold-300/45 hover:text-gold-100"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.5 14.2c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6a11.6 11.6 0 0 1-4.4-4c-.3-.5-.7-1.2-.7-2.2s.5-1.5.7-1.7c.2-.2.5-.3.6-.3h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.5l-.3.4c-.1.2-.3.3-.1.6.5.8 1 1.3 1.7 1.8.6.4.9.5 1.1.4l.5-.5c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.3v.4z" />
              </svg>
              Talk to us first
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
