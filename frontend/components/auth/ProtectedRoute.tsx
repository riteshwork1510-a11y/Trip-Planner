"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!authenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [authenticated, loading, router, pathname]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-forest/20" />
            <div className="absolute inset-0 rounded-full border-2 border-forest border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-text-muted font-medium">Loading WanderAI...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}
