import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Link } from "wouter";
import { MessageSquare, Briefcase, ShieldCheck, Leaf, Calendar, ArrowRight } from "lucide-react";

const poles = [
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "COM' Interne",
    desc: "Fédérez vos collaborateurs autour d'une vision commune. Stratégie, supports, événements internes et scoring CommPulse™.",
    href: "/nos-poles/com-interne",
    tag: "Engagement collaborateur",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Marque Employeur",
    desc: "Attirez et retenez les meilleurs talents. EVP, identité visuelle RH, campagnes recrutement et scénographie RH.",
    href: "/architecture-de-marque/marque-employeur",
    tag: "RH & Attractivité",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "COM'SST-QHSE",
    desc: "Sécurité, santé au travail et conformité visuelle. Signalétique réglementaire, affichage obligatoire et campagnes prévention.",
    href: "/architecture-de-marque/communication-qhse",
    tag: "Sécurité & QHSE",
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "COM'RSE",
    desc: "Valorisez vos engagements sociétaux. Rapports d'impact, campagnes RSE, supports de sensibilisation et scoring ImpactTrace™.",
    href: "/nos-poles/com-rse",
    tag: "Responsabilité sociétale",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "COM' Événementiel",
    desc: "Conventions, galas, roadshows et salons B2B. Des moments qui marquent vos équipes et partenaires.",
    href: "/evenements",
    tag: "Événementiel B2B",
  },
];

export default function NosPolesHub() {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Nos pôles d'expertise — Epitaphe 360"
        description="COM' Interne, Marque Employeur, COM'SST-QHSE, COM'RSE et Événementiel : découvrez les 5 pôles d'expertise de l'agence Epitaphe 360 à Casablanca."
        canonicalPath="/nos-poles"
      />
      <Navigation />
      <Breadcrumbs />

      <main className="pt-24 pb-20">
        <section className="max-w-5xl mx-auto px-6 sm:px-8 mb-16">
          <div className="inline-block px-3 py-1 rounded-full border border-[#C8A96E]/30 text-[#C8A96E] text-xs font-semibold tracking-widest uppercase mb-6">
            Expertise
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Nos pôles d'expertise
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            5 pôles spécialisés pour répondre à tous vos enjeux de communication B2B — de l'engagement
            collaborateur à la responsabilité sociétale, en passant par l'événementiel et la sécurité.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {poles.map((pole) => (
              <Link
                key={pole.href}
                href={pole.href}
                className="group relative flex flex-col p-7 rounded-2xl border border-border hover:border-[#C8A96E]/50 bg-background hover:bg-[#C8A96E]/5 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C8A96E]/10 flex items-center justify-center text-[#C8A96E] mb-5">
                  {pole.icon}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96E]/70 mb-2">
                  {pole.tag}
                </div>
                <h2 className="text-lg font-bold mb-3 group-hover:text-[#C8A96E] transition-colors">
                  {pole.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{pole.desc}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#C8A96E] opacity-0 group-hover:opacity-100 transition-opacity">
                  Découvrir <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
