import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContactSection } from "@/components/contact-section";
import { StatsSection } from "@/components/stats-section";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { getSolutionBySlug } from "@/data/solutionsData";

export default function SolutionPage() {
  const { slug } = useParams();
  const solution = slug ? getSolutionBySlug(slug) : null;

  if (!solution) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-16 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Solution non trouvée</h1>
          <Link href="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="relative pt-20 min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${solution.heroImage}')`
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-white/80 font-medium mb-4 text-lg" data-testid="text-solution-subtitle">
            {solution.label}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" data-testid="text-solution-title">
            {solution.heroTitle}
          </h1>
          <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto">
            {solution.heroSubtitle}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            {solution.content}
          </p>
          <div className="text-center mt-8">
            <Button size="lg" className="font-semibold" data-testid="button-solution-cta">
              PARLEZ-NOUS DE VOTRE PROJET
            </Button>
          </div>
        </div>
      </section>

      <StatsSection />

      <section className="py-16 md:py-24 px-4 relative">
        <div 
          className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-5"
          style={{
            backgroundImage: "url('https://epitaphe.ma/wp-content/uploads/2018/10/particle-02.png')"
          }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-needs-title">
              Quels sont vos besoins
            </h2>
            <p className="text-3xl md:text-4xl font-bold text-primary">
              en matière de {solution.label.toLowerCase()} ?
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {solution.needs.map((need, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-card rounded-md"
                  data-testid={`card-need-${idx}`}
                >
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{need}</span>
                </div>
              ))}
              <div className="pt-4">
                <Link href="#contact">
                  <Button size="lg">Contactez-nous</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src={solution.heroImage}
                alt={solution.label}
                className="rounded-md shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </div>
  );
}
