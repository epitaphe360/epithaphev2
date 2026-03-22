import { Check } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { AnimatedSection, AnimatedGrid, AnimatedItem } from "@/components/animated-section";

const FALLBACK_BENEFITS = [
  "Une maitrise totale : de l'idée à l'exécution, nous gérons vos projet de A à Z pour assurer cohérence, qualité et réactivité",
  "Une approche personnalisée : Nos solutions sont adaptées à vos besoins uniques, avec des formules sur-mesure.",
  "Un atelier interne. Rapidité, flexibilité et réactivité sont nos garanties.",
  "Une équipe passionnée sur laquelle vous pouvez vraiment compter",
  "KPI et suivi. Nous mesurons l'impact de nos solutions pour optimiser votre ROI.",
  "Un partenaire qui optimise votre temps et vos budgets",
];

export function BenefitsSection() {
  const { settings } = useSettings("benefits", {
    benefits_title: "Une agence de communication 360, c'est:",
    benefits_image: "https://epitaphe.ma/wp-content/uploads/2020/05/bg-agence-de-com-360-800x450.jpg",
  });

  const benefits: string[] = (() => {
    try {
      const raw = settings.benefits_items;
      if (Array.isArray(raw) && raw.length > 0) return raw as string[];
      if (typeof raw === "string") {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as string[];
      }
    } catch {}
    return FALLBACK_BENEFITS;
  })();
  return (
    <section id="about" className="py-20 md:py-32" data-testid="section-benefits">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimatedSection variant="fadeRight" className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] rounded-md overflow-hidden shadow-xl">
              <img
                src={settings.benefits_image}
                alt="Agence de communication 360"
                className="w-full h-full object-cover"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection variant="fadeLeft" delay={0.1} className="order-1 lg:order-2">
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-8"
              data-testid="text-benefits-title"
            >
              {settings.benefits_title}
            </h2>

            <AnimatedGrid className="space-y-4" stagger={0.07} delay={0.15}>
              {benefits.map((benefit, index) => (
                <AnimatedItem key={index} variant="fadeLeft">
                <li
                  className="flex items-start gap-3"
                  data-testid={`benefit-item-${index}`}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground leading-relaxed">
                    {benefit}
                  </span>
                </li>
                </AnimatedItem>
              ))}
            </AnimatedGrid>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
