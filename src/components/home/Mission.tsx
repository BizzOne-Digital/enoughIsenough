"use client";

import { motion } from "framer-motion";
import { Heart, Users, Target, Sparkles, Shield, BookOpen } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useContent } from "@/lib/content-store";

const iconMap: Record<string, typeof Heart> = {
  cross: Shield,
  target: Target,
  users: Users,
  sparkles: Sparkles,
  heart: Heart,
  book: BookOpen,
};

export default function Mission() {
  const { content } = useContent();
  const values = content.about.values || [
    { title: "Faith First", description: "Rooted in God's truth", icon: "cross" },
    { title: "Accountability", description: "Personal commitment drives change", icon: "target" },
    { title: "Community", description: "No one walks alone", icon: "users" },
    { title: "Empowerment", description: "Walk in your destiny", icon: "sparkles" },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Our Purpose"
          title="Transforming Lives Through Faith"
          subtitle={content.home.missionStatement}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => {
            const Icon = iconMap[v.icon] || Heart;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-surface p-8 card-lift"
              >
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/20">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{v.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
