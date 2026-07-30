"use client";

import { motion } from "framer-motion";
import { type TouristPlace } from "@/lib/globe/tourist-places";
import { MapPin, Clock, Map, Star, Compass, Phone, Globe, Info, Heart, Share2, Plus, Calendar, CloudSun, CreditCard, ThumbsUp, Wind, Users, Activity, Coffee, ParkingCircle, Car, Shield } from "lucide-react";
import { useState } from "react";

interface TouristPlacePanelProps {
  place: TouristPlace;
}

export default function TouristPlacePanel({ place }: TouristPlacePanelProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <motion.div
      key={place.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-[320px] sm:w-[360px] lg:w-[400px] bg-[#0d1f1a]/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-[0_12px_48px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col"
      style={{ maxHeight: "calc(100vh - 120px)" }}
    >
      {/* Hero Image Section */}
      <div className="relative h-56 w-full flex-shrink-0">
        <img 
          src={place.heroImage} 
          alt={place.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f1a] via-[#0d1f1a]/40 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-semibold">{place.rating}</span>
            <span className="text-white/60 text-[10px]">({place.reviewCount})</span>
          </div>
          
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className={`h-9 w-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              isSaved 
                ? "bg-red-500/20 border-red-500/30 text-red-400" 
                : "bg-black/40 border-white/10 text-white hover:bg-black/60"
            }`}
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-red-400" : ""}`} />
          </button>
        </div>

        {/* Title Area */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#E85D04] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
              {place.category}
            </span>
            <span className="text-white/70 text-xs font-medium bg-black/30 px-2 py-0.5 rounded-sm backdrop-blur-sm">
              {place.subCategory}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight mb-1">{place.name}</h2>
          <div className="flex items-center gap-1.5 text-white/70 text-xs">
            <MapPin className="h-3.5 w-3.5 text-[#E85D04]" />
            <span>{place.cityName}, {place.state}</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 p-5 pb-8">
        
        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          <button className="flex-1 bg-gradient-to-r from-[#E85D04] to-[#E85D04]/80 hover:from-[#E85D04]/90 hover:to-[#E85D04]/70 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#E85D04]/20 transition-all">
            <Plus className="h-4 w-4" />
            Add to Trip
          </button>
          <button className="h-10 px-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-white flex items-center justify-center transition-colors">
            <Share2 className="h-4 w-4 text-white/70" />
          </button>
          <button className="h-10 px-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-white flex items-center justify-center transition-colors">
            <Compass className="h-4 w-4 text-white/70" />
          </button>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <InfoCard icon={<Clock className="h-4 w-4 text-blue-400" />} label="Duration" value={place.averageVisitDuration} />
          <InfoCard icon={<CreditCard className="h-4 w-4 text-green-400" />} label="Entry Fee" value={place.entryFee} />
          <InfoCard icon={<Calendar className="h-4 w-4 text-purple-400" />} label="Best Season" value={place.bestSeason} />
          <InfoCard icon={<CloudSun className="h-4 w-4 text-orange-400" />} label="Weather" value={place.weatherCategory} />
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-2 text-sm flex items-center gap-2">
            <Info className="h-4 w-4 text-[#E85D04]" /> About
          </h3>
          <p className="text-white/60 text-xs leading-relaxed">
            {place.longDescription}
          </p>
        </div>

        {/* Open Hours */}
        <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#E85D04]" /> Operating Hours
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md ${
              place.status === "Open" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            }`}>
              {place.status}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-white/60 border-t border-white/[0.05] pt-3">
            <span>Everyday</span>
            <span className="font-medium text-white/80">{place.openingTime} - {place.closingTime}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-white/60 pt-2">
            <span>Best Time</span>
            <span className="font-medium text-[#E85D04]">{place.bestTimeToVisit}</span>
          </div>
        </div>

        {/* Facilities */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 text-sm">Facilities & Access</h3>
          <div className="flex flex-wrap gap-2">
            {place.familyFriendly && <FacilityBadge icon={<Users className="h-3 w-3" />} label="Family" />}
            {place.parkingAvailable && <FacilityBadge icon={<ParkingCircle className="h-3 w-3" />} label="Parking" />}
            {place.foodAvailable && <FacilityBadge icon={<Coffee className="h-3 w-3" />} label="Food" />}
            {place.wheelchairAccessible && <FacilityBadge icon={<Activity className="h-3 w-3" />} label="Accessible" />}
            {place.washroomAvailable && <FacilityBadge icon={<Shield className="h-3 w-3" />} label="Washroom" />}
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 text-sm">Gallery</h3>
          <div className="grid grid-cols-3 gap-2">
            {place.galleryImages.map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/10 group cursor-pointer">
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Travel Tips */}
        <div className="bg-[#E85D04]/5 border border-[#E85D04]/20 rounded-2xl p-4 mb-6">
          <h3 className="text-[#E85D04] font-semibold mb-2 text-sm flex items-center gap-2">
            <Compass className="h-4 w-4" /> Travel Tips
          </h3>
          <ul className="space-y-1.5">
            {place.travelTips.map((tip, i) => (
              <li key={i} className="text-white/60 text-xs flex items-start gap-2">
                <span className="text-[#E85D04] mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Links */}
        <div className="space-y-2">
          {place.officialWebsite && (
            <a href={place.officialWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-white/60 hover:text-white bg-white/[0.03] p-3 rounded-xl border border-white/[0.05] transition-colors">
              <Globe className="h-4 w-4 text-blue-400" />
              <span className="truncate">{place.officialWebsite.replace("https://", "")}</span>
            </a>
          )}
          {place.googleMapsLink && (
            <a href={place.googleMapsLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-white/60 hover:text-white bg-white/[0.03] p-3 rounded-xl border border-white/[0.05] transition-colors">
              <Map className="h-4 w-4 text-green-400" />
              <span>View on Google Maps</span>
            </a>
          )}
          {place.contactNumber && (
            <div className="flex items-center gap-3 text-xs text-white/60 bg-white/[0.03] p-3 rounded-xl border border-white/[0.05]">
              <Phone className="h-4 w-4 text-purple-400" />
              <span>{place.contactNumber}</span>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider">{label}</span>
      </div>
      <span className="text-white/90 text-sm font-semibold pl-6">{value}</span>
    </div>
  );
}

function FacilityBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full px-2.5 py-1 text-[10px] font-medium text-white/70">
      <span className="text-white/40">{icon}</span>
      {label}
    </div>
  );
}
