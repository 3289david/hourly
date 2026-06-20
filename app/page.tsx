import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Features } from "@/components/features";
import { ModelGrid } from "@/components/model-grid";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
import { CTABanner } from "@/components/cta-banner";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: "80px" }}>
        <Hero />
        <HowItWorks />
        <Features />
        <ModelGrid />
        <Pricing />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
