"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "orange";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#1B4332] text-white hover:bg-[#153728] active:bg-[#0F2B1F] shadow-sm",
  secondary:
    "border-2 border-[#1B4332] text-[#1B4332] bg-transparent hover:bg-[#E8F0E9] active:bg-[#D0E4D3]",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
  ghost:
    "bg-transparent text-[#2D3436] hover:bg-[#E8F0E9] active:bg-[#D0E4D3]",
  orange:
    "bg-[#E85D04] text-white hover:bg-[#D15203] active:bg-[#B84703] shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md gap-1.5",
  md: "px-4 py-2 text-sm rounded-lg gap-2",
  lg: "px-6 py-3 text-base rounded-lg gap-2.5",
};

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
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
  );
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
