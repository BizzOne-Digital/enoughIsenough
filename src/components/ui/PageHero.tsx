"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  dark?: boolean;
  children?: React.ReactNode;
}

export default function PageHero({ title, subtitle, badge, dark = false, children }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden py-20 lg:py-28",
        dark ? "mesh-gradient-dark text-white" : "mesh-gradient"
      )}
    >
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {badge && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mb-6 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest",
                dark ? "bg-white/10 text-white/90" : "bg-secondary/10 text-secondary"
              )}
            >
              {badge}
            </motion.span>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl",
              dark ? "text-white" : "text-gray-900"
            )}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                "mx-auto mt-6 max-w-2xl text-lg leading-relaxed font-content",
                dark ? "text-white/80" : "text-gray-600"
              )}
            >
              {subtitle}
            </motion.p>
          )}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
