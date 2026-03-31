import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Helmet } from "react-helmet-async";
import { sanitizeHtml } from "@/lib/sanitize";

export default function PolitiqueConfidentialite() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/pages/slug/politique-confidentialite')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.content) setHtmlContent(d.content); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Politique de Confidentialité — Epitaphe 360</title>
        <meta name="description" content="Politique de confidentialité et protection des données personnelles d'Epitaphe 360." />
      </Helmet>
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {htmlContent ? (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }}
            />
          ) : (
          <>
          <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>
          <section className="space-y-6 text-muted-foreground leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Introduction</h2>
              <p>
                Épitaphe 360 s'engage à protéger la vie privée des utilisateurs de son site internet. La présente politique de confidentialité décrit les informations que nous collectons, comment nous les utilisons et les mesures que nous prenons pour les protéger.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Collecte des données</h2>
              <p>
                Nous collectons les données personnelles que vous nous fournissez volontairement via nos formulaires de contact, de brief projet, ou d'inscription à notre newsletter. Ces données peuvent inclure : nom, prénom, adresse email, numéro de téléphone, nom de l'entreprise.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Utilisation des données</h2>
              <p>Vos données personnelles sont utilisées pour :</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Répondre à vos demandes de contact et de devis</li>
                <li>Vous envoyer des informations relatives à nos services (si vous y avez consenti)</li>
                <li>Améliorer notre site internet et nos services</li>
                <li>Gérer la relation client via notre espace client sécurisé</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Conservation des données</h2>
              <p>
                Vos données personnelles sont conservées pendant une durée n'excédant pas celle nécessaire aux finalités pour lesquelles elles sont collectées et traitées. Les données de contact sont conservées pendant 3 ans à compter du dernier contact.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Partage des données</h2>
              <p>
                Épitaphe 360 ne vend, ne loue et ne partage pas vos données personnelles avec des tiers à des fins commerciales. Vos données peuvent être communiquées à nos sous-traitants techniques (hébergeur, outils d'emailing) dans le strict cadre de la réalisation de nos services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Cookies</h2>
              <p>
                Notre site utilise des cookies techniques nécessaires au bon fonctionnement du site et des cookies analytiques pour mesurer l'audience. Vous pouvez configurer votre navigateur pour refuser les cookies.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Vos droits</h2>
              <p>
                Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification de vos données</li>
                <li>Droit d'opposition au traitement de vos données</li>
                <li>Droit de suppression de vos données</li>
              </ul>
              <p className="mt-2">
                Pour exercer ces droits, contactez-nous à : <a href="mailto:info@epitaphe.ma" className="text-primary hover:underline">info@epitaphe.ma</a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Sécurité</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre toute perte, détournement, accès non autorisé, divulgation, altération ou destruction.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
              <p>
                Pour toute question relative à cette politique de confidentialité :<br />
                <strong>Épitaphe 360</strong><br />
                Email : <a href="mailto:info@epitaphe.ma" className="text-primary hover:underline">info@epitaphe.ma</a><br />
                Téléphone : +212 662 744 741
              </p>
            </div>
          </section>
          </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
