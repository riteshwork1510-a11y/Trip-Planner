"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import { forgotPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { motion, AnimatePresence } from "framer-motion";

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="w-8 h-8 text-[#1B4332]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address"); return; }

    setLoading(true);
    setError("");
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 0) setError("Unable to connect to the server. Please try again.");
        else setSent(true);
      } else {
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/95 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-2xl text-center space-y-5"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-[#1B4332]/10 flex items-center justify-center mx-auto"
          >
            <CheckCircleIcon />
          </motion.div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Check your email</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-xs mx-auto">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-bold text-gray-900">{email}</span>.
              Please check your inbox.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#E85D04] to-orange-600 hover:from-orange-600 hover:to-[#E85D04] text-white px-6 py-3 text-xs sm:text-sm font-extrabold shadow-xl shadow-orange-950/20 transition-all duration-300"
          >
            Back to Sign In
          </Link>
          <p className="text-xs text-gray-500">
            Didn&apos;t receive the email?{" "}
            <button
              onClick={() => setSent(false)}
              className="font-bold text-[#1B4332] hover:text-[#2D6A4F] transition-colors cursor-pointer"
            >
              Try again
            </button>
          </p>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/95 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6"
      >
        {/* Heading */}
        <div className="space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#1B4332]/10 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-[#1B4332]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Forgot password?</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium"
            >
              <svg className="h-5 w-5 text-rose-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="forgot-email" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <MailIcon />
              </div>
              <input
                id="forgot-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                autoComplete="email"
                className={`w-full bg-gray-50/80 border rounded-2xl py-3.5 pl-11 pr-4 text-xs sm:text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-2 transition-all duration-200 font-medium placeholder:text-gray-400 ${
                  error
                    ? "border-rose-400 focus:ring-rose-500/20"
                    : "border-gray-200 focus:border-[#1B4332] focus:ring-[#1B4332]/20"
                }`}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E85D04] to-orange-600 hover:from-orange-600 hover:to-[#E85D04] text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-orange-950/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              <span>Send Reset Link</span>
            )}
          </motion.button>
        </form>

        {/* Back to Sign In */}
        <p className="text-center text-xs sm:text-sm text-gray-500">
          Remember your password?{" "}
          <Link href="/login" className="font-bold text-[#1B4332] hover:text-[#2D6A4F] transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
