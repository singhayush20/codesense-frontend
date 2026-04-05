import {
  Cta,
  Features,
  Footer,
  Hero,
  Metrics,
  Navbar,
  Personas,
  Workflow,
} from "../components/index";

export function LandingPage() {
  return (
    <main className="bg-[#0A0F1C] text-slate-100">
      <Navbar />
      <Hero />
      <Metrics />
      <Features />
      <Personas />
      <Workflow />
      <Cta />
      <Footer />
    </main>
  );
}