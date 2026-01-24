import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const articles = [
  {
    id: 1,
    title: "Pourquoi les équipes interfonctionnelles en marketing échouent (et comment éviter le chaos)",
    image: "https://epitaphe.ma/wp-content/uploads/2025/03/Pourquoi-les-equipes-interfonctionnelles-en-marketing-echouent.jpg",
    link: "#",
  },
  {
    id: 2,
    title: "Les 4 avantages de la gravure laser",
    image: "https://epitaphe.ma/wp-content/uploads/2020/05/gravure-sur-bois-reussie.jpg",
    link: "#",
  },
];

export function BlogSection() {
  return (
    <section
      id="blog"
      className="py-20 md:py-32 relative overflow-hidden"
      data-testid="section-blog"
    >
      <div 
        className="absolute inset-0 bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: "url('https://epitaphe.ma/wp-content/uploads/2018/10/particle-02.png')"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
            data-testid="text-blog-title"
          >
            Nous vous proposons de lire
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="group overflow-hidden cursor-pointer border-0 bg-card"
              data-testid={`card-article-${article.id}`}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blog">
            <Button variant="outline" size="lg" data-testid="button-all-articles">
              Tous les articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
