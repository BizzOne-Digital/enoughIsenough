"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  badge?: string;
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  className,
  badge,
  light = false,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(centered && "text-center", "mb-14", className)}
    >
      {badge && (
        <span
          className={cn(
            "mb-4 inline-block rounded-full px-4 py-1 font-elegant text-[11px]",
            light ? "bg-white/10 text-white/90" : "bg-primary/10 text-primary"
          )}
        >
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl",
          light ? "text-white" : "text-gray-900"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mx-auto mt-5 max-w-2xl text-lg leading-relaxed font-content",
            light ? "text-white/75" : "text-gray-600"
          )}
        >
          {subtitle}
        </p>
      )}
      <div className="mt-6 flex items-center gap-3 justify-center">
        <div className={cn("h-px w-12", light ? "bg-white/30" : "bg-gray-200")} />
        <div className="h-2 w-2 rounded-full bg-secondary" />
        <div className={cn("h-px w-12", light ? "bg-white/30" : "bg-gray-200")} />
      </div>
    </motion.div>
  );
}
