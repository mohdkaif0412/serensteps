import { StepsPath } from "@/components/ui/StepsPath";
import { Hero } from "@/components/sections/Hero";
import { WelcomeLetter } from "@/components/sections/WelcomeLetter";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { ApproachBand } from "@/components/sections/ApproachBand";
import { ReflectionQuote } from "@/components/sections/ReflectionQuote";
import { TestimonialsStrip } from "@/components/sections/TestimonialsStrip";
import { LatestPosts } from "@/components/sections/LatestPosts";
import { FinalCta } from "@/components/sections/FinalCta";
import { getLatestPosts, getPublishedTestimonials } from "@/lib/queries";

export default async function Home() {
  const [latest, testimonials] = await Promise.all([
    getLatestPosts(3),
    getPublishedTestimonials(),
  ]);

  return (
    <StepsPath steps={7}>
      <Hero />
      <WelcomeLetter />
      <ServicesPreview />
      <ApproachBand />
      <ReflectionQuote />
      <TestimonialsStrip items={testimonials} />
      <LatestPosts posts={latest} />
      <FinalCta />
    </StepsPath>
  );
}
