"use client";

import GuestRoute from "@/components/auth/GuestRoute";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <GuestRoute>{children}</GuestRoute>;
}
