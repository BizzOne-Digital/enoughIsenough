"use client";

import { motion } from "framer-motion";
import type { TimelineItem } from "@/types/content";

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-primary/20 sm:left-1/2 sm:-translate-x-px" />

      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className={`relative mb-12 flex items-start gap-6 sm:gap-0 ${
            i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
          }`}
        >
          <div className={`hidden flex-1 sm:block ${i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {item.year}
            </span>
          </div>

          <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-primary/10 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            <div className="h-3 w-3 rounded-full bg-secondary" />
          </div>

          <div className={`flex-1 sm:max-w-[calc(50%-2rem)] ${i % 2 === 0 ? "sm:pl-12" : "sm:pr-12 sm:text-right"}`}>
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary sm:hidden">
              {item.year}
            </span>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="font-display text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
