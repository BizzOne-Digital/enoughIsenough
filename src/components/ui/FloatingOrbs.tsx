"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function FloatingOrbs() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-secondary/25 blur-3xl will-change-transform"
      />
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-primary/18 blur-3xl will-change-transform"
      />
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-accent/20 blur-3xl will-change-transform"
      />
    </div>
  );
}
