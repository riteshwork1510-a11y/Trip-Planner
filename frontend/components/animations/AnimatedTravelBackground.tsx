"use client";

import { useEffect, useRef, useMemo } from "react";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateParticles(count: number) {
  const rand = seededRandom(42);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${rand() * 100}%`,
    size: 1.5 + rand() * 3,
    delay: rand() * 20,
    duration: 18 + rand() * 22,
    opacity: 0.15 + rand() * 0.25,
  }));
}

function generateBlobs() {
  return [
    { className: "w-[500px] h-[500px] bg-[#1B4332]/[0.07] blur-[100px] top-[-5%] left-[10%]", animation: "blob-drift-1 35s ease-in-out infinite" },
    { className: "w-[400px] h-[400px] bg-[#E85D04]/[0.05] blur-[90px] top-[20%] right-[-5%]", animation: "blob-drift-2 40s ease-in-out infinite 5s" },
    { className: "w-[350px] h-[350px] bg-[#2D6A4F]/[0.06] blur-[80px] bottom-[10%] left-[30%]", animation: "blob-drift-3 30s ease-in-out infinite 10s" },
    { className: "w-[300px] h-[300px] bg-[#3B82F6]/[0.03] blur-[70px] top-[60%] left-[60%]", animation: "blob-drift-1 45s ease-in-out infinite 15s" },
  ];
}

function TravelRoutes() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.06]"
      viewBox="0 0 1440 800"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Route 1: Curved path across top */}
      <path
        d="M-50,150 C200,80 400,200 600,120 S900,180 1100,100 S1400,160 1500,120"
        stroke="#1B4332"
        strokeWidth="1.5"
        strokeDasharray="8 12"
        style={{ animation: "route-dash 3s linear infinite" }}
      />
      {/* Route 2: Diagonal path */}
      <path
        d="M100,700 C300,500 500,600 700,400 S1000,500 1200,300"
        stroke="#E85D04"
        strokeWidth="1"
        strokeDasharray="6 10"
        style={{ animation: "route-dash 4s linear infinite 1s" }}
      />
      {/* Route 3: Bottom curved */}
      <path
        d="M-20,600 C180,650 350,550 550,620 S800,580 1000,640 S1300,590 1500,620"
        stroke="#2D6A4F"
        strokeWidth="1"
        strokeDasharray="4 8"
        style={{ animation: "route-dash 5s linear infinite 2s" }}
      />
    </svg>
  );
}

export default function AnimatedTravelBackground() {
  const particles = useMemo(() => generateParticles(18), []);
  const blobs = useMemo(generateBlobs, []);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #FDF8F0 0%, #F5EFE4 25%, #FDF8F0 50%, #E8F0E9 75%, #FDF8F0 100%)",
          backgroundSize: "400% 400%",
          animation: "gradient-shift 30s ease-in-out infinite",
        }}
      />

      {/* Gradient blobs */}
      {blobs.map((blob, i) => (
        <div
          key={i}
          className={`animated-bg-blob absolute rounded-full ${blob.className}`}
          style={{ animation: blob.animation }}
        />
      ))}

      {/* Travel routes */}
      <TravelRoutes />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="animated-bg-particle absolute rounded-full bg-[#1B4332]/30"
          style={{
            left: p.left,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `${p.id % 2 === 0 ? "particle-float" : "particle-drift"} ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Soft glow overlays */}
      <div
        className="absolute top-[15%] left-[20%] w-64 h-64 rounded-full bg-[#1B4332]/[0.04] blur-[60px]"
        style={{ animation: "glow-pulse 12s ease-in-out infinite" }}
      />
      <div
        className="absolute top-[50%] right-[15%] w-48 h-48 rounded-full bg-[#E85D04]/[0.04] blur-[50px]"
        style={{ animation: "glow-pulse 15s ease-in-out infinite 4s" }}
      />
    </div>
  );
}
