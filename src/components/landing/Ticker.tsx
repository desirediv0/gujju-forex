const items = [
  "Price Rejection Framework",
  "Liquidity Intelligence",
  "Institutional Order Zones",
  "Precision Fibonacci",
  "3 Phase Strategy",
  "50 EMA Trend System",
  "RSI Divergence",
  "Position Sizing",
  "Daily Loss Limits",
  "Compounding",
];

export default function Ticker() {
  return (
    <div className="relative flex overflow-hidden border-y border-gold-300/12 bg-ink-2/60 py-4">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent"
        aria-hidden
      />
      <div className="animate-marquee flex shrink-0 items-center" aria-hidden>
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="px-6 text-[12px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              {item}
            </span>
            <span className="h-1 w-1 rotate-45 bg-gold-400/70" />
          </span>
        ))}
      </div>
      <span className="sr-only">
        Topics covered: {items.join(", ")}
      </span>
    </div>
  );
}
