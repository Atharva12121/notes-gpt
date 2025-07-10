export const metadata = {
  title: "Build Ai Notes",
  description: "Ai Notes",
};

import Cta from "@/components/cta";
import Features from "@/components/features";
import Hero from "@/components/hero-home";
import PageIllustration from "@/components/page-illustration";
import Testimonials from "@/components/testimonials";
import Header from "@/components/ui/header";
import Workflows from "@/components/workflows";

export default function Home() {
  return (
    <>
      <Header />
      <PageIllustration />
      <Hero />
      <Workflows />
      <Features />
      <Testimonials />
      <Cta />
    </>
  );
}
