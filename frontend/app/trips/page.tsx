"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Tabs from "@/components/ui/Tabs";
import EmptyState from "@/components/ui/EmptyState";
import { getTrips, deleteTrip, type Trip } from "@/lib/api/trips";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDateRange, getDurationText } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, staggerItem } from "@/components/animations/animation-utils";

const statusTabs = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Draft", value: "draft" },
];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Budget: High to Low", value: "budget-high" },
  { label: "Budget: Low to High", value: "budget-low" },
];

const gradientMap: Record<string, string> = {
  Manali: "from-blue-400 to-blue-600",
  Goa: "from-orange-300 to-pink-400",
  Dwarka: "from-amber-300 to-orange-400",
  Dubai: "from-yellow-300 to-amber-500",
  Paris: "from-purple-300 to-pink-400",
  Bali: "from-green-300 to-teal-400",
};

const statusBadgeVariant: Record<string, "info" | "success" | "warning" | "default"> = {
  upcoming: "info",
  completed: "success",
  draft: "warning",
};

function MoreActionsDropdown({ tripId, onDelete }: { tripId: string; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" /></svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full z-10 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <Link href={`/trips/${tripId}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>View</Link>
            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 cursor-pointer" onClick={() => { onDelete(tripId); setOpen(false); }}>Delete</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TripsPage() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchTrips = useCallback(async () => {
    try {
      const res = await getTrips();
      let fetched: Trip[] = (res && res.data) ? res.data : [];
      
      // Merge with real-time localStorage saved trips
      const localSavedStr = localStorage.getItem("saved_trips");
      if (localSavedStr) {
        try {
          const localSaved: Trip[] = JSON.parse(localSavedStr);
          const existingIds = new Set(fetched.map(t => t.id));
          const uniqueLocal = localSaved.filter(t => !existingIds.has(t.id));
          fetched = [...uniqueLocal, ...fetched];
        } catch {
          // ignore parsing error
        }
      }
      setTrips(fetched);
    } catch {
      const localSavedStr = localStorage.getItem("saved_trips");
      if (localSavedStr) {
        try { setTrips(JSON.parse(localSavedStr)); } catch {}
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  async function handleDelete(tripId: string) {
    try {
      const res = await deleteTrip(tripId);
      if (res.success) {
        addToast("Trip deleted", "success");
        setTrips((prev) => prev.filter((t) => t.id !== tripId));
      }
    } catch {
      addToast("Failed to delete trip", "error");
    }
  }

  const filteredTrips = useMemo(() => {
    const result = trips.filter((trip) => {
      const matchesSearch = trip.destination.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = activeStatus === "all" || trip.status === activeStatus;
      return matchesSearch && matchesStatus;
    });
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest": return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "budget-high": return b.budget - a.budget;
        case "budget-low": return a.budget - b.budget;
        default: return 0;
      }
    });
    return result;
  }, [trips, search, activeStatus, sortBy]);

  if (loading) {
    return (
      <DashboardLayout title="My Trips" breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "My Trips" }]}>
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1B4332] border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Trips" breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "My Trips" }]}>
      <div className="space-y-6">
        <ScrollReveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#2D3436]">My Trips</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your upcoming adventures and past journeys.</p>
            </div>
            <Link href="/">
              <Button variant="primary" size="md">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Create New Trip
              </Button>
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Input
              placeholder="Search by destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
              containerClassName="w-full lg:w-72"
            />
            <Tabs tabs={statusTabs} activeTab={activeStatus} onChange={setActiveStatus} className="overflow-x-auto" />
            <Select options={sortOptions} value={sortBy} onChange={(e) => setSortBy(e.target.value)} containerClassName="w-full lg:w-52" />
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          {filteredTrips.length === 0 ? (
            <EmptyState
              icon={<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>}
              title="No trips found"
              description="Try adjusting your filters or create a new trip."
            />
          ) : (
            <motion.div key={`${activeStatus}-${sortBy}-${search}`} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" layout>
              {filteredTrips.map((trip, idx) => {
                const gradient = gradientMap[trip.destination] || "from-gray-300 to-gray-500";
                const badgeVariant = statusBadgeVariant[trip.status] || "default";

                return (
                  <motion.div
                    key={trip.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Card padding="none" hover className="overflow-hidden group">
                      <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-end overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-700 group-hover:scale-110`} />
                        <div className="relative z-10 w-full p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-white drop-shadow">{trip.destination}</h3>
                              <p className="mt-0.5 text-sm text-white/90 drop-shadow">{getDurationText(trip.days, trip.nights)}</p>
                            </div>
                            <Badge variant={badgeVariant} size="sm">{trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-bold text-[#2D3436]">{trip.destination}</h3>
                        <p className="mt-1 text-sm text-gray-500">{getDurationText(trip.days, trip.nights)}</p>
                        {trip.start_date && trip.end_date && (
                          <p className="mt-0.5 text-sm text-gray-500">{formatDateRange(trip.start_date, trip.end_date)}</p>
                        )}
                        <div className="mt-3">{trip.travel_style && <Badge variant="default" size="sm">{trip.travel_style}</Badge>}</div>
                        <p className="mt-3 text-base font-semibold text-[#1B4332]">{formatCurrency(trip.budget)}</p>
                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                          <Link href={`/trips/${trip.id}`}><Button variant="primary" size="sm">View Details</Button></Link>
                          <MoreActionsDropdown tripId={trip.id} onDelete={handleDelete} />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
