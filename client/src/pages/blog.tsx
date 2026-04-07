import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedSection, AnimatedGrid, AnimatedItem } from "@/components/animated-section";

interface ArticleItem {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  categories: string[];
}

// Articles de secours affichés si la DB est vide
const FALLBACK_ARTICLES: ArticleItem[] = [
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
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");

  useEffect(() => {
    fetch("/api/articles?status=PUBLISHED&limit=50")
      .then((r) => r.json())
      .then((json) => {
        const data: any[] = json.data ?? json ?? [];
        if (data.length > 0) {
          setArticles(
            data.map((a: any) => ({
              slug: a.slug,
              title: a.title,
              excerpt: a.excerpt ?? "",
              image: a.featuredImage ?? a.featured_image ?? "https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg",
              categories: a.tags ?? [],
            }))
          );
        } else {
          setArticles(FALLBACK_ARTICLES);
        }
      })
      .catch(() => setArticles(FALLBACK_ARTICLES))
      .finally(() => setLoading(false));
  }, []);

  const displayArticles = loading ? FALLBACK_ARTICLES : articles;

  // Extraire toutes les catégories uniques
  const allCategories = ["Tous", ...Array.from(new Set(displayArticles.flatMap((a) => a.categories)))];

  // Filtrer les articles par catégorie
  const filteredArticles = selectedCategory === "Tous"
    ? displayArticles
    : displayArticles.filter((a) => a.categories.includes(selectedCategory));

  const featuredArticle = filteredArticles[0];
  const restArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at top, #0d0120 0%, #000005 60%)' }}>
      <Navigation />
      
      {/* ─── Hero Magazine ─── */}
      <section className="pt-28 pb-16 px-4 relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[20rem] rounded-full opacity-20"
            style={{ background: 'radial-gradient(ellipse, #C8A96E 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection variant="fadeUp">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] mb-4"
                style={{ color: '#C8A96E', background: 'rgba(200,169,110,0.1)', padding: '6px 18px', borderRadius: '100px', border: '1px solid rgba(200,169,110,0.25)' }}>
                Magazine
              </span>
              <h1 className="font-cormorant text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
                data-testid="text-blog-title">
                Nos <em style={{ color: '#C8A96E', fontStyle: 'italic' }}>articles</em>
              </h1>
              <p className="text-white/50 text-lg max-w-xl mx-auto font-montserrat">
                Insights, stratégies et tendances du monde de la communication globale
              </p>
            </div>
          </AnimatedSection>

          {/* Filtres catégories */}
          <AnimatedSection variant="fadeIn" delay={0.15}>
            <div className="flex flex-wrap justify-center gap-3 mb-5">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 font-montserrat"
                  style={selectedCategory === category
                    ? { background: '#C8A96E', color: '#fff', boxShadow: '0 0 20px rgba(200,169,110,0.4)' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.12)' }
                  }
                >
                  {category}
                </button>
              ))}
            </div>
            <p className="text-center text-white/30 text-sm font-montserrat mb-10">
              {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
            </p>
          </AnimatedSection>

          {/* Article en vedette (hero card) */}
          {featuredArticle && (
            <AnimatedSection variant="fadeUp" delay={0.25}>
              <Link href={`/blog/${featuredArticle.slug}`} className="group block mb-12" data-testid={`link-article-${featuredArticle.slug}`}>
                <div className="relative rounded-3xl overflow-hidden"
                  style={{ border: '1px solid rgba(200,169,110,0.2)', boxShadow: '0 0 60px rgba(200,169,110,0.08)' }}>
                  <div className="aspect-[21/9] relative overflow-hidden">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,5,0.92) 0%, rgba(0,0,5,0.3) 50%, transparent 100%)' }} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featuredArticle.categories.map((cat) => (
                        <span key={cat} className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full font-montserrat"
                          style={{ color: '#C8A96E', background: 'rgba(200,169,110,0.15)', border: '1px solid rgba(200,169,110,0.3)' }}>
                          {cat}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-cormorant text-3xl md:text-5xl font-bold text-white mb-3 group-hover:text-[#C8A96E] transition-colors duration-300 line-clamp-2">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-white/60 text-sm md:text-base font-montserrat line-clamp-2 max-w-2xl">
                      {featuredArticle.excerpt}
                    </p>
                  </div>
                  {/* Badge "À la une" */}
                  <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full font-montserrat"
                    style={{ background: '#C8A96E', color: '#fff', boxShadow: '0 0 20px rgba(200,169,110,0.5)' }}>
                    À la une
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          )}

          {/* Grille articles */}
          <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restArticles.map((article) => (
              <AnimatedItem key={article.slug}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="group block h-full"
                  data-testid={`link-article-${article.slug}`}
                >
                  <article className="h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-1"
                    style={{
                      background: 'rgba(13,15,30,0.8)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(200,169,110,0.3)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(200,169,110,0.12)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.07)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
                    }}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.categories.map((cat) => (
                          <span key={cat} className="text-xs font-semibold uppercase tracking-wide font-montserrat"
                            style={{ color: '#C8A96E' }}>
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h2 className="font-cormorant text-xl font-bold text-white mb-3 group-hover:text-[#C8A96E] transition-colors duration-300 line-clamp-3 flex-1">
                        {article.title}
                      </h2>
                      <p className="text-white/45 text-sm font-montserrat line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-[#C8A96E] text-xs font-bold uppercase tracking-widest font-montserrat opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Lire l'article <span>→</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </AnimatedItem>
            ))}
          </AnimatedGrid>
        </div>
      </section>

      <Footer />
    </div>
  );
}
