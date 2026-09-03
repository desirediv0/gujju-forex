import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Ticker from "@/components/landing/Ticker";
import Curriculum from "@/components/landing/Curriculum";
import Blueprint from "@/components/landing/Blueprint";
import Mastery from "@/components/landing/Mastery";
import Outcomes from "@/components/landing/Outcomes";
import Mentor from "@/components/landing/Mentor";
import Pricing from "@/components/landing/Pricing";
import Faq from "@/components/landing/Faq";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import FloatingBar from "@/components/landing/FloatingBar";
import EnrollDialog from "@/components/EnrollDialog";
import { faqs, site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: `${site.course.codename} — ${site.course.name}`,
  description:
    "The ultimate Forex & Crypto blueprint: market structure mastery, three complete trading strategies and a professional risk management system.",
  provider: {
    "@type": "Organization",
    name: site.brand,
    email: site.contact.email,
    telephone: `+91${site.contact.whatsapp}`,
  },
  offers: {
    "@type": "Offer",
    price: (site.course.pricePaise / 100).toFixed(2),
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    category: "Paid",
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT8H",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Curriculum />
        <Blueprint />
        <Mastery />
        <Outcomes />
        <Mentor />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <FloatingBar />
      <EnrollDialog />
    </>
  );
}
