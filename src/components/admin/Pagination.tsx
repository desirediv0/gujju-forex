import Link from "next/link";

export default function Pagination({
  page,
  pageCount,
  basePath,
  params,
}: {
  page: number;
  pageCount: number;
  basePath: string;
  params: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  const build = (target: number) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) search.set(key, value);
    });
    if (target > 1) search.set("page", String(target));
    const qs = search.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <p className="text-[12.5px] text-neutral-600">
        Page {page} of {pageCount}
      </p>
      <div className="flex gap-2">
        {page > 1 && (
          <Link
            href={build(page - 1)}
            className="rounded-lg border border-white/12 px-4 py-2 text-[12.5px] font-semibold text-neutral-300 transition hover:border-gold-300/45 hover:text-gold-100"
          >
            ← Previous
          </Link>
        )}
        {page < pageCount && (
          <Link
            href={build(page + 1)}
            className="rounded-lg border border-white/12 px-4 py-2 text-[12.5px] font-semibold text-neutral-300 transition hover:border-gold-300/45 hover:text-gold-100"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
