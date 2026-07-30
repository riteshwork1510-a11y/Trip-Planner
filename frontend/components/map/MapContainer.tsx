"use client";

import { memo, type ReactNode } from "react";

interface MapContainerProps {
  children: ReactNode;
  className?: string;
}

function MapContainerInner({ children, className = "" }: MapContainerProps) {
  return (
    <div
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={{ minHeight: "100%" }}
    >
      {children}
    </div>
  );
}

const MapContainer = memo(MapContainerInner);
export default MapContainer;
