import Reveal from "@/components/Reveal";
import SectionHeading from "./SectionHeading";
import { faqs, site, whatsappLink } from "@/lib/site";

export default function Faq() {
  return (
    <section
      id="faq"
      className="relative border-t border-white/5 bg-ink-2/40 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Questions"
            title="Everything you might be wondering"
          />
        </Reveal>

        <div className="mt-12 divide-y divide-white/8 border-y border-white/8">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 50}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] font-semibold text-white transition hover:text-gold-100">
                  {faq.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/12 text-gold-300 transition group-open:rotate-45 group-open:border-gold-300/50">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl pr-12 text-[14px] leading-relaxed text-neutral-400">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80}>
          <p className="mt-10 text-center text-[13.5px] text-neutral-500">
            Still have a question?{" "}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-gold-200 underline underline-offset-4"
            >
              WhatsApp us on +91 {site.contact.whatsapp}
            </a>{" "}
            or write to{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="font-semibold text-gold-200 underline underline-offset-4"
            >
              {site.contact.email}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
