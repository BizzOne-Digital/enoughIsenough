"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard, { ServiceModal } from "@/components/ui/ServiceCard";
import Button from "@/components/ui/Button";
import { useContent } from "@/lib/content-store";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/types/content";

export default function HomeServices() {
  const { content } = useContent();
  const services = content.services.items;
  const [selected, setSelected] = useState<Service | null>(null);

  return (
    <section className="relative overflow-hidden bg-surface py-20 lg:py-28">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Programs"
          title="Our Core Programs"
          subtitle="Six transformative initiatives designed to empower, educate, and elevate every individual we serve."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              onSelect={setSelected}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button href="/services" variant="outline" size="lg" className="group">
            View All Programs
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
      <ServiceModal service={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
