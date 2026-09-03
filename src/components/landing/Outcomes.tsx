import Reveal from "@/components/Reveal";
import { outcomes } from "@/lib/site";

const icons = [
  <path
    key="0"
    d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5l-2 2m-7 7l-2 2m0-11l2 2m7 7l2 2"
    strokeWidth="1.7"
    strokeLinecap="round"
  />,
  <path
    key="1"
    d="M9 21h6M10 17a6 6 0 1 1 4 0v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1z"
    strokeWidth="1.7"
    strokeLinejoin="round"
  />,
  <path
    key="2"
    d="M4 19V13m5 6V8m5 11V4m5 15v-8"
    strokeWidth="2"
    strokeLinecap="round"
  />,
  <path
    key="3"
    d="M12 3l8 3.5v5.2c0 4.6-3.3 8.3-8 9.3-4.7-1-8-4.7-8-9.3V6.5L12 3z"
    strokeWidth="1.7"
    strokeLinejoin="round"
  />,
  <path
    key="4"
    d="M8 4h8v4a4 4 0 1 1-8 0V4zM6 5H4v2a3 3 0 0 0 3 3M18 5h2v2a3 3 0 0 1-3 3M10 20h4M12 16v4"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  />,
];

export default function Outcomes() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-5">
          {outcomes.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 60} className="h-full">
              <div className="group h-full bg-ink px-6 py-8 text-center transition-colors duration-400 hover:bg-ink-3">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-gold-300/20 bg-gold-300/[0.06] text-gold-300 transition group-hover:border-gold-300/50">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden
                  >
                    {icons[i]}
                  </svg>
                </span>
                <h3 className="mt-4 text-[12px] font-bold uppercase tracking-[0.14em] text-gold-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] text-neutral-500">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
