"use client";

type SkeletonVariant = "text" | "circle" | "card" | "image";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
  width?: string;
  height?: string;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "rounded-md",
  circle: "rounded-full",
  card: "rounded-xl",
  image: "rounded-lg",
};

const defaultSizes: Record<SkeletonVariant, { width: string; height: string }> = {
  text: { width: "w-full", height: "h-4" },
  circle: { width: "w-10", height: "h-10" },
  card: { width: "w-full", height: "h-40" },
  image: { width: "w-full", height: "h-48" },
};

export default function Skeleton({
  variant = "text",
  className = "",
  width,
  height,
}: SkeletonProps) {
  const defaults = defaultSizes[variant];

  return (
    <div
      className={`animate-pulse bg-gray-200 ${variantStyles[variant]} ${
        width || defaults.width
      } ${height || defaults.height} ${className}`}
    />
  );
}
