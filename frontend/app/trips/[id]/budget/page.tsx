import BudgetContent from "./budget-content";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/api/trips`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return (json.data || []).map((trip: any) => ({ id: trip._id?.toString() || trip.id?.toString() }));
    }
  } catch {}
  return [];
}

export default function TripBudgetPage() {
  return <BudgetContent />;
}
