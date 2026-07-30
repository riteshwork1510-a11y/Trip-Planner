"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api/client";

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="h-5 w-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const justRegistered = searchParams.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  function clearError(field: string) {
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please enter a valid email address";

    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";

    if (Object.keys(errs).length > 0) setShake(true);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate() || loading) return;

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      router.push("/");
    } catch (err) {
      setShake(true);
      if (err instanceof ApiError) {
        if (err.status === 0) {
          setErrors({ form: "Unable to connect to the server. Please try again." });
        } else if (err.status === 401) {
          setErrors({ form: "Invalid email or password. Please try again." });
        } else {
          setErrors({ form: err.message });
        }
      } else {
        setErrors({ form: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/95 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6 text-gray-900"
      >
        {/* Segment Tabs: Sign In / Create Account */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-gray-100/80 border border-gray-200/80 text-xs font-bold">
          <Link
            href="/login"
            className="py-2.5 rounded-xl text-center bg-[#1B4332] text-white shadow-md transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="py-2.5 rounded-xl text-center text-gray-600 hover:text-gray-900 transition-all"
          >
            Create Account
          </Link>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Sign in to continue planning your next adventure.
          </p>
        </div>

        {/* Registration Success Banner */}
        <AnimatePresence>
          {justRegistered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, height: 0 }}
              animate={{ opacity: 1, scale: 1, height: "auto" }}
              exit={{ opacity: 0, scale: 0.95, height: 0 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm font-medium overflow-hidden"
            >
              <CheckCircleIcon />
              <span>Account created successfully! Please sign in.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Error */}
        <AnimatePresence>
          {errors.form && (
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
              <span>{errors.form}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
          animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.4 }}
          onAnimationComplete={() => setShake(false)}
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <MailIcon />
              </div>
              <input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                autoComplete="email"
                className={`w-full bg-gray-50/80 border rounded-2xl py-3.5 pl-11 pr-4 text-xs sm:text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-2 transition-all duration-200 font-medium placeholder:text-gray-400 ${
                  errors.email
                    ? "border-rose-400 focus:ring-rose-500/20"
                    : "border-gray-200 focus:border-[#1B4332] focus:ring-[#1B4332]/20"
                }`}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-xs text-rose-500 font-medium pt-0.5"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <LockIcon />
              </div>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                autoComplete="current-password"
                className={`w-full bg-gray-50/80 border rounded-2xl py-3.5 pl-11 pr-11 text-xs sm:text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-2 transition-all duration-200 font-medium placeholder:text-gray-400 ${
                  errors.password
                    ? "border-rose-400 focus:ring-rose-500/20"
                    : "border-gray-200 focus:border-[#1B4332] focus:ring-[#1B4332]/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                <EyeIcon show={showPassword} />
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-xs text-rose-500 font-medium pt-0.5"
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#1B4332] focus:ring-[#1B4332]/20 accent-[#1B4332]"
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-[#1B4332] hover:text-[#2D6A4F] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
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
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </motion.button>
        </motion.form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold text-gray-400">
            <span className="bg-white/95 px-3">or</span>
          </div>
        </div>

        {/* Google Sign In */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white py-3 px-4 text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-200 cursor-pointer"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </motion.button>
      </motion.div>
    </AuthLayout>
  );
}
