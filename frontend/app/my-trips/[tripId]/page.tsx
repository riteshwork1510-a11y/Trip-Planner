import MyTripContent from "./my-trip-content";

export async function generateStaticParams() {
  try {
    const res = await fetch("http://localhost:8000/api/trips", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return (json.data || []).map((trip: any) => ({ tripId: trip._id?.toString() || trip.id?.toString() }));
    }
  } catch {}
  return [];
}

export default function MyTripPage() {
  return <MyTripContent />;
}
