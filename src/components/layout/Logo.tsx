"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-sm" },
    md: { icon: 40, text: "text-base" },
    lg: { icon: 56, text: "text-xl" },
  };

  const s = sizes[size];
  const uid = useId();
  const gradId = `logo-grad-${uid}`;
  const glowId = `logo-glow-${uid}`;

  return (
    <motion.div
      className={cn("flex items-center gap-3", className)}
      whileHover={{ scale: 1.05, rotate: 1 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </linearGradient>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="var(--primary)" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Bold solid badge instead of a thin outline — reads clearly at any size */}
        <circle cx="24" cy="24" r="22" fill={`url(#${gradId})`} filter={`url(#${glowId})`} />
        <circle cx="24" cy="24" r="19" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" fill="none" />

        {/* Thick compass cross in white so it pops against the gradient */}
        <path
          d="M24 9 L24 39 M9 24 L39 24"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />

        {/* Accent-colored core — the energetic focal point */}
        <circle cx="24" cy="24" r="8" fill="var(--accent)" />
        <path d="M24 17 L27 22.5 L24 28 L21 22.5 Z" fill="white" />

        {/* Compass arrow points for a distinct, ownable silhouette */}
        <path d="M24 9 L26.5 15 L24 15 L21.5 15 Z" fill="white" fillOpacity="0.9" />
        <path d="M14 32 Q24 39 34 32" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeOpacity="0.8" />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-display font-bold tracking-tight text-gradient", s.text)}>
            Enough Is Enough
          </span>
          <span className={cn("font-elegant text-muted mt-0.5", size === "sm" ? "text-[10px]" : "text-[11px]")}>
            Foundation
          </span>
        </div>
      )}
    </motion.div>
  );
}
