'use client';

import { CTASection } from '@/features/home/cta-section';
import { FeaturesSection } from '@/features/home/features-section';
import { HeroSection } from '@/features/home/hero-section';
import { HowItWorksSection } from '@/features/home/how-it-works-section';
import { StatsSection } from '@/features/home/stats-section';

export default function HomePage() {
   return (
      <main className="min-h-screen">
         <HeroSection />
         <FeaturesSection />
         <HowItWorksSection />
         <StatsSection />
         <CTASection />
      </main>
   );
}
