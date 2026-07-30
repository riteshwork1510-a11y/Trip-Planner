"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/animation-utils";
import { useToast } from "@/components/ui/Toast";

interface DestinationCard {
  id: string;
  name: string;
  country: string;
  image: string;
  duration: string;
  price: string;
  rating: number;
  reviews: number;
  category: string;
  groupSize: string;
  isPopular?: boolean;
  ribbonText?: string;
}

const DESTINATIONS: DestinationCard[] = [
  {
    id: "bali-paradise",
    name: "Bali Island Escape",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    duration: "6 Days / 5 Nights",
    price: "₹45,999",
    rating: 4.9,
    reviews: 1420,
    category: "Beach & Honeymoon",
    groupSize: "2 - 8 People",
    isPopular: true,
    ribbonText: "🔥 Most Popular",
  },
  {
    id: "dubai-luxury",
    name: "Dubai Skyline & Desert Safari",
    country: "United Arab Emirates",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    duration: "5 Days / 4 Nights",
    price: "₹58,499",
    rating: 4.85,
    reviews: 980,
    category: "Luxury & Shopping",
    groupSize: "2 - 12 People",
    isPopular: true,
    ribbonText: "⭐ Best Seller",
  },
  {
    id: "swiss-alps",
    name: "Swiss Alps & Lakes Odyssey",
    country: "Switzerland",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    duration: "7 Days / 6 Nights",
    price: "₹1,45,000",
    rating: 4.95,
    reviews: 750,
    category: "Scenic & Mountains",
    groupSize: "Max 10 People",
    isPopular: true,
    ribbonText: "👑 Luxury Pick",
  },
  {
    id: "maldives-water-villa",
    name: "Maldives Overwater Sanctuary",
    country: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    duration: "4 Days / 3 Nights",
    price: "₹89,999",
    rating: 4.98,
    reviews: 2100,
    category: "Honeymoon & Villa",
    groupSize: "Couples Only",
    isPopular: fontTrue("Trending"),
    ribbonText: "🏝️ Trending",
  },
  {
    id: "paris-romantic",
    name: "Paris & French Riviera",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    duration: "6 Days / 5 Nights",
    price: "₹1,12,000",
    rating: 4.88,
    reviews: 890,
    category: "Culture & Romance",
    groupSize: "2 - 10 People",
  },
  {
    id: "leh-ladakh",
    name: "Leh Ladakh Bike & Pangong Expedition",
    country: "India",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    duration: "8 Days / 7 Nights",
    price: "₹34,500",
    rating: 4.92,
    reviews: 1650,
    category: "Adventure Trek",
    groupSize: "Solo / Groups",
    ribbonText: "🏔️ High Adventure",
  },
];

function fontTrue(text: string) {
  return true;
}

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m15 19-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m9 5 7 7-7 7" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg className={`w-5 h-5 transition-colors ${filled ? "fill-red-500 text-red-500" : "text-gray-700 dark:text-gray-200"}`} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-[#E85D04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3" strokeWidth={2} />
    <circle cx="6" cy="12" r="3" strokeWidth={2} />
    <circle cx="18" cy="19" r="3" strokeWidth={2} />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" strokeWidth={2} />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" strokeWidth={2} />
  </svg>
);

const CompareIcon = () => (
  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-[#E85D04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

export default function PopularDestinations() {
  const { addToast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string, name: string) => {
    setWishlist((prev) => {
      const nextState = !prev[id];
      addToast(nextState ? `Added "${name}" to Wishlist` : `Removed "${name}" from Wishlist`, "info");
      return { ...prev, [id]: nextState };
    });
  };

  const handleShare = (name: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast(`Link for "${name}" copied to clipboard!`, "success");
    } else {
      addToast(`Shared "${name}"`, "info");
    }
  };

  const handleCompare = (name: string) => {
    addToast(`"${name}" added to comparison queue!`, "info");
  };

  const handleEnquire = (name: string) => {
    addToast(`Enquiry modal opened for "${name}". An agent will connect shortly!`, "success");
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gray-50 dark:bg-[#0B0F17] transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header with Arrows */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#E85D04] mb-2">
                Top Rated Journeys
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white font-sans">
                Popular Destinations
              </h2>
              <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl">
                Discover travelers' most-loved luxury itineraries with guaranteed best prices and 5-star experiences.
              </p>
            </div>

            {/* Scroll Navigation Arrows */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-800 dark:text-white shadow-md hover:bg-[#1B4332] hover:text-white hover:border-transparent transition-all cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-800 dark:text-white shadow-md hover:bg-[#1B4332] hover:text-white hover:border-transparent transition-all cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Horizontal Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-8 pt-2 scroll-smooth snap-x snap-mandatory"
        >
          {DESTINATIONS.map((dest) => (
            <motion.div
              key={dest.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="snap-start shrink-0 w-[320px] sm:w-[360px] bg-white dark:bg-[#121824] rounded-3xl overflow-hidden border border-gray-200/70 dark:border-white/10 shadow-xl flex flex-col justify-between"
            >
              {/* Card Top: Image & Overlay Badges */}
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  sizes="360px"
                  className="object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                {/* Ribbon Tag */}
                {dest.ribbonText && (
                  <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#E85D04] to-[#F37216] text-white text-xs font-extrabold shadow-lg">
                    {dest.ribbonText}
                  </div>
                )}

                {/* Top Action Icons: Wishlist & Share */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => toggleWishlist(dest.id, dest.name)}
                    className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md flex items-center justify-center shadow hover:scale-110 transition-transform cursor-pointer"
                    aria-label="Wishlist"
                  >
                    <HeartIcon filled={!!wishlist[dest.id]} />
                  </button>
                  <button
                    onClick={() => handleShare(dest.name)}
                    className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md flex items-center justify-center shadow hover:scale-110 transition-transform cursor-pointer"
                    aria-label="Share"
                  >
                    <ShareIcon />
                  </button>
                </div>

                {/* Bottom Overlay Info: Duration & Group */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90 font-semibold">
                  <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/20">
                    ⏱️ {dest.duration}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/20">
                    👥 {dest.groupSize}
                  </span>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Category & Rating Row */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#1B4332] dark:text-emerald-400">
                      {dest.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-gray-300">
                      <span className="text-amber-400">⭐</span>
                      <span>{dest.rating}</span>
                      <span className="text-gray-400">({dest.reviews})</span>
                    </div>
                  </div>

                  {/* Title & Country */}
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white line-clamp-1">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                    📍 {dest.country}
                  </p>
                </div>

                {/* Price & Primary CTA Row */}
                <div className="pt-4 border-t border-gray-100 dark:border-white/10 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider block">Starting From</span>
                      <span className="text-2xl font-extrabold text-[#E85D04] tracking-tight">{dest.price}</span>
                      <span className="text-xs text-gray-400 font-normal"> / person</span>
                    </div>
                    <button
                      onClick={() => handleCompare(dest.name)}
                      className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 transition-colors"
                      title="Compare Destination"
                    >
                      <CompareIcon />
                    </button>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/destinations/${dest.id}`}
                      className="text-center py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-gray-800 dark:text-white font-bold text-xs hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleEnquire(dest.name)}
                      className="py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#153728] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
