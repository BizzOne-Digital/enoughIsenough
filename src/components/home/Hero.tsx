"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import FloatingOrbs from "@/components/ui/FloatingOrbs";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { useContent } from "@/lib/content-store";

export default function Hero() {
  const { content } = useContent();
  const { home } = content;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const words = home.heroHeadline.split(" ");

  return (
    <section ref={ref} className="relative min-h-[90vh] overflow-hidden mesh-gradient">
      <FloatingOrbs />
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <motion.div style={{ opacity }} className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div style={{ y: textY }} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 font-elegant text-[11px] text-primary shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-secondary" />
              {home.heroBadge || "Faith • Community • Transformation"}
            </motion.div>

            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
              {words.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.5 }}
                  className="mr-[0.25em] inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl font-content"
            >
              {home.heroSubheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button href="/contact" size="lg" className="pulse-glow group">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button href="/services" variant="outline" size="lg">
                <Play className="mr-2 h-4 w-4" />
                Explore Programs
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-8 pt-4"
            >
              {content.stats.slice(0, 3).map((stat) => (
                <div key={stat.id}>
                  <p className="font-display text-3xl font-bold text-gradient">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div style={{ y: imageY }} className="relative hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={home.heroImage}
                  alt="Community support and life coaching"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 rounded-2xl glass p-5 shadow-xl"
              >
                <p className="font-display text-3xl font-bold text-primary">
                  <AnimatedCounter value={500} suffix="+" />
                </p>
                <p className="text-sm text-gray-600">Lives Transformed</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-4 -right-4 rounded-2xl bg-secondary px-5 py-3 text-white shadow-xl"
              >
                <p className="text-sm font-semibold">Professional Life Coaching</p>
                <p className="text-xs text-white/80">Sharon Bedford</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
