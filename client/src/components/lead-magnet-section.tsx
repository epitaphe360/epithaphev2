/**
 * Lead Magnet Section — CDC 4.6
 * Capture d'email professionnel → envoi PDF + tracking GA4 lead_magnet_download
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Mail, CheckCircle2, AlertCircle, Shield, FileText, Loader2 } from "lucide-react";

/* ── Types ─────────────────────────────────────────────────── */
export interface LeadMagnetProps {
  /** Titre de l'offre */
  title: string;
  /** Sous-titre / description */
  description: string;
  /** Image de couverture du PDF (optionnel) */
  coverImage?: string;
  /** Slug du document à télécharger (doit correspondre au serveur) */
  documentSlug: string;
  /** Liste de points de valeur */
  bulletPoints?: string[];
  className?: string;
}

/* ── Validation email pro ─────────────────────────────────── */
const FREE_DOMAINS = ["gmail", "yahoo", "hotmail", "outlook", "live", "msn", "wanadoo", "laposte", "free", "orange", "sfr", "icloud", "protonmail", "yopmail"];

function isProfessionalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.split(".")[0]?.toLowerCase();
  return !!domain && !FREE_DOMAINS.includes(domain);
}

/* ── Suivi GA4 ─────────────────────────────────────────────── */
function trackLeadMagnet(documentSlug: string, email: string) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "lead_magnet_download", {
      document_slug: documentSlug,
      email_domain:  email.split("@")[1] ?? "unknown",
    });
  }
}

/* ── Composant ─────────────────────────────────────────────── */
export function LeadMagnetSection({
  title,
  description,
  coverImage,
  documentSlug,
  bulletPoints = [],
  className = "",
}: LeadMagnetProps) {
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }
    if (!isProfessionalEmail(email)) {
      setError("Merci d'utiliser votre email professionnel (ex : vous@votreentreprise.com).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), documentSlug }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      trackLeadMagnet(documentSlug, email);
      setSuccess(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-primary/8 via-card to-primary/5 border border-primary/20 rounded-3xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-5 gap-0">

            {/* Colonne gauche : infos */}
            <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-primary/15 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                  <FileText className="w-3.5 h-3.5" /> Ressource gratuite
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight">
                {title}
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>

              {bulletPoints.length > 0 && (
                <ul className="space-y-2 mb-8">
                  {bulletPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              )}

              {/* Formulaire */}
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-300">Envoi confirmé !</p>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        Le document a été envoyé à <strong>{email}</strong>. Vérifiez vos spams si besoin.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-3"
                  >
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="vous@votreentreprise.com"
                          className="w-full pl-9 pr-4 py-3 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                          required
                        />
                      </div>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={loading ? {} : { scale: 1.04 }}
                        whileTap={loading ? {} : { scale: 0.96 }}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {loading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Envoi…</>
                        ) : (
                          <><Download className="w-4 h-4" /> Recevoir</>
                        )}
                      </motion.button>
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 text-xs text-red-600"
                      >
                        <AlertCircle className="w-3.5 h-3.5" /> {error}
                      </motion.p>
                    )}

                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3" />
                      Email professionnel requis — aucun spam, désabonnement en 1 clic.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Colonne droite : couverture PDF */}
            <div className="md:col-span-2 relative bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center p-8">
              {coverImage ? (
                <motion.img
                  src={coverImage}
                  alt={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-full max-w-xs rounded-xl shadow-2xl object-cover"
                />
              ) : (
                <div className="w-40 h-56 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 flex flex-col items-center justify-center gap-3 shadow-xl">
                  <FileText className="w-12 h-12 text-primary/60" />
                  <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">PDF</span>
                </div>
              )}
              {/* Badge flottant */}
              <div className="absolute top-4 right-4 bg-white dark:bg-card rounded-full shadow-md px-3 py-1.5 text-xs font-bold text-primary border border-primary/20">
                GRATUIT
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
