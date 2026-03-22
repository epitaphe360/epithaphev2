import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { PageMeta } from "@/components/seo/page-meta";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { RevealSection } from "@/components/reveal-section";
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
  { icon: <Phone className="w-5 h-5" />, title: "Téléphone", lines: ["+212 5 22 XX XX XX", "+212 6 XX XX XX XX"] },
  { icon: <Mail className="w-5 h-5" />, title: "Email", lines: ["contact@epitaphe360.ma", "brief@epitaphe360.ma"] },
  { icon: <Clock className="w-5 h-5" />, title: "Horaires", lines: ["Lun – Ven : 8h30 – 18h00", "Sam : 9h00 – 13h00"] },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post("/api/leads", { name: data.name, email: data.email, phone: data.phone, message: `${data.subject}\n\n${data.message}`, source: "contact_form" });
      setSent(true);
    } catch {
      setError("Erreur lors de l'envoi. Réessayez ou appelez-nous directement.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Contact — Epitaphe 360"
        description="Contactez Epitaphe 360 pour votre projet événementiel, signalétique ou architecture de marque. Réponse sous 24h."
        canonicalPath="/contact"
      />
      <Navigation />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <RevealSection>
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">Contact</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Commençons à créer <br className="hidden sm:block" /> ensemble</h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                Un projet en tête ? Une question ? Notre équipe répond sous 24h.
              </p>
              <Link href="/contact/brief">
                <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors cursor-pointer">
                  Déposer un brief complet <ArrowRight className="w-4 h-4" />
                </motion.a>
              </Link>
            </RevealSection>
          </div>
        </section>

        {/* Grid contact */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Infos */}
              <RevealSection direction="left">
                <h2 className="text-2xl font-bold text-foreground mb-8">Nos coordonnées</h2>
                <div className="grid sm:grid-cols-2 gap-5 mb-10">
                  {CONTACT_INFO.map((info, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-card border border-border rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">{info.icon}</div>
                      <div>
                        <p className="font-semibold text-foreground text-sm mb-1">{info.title}</p>
                        {info.lines.map((l, j) => <p key={j} className="text-muted-foreground text-sm">{l}</p>)}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Map placeholder */}
                <div className="w-full h-56 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground text-sm border border-border">
                  <MapPin className="w-5 h-5 mr-2" /> Carte interactive — Casablanca, Maroc
                </div>
              </RevealSection>

              {/* Formulaire rapide */}
              <RevealSection direction="right">
                <h2 className="text-2xl font-bold text-foreground mb-8">Message rapide</h2>
                {sent ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                    <p className="text-green-700 font-semibold text-lg mb-2">Message envoyé !</p>
                    <p className="text-green-600 text-sm">Notre équipe vous contactera sous 24 heures.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <input {...register("name")} placeholder="Votre nom *" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <input {...register("email")} type="email" placeholder="Email *" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div>
                      <input {...register("phone")} type="tel" placeholder="Téléphone (optionnel)" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <input {...register("subject")} placeholder="Objet *" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                      {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject.message}</p>}
                    </div>
                    <div>
                      <textarea {...register("message")} rows={5} placeholder="Votre message *" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
                      {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
                    </div>
                    {error && <p className="text-destructive text-sm bg-destructive/10 px-4 py-3 rounded-xl">{error}</p>}
                    <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
                      {isSubmitting ? "Envoi..." : (<><Send className="w-4 h-4" /> Envoyer le message</>)}
                    </motion.button>
                  </form>
                )}
              </RevealSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
