import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Filter } from "lucide-react";
import { StatsSection } from "@/components/stats-section";
import { RevealSection } from "@/components/reveal-section";
import { ContextualCta } from "@/components/contextual-cta";
import { PageMeta } from "@/components/seo/page-meta";
import { BreadcrumbSchema } from "@/components/seo/schema-org";

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
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Blog & Ressources — Epitaphe 360"
        description="Insights, stratégies et tendances du monde de la communication globale. Articles et guides Epitaphe 360."
        canonicalPath="/blog"
        keywords="communication Maroc, stratégie communication, événementiel, marque employeur, blog agence"
      />
      <BreadcrumbSchema items={[
        { name: "Accueil", url: "/" },
        { name: "Blog & Ressources", url: "/blog" },
      ]} />
      <Navigation />

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://epitaphe.ma/wp-content/uploads/2025/03/Pourquoi-les-equipes-interfonctionnelles-en-marketing-echouent.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            data-testid="text-blog-title"
          >
            <span className="inline-block bg-primary px-4 py-2">Nos</span>
            <br />
            <span className="inline-block bg-primary px-4 py-2 mt-2">articles</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg"
          >
            Insights, stratégies et tendances du monde de la communication globale
          </motion.p>
        </div>
      </section>

      {/* ─── Filtres + grille articles ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            {/* Filtres */}
            <div className="text-center mb-10">
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-muted-foreground self-center mr-1" />
                {allCategories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-primary text-white shadow-sm"
                        : "bg-card border border-border text-foreground/70 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
              <p className="text-muted-foreground text-sm">
                {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""}
              </p>
            </div>
          </RevealSection>

          {/* Article en vedette */}
          {featuredArticle && (
            <RevealSection>
              <Link href={`/blog/${featuredArticle.slug}`} className="group block mb-12" data-testid={`link-article-${featuredArticle.slug}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative rounded-2xl overflow-hidden border border-border bg-card"
                >
                  <div className="aspect-[21/9] relative overflow-hidden">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featuredArticle.categories.map((cat) => (
                        <span key={cat} className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-white/70 text-sm md:text-base line-clamp-2 max-w-2xl">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-1 text-primary text-sm font-semibold mt-4">
                      Lire l'article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <span className="absolute top-6 left-6 bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    À la une
                  </span>
                </motion.div>
              </Link>
            </RevealSection>
          )}

          {/* Grille articles */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {restArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group block h-full"
                  data-testid={`link-article-${article.slug}`}
                >
                  <motion.article
                    whileHover={{ y: -4 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col"
                  >
                    <div className="relative h-48 bg-muted overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {article.categories.slice(0, 2).map((cat) => (
                          <span key={cat} className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h2 className="font-bold text-foreground text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2 flex-1">
                        {article.title}
                      </h2>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{article.excerpt}</p>
                      <div className="flex items-center gap-1 text-primary text-sm font-semibold mt-auto">
                        Lire l'article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <StatsSection />
      <ContextualCta pageKey="evenements" />
      <Footer />
    </div>
  );
}
