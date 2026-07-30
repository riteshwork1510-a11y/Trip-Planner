"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export default function LoadingButton({
  loading = false,
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: LoadingButtonProps) {
  const baseStyles =
    "relative flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed";

  const variantStyles =
    variant === "primary"
      ? "bg-forest text-white hover:bg-forest-light disabled:bg-forest/60 disabled:text-white/80 shadow-sm hover:shadow-md"
      : "bg-white text-charcoal border border-border hover:bg-sage/40 disabled:bg-gray-50 disabled:text-text-muted";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      <span className={loading ? "opacity-70" : ""}>{children}</span>
    </button>
  );
}
