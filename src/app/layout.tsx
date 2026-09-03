import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gujjuforex.com"),
  title: {
    default: `${site.course.name} — ${site.course.codename} | ${site.brand}`,
    template: `%s | ${site.brand}`,
  },
  description:
    "Divyashtra — the ultimate Forex & Crypto blueprint. 8 modules on market structure, institutional strategy and risk mastery. Enroll for just ₹19.",
  keywords: [
    "forex course",
    "crypto course",
    "trading course India",
    "Gujju Forex",
    "Divyashtra",
    "price action",
    "smart money concepts",
  ],
  openGraph: {
    title: `${site.course.name} — just ₹19`,
    description:
      "Master market structure, institutional order zones, three complete strategies and professional risk management.",
    type: "website",
    siteName: site.brand,
    images: ["/images/course-blueprint.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.course.name} — just ₹19`,
    description: "The ultimate Forex & Crypto blueprint by Gujju Forex.",
    images: ["/images/course-blueprint.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050506",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
