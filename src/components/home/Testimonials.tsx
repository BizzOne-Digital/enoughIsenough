"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialCarousel from "@/components/ui/TestimonialCarousel";
import { useContent } from "@/lib/content-store";

export default function Testimonials() {
  const { content } = useContent();

  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Testimonials"
          title="Stories of Transformation"
          subtitle="Real people, real change — hear from those whose lives have been impacted by our programs."
        />
        <TestimonialCarousel testimonials={content.testimonials} />
      </div>
    </section>
  );
}
