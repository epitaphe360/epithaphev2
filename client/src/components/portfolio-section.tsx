import { Card } from "@/components/ui/card";

const projects = [
  {
    id: 1,
    client: "Qatar Airways",
    image: "https://epitaphe.ma/wp-content/uploads/2018/10/eventqatar.jpg",
  },
  {
    id: 2,
    client: "Schneider Electric",
    image: "https://epitaphe.ma/wp-content/uploads/2018/10/LIFE.jpg",
  },
  {
    id: 3,
    client: "Dell",
    image: "https://epitaphe.ma/wp-content/uploads/2018/10/dell-rea.jpg",
  },
  {
    id: 4,
    client: "SNEP",
    image: "https://epitaphe.ma/wp-content/uploads/2018/10/REARapport.jpg",
  },
  {
    id: 5,
    client: "Ajial",
    image: "https://epitaphe.ma/wp-content/uploads/2018/10/Ajial2-1.jpg",
  },
];

export function PortfolioSection() {
  return (
    <section
      id="portfolio"
      className="py-20 md:py-32 bg-secondary/30 relative overflow-hidden"
      data-testid="section-portfolio"
    >
      <div 
        className="absolute inset-0 bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: "url('https://epitaphe.ma/wp-content/uploads/2018/10/particle-01-black.png')"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group relative overflow-hidden aspect-square cursor-pointer border-0"
              data-testid={`card-project-${project.id}`}
            >
              <img
                src={project.image}
                alt={project.client}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-bold text-white">
                  {project.client}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
