import { useEffect } from "react";
import { PageMeta } from "@/components/seo/page-meta";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { StatsSection } from "@/components/stats-section";
import { ClientsSection } from "@/components/clients-section";
import { BenefitsSection } from "@/components/benefits-section";
import { BlogSection } from "@/components/blog-section";
import { PortfolioSection } from "@/components/portfolio-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background" data-testid="page-home">
      <PageMeta
        title="Epitaphe 360 — Agence Événementielle & Architecture de Marque"
        description="Agence événementielle au Maroc spécialisée en événements d'entreprise, architecture de marque et fabrication. Conventions, galas, signalétique, stand 3D."
        canonicalPath="/"
        schemaType="WebPage"
      />
      <Navigation />
      <main>
        <HeroSection />
        <ServicesSection />
        <StatsSection />
        <ClientsSection />
        <BenefitsSection />
        <BlogSection />
        <PortfolioSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
