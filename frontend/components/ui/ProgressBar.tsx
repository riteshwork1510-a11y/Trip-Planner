"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: "green" | "orange" | "blue" | "red";
  className?: string;
}

const colorStyles: Record<string, string> = {
  green: "bg-[#1B4332]",
  orange: "bg-[#E85D04]",
  blue: "bg-[#3B82F6]",
  red: "bg-red-500",
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = "green",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-[#2D3436]">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorStyles[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
