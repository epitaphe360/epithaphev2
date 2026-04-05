import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

interface Article {
  id: number;
  title: string;
  slug: string;
  featuredImage?: string | null;
  excerpt?: string | null;
  publishedAt?: string | null;
}

function ArticleSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-5 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function BlogSection() {
  const { data, isLoading } = useQuery<{ data: Article[] }>({
    queryKey: ["/api/articles", { limit: 2 }],
    queryFn: async () => {
      const res = await fetch("/api/articles?limit=2&status=PUBLISHED");
      if (!res.ok) throw new Error("Erreur chargement articles");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const articles = data?.data ?? [];

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
          {isLoading ? (
            <>
              <ArticleSkeleton />
              <ArticleSkeleton />
            </>
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="block group"
                data-testid={`card-article-${article.id}`}
              >
                <Card className="overflow-hidden border-0 bg-card group-hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    {article.featuredImage ? (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                  </div>
                </Card>
              </Link>
            ))
          ) : null}
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
