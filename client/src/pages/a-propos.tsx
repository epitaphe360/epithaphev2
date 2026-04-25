import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContextualCta } from "@/components/contextual-cta";

export default function APropos() {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="À propos — Epitaphe 360, agence de communication 360° à Casablanca"
        description="Depuis 20 ans, Epitaphe 360 accompagne les grandes entreprises et multinationales au Maroc dans leurs défis de communication : événementiel, branding, digital, QHSE, RSE et plus."
        canonicalPath="/a-propos"
      />
      <Navigation />
      <Breadcrumbs />

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 sm:px-8 mb-20">
          <div className="inline-block px-3 py-1 rounded-full border border-[#C8A96E]/30 text-[#C8A96E] text-xs font-semibold tracking-widest uppercase mb-6">
            Agence de communication 360°
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Inspirez. Connectez.<br />
            <span className="text-[#C8A96E]">Marquez durablement.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Basée à Casablanca, Epitaphe 360 accompagne depuis plus de 20 ans grandes entreprises,
            multinationales et PME dans la complexité de leurs défis de communication — là où
            créativité et pragmatisme se croisent.
          </p>
        </section>

        {/* Stats */}
        <section className="bg-[#0A0A0B] py-16 mb-20">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-10 text-center">
            {[
              { value: "20+", label: "Ans d'expérience" },
              { value: "360°", label: "Vision globale" },
              { value: "500+", label: "Projets réalisés" },
              { value: "98%", label: "Clients satisfaits" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-[#C8A96E] mb-2">{s.value}</p>
                <p className="text-sm text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Notre mission */}
        <section className="max-w-5xl mx-auto px-6 sm:px-8 mb-20">
          <h2 className="text-2xl font-bold mb-6">Notre mission</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Epitaphe 360 est une agence de communication globale qui conçoit et produit des
                solutions créatives à fort impact. Notre force : une maîtrise totale de la chaîne de
                valeur, de l'idée à l'exécution.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nous comprenons vos contraintes en tant que CEO, Directeur marketing ou de
                communication : des délais serrés, des attentes élevées, un besoin constant
                d'innovation. C'est pour cela que nous avons choisi de faire autrement.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Maîtrise totale de A à Z — de l'idée à l'exécution",
                "Approche personnalisée — solutions sur mesure",
                "Atelier interne — rapidité et réactivité garanties",
                "KPI et suivi — mesure de l'impact de vos solutions",
                "Optimisation de votre temps et de vos budgets",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96E] mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nos expertises */}
        <section className="max-w-5xl mx-auto px-6 sm:px-8 mb-20">
          <h2 className="text-2xl font-bold mb-8">Nos expertises</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Nos pôles d'expertise", desc: "COM' Interne, Marque Employeur, QHSE, RSE, Événementiel", href: "/nos-poles" },
              { title: "La Fabrique 360", desc: "Branding de siège, stands, enseignes, impression, lettrage", href: "/la-fabrique" },
              { title: "Architecture de Marque", desc: "Identité visuelle, expérience client, communication corporate", href: "/architecture-de-marque" },
              { title: "Événementiel", desc: "Conventions, galas, roadshows, salons professionnels", href: "/evenements" },
              { title: "Scoring BMI 360™", desc: "8 outils d'intelligence communicationnelle et d'aide à la décision", href: "/outils" },
              { title: "Ressources", desc: "Articles, guides et études de cas pour booster votre communication", href: "/ressources" },
            ].map((e) => (
              <a
                key={e.href}
                href={e.href}
                className="group p-6 rounded-xl border border-border hover:border-[#C8A96E]/40 transition-colors duration-200"
              >
                <h3 className="font-semibold mb-2 group-hover:text-[#C8A96E] transition-colors">{e.title}</h3>
                <p className="text-sm text-muted-foreground">{e.desc}</p>
              </a>
            ))}
          </div>
        </section>
      </main>

      <ContextualCta pageKey="a-propos" />
      <Footer />
    </div>
  );
}
