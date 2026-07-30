import TripDetailContent from "./trip-detail-content";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/api/trips`);
    if (res.ok) {
      const json = await res.json();
      const params = (json.data || []).map((trip: any) => ({ id: trip._id?.toString() || trip.id?.toString() }));
      if (params.length > 0) return params;
    }
  } catch {}
  return [{ id: "placeholder" }];
}

export default function TripDetailPage() {
  return <TripDetailContent />;
}
