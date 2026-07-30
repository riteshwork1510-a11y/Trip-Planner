"use client";

import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      containerClassName = "",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#2D3436]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#2D3436] transition-all duration-200 outline-none placeholder:text-gray-400 ${
              leftIcon ? "pl-10" : ""
            } ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-300 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
