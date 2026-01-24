import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const scrollToServices = () => {
    const element = document.querySelector("#services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      data-testid="section-hero"
    >
      <div 
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-10"
        style={{
          backgroundImage: "url('https://epitaphe.ma/wp-content/uploads/2018/10/particle-02.png')"
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
            data-testid="text-hero-title"
          >
            <span className="inline-block bg-primary text-primary-foreground px-4 py-2">
              Epitaphe 360
            </span>
          </h1>
        </div>

        <div className="mb-8 md:mb-12">
          <p
            className="text-xl sm:text-2xl md:text-3xl font-semibold"
            data-testid="text-hero-tagline"
          >
            <span className="inline-block bg-primary text-primary-foreground px-3 py-1 mb-2">
              Inspirez.
            </span>{" "}
            <span className="inline-block bg-primary text-primary-foreground px-3 py-1 mb-2">
              Connectez.
            </span>{" "}
            <span className="inline-block bg-primary text-primary-foreground px-3 py-1">
              Marquez Durablement.
            </span>
          </p>
        </div>

        <div className="mb-8">
          <p className="text-lg md:text-xl text-muted-foreground mb-2">
            Nous sommes une agence de communication 360°
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            globalement <span className="text-primary">créative</span>
            <span className={`inline-block w-0.5 h-8 md:h-10 bg-primary ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 mb-8">
          <p
            className="text-lg md:text-xl font-semibold text-foreground"
            data-testid="text-hero-subtitle"
          >
            Vous voulez impacter? Nous savons comment!
          </p>
          <p
            className="text-base md:text-lg text-muted-foreground leading-relaxed"
            data-testid="text-hero-description"
          >
            Basée à Casablanca au Maroc, notre agence de communication Epitaphe360 accompagne depuis 20 ans, grandes entreprises, multinationales et PME dans la complexité de leurs défis : là où créativité et pragmatisme se croisent. Nous comprenons vos contraintes, en tant que CEO, Directeurs marketing ou de communication… : des délais serrés, des attentes élevées, un besoin constant d'innovation. C'est pour cela que nous avons choisi de faire autrement.
          </p>
        </div>
      </div>

      <button
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        data-testid="button-scroll-down"
      >
        <span className="text-sm font-medium">Découvrir</span>
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </button>
    </section>
  );
}
