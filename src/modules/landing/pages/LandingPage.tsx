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
    <main className="bg-background text-foreground">
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
