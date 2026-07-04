import {
  Cta,
  Features,
  Footer,
  Hero,
  Navbar,
  WhyCodeSense,
  Workflow,
} from "../components/index";

export function LandingPage() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <WhyCodeSense />
      <Workflow />
      <Cta />
      <Footer />
    </main>
  );
}
