"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  duration = 1.6,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // A single spring-driven motion value keeps every counter on the page
  // synced to the shared animation frame loop instead of each one
  // running its own setInterval — noticeably smoother when several
  // counters animate in at once. With reduced motion requested, a
  // near-zero duration makes it settle immediately instead of counting up.
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: prefersReducedMotion ? 0 : duration * 1000, bounce: 0 });

  useEffect(() => {
    if (!isInView) return;
    motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => setDisplay(Math.round(latest)));
    return unsubscribe;
  }, [spring]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
