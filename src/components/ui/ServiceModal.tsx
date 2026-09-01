"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, ArrowRight } from "lucide-react";
import {
  Users,
  BookOpen,
  HeartHandshake,
  Link,
  Sparkles,
  Home,
  type LucideIcon,
} from "lucide-react";
import Button from "@/components/ui/Button";
import type { Service } from "@/types/content";

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  "book-open": BookOpen,
  "heart-handshake": HeartHandshake,
  link: Link,
  sparkles: Sparkles,
  home: Home,
};

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
}

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  // Stay mounted at all times so AnimatePresence can actually play the
  // exit transition — the caller no longer conditionally renders this
  // component, which previously made the modal vanish with a jump-cut
  // instead of animating closed.
  useEffect(() => {
    if (!service) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [service, onClose]);

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={service.title}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="relative aspect-[21/9] overflow-hidden">
              {(() => {
                const Icon = iconMap[service.icon] || Users;
                return (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <button
                      type="button"
                      onClick={onClose}
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/30"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-6 left-6 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        {service.tag && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            {service.tag}
                          </span>
                        )}
                        <h2 className="font-display text-2xl font-bold text-white">{service.title}</h2>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="p-8">
              <p className="leading-relaxed text-gray-600">
                {service.longDescription || service.description}
              </p>
              {service.features && service.features.length > 0 && (
                <ul className="mt-6 space-y-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/contact" size="lg">
                  Enroll Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
