import Navbar from "@/components/features/landing/navbar";
import Hero from "@/components/features/landing/hero";
import Metrics from "@/components/features/landing/metrics";
import Features from "@/components/features/landing/features";
import Personas from "@/components/features/landing/personas";
import Workflow from "@/components/features/landing/workflow";
import CTA from "@/components/features/landing/cta";
import Footer from "@/components/features/landing/footer";

export default function Home() {
  return (
    <main className="bg-[#0A0F1C] text-slate-100">
      <Navbar />
      <Hero />
      <Metrics />
      <Features />
      <Personas />
      <Workflow />
      <CTA />
      <Footer />
    </main>
  );
}
