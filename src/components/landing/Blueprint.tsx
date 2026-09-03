import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "./SectionHeading";
import EnrollButton from "@/components/EnrollButton";

export default function Blueprint() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="The full system at a glance"
            title={
              <>
                The <span className="gold-text">Divyashtra</span> blueprint
              </>
            }
            subtitle="One page that maps every module, every strategy and every risk rule you will learn inside the course."
          />
        </Reveal>

        <Reveal delay={100}>
          <figure className="group relative mx-auto mt-14 max-w-5xl">
            <div
              className="absolute -inset-4 -z-10 rounded-[2rem] opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(217,169,52,0.35), transparent)",
              }}
              aria-hidden
            />
            <div className="overflow-hidden rounded-2xl border border-gold-300/25 bg-ink-2 p-1.5">
              <Image
                src="/images/course-blueprint.jpg"
                alt="Divyashtra course blueprint: market structure mastery, strategy mastery, and risk and money mastery modules"
                width={1600}
                height={1069}
                sizes="(max-width: 1024px) 95vw, 1000px"
                className="w-full rounded-xl"
              />
            </div>
            <figcaption className="mt-5 text-center text-[12.5px] text-neutral-500">
              The complete curriculum map — 8 modules across 3 pillars.
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 flex justify-center">
            <EnrollButton source="blueprint" className="px-8 py-4">
              Get the full blueprint for ₹19
            </EnrollButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
