"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { motion, useInView, type Variants } from "framer-motion";

/* ─── Page Transition Wrapper ──────────────────────── */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Scroll Reveal Section ────────────────────────── */
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

const directionOffset = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
};

export function ScrollReveal({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const offset = directionOffset[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stagger Container ────────────────────────────── */
const staggerContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
}

export function StaggerContainer({ children, className = "" }: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainerVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Animated Card (hover lift + entrance) ─────────── */
interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({ children, className = "", delay = 0 }: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Count Up Hook ────────────────────────────────── */
export function useCountUp(target: number, duration = 1600, enabled = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView || !enabled) return;
    if (target === 0) { setCount(0); return; }

    let startTime: number | null = null;
    let frame: number;

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target, duration, enabled]);

  return { count, ref };
}

/* ─── Count Up Display Component ───────────────────── */
interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function CountUp({ value, prefix = "", suffix = "", duration = 1600, className = "" }: CountUpProps) {
  const { count, ref } = useCountUp(value, duration);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

/* ─── String Count Up (for currency strings) ────────── */
interface StringCountUpProps {
  targetText: string;
  duration?: number;
  className?: string;
}

export function StringCountUp({ targetText, duration = 1600, className = "" }: StringCountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayText, setDisplayText] = useState(targetText);

  useEffect(() => {
    if (!isInView) return;

    const numericPart = targetText.replace(/[^0-9]/g, "");
    const targetNum = parseInt(numericPart, 10);
    if (isNaN(targetNum) || targetNum === 0) return;

    let startTime: number | null = null;
    let frame: number;

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentNum = Math.round(eased * targetNum);
      setDisplayText(targetText.replace(numericPart, currentNum.toLocaleString()));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, targetText, duration]);

  return <span ref={ref} className={className}>{displayText}</span>;
}

/* ─── Hero Floating Element ────────────────────────── */
interface FloatingElementProps {
  children?: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FloatingElement({ children, className = "", delay = 0, duration = 4 }: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
