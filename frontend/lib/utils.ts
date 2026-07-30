/**
 * Merge class names — filters out falsy values and joins with a space.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format a number as currency.
 * Default currency is INR (₹1,50,000 Indian grouping).
 * Supports "INR" and "USD".
 */
export function formatCurrency(amount: number, currency: string = "INR"): string {
  if (currency === "USD") {
    return `$${amount.toLocaleString("en-US")}`;
  }
  // Indian numbering system: ₹1,50,000
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * Format an ISO date string as "Jan 15, 2025".
 */
export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date range as "Jan 15 - Jan 18, 2025".
 * If the months are the same, the year is only appended once.
 */
export function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);

  const monthDay = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const monthDayYear = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${monthDay(s)} - ${monthDayYear(e)}`;
  }

  if (s.getFullYear() === e.getFullYear()) {
    return `${monthDay(s)} - ${monthDayYear(e)}`;
  }

  return `${monthDayYear(s)} - ${monthDayYear(e)}`;
}

/**
 * Return a human-readable duration string.
 * Example: getDurationText(4, 3) → "4 Days / 3 Nights"
 */
export function getDurationText(days: number, nights: number): string {
  const dayLabel = days === 1 ? "Day" : "Days";
  const nightLabel = nights === 1 ? "Night" : "Nights";
  return `${days} ${dayLabel} / ${nights} ${nightLabel}`;
}

/**
 * Return Tailwind color classes based on trip status.
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "draft":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

/**
 * Return a greeting based on the current time of day.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

/**
 * Calculate the percentage of budget spent.
 * Returns a number between 0 and 100.
 */
export function calculateBudgetPercentage(spent: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(Math.round((spent / total) * 100), 100);
}

/**
 * Generate a simple unique ID (timestamp + random suffix).
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
