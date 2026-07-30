"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  containerClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      placeholder,
      options,
      containerClassName = "",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-[#2D3436]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-sm text-[#2D3436] transition-all duration-200 outline-none ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-300 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
            } ${props.value === "" || !props.value ? "text-gray-400" : ""} ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
