"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import PasswordStrengthIndicator from "@/components/auth/PasswordStrengthIndicator";
import LoadingButton from "@/components/auth/LoadingButton";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(password)) errs.password = "Must include at least one uppercase letter";
    else if (!/[a-z]/.test(password)) errs.password = "Must include at least one lowercase letter";
    else if (!/[0-9]/.test(password)) errs.password = "Must include at least one number";

    if (!confirm) errs.confirm = "Please confirm your password";
    else if (password !== confirm) errs.confirm = "Passwords do not match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) { setErrors({ form: "Invalid or expired reset link. Please request a new one." }); return; }
    if (!validate() || loading) return;

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 0) setErrors({ form: "Unable to connect to the server. Please try again." });
        else setErrors({ form: err.message });
      } else {
        setErrors({ form: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Password reset successful</h2>
          <p className="text-sm text-text-muted mb-8">Your password has been updated. You can now sign in with your new password.</p>
          <Link href="/login" className="inline-flex items-center justify-center rounded-lg bg-forest text-white px-6 py-3 text-sm font-semibold hover:bg-forest-light transition-colors shadow-sm">
            Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div>
        <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center mb-5">
          <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-charcoal">Set new password</h2>
        <p className="text-sm text-text-muted mt-1.5 mb-8">
          Choose a strong password to secure your account.
        </p>

        {!token && (
          <motion.div
            className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            No reset token found. Please use the link from your email or request a new one.
          </motion.div>
        )}

        {errors.form && (
          <motion.div
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.form}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <PasswordInput
              id="reset-password"
              label="New Password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => { const n = { ...p }; delete n.password; return n; }); }}
              error={errors.password}
              autoComplete="new-password"
            />
            <PasswordStrengthIndicator password={password} />
          </div>

          <PasswordInput
            id="reset-confirm"
            label="Confirm New Password"
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setErrors((p) => { const n = { ...p }; delete n.confirm; return n; }); }}
            error={errors.confirm}
            autoComplete="new-password"
          />

          <LoadingButton type="submit" loading={loading} disabled={!token} className="w-full mt-2">
            {loading ? "Resetting..." : "Reset Password"}
          </LoadingButton>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          <Link href="/login" className="font-semibold text-forest hover:text-forest-light transition-colors">
            Back to Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
