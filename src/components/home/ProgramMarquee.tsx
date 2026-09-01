"use client";

import { useContent } from "@/lib/content-store";

export default function ProgramMarquee() {
  const { content } = useContent();
  const programs = content.services.items.map((s) => s.title);
  if (programs.length === 0) return null;
  const doubled = [...programs, ...programs];

  return (
    <section className="overflow-hidden border-y border-gray-100 bg-surface py-5 font-sans">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((title, i) => (
          <span key={`${title}-${i}`} className="mx-8 flex items-center gap-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
            {title}
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          </span>
        ))}
      </div>
    </section>
  );
}
