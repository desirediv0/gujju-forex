export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatINR(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: paise % 100 === 0 ? 0 : 2,
  }).format(paise / 100);
}

export function formatDateTime(value: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/**
 * Midnight IST today, as a UTC instant. The business is India-based, so
 * "today" must not follow the server's timezone (UTC on most hosts).
 */
export function startOfTodayIST() {
  const now = Date.now();
  const istNow = now + IST_OFFSET_MS;
  const istMidnight = istNow - (istNow % (24 * 60 * 60 * 1000));
  return new Date(istMidnight - IST_OFFSET_MS);
}

export function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}
