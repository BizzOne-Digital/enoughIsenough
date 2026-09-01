"use client";

import { motion } from "framer-motion";
import { Award, CheckCircle, Quote, Star } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { useContent } from "@/lib/content-store";

const highlights = [
  "Follow-through on life commitments",
  "Personal accountability coaching",
  "Faith-centered guidance",
  "Celebrating your progress",
];

export default function LifeCoaching() {
  const { content } = useContent();
  const { home } = content;

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 mesh-gradient-dark" />
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Meet Your Coach"
          title={home.lifeCoachName}
          subtitle={home.lifeCoachTitle}
          light
        />

        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-md lg:max-w-none"
          >
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-secondary/30 to-primary/30 blur-xl" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={home.lifeCoachImage}
                alt={home.lifeCoachName}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-5 -right-5 flex items-center gap-2 rounded-2xl bg-secondary px-5 py-3 text-white shadow-xl"
            >
              <Award className="h-5 w-5" />
              <span className="text-sm font-semibold">Certified Life Coach</span>
            </motion.div>

            <div className="absolute -left-4 top-8 rounded-2xl glass-dark p-4 text-white">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="mt-1 text-xs text-white/80">Trusted by 500+ clients</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-white"
          >
            <div className="flex items-start gap-3">
              <Quote className="mt-1 h-8 w-8 shrink-0 text-secondary/60" />
              <p className="font-display text-xl leading-relaxed text-white/90 italic sm:text-2xl">
                {home.lifeCoachBio}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 rounded-xl glass-dark px-4 py-3"
                >
                  <CheckCircle className="h-5 w-5 shrink-0 text-secondary" />
                  <span className="text-sm text-white/90">{item}</span>
                </motion.div>
              ))}
            </div>

            <Button href="/contact" variant="secondary" size="lg" className="mt-4">
              Schedule a Session
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
