import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at top, #0d0120 0%, #000005 70%)' }}>
      <PageMeta
        title="Contact — Epitaphe 360"
        description="Contactez Epitaphe 360 pour votre projet événementiel, signalétique ou architecture de marque. Réponse sous 24h."
        canonicalPath="/contact"
      />
      <Navigation />
      <main>
        {/* ─── Hero dark ─── */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-[18rem] rounded-full opacity-25"
              style={{ background: 'radial-gradient(ellipse, #EC4899 0%, transparent 70%)', filter: 'blur(80px)' }} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <AnimatedSection variant="fadeUp">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] mb-5 font-montserrat"
                style={{ color: '#EC4899', background: 'rgba(236,72,153,0.1)', padding: '6px 18px', borderRadius: '100px', border: '1px solid rgba(236,72,153,0.25)' }}>
                Contact
              </span>
              <h1 className="font-cormorant text-5xl md:text-7xl font-bold text-white mb-5">
                Commençons à créer <br className="hidden sm:block" />
                <em style={{ color: '#EC4899', fontStyle: 'italic' }}>ensemble</em>
              </h1>
              <p className="text-white/55 text-lg max-w-xl mx-auto mb-8 font-montserrat">
                Un projet en tête ? Une question ? Notre équipe répond sous 24h.
              </p>
              <Link href="/contact/brief">
                <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm font-montserrat cursor-pointer"
                  style={{ background: '#EC4899', color: '#fff', boxShadow: '0 0 30px rgba(236,72,153,0.4)' }}>
                  Déposer un brief complet <ArrowRight className="w-4 h-4" />
                </motion.a>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* ─── Grid contact ─── */}
        <section className="pb-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Infos coordonnées */}
              <AnimatedSection variant="fadeLeft">
                <h2 className="font-cormorant text-3xl font-bold text-white mb-8">Nos coordonnées</h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {CONTACT_INFO.map((info, i) => (
                    <div key={i} className="flex gap-4 p-5 rounded-2xl transition-all duration-300"
                      style={{ background: 'rgba(13,15,30,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(236,72,153,0.15)', color: '#EC4899', border: '1px solid rgba(236,72,153,0.25)' }}>
                        {info.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm mb-1 font-montserrat">{info.title}</p>
                        {info.lines.map((l, j) => <p key={j} className="text-white/45 text-sm font-montserrat">{l}</p>)}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Map placeholder */}
                <div className="w-full h-52 rounded-2xl flex items-center justify-center text-white/30 text-sm font-montserrat"
                  style={{ background: 'rgba(13,15,30,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <MapPin className="w-5 h-5 mr-2 text-[#EC4899]" /> Carte interactive — Casablanca, Maroc
                </div>
              </AnimatedSection>

              {/* Formulaire rapide */}
              <AnimatedSection variant="fadeRight">
                <h2 className="font-cormorant text-3xl font-bold text-white mb-8">Message rapide</h2>
                {sent ? (
                  <div className="rounded-2xl p-8 text-center"
                    style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
                    <p className="text-green-400 font-semibold text-lg mb-2 font-montserrat">Message envoyé !</p>
                    <p className="text-green-500/70 text-sm font-montserrat">Notre équipe vous contactera sous 24 heures.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <input {...register("name")} placeholder="Votre nom *"
                          className="w-full px-4 py-3 rounded-xl text-sm font-montserrat outline-none transition-all"
                          style={{ background: 'rgba(13,15,30,0.9)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                          onFocus={e => (e.target.style.border = '1px solid rgba(236,72,153,0.5)')}
                          onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
                        />
                        {errors.name && <p className="text-[#EC4899] text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <input {...register("email")} type="email" placeholder="Email *"
                          className="w-full px-4 py-3 rounded-xl text-sm font-montserrat outline-none transition-all"
                          style={{ background: 'rgba(13,15,30,0.9)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                          onFocus={e => (e.target.style.border = '1px solid rgba(236,72,153,0.5)')}
                          onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
                        />
                        {errors.email && <p className="text-[#EC4899] text-xs mt-1">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div>
                      <input {...register("phone")} type="tel" placeholder="Téléphone (optionnel)"
                        className="w-full px-4 py-3 rounded-xl text-sm font-montserrat outline-none transition-all"
                        style={{ background: 'rgba(13,15,30,0.9)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                        onFocus={e => (e.target.style.border = '1px solid rgba(236,72,153,0.5)')}
                        onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
                      />
                    </div>
                    <div>
                      <input {...register("subject")} placeholder="Objet *"
                        className="w-full px-4 py-3 rounded-xl text-sm font-montserrat outline-none transition-all"
                        style={{ background: 'rgba(13,15,30,0.9)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                        onFocus={e => (e.target.style.border = '1px solid rgba(236,72,153,0.5)')}
                        onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
                      />
                      {errors.subject && <p className="text-[#EC4899] text-xs mt-1">{errors.subject.message}</p>}
                    </div>
                    <div>
                      <textarea {...register("message")} rows={5} placeholder="Votre message *" 
                        className="w-full px-4 py-3 rounded-xl text-sm font-montserrat outline-none transition-all resize-none"
                        style={{ background: 'rgba(13,15,30,0.9)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                        onFocus={e => (e.target.style.border = '1px solid rgba(236,72,153,0.5)')}
                        onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
                      />
                      {errors.message && <p className="text-[#EC4899] text-xs mt-1">{errors.message.message}</p>}
                    </div>
                    {error && (
                      <p className="text-[#EC4899] text-sm px-4 py-3 rounded-xl"
                        style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)' }}>
                        {error}
                      </p>
                    )}
                    <motion.button type="submit" disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold font-montserrat disabled:opacity-60"
                      style={{ background: '#EC4899', color: '#fff', boxShadow: '0 0 25px rgba(236,72,153,0.35)' }}>
                      {isSubmitting ? "Envoi..." : (<><Send className="w-4 h-4" /> Envoyer le message</>)}
                    </motion.button>
                  </form>
                )}
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
