"use client";

import { ReactNode } from "react";

type CardVariant = "default" | "glass" | "elevated" | "dark" | "dark-glass";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-white border border-gray-200",
  glass:
    "bg-white/60 backdrop-blur-md border border-white/40",
  elevated:
    "bg-white shadow-lg shadow-black/5 border border-gray-100",
  dark:
    "bg-[#143326]/40 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20 text-white",
  "dark-glass":
    "bg-white/5 backdrop-blur-md border border-white/10 text-white",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export default function Card({
  children,
  variant = "default",
  padding = "md",
  hover = false,
  className = "",
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl transition-all duration-200 ${variantStyles[variant]} ${paddingStyles[padding]} ${
        hover
          ? "hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 cursor-pointer"
          : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
