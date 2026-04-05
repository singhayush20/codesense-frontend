import Navbar from "@/components/sections/navbar";
import Hero from "@/components/sections/hero";
import Metrics from "@/components/sections/metrics";
import Features from "@/components/sections/features";
import Personas from "@/components/sections/personas";
import Workflow from "@/components/sections/workflow";
import CTA from "@/components/sections/cta";
import Footer from "@/components/sections/footer";

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
