"use client";

import SiteLayout from "@/components/layout/SiteLayout";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import BoardMemberCard from "@/components/ui/BoardMemberCard";
import ImpactStats from "@/components/home/ImpactStats";
import { useContent } from "@/lib/content-store";

export default function BoardPage() {
  const { content } = useContent();

  const LEGACY_LEADERSHIP_TITLES = ["Chair", "Asst. Chair", "Office Manager", "Grant Finder"];
  const isLeadership = (m: (typeof content.boardMembers)[number]) =>
    m.isLeadership ?? LEGACY_LEADERSHIP_TITLES.includes(m.title);

  const leadership = content.boardMembers.filter(isLeadership);
  const members = content.boardMembers.filter((m) => !isLeadership(m));

  return (
    <SiteLayout>
      <PageHero
        title="Board of Directors"
        subtitle="Meet the dedicated leaders who guide the Enough Is Enough Foundation with vision, compassion, and commitment to community transformation."
        badge="Leadership"
        dark
      />

      <ImpactStats />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Executive Team" title="Leadership" subtitle="The visionaries steering our foundation forward." />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((member, i) => (
              <BoardMemberCard key={member.id} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Advisory" title="Board Members" subtitle="Passionate individuals committed to lifting others up." />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member, i) => (
              <BoardMemberCard key={member.id} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
