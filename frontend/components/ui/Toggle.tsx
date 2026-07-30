"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
}: ToggleProps) {
  return (
    <label
      className={`inline-flex items-center gap-3 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 focus:ring-offset-2 ${
          checked ? "bg-[#1B4332]" : "bg-gray-300"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
          style={{ marginTop: "2px" }}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-[#2D3436]">{label}</span>
      )}
    </label>
  );
}
