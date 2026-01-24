import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContactSection } from "@/components/contact-section";
import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sanitizeHtml } from "@/lib/sanitize";

const blogArticles: Record<string, {
  title: string;
  excerpt: string;
  image: string;
  categories: string[];
  content: string;
}> = {
  "eviter-le-chaos-dans-les-equipes-interfonctionnelles-en-marketing": {
    title: "Pourquoi les équipes interfonctionnelles en marketing échouent (et comment éviter le chaos)",
    excerpt: "Tout le monde le sait : une équipe interfonctionnelle devrait briser les silos et améliorer l'efficacité.",
    image: "https://epitaphe.ma/wp-content/uploads/2025/03/Pourquoi-les-equipes-interfonctionnelles-en-marketing-echouent.jpg",
    categories: ["Communication globale", "Communication interne", "Stratégie de communication"],
    content: `Les équipes interfonctionnelles en marketing promettent d'améliorer l'efficacité, mais elles échouent souvent à cause du manque d'alignement, de communication et de leadership.

Dans cet article, nous explorons les raisons principales de ces échecs et comment votre entreprise peut éviter ces pièges courants.

## Le problème des silos

Les silos organisationnels sont l'un des plus grands obstacles à la collaboration efficace. Quand les départements travaillent de manière isolée, les informations ne circulent pas et les objectifs peuvent diverger.

## Solutions pratiques

1. **Alignement des objectifs** : Assurez-vous que tous les membres de l'équipe comprennent et partagent les mêmes objectifs.

2. **Communication régulière** : Mettez en place des réunions courtes mais fréquentes pour maintenir tout le monde informé.

3. **Leadership clair** : Désignez un leader qui peut faciliter la collaboration et résoudre les conflits.

4. **Outils adaptés** : Utilisez des outils de collaboration qui permettent à tous de suivre l'avancement des projets.

Chez Epitaphe 360, nous accompagnons les entreprises dans la mise en place de stratégies de communication interne efficaces.`,
  },
  "marketing-strategique-anticipation-concurrents": {
    title: "L'Erreur Stratégique des Marketeurs : Pourquoi l'Anticipation Concurrentielle Change Tout",
    excerpt: "L'Erreur Stratégique que 90% des Marketeurs font. Ils lancent des campagnes sans analyser la concurrence...",
    image: "https://epitaphe.ma/wp-content/uploads/2026/01/pub-et-concurrence.jpg",
    categories: ["Communication globale", "Stratégie de communication"],
    content: `L'Erreur Stratégique que 90% des Marketeurs font : ils lancent des campagnes sans analyser la concurrence.

## Pourquoi c'est un problème ?

Dans un marché saturé, ne pas connaître vos concurrents revient à naviguer à l'aveugle. Vous risquez de :
- Dupliquer des messages déjà utilisés
- Manquer des opportunités de différenciation
- Gaspiller votre budget marketing

## L'anticipation concurrentielle

L'anticipation concurrentielle n'est pas simplement observer ce que font vos concurrents. C'est comprendre :
- Leurs forces et faiblesses
- Leur positionnement
- Leurs prochains mouvements probables

## Comment l'appliquer ?

1. **Veille continue** : Mettez en place un système de veille concurrentielle régulier.
2. **Analyse SWOT** : Évaluez votre position par rapport à vos concurrents.
3. **Différenciation** : Identifiez ce qui vous rend unique.

Epitaphe 360 vous aide à développer une stratégie marketing différenciante et efficace.`,
  },
  "faut-il-faire-aimer-votre-marque-ou-limposer": {
    title: "Pourquoi l'illusion de la \"Love Brand\" fragilise votre entreprise ?",
    excerpt: "On vous martèle qu'il faut « faire aimer votre marque ». Mais est-ce vraiment la bonne stratégie ?",
    image: "https://epitaphe.ma/wp-content/uploads/2025/12/beautiful-heart-shape.webp",
    categories: ["Communication globale", "Stratégie de communication"],
    content: `On vous martèle qu'il faut « faire aimer votre marque ». Mais est-ce vraiment la bonne stratégie ?

## Le mythe de la Love Brand

Le concept de "Love Brand" est séduisant : créer une connexion émotionnelle si forte que les consommateurs deviennent des ambassadeurs passionnés de votre marque.

Mais attention aux pièges :
- L'amour des consommateurs est volatile
- Cette stratégie demande des investissements massifs
- Elle peut fragiliser votre entreprise en cas de crise

## L'alternative : la marque de confiance

Plutôt que de chercher à être aimé, construisez une marque de confiance :
- Soyez fiable et cohérent
- Tenez vos promesses
- Créez de la valeur réelle

## Comment y parvenir ?

1. **Qualité constante** : Ne décevez jamais vos clients
2. **Transparence** : Communiquez honnêtement
3. **Engagement** : Montrez que vous êtes là pour le long terme

Epitaphe 360 vous accompagne dans la construction d'une marque solide et durable.`,
  },
  "pourquoi-payez-vous-pour-etre-invisible-le-cout-du-consensus-en-branding": {
    title: "Le branding, ce n'est pas porter un uniforme. C'est être celui qui définit le dress-code de son secteur.",
    excerpt: "Vous investissez massivement. Vous occupez l'espace. Pourtant, votre marque semble invisible...",
    image: "https://epitaphe.ma/wp-content/uploads/2025/12/branding-epitaphe360.webp",
    categories: ["Branding"],
    content: `Vous investissez massivement. Vous occupez l'espace. Pourtant, votre marque semble invisible...

## Le piège du consensus

Beaucoup d'entreprises optent pour un branding "sûr" qui ressemble à celui de leurs concurrents. Résultat : elles se fondent dans la masse.

Le consensus en branding, c'est :
- Utiliser les mêmes codes visuels que tout le monde
- Adopter un ton de communication générique
- Éviter de prendre position

## Oser la différence

Les marques qui marquent les esprits sont celles qui osent :
- Avoir une identité visuelle distinctive
- Prendre des positions fortes
- Créer leur propre langage

## Comment sortir du lot ?

1. **Identifiez votre singularité** : Qu'est-ce qui vous rend vraiment unique ?
2. **Assumez vos choix** : N'ayez pas peur de polariser
3. **Soyez cohérent** : Maintenez votre différence dans toutes vos communications

Epitaphe 360 vous aide à créer un branding qui vous démarque vraiment.`,
  },
  "safety-day-entreprise-erreurs-a-eviter": {
    title: "Safety Day : Les erreurs à éviter pour réussir votre journée sécurité",
    excerpt: "Organiser un Safety Day peut transformer la culture sécurité de votre entreprise. Découvrez les erreurs à éviter.",
    image: "https://epitaphe.ma/wp-content/uploads/2025/05/Safety-day-1920x1281.jpg",
    categories: ["Événementiel", "Communication interne"],
    content: `Organiser un Safety Day peut transformer la culture sécurité de votre entreprise. Mais attention aux erreurs courantes !

## Qu'est-ce qu'un Safety Day ?

Un Safety Day est une journée dédiée à la sécurité au travail. C'est l'occasion de sensibiliser vos équipes et de renforcer la culture sécurité.

## Les erreurs à éviter

1. **Faire un événement one-shot** : Le Safety Day doit s'inscrire dans une démarche continue
2. **Proposer du contenu ennuyeux** : Rendez l'apprentissage interactif et ludique
3. **Oublier le suivi** : Mesurez l'impact et planifiez les actions suivantes
4. **Négliger la communication** : Annoncez l'événement et valorisez les résultats

## Les clés du succès

- Impliquez les collaborateurs dans la préparation
- Variez les formats (ateliers, démonstrations, jeux)
- Personnalisez le contenu selon les risques de votre entreprise
- Créez un moment convivial

Epitaphe 360 vous accompagne dans l'organisation de votre Safety Day.`,
  },
  "epitaphe360-com-blog-communication-interne-engagement": {
    title: "Comment réussir son événement de marque avec le branding événementiel",
    excerpt: "Dans un monde où chaque interaction compte, savoir comment réussir son événement de marque est essentiel.",
    image: "https://epitaphe.ma/wp-content/uploads/2025/03/marketing-promotional-campaign-brand-awareness-building-branded-workshop-workshop-organized-by-brand-useful-marketing-event-concept_335657-115.jpg",
    categories: ["Événementiel", "Branding"],
    content: `Dans un monde où chaque interaction compte, savoir comment réussir son événement de marque est essentiel.

## Le branding événementiel : qu'est-ce que c'est ?

Le branding événementiel consiste à créer une expérience qui incarne les valeurs et l'identité de votre marque. Chaque détail compte : du choix du lieu à la scénographie, en passant par les animations.

## Pourquoi c'est important ?

Un événement de marque réussi :
- Renforce la notoriété
- Crée des liens émotionnels avec vos publics
- Génère du contenu pour vos réseaux sociaux
- Différencie votre marque de la concurrence

## Les étapes clés

1. **Définir l'objectif** : Que voulez-vous accomplir ?
2. **Connaître votre audience** : Qui sont vos invités ?
3. **Créer un concept fort** : Quelle expérience voulez-vous offrir ?
4. **Soigner chaque détail** : De l'invitation au suivi post-événement

Epitaphe 360 conçoit et organise vos événements de marque.`,
  },
  "agence-evenementielle-innovante-maroc": {
    title: "Stratégies pour des événements mémorables au Maroc",
    excerpt: "Les méthodes classiques coûtent cher et rapportent peu. Par conséquent, découvrez nos stratégies innovantes.",
    image: "https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg",
    categories: ["Événementiel"],
    content: `Les méthodes classiques coûtent cher et rapportent peu. Par conséquent, découvrez nos stratégies innovantes pour des événements mémorables au Maroc.

## Le contexte marocain

Le Maroc offre un cadre exceptionnel pour l'événementiel :
- Des lieux uniques (riads, palais, désert)
- Une culture d'hospitalité
- Des savoir-faire artisanaux

## Nos stratégies innovantes

1. **L'expérience immersive** : Plongez vos invités dans un univers unique
2. **Le digital augmenté** : Combinez présentiel et digital pour plus d'impact
3. **La durabilité** : Organisez des événements éco-responsables
4. **La personnalisation** : Créez des moments sur-mesure pour chaque invité

## Les clés du succès au Maroc

- Travaillez avec des partenaires locaux fiables
- Respectez les codes culturels
- Anticipez les aspects logistiques
- Valorisez l'artisanat marocain

Epitaphe 360, votre agence événementielle au Maroc.`,
  },
  "les-secrets-pour-organiser-votre-evenement-avec-plus-de-succes-et-moins-de-stress": {
    title: "Les secrets pour organiser votre événement... avec plus de succès et moins de stress",
    excerpt: "Organiser un événement est loin d'être une mince affaire. Sa réussite dépend de nombreux facteurs.",
    image: "https://epitaphe.ma/wp-content/uploads/2023/05/event.jpg",
    categories: ["Événementiel"],
    content: `Organiser un événement est loin d'être une mince affaire. Sa réussite dépend de nombreux facteurs qu'il faut maîtriser.

## La planification est la clé

Un événement réussi commence par une planification minutieuse. Voici les étapes essentielles :

### 1. Définir vos objectifs
Que souhaitez-vous accomplir avec cet événement ? Lancement de produit ? Team building ? Networking ?

### 2. Établir un budget réaliste
Incluez tous les postes de dépenses : lieu, traiteur, décoration, communication, imprévus.

### 3. Créer un rétroplanning
Établissez un calendrier détaillé avec toutes les tâches et leurs deadlines.

### 4. Choisir les bons partenaires
Entourez-vous de professionnels fiables pour chaque aspect de l'événement.

## Les erreurs à éviter

- Sous-estimer le temps de préparation
- Négliger la communication en amont
- Oublier le plan B
- Ignorer les détails logistiques

Epitaphe 360 est votre partenaire pour des événements mémorables et sans stress.`,
  },
  "les-secrets-de-reussite-de-fabrication-de-votre-enseigne": {
    title: "Les secrets de réussite de fabrication de votre enseigne",
    excerpt: "Les modèles d'enseignes sont très nombreux : Enseigne en drapeau, enseigne lumineuse, enseigne néon...",
    image: "https://epitaphe.ma/wp-content/uploads/2023/04/VINTAGE.png",
    categories: ["Signalétique"],
    content: `Les modèles d'enseignes sont très nombreux : Enseigne en drapeau, enseigne lumineuse, enseigne néon, enseigne caisson...

## L'importance de l'enseigne

Votre enseigne est souvent le premier contact visuel avec vos clients. Elle doit :
- Attirer l'attention
- Communiquer votre identité
- Être visible de jour comme de nuit
- Résister aux intempéries

## Les différents types d'enseignes

1. **Enseigne lumineuse** : Impact maximal, idéale pour les commerces
2. **Enseigne non lumineuse** : Plus sobre, adaptée à certains contextes
3. **Enseigne en drapeau** : Visible depuis la rue, perpendiculaire à la façade
4. **Enseigne néon** : Style vintage ou moderne, très tendance
5. **Enseigne caisson** : Professionnelle et durable

## Les critères de choix

- La réglementation locale
- Votre budget
- Votre identité visuelle
- L'environnement de votre commerce

## Notre expertise

Epitaphe 360 vous accompagne de la conception à l'installation de votre enseigne.`,
  },
};

