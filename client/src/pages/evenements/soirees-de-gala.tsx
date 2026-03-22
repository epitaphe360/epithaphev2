import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ServicePageTemplate, type ServicePageData } from "@/components/service-page-template";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Star, UtensilsCrossed, Music, Camera } from "lucide-react";
import { useServicePage } from "@/hooks/useServicePage";

const fallbackData: ServicePageData = {
  heroTitle: "Soirées de gala & événements prestige",
  heroSubtitle: "Des moments d'exception qui célèbrent vos succès et marquent vos parties prenantes de façon inoubliable.",
  heroTag: "Prestige & Excellence",
  heroImage: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1400&q=80",
  heroCta: { label: "Concevoir ma soirée", href: "/contact/brief" },

  pitchTitle: "L'événement comme signature de votre marque",
  pitchBody: "Une soirée de gala réussie ne se résume pas à un dîner. C'est une expérience sensorielle totale qui véhicule vos valeurs et renforce votre image auprès de vos clients, partenaires et collaborateurs.",
  pitchStats: [
    { value: "+150", label: "Galas organisés" },
    { value: "50–2000", label: "Invités par événement" },
    { value: "100%", label: "Sur mesure" },
    { value: "3★", label: "Niveau hospitalité minimum" },
  ],

  serviceBlocks: [
    {
      icon: <Star className="w-5 h-5" />,
      title: "Décors & scénographie",
      description: "Concept artistique unique, mobilier premium, éclairage architectural, floral design et habillage de salle.",
      features: ["Moodboard exclusif", "Fabrication en atelier", "Montage & démontage inclus"],
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5" />,
      title: "Gastronomie & boissons",
      description: "Sélection des meilleurs traiteurs, cocktails créatifs et service hôtelier impeccable.",
      features: ["Menus personnalisés", "Sommelier attitré", "Service aux tables"],
    },
    {
      icon: <Music className="w-5 h-5" />,
      title: "Animation & artistes",
      description: "Orchestre live, DJ set, spectacles, conférenciers motivationnels et maîtres de cérémonie.",
      features: ["Booking artistes", "Animation sur mesure", "Régie technique"],
    },
    {
      icon: <Camera className="w-5 h-5" />,
      title: "Photographie & vidéo",
      description: "Captation professionnelle pour immortaliser votre soirée et valoriser votre communication.",
      features: ["Photos retouchées J+2", "Clip aftermovie", "Diffusion réseaux sociaux"],
    },
  ],

  fabriqueCta: {
    title: "Décors fabriqués dans notre atelier",
    body: "Podiums, totems lumineux, murs végétaux, structures architecturales éphémères — tout est créé dans notre fabrique à Casablanca pour une qualité irréprochable.",
  },

  references: [
    { name: "Attijariwafa Bank" },
    { name: "CIH Bank" },
    { name: "Total Maroc" },
    { name: "Holcim Maroc" },
  ],

  testimonials: [
    {
      author: "DRH",
      company: "Attijariwafa Bank",
      content: "La soirée de fin d'année organisée par Epitaphe 360 était d'une qualité exceptionnelle. Nos 800 collaborateurs en parlent encore.",
      rating: 5,
    },
  ],

  ctaTitle: "Créons ensemble votre soirée de prestige",
  ctaBody: "Chaque détail compte. Partagez votre vision et nous vous proposerons un concept créatif unique.",
  ctaLabel: "Organiser ma soirée",
};

export default function SoireesDeGala() {
  const { data } = useServicePage("evenements/soirees-de-gala", fallbackData);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Soirées de Gala & Événements Prestige — Epitaphe 360"
        description="Organisez des soirées d'exception qui célèbrent vos succès. Décors luxueux, scénographie sur mesure, hospitalité 3 étoiles."
        canonicalPath="/evenements/soirees-de-gala"
      />
      <Navigation />
      <Breadcrumbs />
      <ServicePageTemplate data={data} />
      <Footer />
    </div>
  );
}
