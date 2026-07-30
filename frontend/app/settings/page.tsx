"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/components/ui/Toast";
import { getCurrentUser, type AuthUser } from "@/lib/api/auth";
import { ScrollReveal } from "@/components/animations/animation-utils";
import { motion, AnimatePresence } from "framer-motion";

const currencies = [
  { label: "INR (₹)", value: "INR" },
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "GBP (£)", value: "GBP" },
];

const travelStyles = [
  { label: "Solo Explorer", value: "Solo" },
  { label: "Couples Luxury", value: "Couple" },
  { label: "Family Vacation", value: "Family" },
  { label: "Adventure Friends", value: "Friends" },
  { label: "Ultra Luxury", value: "Luxury" },
  { label: "Budget Backpacker", value: "Budget" },
];

const foodPreferences = [
  { label: "Pure Vegetarian 🌿", value: "Pure Vegetarian" },
  { label: "Non-Vegetarian 🍖", value: "Non-Vegetarian" },
  { label: "Vegan 🌱", value: "Vegan" },
  { label: "No Preference 🍽️", value: "No Preference" },
];

const activityOptions = ["History", "Nature", "Adventure", "Beaches", "Shopping", "Food", "Nightlife", "Spirituality"];

export default function SettingsPage() {
  const { addToast } = useToast();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("Ritesh Gajjar");
  const [email, setEmail] = useState("ritesh.optimatrix@gmail.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [currency, setCurrency] = useState("INR");
  const [travelStyle, setTravelStyle] = useState("Couple");
  const [foodPref, setFoodPref] = useState("Pure Vegetarian");
  const [activities, setActivities] = useState<string[]>(["History", "Beaches", "Food"]);
  
  const [notifTripReminders, setNotifTripReminders] = useState(true);
  const [notifBudgetAlerts, setNotifBudgetAlerts] = useState(true);
  const [notifAIUpdates, setNotifAIUpdates] = useState(true);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchUser = useCallback(async () => {
    try {
      const res = await getCurrentUser();
      if (res.success && res.data) {
        const u = res.data as AuthUser;
        setUser(u);
        if (u.full_name) setName(u.full_name);
        if (u.email) setEmail(u.email);
        if (u.phone_number) setPhone(u.phone_number);
        if (u.travel_style) setTravelStyle(u.travel_style);
        if (u.food_preference) setFoodPref(u.food_preference);
        if (u.default_currency) setCurrency(u.default_currency);
      }
    } catch {
      // Keep default values
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const toggleActivity = (activity: string) => {
    setActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]
    );
  };

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (loading) {
    return (
      <DashboardLayout title="Settings">
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1B4332] border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Account Settings">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Header Title */}
        <ScrollReveal>
          <div className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white p-8 rounded-3xl shadow-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-extrabold uppercase tracking-widest text-amber-300">
              ⚙️ Account Control Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">System & Account Settings</h1>
            <p className="text-white/80 text-sm max-w-xl">
              Manage your personal profile, AI trip preferences, default currency, and security settings.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: User Profile Overview Card */}
          <div className="space-y-6">
            <ScrollReveal delay={0.05}>
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-6 shadow-xl border border-gray-200/70 dark:border-white/10 text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-[#1B4332] text-white text-3xl font-extrabold flex items-center justify-center shadow-lg border-4 border-[#CBE3D6]">
                  {initials || "RG"}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{email}</p>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
                    VIP Member
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex justify-center gap-2">
                  <button
                    onClick={() => addToast("Profile picture update triggered!", "info")}
                    className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 text-xs font-extrabold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                  >
                    Change Avatar
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Quick Actions Card */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-6 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-4">
                <h4 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                  Security & Access
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setPasswordModalOpen(true)}
                    className="w-full text-left px-4 py-3 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-[#1B4332]/10 text-gray-800 dark:text-gray-200 text-xs font-bold transition-all flex items-center justify-between"
                  >
                    <span>🔒 Change Password</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => addToast("Logged out successfully!", "info")}
                    className="w-full text-left px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-red-600 dark:text-red-400 text-xs font-bold transition-all flex items-center justify-between"
                  >
                    <span>🚪 Sign Out</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Editable Settings Sections */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Section 1: Profile Details */}
            <ScrollReveal delay={0.05}>
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-8 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
                  <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">1</span>
                  <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Personal Profile</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-gray-700 dark:text-gray-300">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-[#E85D04]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-gray-700 dark:text-gray-300">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-[#E85D04]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-extrabold text-gray-700 dark:text-gray-300">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-[#E85D04]"
                    />
                  </div>
                </div>

                <button
                  onClick={() => addToast("Profile details saved successfully!", "success")}
                  className="px-6 py-3 rounded-2xl bg-[#1B4332] hover:bg-[#153728] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer"
                >
                  Save Profile Info
                </button>
              </div>
            </ScrollReveal>

            {/* Section 2: AI & Travel Preferences */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-8 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
                  <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">2</span>
                  <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">AI Planner Preferences</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-gray-700 dark:text-gray-300">Default Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs font-bold text-gray-900 dark:text-white outline-none cursor-pointer"
                    >
                      {currencies.map((c) => (
                        <option key={c.value} value={c.value} className="text-gray-900">{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-gray-700 dark:text-gray-300">Preferred Travel Style</label>
                    <select
                      value={travelStyle}
                      onChange={(e) => setTravelStyle(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs font-bold text-gray-900 dark:text-white outline-none cursor-pointer"
                    >
                      {travelStyles.map((s) => (
                        <option key={s.value} value={s.value} className="text-gray-900">{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-extrabold text-gray-700 dark:text-gray-300">Food Preference</label>
                    <select
                      value={foodPref}
                      onChange={(e) => setFoodPref(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs font-bold text-gray-900 dark:text-white outline-none cursor-pointer"
                    >
                      {foodPreferences.map((f) => (
                        <option key={f.value} value={f.value} className="text-gray-900">{f.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Favorite Activity Chips */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-extrabold text-gray-700 dark:text-gray-300">Favorite Activities</label>
                  <div className="flex flex-wrap gap-2">
                    {activityOptions.map((activity) => {
                      const selected = activities.includes(activity);
                      return (
                        <button
                          key={activity}
                          type="button"
                          onClick={() => toggleActivity(activity)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selected
                              ? "bg-[#1B4332] text-white shadow"
                              : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {selected ? "✓ " : "+ "}{activity}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => addToast("AI Preferences saved!", "success")}
                  className="px-6 py-3 rounded-2xl bg-[#E85D04] hover:bg-[#D4540A] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer"
                >
                  Save AI Preferences
                </button>
              </div>
            </ScrollReveal>

            {/* Section 3: Notification Toggles */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-8 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
                  <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">3</span>
                  <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Notification Alerts</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
                    <div>
                      <p className="text-xs font-extrabold text-gray-900 dark:text-white">Trip Reminders</p>
                      <p className="text-[10px] text-gray-500">Get alerts for upcoming departure dates and bookings</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifTripReminders}
                      onChange={(e) => setNotifTripReminders(e.target.checked)}
                      className="w-5 h-5 accent-[#1B4332] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
                    <div>
                      <p className="text-xs font-extrabold text-gray-900 dark:text-white">Budget Alerts</p>
                      <p className="text-[10px] text-gray-500">Receive notifications when spending nears budget caps</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifBudgetAlerts}
                      onChange={(e) => setNotifBudgetAlerts(e.target.checked)}
                      className="w-5 h-5 accent-[#1B4332] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
                    <div>
                      <p className="text-xs font-extrabold text-gray-900 dark:text-white">AI Assistant Updates</p>
                      <p className="text-[10px] text-gray-500">Real-time alerts when AI updates itinerary itineraries</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifAIUpdates}
                      onChange={(e) => setNotifAIUpdates(e.target.checked)}
                      className="w-5 h-5 accent-[#1B4332] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>

        {/* Change Password Modal */}
        <AnimatePresence>
          {passwordModalOpen && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setPasswordModalOpen(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-md bg-white dark:bg-[#161F2E] rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-white/10 space-y-4 text-gray-900 dark:text-white"
              >
                <h3 className="text-lg font-extrabold">Change Password</h3>
                <p className="text-xs text-gray-500">Update your security credentials.</p>

                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs font-bold outline-none"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs font-bold outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs font-bold outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setPasswordModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!currentPassword || !newPassword) {
                        addToast("Please fill in all fields", "error");
                        return;
                      }
                      if (newPassword !== confirmPassword) {
                        addToast("Passwords do not match", "error");
                        return;
                      }
                      addToast("Password changed successfully!", "success");
                      setPasswordModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold"
                  >
                    Save Password
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}
