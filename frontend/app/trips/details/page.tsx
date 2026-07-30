import { Suspense } from "react";
import TripDetailContent from "./trip-detail-content";

export default function TripDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white text-xl font-bold">Loading Trip...</div>}>
      <TripDetailContent />
    </Suspense>
  );
}
