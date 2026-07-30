"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, staggerItem } from "@/components/animations/animation-utils";

interface Category {
  id: string;
  title: string;
  count: string;
  image: string;
  icon: string;
  tagline: string;
  gradient: string;
}

const CATEGORIES: Category[] = [
  {
    id: "international",
    title: "International Tours",
    count: "180+ Packages",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
    icon: "🌍",
    tagline: "Explore iconic global destinations",
    gradient: "from-blue-900/80 via-blue-950/40 to-transparent",
  },
  {
    id: "honeymoon",
    title: "Honeymoon",
    count: "120+ Packages",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    icon: "💖",
    tagline: "Romantic escapes for couples",
    gradient: "from-rose-900/80 via-pink-950/40 to-transparent",
  },
  {
    id: "beach",
    title: "Beach & Islands",
    count: "150+ Packages",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    icon: "🏝️",
    tagline: "Turquoise waters & pristine sands",
    gradient: "from-teal-900/80 via-cyan-950/40 to-transparent",
  },
  {
    id: "adventure",
    title: "Adventure",
    count: "95+ Packages",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    icon: "🏔️",
    tagline: "Trekking, expeditions & thrill",
    gradient: "from-amber-900/80 via-amber-950/40 to-transparent",
  },
  {
    id: "wildlife",
    title: "Wildlife",
    count: "70+ Packages",
    image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80",
    icon: "🦁",
    tagline: "Safaris & natural habitats",
    gradient: "from-emerald-900/80 via-emerald-950/40 to-transparent",
  },
  {
    id: "cruises",
    title: "Cruises",
    count: "45+ Packages",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80",
    icon: "🚢",
    tagline: "Luxury ocean voyages",
    gradient: "from-indigo-900/80 via-indigo-950/40 to-transparent",
  },
  {
    id: "religious",
    title: "Religious & Spiritual",
    count: "85+ Packages",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    icon: "🛕",
    tagline: "Sacred pilgrimages & heritage",
    gradient: "from-orange-900/80 via-orange-950/40 to-transparent",
  },
  {
    id: "luxury",
    title: "Luxury Travel",
    count: "60+ Packages",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    icon: "👑",
    tagline: "5-star stays & private charters",
    gradient: "from-yellow-900/80 via-amber-950/40 to-transparent",
  },
  {
    id: "family",
    title: "Family Vacations",
    count: "140+ Packages",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80",
    icon: "👨‍👩‍👧‍👦",
    tagline: "Memories for all generations",
    gradient: "from-violet-900/80 via-purple-950/40 to-transparent",
  },
  {
    id: "corporate",
    title: "Corporate & MICE",
    count: "50+ Packages",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    icon: "💼",
    tagline: "Offsites, retreats & conferences",
    gradient: "from-[#1B4332]/90 via-emerald-950/40 to-transparent",
  },
];

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12" strokeWidth={2} strokeLinecap="round" />
    <polyline points="12 5 19 12 12 19" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HolidayCategories() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-[#0B0F17] dark:via-[#121824] dark:to-[#0B0F17] transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#E85D04] mb-2">
                Handcrafted Collections
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white font-sans">
                Explore by Holiday Category
              </h2>
              <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl">
                Whether you seek serene island beaches, thrilling mountain treks, or romantic retreats, find your dream travel style.
              </p>
            </div>
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 font-bold text-sm text-[#E85D04] hover:text-[#D4540A] group shrink-0"
            >
              <span>View All Categories</span>
              <span className="transform group-hover:translate-x-1 transition-transform">
                <ArrowRightIcon />
              </span>
            </Link>
          </div>
        </ScrollReveal>

        {/* Categories Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.id} variants={staggerItem}>
              <Link
                href={`/packages?category=${cat.id}`}
                className="group relative flex flex-col justify-between h-72 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 border border-black/5 dark:border-white/10"
              >
                {/* Background Image */}
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Scrim Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-90 group-hover:opacity-95 transition-opacity`} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                {/* Top Badge & Icon */}
                <div className="relative z-10 p-5 flex items-start justify-between">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-sm group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white">
                    {cat.count}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 p-5 space-y-1">
                  <h3 className="text-xl font-extrabold text-white tracking-tight leading-snug group-hover:text-amber-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-white/80 font-medium line-clamp-1">
                    {cat.tagline}
                  </p>
                  <div className="pt-2 flex items-center gap-1 text-xs font-bold text-white opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span>Explore Packages</span>
                    <ArrowRightIcon />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
