import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import AnimatedTravelBackground from "@/components/animations/AnimatedTravelBackground";

import { AuthProvider } from "@/contexts/AuthContext";

import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OptiTripPlanner — AI Trip Planner",
  description:
    "Plan your next adventure with AI. Create personalized itineraries, discover destinations, and manage your trips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col justify-between">
        <AuthProvider>
          <AnimatedTravelBackground />
          <ToastProvider>
            {children}
            <Footer />
          </ToastProvider>

        </AuthProvider>
      </body>
    </html>
  );
}
