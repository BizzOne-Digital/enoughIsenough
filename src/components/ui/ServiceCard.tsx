"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  Users,
  BookOpen,
  HeartHandshake,
  Link,
  Sparkles,
  Home,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@/types/content";
import ServiceModal from "./ServiceModal";

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  "book-open": BookOpen,
  "heart-handshake": HeartHandshake,
  link: Link,
  sparkles: Sparkles,
  home: Home,
};

interface ServiceCardProps {
  service: Service;
  index: number;
  onSelect?: (service: Service) => void;
  featured?: boolean;
}

export default function ServiceCard({ service, index, onSelect, featured = false }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={`group relative overflow-hidden rounded-2xl bg-white card-lift ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Icon className="h-5 w-5 text-white" />
            </div>
            {service.tag && (
              <span className="rounded-full bg-secondary/90 px-3 py-0.5 text-xs font-semibold text-white">
                {service.tag}
              </span>
            )}
          </div>
          <h3 className={`font-display font-bold text-white ${featured ? "text-2xl sm:text-3xl" : "text-lg"}`}>
            {service.title}
          </h3>
          <p className={`mt-2 text-white/80 ${featured ? "text-base line-clamp-3" : "text-sm line-clamp-2"}`}>
            {service.description}
          </p>
          <button
            type="button"
            onClick={() => onSelect?.(service)}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary transition-colors hover:text-white"
          >
            Learn More
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export { ServiceModal };
