"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { useContent } from "@/lib/content-store";

export default function FAQSection() {
  const { content } = useContent();

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about our programs, enrollment, and how we can help you."
        />
        <FAQAccordion faqs={content.faqs} />
      </div>
    </section>
  );
}
