import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const blogArticles = [
  {
    slug: "eviter-le-chaos-dans-les-equipes-interfonctionnelles-en-marketing",
    title: "Pourquoi les équipes interfonctionnelles en marketing échouent (et comment éviter le chaos)",
    excerpt: "Tout le monde le sait : une équipe interfonctionnelle devrait briser les silos et améliorer l'efficacité, mais elles échouent souvent à cause du manque d'alignement, de communication et de leadership.",
    image: "https://epitaphe.ma/wp-content/uploads/2025/03/Pourquoi-les-equipes-interfonctionnelles-en-marketing-echouent.jpg",
    categories: ["Communication globale", "Communication interne", "Stratégie de communication"],
  },
  {
    slug: "marketing-strategique-anticipation-concurrents",
    title: "L'Erreur Stratégique des Marketeurs : Pourquoi l'Anticipation Concurrentielle Change Tout",
    excerpt: "L'Erreur Stratégique que 90% des Marketeurs font. Ils lancent des campagnes sans analyser la concurrence...",
    image: "https://epitaphe.ma/wp-content/uploads/2026/01/pub-et-concurrence.jpg",
    categories: ["Communication globale", "Stratégie de communication"],
  },
  {
    slug: "faut-il-faire-aimer-votre-marque-ou-limposer",
    title: "Pourquoi l'illusion de la \"Love Brand\" fragilise votre entreprise ?",
    excerpt: "On vous martèle qu'il faut « faire aimer votre marque ». Mais est-ce vraiment la bonne stratégie ?",
    image: "https://epitaphe.ma/wp-content/uploads/2025/12/beautiful-heart-shape.webp",
    categories: ["Communication globale", "Stratégie de communication"],
  },
  {
    slug: "pourquoi-payez-vous-pour-etre-invisible-le-cout-du-consensus-en-branding",
    title: "Le branding, ce n'est pas porter un uniforme. C'est être celui qui définit le dress-code de son secteur.",
    excerpt: "Vous investissez massivement. Vous occupez l'espace. Pourtant, votre marque semble invisible...",
    image: "https://epitaphe.ma/wp-content/uploads/2025/12/branding-epitaphe360.webp",
    categories: ["Branding"],
  },
  {
    slug: "safety-day-entreprise-erreurs-a-eviter",
    title: "Safety Day : Les erreurs à éviter pour réussir votre journée sécurité",
    excerpt: "Organiser un Safety Day peut transformer la culture sécurité de votre entreprise. Découvrez les erreurs à éviter.",
    image: "https://epitaphe.ma/wp-content/uploads/2025/05/Safety-day-1920x1281.jpg",
    categories: ["Événementiel", "Communication interne"],
  },
  {
    slug: "epitaphe360-com-blog-communication-interne-engagement",
    title: "Comment réussir son événement de marque avec le branding événementiel",
    excerpt: "Dans un monde où chaque interaction compte, savoir comment réussir son événement de marque est essentiel.",
    image: "https://epitaphe.ma/wp-content/uploads/2025/03/marketing-promotional-campaign-brand-awareness-building-branded-workshop-workshop-organized-by-brand-useful-marketing-event-concept_335657-115.jpg",
    categories: ["Événementiel", "Branding"],
  },
  {
    slug: "agence-evenementielle-innovante-maroc",
    title: "Stratégies pour des événements mémorables au Maroc",
    excerpt: "Les méthodes classiques coûtent cher et rapportent peu. Par conséquent, découvrez nos stratégies innovantes.",
    image: "https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg",
    categories: ["Événementiel"],
  },
  {
    slug: "les-secrets-pour-organiser-votre-evenement-avec-plus-de-succes-et-moins-de-stress",
    title: "Les secrets pour organiser votre événement... avec plus de succès et moins de stress",
    excerpt: "Organiser un événement est loin d'être une mince affaire. Sa réussite dépend de nombreux facteurs.",
    image: "https://epitaphe.ma/wp-content/uploads/2023/05/event.jpg",
    categories: ["Événementiel"],
  },
  {
    slug: "les-secrets-de-reussite-de-fabrication-de-votre-enseigne",
    title: "Les secrets de réussite de fabrication de votre enseigne",
    excerpt: "Les modèles d'enseignes sont très nombreux : Enseigne en drapeau, enseigne lumineuse, enseigne néon...",
    image: "https://epitaphe.ma/wp-content/uploads/2023/04/VINTAGE.png",
    categories: ["Signalétique"],
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  
  // Extraire toutes les catégories uniques
  const allCategories = ["Tous", ...Array.from(new Set(blogArticles.flatMap(article => article.categories)))];
  
  // Filtrer les articles par catégorie
  const filteredArticles = selectedCategory === "Tous" 
    ? blogArticles 
    : blogArticles.filter(article => article.categories.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8" data-testid="text-blog-title">
            Tous nos articles
          </h1>
          
          {/* Filtres par catégorie */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {allCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          
          {/* Compteur d'articles */}
          <p className="text-center text-muted-foreground mb-8">
            {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link 
                key={article.slug} 
                href={`/blog/${article.slug}`}
                className="group"
                data-testid={`link-article-${article.slug}`}
              >
                <article className="bg-card rounded-md overflow-hidden hover-elevate transition-all h-full flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-3">
                      {article.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.categories.map((cat) => (
                        <span 
                          key={cat}
                          className="text-xs font-medium text-primary uppercase tracking-wide"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 mt-auto">
                      {article.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
