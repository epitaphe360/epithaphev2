import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Helmet } from "react-helmet-async";
import { sanitizeHtml } from "@/lib/sanitize";

export default function MentionsLegales() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/pages/slug/mentions-legales')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.content) setHtmlContent(d.content); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Mentions Légales — Epitaphe 360</title>
        <meta name="description" content="Mentions légales du site Epitaphe 360, agence de communication 360° à Casablanca." />
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
          <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>
          <section className="space-y-6 text-muted-foreground leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Éditeur du site</h2>
              <p>
                <strong>Épitaphe 360</strong><br />
                Rez de chaussée Immeuble 7-9 Rue Bussang<br />
                Casablanca, Maroc<br />
                Téléphone : +212 662 744 741<br />
                Email : info@epitaphe.ma
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Directeur de la publication</h2>
              <p>Le directeur de la publication est le représentant légal de la société Épitaphe 360.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Hébergement</h2>
              <p>
                Ce site est hébergé par Railway / Vercel.<br />
                Les informations d'hébergement sont disponibles sur demande.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu de ce site (textes, images, vidéos, graphismes, logo, icônes, etc.) est la propriété exclusive d'Épitaphe 360 ou de ses partenaires. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site est interdite, sauf autorisation écrite préalable.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Limitation de responsabilité</h2>
              <p>
                Épitaphe 360 ne saurait être tenue responsable des dommages directs et indirects causés au matériel de l'utilisateur lors de l'accès au site. Épitaphe 360 décline toute responsabilité quant à l'utilisation qui pourrait être faite des informations et contenus présents sur le site.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Liens hypertextes</h2>
              <p>
                Le site peut contenir des liens hypertextes vers d'autres sites. Épitaphe 360 n'exerce aucun contrôle sur le contenu de ces sites et décline toute responsabilité les concernant.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Droit applicable</h2>
              <p>
                Les présentes mentions légales sont soumises au droit marocain. En cas de litige, les tribunaux de Casablanca seront compétents.
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
