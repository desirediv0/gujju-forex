export const site = {
  brand: "Gujju Forex",
  tagline: "Trade • Analyze • Execute",
  course: {
    codename: "DIVYASHTRA",
    name: "Crypto & Forex Mastery Course",
    subtitle: "The Ultimate Forex & Crypto Blueprint",
    pricePaise: Number(process.env.COURSE_PRICE_PAISE ?? 1900),
    strikePriceRupees: 4999,
  },
  contact: {
    email: "Info@gujjuforex.com",
    whatsapp: "9327167437",
    whatsappIntl: "919327167437",
    whatsappMessage:
      "Hi Gujju Forex, I want to know more about the Divyashtra Crypto & Forex Mastery Course (Rs.19).",
  },
} as const;

export const whatsappLink = `https://wa.me/${site.contact.whatsappIntl}?text=${encodeURIComponent(
  site.contact.whatsappMessage,
)}`;

/** The three pillars of the blueprint, straight from the course poster. */
export const pillars = [
  {
    numeral: "I",
    title: "Market Structure Mastery",
    blurb: "Read the chart the way institutions do — before the move happens.",
    modules: [
      {
        n: "01",
        title: "Price Rejection Framework",
        desc: "Master high probability price reversals.",
      },
      {
        n: "02",
        title: "Liquidity Intelligence",
        desc: "Understand liquidity. Trade with smart money.",
      },
      {
        n: "03",
        title: "Institutional Order Zones",
        desc: "Identify high probability institutional zones.",
      },
      {
        n: "04",
        title: "Precision Fibonacci",
        desc: "Use Fibonacci with professional precision.",
      },
    ],
  },
  {
    numeral: "II",
    title: "Strategy Mastery",
    blurb: "Three complete, rule-based systems you can execute from day one.",
    modules: [
      {
        n: "05",
        title: "The 3 Phase Strategy",
        desc: "A complete 3 step trading process.",
      },
      {
        n: "06",
        title: "Trend Navigation System",
        desc: "50 EMA based trend trading strategy.",
      },
      {
        n: "07",
        title: "Momentum Precision Strategy",
        desc: "RSI divergence + Fibonacci strategy.",
      },
    ],
  },
  {
    numeral: "III",
    title: "Risk & Money Mastery",
    blurb: "The discipline layer that keeps you in the game long enough to win.",
    modules: [
      {
        n: "08",
        title: "Capital Protection Blueprint",
        desc: "Protect your capital. Maximize your growth.",
      },
    ],
  },
] as const;

export const mastery = [
  {
    title: "Risk Management Foundation",
    desc: "Build a strong risk management base.",
  },
  { title: "Position Sizing", desc: "Calculate the perfect position size." },
  {
    title: "Risk-to-Reward Framework",
    desc: "Build high probability R:R setups.",
  },
  {
    title: "Daily Loss Limits",
    desc: "Control your losses. Stay in the game.",
  },
  { title: "Compounding Strategy", desc: "Grow your capital consistently." },
  {
    title: "Professional Capital Management",
    desc: "Think like a pro. Manage like a fund.",
  },
] as const;

export const highlights = [
  "Complete A–Z trading framework",
  "Institutional concepts + strategies",
  "High probability setups",
  "Risk management & money management",
  "Live market examples",
  "Practical & actionable learning",
] as const;

export const outcomes = [
  { title: "Professional Trading Edge", desc: "Trade with confidence." },
  { title: "Smart Money Mindset", desc: "Think like institutions." },
  { title: "Consistent Profits", desc: "Small wins. Big results." },
  { title: "Capital Protection", desc: "Protect first. Profit next." },
  { title: "Long Term Success", desc: "Build wealth. Create freedom." },
] as const;

export const faqs = [
  {
    q: "Is this really just ₹19?",
    a: "Yes. The complete Divyashtra blueprint is ₹19 for this launch batch. There is no hidden fee and no auto-renewal — you pay once and get access.",
  },
  {
    q: "I have never traded before. Will I understand it?",
    a: "The course starts from market structure basics and builds up to institutional strategies, so a complete beginner can follow it. Every concept is taught with live chart examples.",
  },
  {
    q: "Forex, crypto, or both?",
    a: "Both. The framework is price-action based, so the same setups work on currency pairs, gold, indices and crypto.",
  },
  {
    q: "How do I get access after paying?",
    a: "Right after your payment is confirmed you get a confirmation screen, and our team contacts you on the WhatsApp number you enter in the form with your access details.",
  },
  {
    q: "Do I need a big account to start?",
    a: "No. Module 8 and the money-management section are built around position sizing and daily loss limits precisely so that small accounts survive and compound.",
  },
  {
    q: "Is this financial advice?",
    a: "No. Gujju Forex is an education platform. We teach you a process for analysing markets — we do not manage money, give buy/sell calls, or guarantee returns.",
  },
] as const;
