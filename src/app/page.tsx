import Hero from "@/components/home/Hero";
import ProgramMarquee from "@/components/home/ProgramMarquee";
import Mission from "@/components/home/Mission";
import ImpactStats from "@/components/home/ImpactStats";
import LifeCoaching from "@/components/home/LifeCoaching";
import HomeServices from "@/components/home/HomeServices";
import Testimonials from "@/components/home/Testimonials";
import FAQSection from "@/components/home/FAQSection";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import CTASection from "@/components/home/CTASection";
import SiteLayout from "@/components/layout/SiteLayout";

export default function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <ProgramMarquee />
      <Mission />
      <ImpactStats />
      <LifeCoaching />
      <HomeServices />
      <Testimonials />
      <FAQSection />
      <NewsletterSignup />
      <CTASection />
    </SiteLayout>
  );
}
