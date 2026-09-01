"use client";

import { motion } from "framer-motion";
import { useContent } from "@/lib/content-store";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function ImpactStats() {
  const { content } = useContent();

  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      <div className="absolute inset-0 mesh-gradient-dark" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {content.stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl glass-dark p-8 text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <p className="font-display text-4xl font-bold text-white sm:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-white/70">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
