import { Card } from "@/components/ui/card";

const services = [
  {
    id: "communication-corporate",
    title: "Communication corporate",
    image: "https://epitaphe.ma/wp-content/uploads/2020/05/Com-CORPORATE-1.jpg",
  },
  {
    id: "communication-produits",
    title: "Communication produits",
    image: "https://epitaphe.ma/wp-content/uploads/2020/05/com-produits.jpg",
  },
  {
    id: "communication-evenementielle",
    title: "Communication événementielle",
    image: "https://epitaphe.ma/wp-content/uploads/2020/05/com-event.jpg",
  },
  {
    id: "communication-financiere",
    title: "Communication financière",
    image: "https://epitaphe.ma/wp-content/uploads/2020/05/com-financiere.jpg",
  },
  {
    id: "communication-interne",
    title: "Communication interne",
    image: "https://epitaphe.ma/wp-content/uploads/2020/05/com-interne.jpg",
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="py-20 md:py-32 bg-secondary/30"
      data-testid="section-services"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
            data-testid="text-services-title"
          >
            Nos métiers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une expertise complète pour accompagner vos projets de A à Z
          </p>
        </div>

        <div className="overflow-hidden">
          <div className="flex animate-services-scroll">
            {[...services, ...services, ...services].map((service, index) => (
              <Card
                key={`${service.id}-${index}`}
                className="group relative flex-shrink-0 w-72 md:w-80 mx-3 overflow-hidden cursor-pointer border-0 bg-card"
                data-testid={`card-service-${service.id}-${index}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    {service.title}
                  </h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes services-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        .animate-services-scroll {
          animation: services-scroll 25s linear infinite;
        }
        .animate-services-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
