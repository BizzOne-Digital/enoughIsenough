"use client";

import { motion } from "framer-motion";
import SiteLayout from "@/components/layout/SiteLayout";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import BoardMemberCard from "@/components/ui/BoardMemberCard";
import Timeline from "@/components/ui/Timeline";
import { useContent } from "@/lib/content-store";
import { Shield, Target, Users, Sparkles } from "lucide-react";

const valueIcons: Record<string, typeof Shield> = {
  cross: Shield,
  target: Target,
  users: Users,
  sparkles: Sparkles,
};

export default function AboutPage() {
  const { content } = useContent();
  const { about } = content;

  return (
    <SiteLayout>
      <PageHero
        title={about.title}
        subtitle={about.missionText.length > 140 ? `${about.missionText.slice(0, 140).trim()}…` : about.missionText}
        badge="Who We Are"
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
                  Our Purpose
                </span>
                <h2 className="mt-2 font-display text-3xl font-bold text-gray-900">{about.missionTitle}</h2>
                <p className="mt-4 leading-relaxed text-gray-600">{about.missionText}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
                  The Full Picture
                </span>
                <h2 className="mt-2 font-display text-3xl font-bold text-gray-900">{about.overviewTitle}</h2>
                <p className="mt-4 leading-relaxed text-gray-600">{about.overviewText}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={about.image} alt="About us" className="h-full w-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {about.values && (
        <section className="bg-surface py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading badge="Values" title="What We Stand For" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {about.values.map((v, i) => {
                const Icon = valueIcons[v.icon] || Shield;
                return (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl border border-gray-100 bg-white p-6 card-lift"
                  >
                    <Icon className="mb-4 h-8 w-8 text-primary" />
                    <h3 className="font-display text-lg font-bold">{v.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{v.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="History" title="Our Journey" subtitle="Over a decade of lifting communities and transforming lives." />
          <Timeline items={content.timeline} />
        </div>
      </section>

      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Board of Directors" subtitle="Meet the dedicated leaders guiding our foundation" />
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {content.boardMembers.map((member, i) => (
              <BoardMemberCard key={member.id} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
