"use client";

import { useState } from "react";
import SiteLayout from "@/components/layout/SiteLayout";
import PageHero from "@/components/ui/PageHero";
import ServiceCard, { ServiceModal } from "@/components/ui/ServiceCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { useContent } from "@/lib/content-store";
import { motion } from "framer-motion";
import { Info, Shield, Heart } from "lucide-react";
import type { Service } from "@/types/content";

export default function ServicesPage() {
  const { content } = useContent();
  const { services } = content;
  const [selected, setSelected] = useState<Service | null>(null);
  const [filter, setFilter] = useState("All");
  const tags = ["All", ...Array.from(new Set(services.items.map((s) => s.tag).filter(Boolean)))] as string[];

  const filtered =
    filter === "All" ? services.items : services.items.filter((s) => s.tag === filter);

  return (
    <SiteLayout>
      <PageHero title={services.title} subtitle={services.subtitle} badge="Our Programs" dark />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {tags.length > 1 && (
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setFilter(tag)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    filter === tag
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((service, i) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={i}
                onSelect={setSelected}
                featured={i === 0 && filter === "All"}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/90 p-8 text-white sm:p-12"
          >
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Info className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold">Pricing Information</h3>
                <p className="mt-3 text-white/80">{services.pricingNote}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Shield, text: "Grant-funded programs" },
                  { icon: Heart, text: "Community supported" },
                  { icon: Info, text: "Contact for details" },
                  { icon: Shield, text: "Accessible to all" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                    <Icon className="h-5 w-5 text-secondary" />
                    <span className="text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Process"
            title="How Enrollment Works"
            subtitle="Getting started is simple — we're here to guide you every step of the way."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Reach Out", desc: "Contact us by phone or fill out our contact form to express interest." },
              { step: "02", title: "Intake Session", desc: "Meet with our team for a personalized assessment and program matching." },
              { step: "03", title: "Begin Your Journey", desc: "Start your program with full support, accountability, and community." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-gray-100 bg-white p-8 card-lift"
              >
                <span className="font-display text-5xl font-bold text-primary/10">{item.step}</span>
                <h3 className="mt-2 font-display text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceModal service={selected} onClose={() => setSelected(null)} />
    </SiteLayout>
  );
}
