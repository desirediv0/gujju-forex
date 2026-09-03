import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "./SectionHeading";
import { site } from "@/lib/site";

const pointers = [
  {
    title: "Traders, not theorists",
    desc: "Every framework in Divyashtra comes from charts we trade ourselves — not from a textbook.",
  },
  {
    title: "Taught in your language",
    desc: "Complex institutional concepts explained simply, in Hindi and Gujarati, so nothing gets lost in jargon.",
  },
  {
    title: "Process over predictions",
    desc: "We do not sell signals or tips. We hand you a repeatable process and the discipline to run it.",
  },
];

export default function Mentor() {
  return (
    <section
      id="mentor"
      className="relative border-y border-white/5 bg-ink-2/40 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="grid grid-cols-5 grid-rows-6 gap-3 sm:gap-4">
              <div className="col-span-3 row-span-6 overflow-hidden rounded-2xl border border-gold-300/20">
                <Image
                  src="/images/mentor-founder.jpg"
                  alt="Gujju Forex founder"
                  width={800}
                  height={1200}
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="col-span-2 row-span-3 overflow-hidden rounded-2xl border border-gold-300/20">
                <Image
                  src="/images/mentor-portrait.jpg"
                  alt="Gujju Forex mentor portrait"
                  width={700}
                  height={1050}
                  sizes="(max-width: 1024px) 35vw, 220px"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="col-span-2 row-span-3 overflow-hidden rounded-2xl border border-gold-300/20">
                <Image
                  src="/images/mentor-desk.jpg"
                  alt="Gujju Forex mentor analysing the markets"
                  width={700}
                  height={1050}
                  sizes="(max-width: 1024px) 35vw, 220px"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <SectionHeading
              align="left"
              eyebrow="Who is teaching you"
              title={
                <>
                  Built by traders who{" "}
                  <span className="gold-text">still trade</span>
                </>
              }
            />
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-neutral-400">
              Gujju Forex was started with one goal — to give Indian traders the
              same structural edge that desks and funds use, without the
              mystique. {site.tagline} is not a slogan; it is the exact order in
              which we teach you to work.
            </p>

            <ul className="mt-9 space-y-6">
              {pointers.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" aria-hidden />
                  <div>
                    <h3 className="text-[15px] font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-500">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-center gap-4 rounded-2xl border border-gold-300/15 bg-black/25 p-5">
              <Image
                src="/images/logo-sm.png"
                alt=""
                width={56}
                height={50}
                className="h-11 w-auto"
              />
              <p className="text-[13px] leading-relaxed text-neutral-400">
                <span className="font-semibold text-white">Gujju Forex</span> —
                an education-first trading community. Reach us any time at{" "}
                <span className="text-gold-200">{site.contact.email}</span>.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
