"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

type Strength = "weak" | "medium" | "strong";

function getStrength(password: string): { level: Strength; percent: number; label: string; color: string } {
  if (!password) return { level: "weak", percent: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { level: "weak", percent: 33, label: "Weak", color: "bg-red-400" };
  if (score <= 3) return { level: "medium", percent: 66, label: "Medium", color: "bg-amber-400" };
  return { level: "strong", percent: 100, label: "Strong", color: "bg-green-500" };
}

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-black/50">Password strength</span>
        <span className={`text-xs font-medium ${
          strength.level === "weak" ? "text-red-500" :
          strength.level === "medium" ? "text-amber-500" :
          "text-green-600"
        }`}>
          {strength.label}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${strength.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${strength.percent}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