export default function BlogArticlePage() {
  const { slug } = useParams();
  const article = slug ? blogArticles[slug] : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-16 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Article non trouvé</h1>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <article className="pt-24">
        <div className="relative h-[50vh] min-h-[400px]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center text-white">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {article.categories.map((cat) => (
                  <span 
                    key={cat}
                    className="text-sm font-medium bg-primary px-3 py-1 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold" data-testid="text-article-title">
                {article.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-16">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au blog
            </Button>
          </Link>

          <div className="prose prose-lg dark:prose-invert max-w-none" data-testid="content-article-body">
            {article.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('## ')) {
                return <h2 key={idx} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={idx} className="text-xl font-bold mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                return (
                  <ul key={idx} className="list-disc pl-6 my-4 space-y-2">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.match(/^\d\. /)) {
                const items = paragraph.split('\n').filter(line => line.match(/^\d\. /));
                return (
                  <ol key={idx} className="list-decimal pl-6 my-4 space-y-2">
                    {items.map((item, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.replace(/^\d\. /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')) }} />
                    ))}
                  </ol>
                );
              }
              return <p key={idx} className="text-muted-foreground leading-relaxed my-4">{paragraph}</p>;
            })}
          </div>
        </div>
      </article>

      <ContactSection />
      <Footer />
    </div>
  );
}
