"use client";

import { ReactNode, useState, useRef, useEffect } from "react";

interface Tab {
  label: string;
  value: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  className = "",
}: TabsProps) {
  const [active, setActive] = useState(activeTab || tabs[0]?.value || "");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const currentActive = activeTab !== undefined ? activeTab : active;

  useEffect(() => {
    const el = tabRefs.current.get(currentActive);
    if (el) {
      setIndicatorStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [currentActive]);

  const handleChange = (value: string) => {
    if (activeTab === undefined) {
      setActive(value);
    }
    onChange(value);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.value, el);
            }}
            onClick={() => handleChange(tab.value)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
              currentActive === tab.value
                ? "text-[#1B4332]"
                : "text-gray-500 hover:text-[#2D3436]"
            }`}
          >
            {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
        <div
          className="absolute bottom-0 h-0.5 bg-[#1B4332] transition-all duration-300 ease-in-out rounded-full"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        />
      </div>
    </div>
  );
}
