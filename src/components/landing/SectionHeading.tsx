export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <div
        className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}
      >
        <span className="h-px w-8 bg-gold-400/50" aria-hidden />
        <span className="text-[10.5px] font-bold uppercase tracking-[0.3em] text-gold-300">
          {eyebrow}
        </span>
        <span className="h-px w-8 bg-gold-400/50" aria-hidden />
      </div>
      <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-[2.6rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[15px] leading-relaxed text-neutral-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
