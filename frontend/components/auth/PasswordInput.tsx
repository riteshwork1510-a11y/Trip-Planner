"use client";

import { useState } from "react";

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

interface PasswordInputProps {
  id?: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
}

export function PasswordInput({ id, label, placeholder, value, onChange, error, autoComplete }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-black mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`w-full rounded-lg border bg-white px-4 py-3 pr-12 text-sm text-black outline-none transition-all duration-200 placeholder:text-black/30 focus:ring-2 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-[#E2DED6] focus:border-[#1B4332] focus:ring-[#1B4332]/20 hover:border-black/20"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black/40 hover:text-black transition-colors cursor-pointer"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      </div>
      {error && (
        <p
          className="mt-1.5 text-xs text-red-500 animate-[auth-fade-in_0.2s_ease-out_both]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
