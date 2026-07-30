"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: "deal" | "trip" | "system";
}

const NOTIFICATIONS_DATA: NotificationItem[] = [
  { id: "n1", title: "🎉 Special Deal: Swiss Alps Express", desc: "Get 15% off luxury train tours this month.", time: "10 mins ago", read: false, type: "deal" },
  { id: "n2", title: "✈️ Itinerary Update: Bali Trip", desc: "Day 2 sunset temple slot confirmed.", time: "1 hour ago", read: false, type: "trip" },
  { id: "n3", title: "💳 Visa Assistance Approved", desc: "Your UAE eVisa application has passed document check.", time: "3 hours ago", read: true, type: "system" },
];

export default function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-white/15 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E85D04] text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-[#161F2E] rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 py-3 z-50 overflow-hidden text-gray-900 dark:text-white"
          >
            <div className="px-4 py-2 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider">Notifications</h4>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[10px] font-bold text-[#E85D04] hover:underline">
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1 p-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-2xl transition-colors text-xs space-y-0.5 ${
                    n.read ? "bg-transparent opacity-70" : "bg-gray-50 dark:bg-white/5 font-semibold"
                  }`}
                >
                  <p className="font-bold text-gray-900 dark:text-white">{n.title}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{n.desc}</p>
                  <span className="text-[9px] text-gray-400 block pt-0.5">{n.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
