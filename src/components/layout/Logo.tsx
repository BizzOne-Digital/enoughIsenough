"use client";

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

  return (
    <motion.div
      className={cn("flex items-center gap-3", className)}
      whileHover={{ scale: 1.02 }}
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
        <circle cx="24" cy="24" r="22" fill="var(--primary)" opacity="0.1" />
        <circle cx="24" cy="24" r="18" stroke="var(--primary)" strokeWidth="2" fill="none" />
        <path
          d="M24 8 L24 40 M8 24 L40 24"
          stroke="var(--secondary)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="24" r="6" fill="var(--primary)" />
        <path
          d="M24 18 L26 22 L24 26 L22 22 Z"
          fill="white"
          transform="translate(0, -2)"
        />
        <path
          d="M14 32 Q24 38 34 32"
          stroke="var(--secondary)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-display font-semibold tracking-tight text-primary", s.text)}>
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
