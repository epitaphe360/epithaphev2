import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { PageMeta } from "@/components/seo/page-meta";
import { LocalBusinessSchema, BreadcrumbSchema } from "@/components/seo/schema-org";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AnimatedSection } from "@/components/animated-section";
import { useState } from "react";
import axios from "axios";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Objet requis"),
  message: z.string().min(20, "Message trop court (20 car. min)"),
});
type FormData = z.infer<typeof schema>;

const CONTACT_INFO = [
  { icon: <MapPin className="w-5 h-5" />, title: "Adresse", lines: ["123 Boulevard Mohammed V", "Casablanca, Maroc"] },
  { icon: <Phone className="w-5 h-5" />, title: "Telephone", lines: ["+212 5 22 XX XX XX", "+212 6 XX XX XX XX"] },
  { icon: <Mail className="w-5 h-5" />, title: "Email", lines: ["contact@epitaphe360.ma", "brief@epitaphe360.ma"] },
  { icon: <Clock className="w-5 h-5" />, title: "Horaires", lines: ["Lun - Ven : 8h30 - 18h00", "Sam : 9h00 - 13h00"] },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post("/api/leads", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: `${data.subject}\n\n${data.message}`,
        source: "contact_form",
      });
      setSent(true);
    } catch {
      setError("Erreur lors de l'\''envoi. Reessayez ou appelez-nous directement.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <PageMeta
        title="Contact — Epitaphe 360 | Agence Communication Casablanca"
        description="Contactez Epitaphe 360 pour votre projet événementiel, signalétique ou architecture de marque. Siège : Casablanca. Réponse sous 24h."
        canonicalPath="/contact"
        keywords="contact agence communication Casablanca, devis événementiel Maroc, Epitaphe 360"
      />
      <LocalBusinessSchema />
      <BreadcrumbSchema items={[
        { name: "Accueil", url: "/" },
        { name: "Contact", url: "/contact" },
      ]} />
      <Navigation />
      <main>

        {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
        <section className="relative pt-20 min-h-[45vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
          <div className="relative z-10 text-center px-4">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              <span className="inline-block bg-primary px-4 py-2">Commençons à</span>
              <br />
              <span className="inline-block bg-primary px-4 py-2 mt-2">créer ensemble</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/80 text-lg">
              Un projet en tête ? Notre équipe répond sous 24h.
            </motion.p>
          </div>
        </section>

        {/* --- Grid contact --- */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

              {/* Coordonnees */}
              <AnimatedSection variant="fadeLeft">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Nos coordonnées
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Plusieurs façons de nous joindre. Nous sommes joignables du lundi au samedi.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {CONTACT_INFO.map((info, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-5 flex gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary">
                        {info.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm mb-1">{info.title}</p>
                        {info.lines.map((l, j) => (
                          <p key={j} className="text-muted-foreground text-sm">{l}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Map placeholder */}
                <div className="w-full h-52 rounded-2xl flex items-center justify-center text-muted-foreground text-sm border border-border bg-muted/20">
                  <MapPin className="w-4 h-4 mr-2 text-primary" /> Carte interactive - Casablanca, Maroc
                </div>
              </AnimatedSection>

              {/* Formulaire */}
              <AnimatedSection variant="fadeRight">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Message rapide
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Remplissez le formulaire, nous vous répondons dans les 24 heures ouvrables.
                </p>

                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div key="success"
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                      className="rounded-2xl p-10 text-center bg-emerald-50 border border-emerald-100">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                      <p className="text-emerald-700 font-semibold text-lg mb-2">Message envoyé !</p>
                      <p className="text-emerald-600/80 text-sm">Notre équipe vous contactera sous 24 heures.</p>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-semibold text-foreground" htmlFor="name">
                            Nom complet <span className="text-primary">*</span>
                          </label>
                          <input id="name" {...register("name")} placeholder="Votre nom"
                            className="input-premium" />
                          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-semibold text-foreground" htmlFor="email">
                            Adresse email <span className="text-primary">*</span>
                          </label>
                          <input id="email" {...register("email")} type="email" placeholder="vous@domaine.com"
                            className="input-premium" />
                          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-foreground" htmlFor="phone">
                          Téléphone <span className="text-muted-foreground font-normal">(optionnel)</span>
                        </label>
                        <input id="phone" {...register("phone")} type="tel" placeholder="+212 6 XX XX XX XX"
                          className="input-premium" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-foreground" htmlFor="subject">
                          Objet <span className="text-primary">*</span>
                        </label>
                        <input id="subject" {...register("subject")} placeholder="Ex : Projet événementiel 2025"
                          className="input-premium" />
                        {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-foreground" htmlFor="message">
                          Message <span className="text-primary">*</span>
                        </label>
                        <textarea id="message" {...register("message")} rows={5} placeholder="Décrivez votre projet..."
                          className="input-premium resize-none" />
                        {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
                      </div>

                      {error && (
                        <p className="text-red-600 text-sm px-4 py-3 rounded-xl bg-red-50 border border-red-100">{error}</p>
                      )}

                      <motion.button type="submit" disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60">
                        {isSubmitting ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : <Send className="w-4 h-4" />}
                        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}