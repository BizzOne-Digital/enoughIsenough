"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import type { Testimonial } from "@/types/content";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const paginate = useCallback(
    (dir: number) => {
      if (count === 0) return;
      setDirection(dir);
      setCurrent((prev) => (prev + dir + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count === 0 || paused) return;
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [paginate, count, paused]);

  if (count === 0) return null;

  const t = testimonials[current % count];

  return (
    <div
      className="relative mx-auto max-w-4xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
          <Quote className="h-6 w-6 text-secondary" />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl gradient-border p-8 sm:p-12">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-center"
          >
            <div className="mb-4 flex justify-center gap-1">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
              ))}
            </div>
            <blockquote className="font-display text-xl leading-relaxed text-gray-800 sm:text-2xl">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.image}
                alt={t.name}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div className="text-left">
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-secondary">{t.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => paginate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:border-primary hover:text-primary hover:shadow-md"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => paginate(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:border-primary hover:text-primary hover:shadow-md"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

