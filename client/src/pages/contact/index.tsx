import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { PageMeta } from "@/components/seo/page-meta";
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
        title="Contact - Epitaphe 360"
        description="Contactez Epitaphe 360 pour votre projet evenementiel, signaletique ou architecture de marque. Reponse sous 24h."
        canonicalPath="/contact"
      />
      <Navigation />
      <main>

        {/* --- Hero editorial light --- */}
        <section className="pt-24 pb-16 relative overflow-hidden bg-[#0A0A0B] grain">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-4rem] left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] rounded-full opacity-20"
              style={{ background: "radial-gradient(ellipse, #C8A96E 0%, transparent 70%)", filter: "blur(60px)" }} />
          </div>
          <div className="container-editorial text-center relative z-10">
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <span className="badge-gold mb-6 inline-flex">Contact</span>
              <h1 className="font-cormorant text-5xl md:text-7xl font-bold text-white mb-5 leading-tight">
                Commençons à créer <br className="hidden sm:block" />
                <em className="text-[#C8A96E] not-italic font-light">ensemble</em>
              </h1>
              <p className="text-white/65 text-lg max-w-xl mx-auto mb-8 font-montserrat leading-relaxed">
                Un projet en tete ? Une question ? Notre équipe répond sous 24h.
              </p>
              <Link href="/contact/brief">
                <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-gold inline-flex cursor-pointer">
                  Deposer un brief complet <ArrowRight className="w-4 h-4" />
                </motion.a>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* --- Grid contact --- */}
        <section className="py-20">
          <div className="container-editorial">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

              {/* Coordonnees */}
              <AnimatedSection variant="fadeLeft">
                <div className="mb-2">
                  <span className="section-number">01</span>
                </div>
                <h2 className="font-cormorant text-3xl md:text-4xl font-bold text-[#0A0A0B] mb-2 gold-rule">
                  Nos coordonnees
                </h2>
                <p className="text-[#0A0A0B]/60 mb-8 leading-relaxed">
                  Plusieurs façons de nous joindre. Nous sommes joignables du lundi au samedi.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {CONTACT_INFO.map((info, i) => (
                    <div key={i} className="card-premium p-5 flex gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--gold-bg)", color: "var(--gold)", border: "1px solid var(--gold-border)" }}>
                        {info.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0A0A0B] text-sm mb-1 font-montserrat">{info.title}</p>
                        {info.lines.map((l, j) => (
                          <p key={j} className="text-[#0A0A0B]/60 text-sm font-montserrat">{l}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Map placeholder */}
                <div className="w-full h-52 rounded-2xl flex items-center justify-center text-[#0A0A0B]/35 text-sm font-montserrat border border-black/[0.07] bg-white/60">
                  <MapPin className="w-4 h-4 mr-2 text-[#C8A96E]" /> Carte interactive - Casablanca, Maroc
                </div>
              </AnimatedSection>

              {/* Formulaire */}
              <AnimatedSection variant="fadeRight">
                <div className="mb-2">
                  <span className="section-number">02</span>
                </div>
                <h2 className="font-cormorant text-3xl md:text-4xl font-bold text-[#0A0A0B] mb-2 gold-rule">
                  Message rapide
                </h2>
                <p className="text-[#0A0A0B]/60 mb-8 leading-relaxed">
                  Remplissez le formulaire, nous vous repondons dans les 24 heures ouvrables.
                </p>

                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div key="success"
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                      className="rounded-2xl p-10 text-center bg-emerald-50 border border-emerald-100">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                      <p className="text-emerald-700 font-semibold text-lg mb-2 font-montserrat">Message envoye !</p>
                      <p className="text-emerald-600/80 text-sm font-montserrat">Notre equipe vous contactera sous 24 heures.</p>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-semibold text-[#0A0A0B]/80 font-montserrat" htmlFor="name">
                            Nom complet <span className="text-[#C8A96E]">*</span>
                          </label>
                          <input id="name" {...register("name")} placeholder="Votre nom"
                            className="input-premium" />
                          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-semibold text-[#0A0A0B]/80 font-montserrat" htmlFor="email">
                            Adresse email <span className="text-[#C8A96E]">*</span>
                          </label>
                          <input id="email" {...register("email")} type="email" placeholder="vous@domaine.com"
                            className="input-premium" />
                          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-[#0A0A0B]/80 font-montserrat" htmlFor="phone">
                          Telephone <span className="text-[#0A0A0B]/35 font-normal">(optionnel)</span>
                        </label>
                        <input id="phone" {...register("phone")} type="tel" placeholder="+212 6 XX XX XX XX"
                          className="input-premium" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-[#0A0A0B]/80 font-montserrat" htmlFor="subject">
                          Objet <span className="text-[#C8A96E]">*</span>
                        </label>
                        <input id="subject" {...register("subject")} placeholder="Ex : Projet evenementiel 2025"
                          className="input-premium" />
                        {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-[#0A0A0B]/80 font-montserrat" htmlFor="message">
                          Message <span className="text-[#C8A96E]">*</span>
                        </label>
                        <textarea id="message" {...register("message")} rows={5} placeholder="Decrivez votre projet..."
                          className="input-premium resize-none" />
                        {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
                      </div>

                      {error && (
                        <p className="text-red-600 text-sm px-4 py-3 rounded-xl bg-red-50 border border-red-100">{error}</p>
                      )}

                      <motion.button type="submit" disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="btn-gold w-full justify-center disabled:opacity-60">
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