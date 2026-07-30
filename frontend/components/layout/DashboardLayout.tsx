"use client";

import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { PageTransition } from "@/components/animations/animation-utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: Breadcrumb[];
  fullBleed?: boolean;
}

export default function DashboardLayout({
  children,
  title,
  breadcrumbs = [],
  fullBleed = false,
}: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-gray-50 dark:bg-[#0B0F17]">
        <Navbar />
        <div className="min-h-screen flex flex-col">
          {breadcrumbs.length > 1 && (
            <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border-b border-border/50 pt-20">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                  {breadcrumbs.map((crumb, index) => (
                    <span key={index} className="flex items-center gap-1.5">
                      {index > 0 && <span className="text-border">/</span>}
                      {crumb.href ? (
                        <a href={crumb.href} className="hover:text-forest transition-colors">
                          {crumb.label}
                        </a>
                      ) : (
                        <span className="text-charcoal dark:text-white font-medium">{crumb.label}</span>
                      )}
                    </span>
                  ))}
                </nav>
                <h1 className="text-xl font-bold text-charcoal dark:text-white">{title}</h1>
              </div>
            </div>
          )}
          <AnimatePresence mode="wait">
            <PageTransition key={breadcrumbs[breadcrumbs.length - 1]?.href || title}>
              {fullBleed ? (
                <main className="relative z-10 flex-1 w-full">{children}</main>
              ) : (
                <main className="relative z-10 flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-24">
                  {children}
                </main>
              )}
            </PageTransition>
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
}
