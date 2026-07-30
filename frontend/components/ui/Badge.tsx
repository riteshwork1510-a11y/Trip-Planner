"use client";

import { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "info" | "default" | "danger";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-[#E8F0E9] text-[#1B4332]",
  warning: "bg-orange-100 text-[#E85D04]",
  info: "bg-blue-100 text-[#3B82F6]",
  default: "bg-gray-100 text-gray-600",
  danger: "bg-red-100 text-red-600",
};

const dotStyles: Record<BadgeVariant, string> = {
  success: "bg-[#1B4332]",
  warning: "bg-[#E85D04]",
  info: "bg-[#3B82F6]",
  default: "bg-gray-500",
  danger: "bg-red-500",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotStyles[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
