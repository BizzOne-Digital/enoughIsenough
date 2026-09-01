"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { ArrowRight, Phone } from "lucide-react";
import { useContent } from "@/lib/content-store";

export default function CTASection() {
  const { content } = useContent();

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 mesh-gradient-dark" />
      <div className="absolute inset-0 noise" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
      >
        <span className="mb-6 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
          Take the First Step
        </span>
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Ready to Walk Into Your Destiny?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
          Take the first step today. Our team is here to lift you up, celebrate you, and guide you
          through whatever obstacles you face.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/contact" size="lg" variant="secondary" className="group">
            Contact Us Today
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <a
            href={`tel:${content.contact.phone.replace(/\D/g, "")}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-8 py-3 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/10"
          >
            <Phone className="h-4 w-4" />
            {content.contact.phone}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
