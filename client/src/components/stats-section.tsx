import { useEffect, useState, useRef } from "react";
import { useSettings } from "@/hooks/useSettings";

type StatItem = { value: number; label: string; suffix: string };

const FALLBACK_STATS: StatItem[] = [
  { value: 20, label: "Ans d'expérience", suffix: "" },
  { value: 360, label: "Vision globale", suffix: "°" },
  { value: 500, label: "Projets réalisés", suffix: "+" },
  { value: 200, label: "Clients satisfaits", suffix: "+" },
];

function AnimatedCounter({
  value,
  suffix,
  isVisible,
}: {
  value: number;
  suffix: string;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
      {count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings("stats", {
    stats_title: "Pourquoi faire appel à Epitaphe 360",
  });

  const stats: StatItem[] = (() => {
    try {
      const raw = settings.stats_items;
      if (Array.isArray(raw) && raw.length > 0) return raw as StatItem[];
      if (typeof raw === "string") {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as StatItem[];
      }
    } catch {}
    return FALLBACK_STATS;
  })();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 relative overflow-hidden"
      data-testid="section-stats"
    >
      <div 
        className="absolute inset-0 bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: "url('https://epitaphe.ma/wp-content/uploads/2018/10/particle-01-black.png')"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
            data-testid="text-stats-title"
          >
            {settings.stats_title}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-md"
              data-testid={`stat-item-${index}`}
            >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                isVisible={isVisible}
              />
              <p className="text-sm md:text-base text-muted-foreground mt-3 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
