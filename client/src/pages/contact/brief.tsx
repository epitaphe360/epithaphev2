import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, Send, Building2, Briefcase, FileText, User } from "lucide-react";
import { PageMeta } from "@/components/seo/page-meta";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { RevealSection } from "@/components/reveal-section";
import axios from "axios";
import { useBriefConfig } from "@/hooks/useToolQuestions";

/* ─── Validation email professionnel ────────────────────── */
const FREE_DOMAINS = ["gmail", "yahoo", "hotmail", "outlook", "yopmail", "protonmail", "icloud", "live"];
const isProfessionalEmail = (email: string) => {
  const domain = email.split("@")[1]?.split(".")[0]?.toLowerCase() ?? "";
  return !FREE_DOMAINS.includes(domain);
};

/* ─── Schémas Zod par étape ─────────────────────────────── */
const step1Schema = z.object({
  sector: z.string().min(1, "Veuillez sélectionner un secteur"),
});

const step2Schema = z.object({
  needs: z.array(z.string()).min(1, "Sélectionnez au moins un besoin"),
});

const step3Schema = z.object({
  description: z.string().min(30, "Décrivez votre projet en au moins 30 caractères"),
  budget: z.string().min(1, "Veuillez indiquer votre budget"),
  timeline: z.string().min(1, "Veuillez indiquer votre délai"),
});

const step4Schema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName:  z.string().min(2, "Nom requis"),
  email:     z.string().email("Email invalide").refine(isProfessionalEmail, "Veuillez utiliser un email professionnel (pas Gmail, Yahoo, etc.)"),
  phone:     z.string().min(8, "Numéro de téléphone requis"),
  company:   z.string().min(2, "Nom de l'entreprise requis"),
});

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type Step3 = z.infer<typeof step3Schema>;
type Step4 = z.infer<typeof step4Schema>;

/* ─── Data ──────────────────────────────────────────────── */
const SECTORS = [
  "Industrie & BTP", "Finance & Assurance", "Télécommunications",
  "Grande Distribution", "Santé & Pharma", "Énergie & Environnement",
  "Immobilier", "Éducation", "Tourisme & Hôtellerie", "Agroalimentaire",
  "Automobile", "Administration publique", "Autre",
];

const NEEDS = [
  { value: "evenement", label: "Organisation d'événement" },
  { value: "stand", label: "Stand salon/exposition" },
  { value: "signaletique", label: "Signalétique" },
  { value: "impression", label: "Impression grand format" },
  { value: "marque_employeur", label: "Marque employeur" },
  { value: "communication_qhse", label: "Communication QHSE" },
  { value: "experience_client", label: "Expérience client" },
  { value: "menuiserie", label: "Menuiserie & décor" },
  { value: "amenagement", label: "Aménagement d'espace" },
  { value: "video", label: "Production vidéo" },
  { value: "autre", label: "Autre besoin" },
];

const BUDGETS = [
  "Moins de 50 000 MAD",
  "50 000 – 150 000 MAD",
  "150 000 – 500 000 MAD",
  "500 000 – 1 000 000 MAD",
  "Plus de 1 000 000 MAD",
];

const TIMELINES = [
  "Moins de 2 semaines (urgent)",
  "2 à 4 semaines",
  "1 à 3 mois",
  "3 à 6 mois",
  "Plus de 6 mois",
];

/* ─── Composants UI ─────────────────────────────────────── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  const steps = [
    { label: "Secteur", icon: <Building2 className="w-4 h-4" /> },
    { label: "Besoins", icon: <Briefcase className="w-4 h-4" /> },
    { label: "Projet", icon: <FileText className="w-4 h-4" /> },
    { label: "Contact", icon: <User className="w-4 h-4" /> },
  ];
  return (
    <div className="flex items-center gap-0 w-full max-w-lg mx-auto mb-10">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 transition-all duration-300 text-sm font-bold
            ${i < current ? "bg-primary text-primary-foreground" : i === current ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`}>
            {i < current ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
          </div>
          <div className={`hidden sm:block text-xs font-medium mt-1 text-center ml-1 mr-2 ${i === current ? "text-primary" : "text-muted-foreground"}`}>
            {step.label}
          </div>
          {i < total - 1 && (
            <div className={`flex-1 h-0.5 transition-all duration-500 ${i < current ? "bg-primary" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Page principale ───────────────────────────────────── */
export default function BriefPage() {
  const config = useBriefConfig({ sectors: SECTORS, needs: NEEDS, budgets: BUDGETS, timelines: TIMELINES });
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Step1 & Step2 & Step3 & Step4>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Step 1 */
  const form1 = useForm<Step1>({ resolver: zodResolver(step1Schema), defaultValues: { sector: formData.sector ?? "" } });
  /* Step 2 */
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(formData.needs ?? []);
  const [needsError, setNeedsError] = useState("");
  /* Step 3 */
  const form3 = useForm<Step3>({ resolver: zodResolver(step3Schema), defaultValues: { description: formData.description ?? "", budget: formData.budget ?? "", timeline: formData.timeline ?? "" } });
  /* Step 4 */
  const form4 = useForm<Step4>({ resolver: zodResolver(step4Schema), defaultValues: { firstName: formData.firstName ?? "", lastName: formData.lastName ?? "", email: formData.email ?? "", phone: formData.phone ?? "", company: formData.company ?? "" } });

  const next1 = form1.handleSubmit((data) => { setFormData((p) => ({ ...p, ...data })); setStep(1); });
  const next2 = () => {
    if (selectedNeeds.length === 0) { setNeedsError("Sélectionnez au moins un besoin"); return; }
    setFormData((p) => ({ ...p, needs: selectedNeeds }));
    setStep(2);
  };
  const next3 = form3.handleSubmit((data) => { setFormData((p) => ({ ...p, ...data })); setStep(3); });

  const submit = form4.handleSubmit(async (data) => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = { ...formData, ...data };
      await axios.post("/api/leads", {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        company: data.company,
        message: `Secteur: ${formData.sector}\nBesoins: ${(formData.needs ?? []).join(", ")}\nDescription: ${formData.description}\nBudget: ${formData.budget}\nDélai: ${formData.timeline}`,
        sector: formData.sector,
        source: "brief_form",
        metadata: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer ou nous appeler directement.");
    } finally {
      setSubmitting(false);
    }
  });

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
    exit:  (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2 } }),
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Déposer un Brief — Epitaphe 360"
        description="Décrivez votre projet en 4 étapes et recevez une proposition créative personnalisée sous 48h. Secteur, besoins, budget et coordonnées."
        canonicalPath="/contact/brief"
        noIndex
      />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* En-tête */}
          <RevealSection className="text-center mb-10">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              Déposer un brief
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Parlez-nous de votre projet</h1>
            <p className="text-muted-foreground">Répondez à 4 questions rapides et recevez une proposition créative sous 48h.</p>
          </RevealSection>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-2xl p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Brief envoyé avec succès !</h2>
              <p className="text-muted-foreground mb-6">Notre équipe créative reviendra vers vous sous <strong>48 heures ouvrables</strong> avec une proposition personnalisée.</p>
              <p className="text-sm text-muted-foreground">📧 Un email de confirmation vous a été envoyé à <strong>{formData.email}</strong></p>
            </motion.div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 md:p-10">
              <StepIndicator current={step} total={4} />

              <AnimatePresence mode="wait" custom={1}>
                {step === 0 && (
                  <motion.div key="step0" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit">
                    <h2 className="text-xl font-bold text-foreground mb-6">Quel est votre secteur d'activité ?</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
                      {config.sectors.map((sector) => (
                        <label key={sector} className={`cursor-pointer flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          form1.watch("sector") === sector
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                        }`}>
                          <input type="radio" className="sr-only" value={sector} {...form1.register("sector")} />
                          {sector}
                        </label>
                      ))}
                    </div>
                    {form1.formState.errors.sector && (
                      <p className="text-destructive text-sm mb-4">{form1.formState.errors.sector.message}</p>
                    )}
                    <button onClick={next1} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                      Suivant <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="step1" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit">
                    <h2 className="text-xl font-bold text-foreground mb-2">Quels sont vos besoins ?</h2>
                    <p className="text-sm text-muted-foreground mb-6">Sélectionnez tout ce qui s'applique</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                      {config.needs.map((need) => {
                        const checked = selectedNeeds.includes(need.value);
                        return (
                          <label key={need.value} className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                            checked ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/50"
                          }`}>
                            <input type="checkbox" className="sr-only" checked={checked} onChange={() => {
                              setNeedsError("");
                              setSelectedNeeds((p) => checked ? p.filter((v) => v !== need.value) : [...p, need.value]);
                            }} />
                            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-all ${checked ? "bg-primary border-primary" : "border-border"}`}>
                              {checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                            {need.label}
                          </label>
                        );
                      })}
                    </div>
                    {needsError && <p className="text-destructive text-sm mb-4">{needsError}</p>}
                    <div className="flex gap-3">
                      <button onClick={() => setStep(0)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-foreground font-semibold hover:border-primary transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Retour
                      </button>
                      <button onClick={next2} className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                        Suivant <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit">
                    <h2 className="text-xl font-bold text-foreground mb-6">Décrivez votre projet</h2>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Description du projet *</label>
                        <textarea {...form3.register("description")} rows={4} placeholder="Expliquez votre projet, vos objectifs, votre public cible..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none text-sm" />
                        {form3.formState.errors.description && <p className="text-destructive text-xs mt-1">{form3.formState.errors.description.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Budget estimé *</label>
                        <select {...form3.register("budget")} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm">
                          <option value="">Sélectionner...</option>
                          {config.budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                        {form3.formState.errors.budget && <p className="text-destructive text-xs mt-1">{form3.formState.errors.budget.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Délai souhaité *</label>
                        <select {...form3.register("timeline")} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm">
                          <option value="">Sélectionner...</option>
                          {config.timelines.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {form3.formState.errors.timeline && <p className="text-destructive text-xs mt-1">{form3.formState.errors.timeline.message}</p>}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-foreground font-semibold hover:border-primary transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Retour
                      </button>
                      <button onClick={next3} className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                        Suivant <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit">
                    <h2 className="text-xl font-bold text-foreground mb-2">Vos coordonnées</h2>
                    <p className="text-sm text-muted-foreground mb-6">Email professionnel requis (pas Gmail, Yahoo, etc.)</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Prénom *</label>
                        <input {...form4.register("firstName")} placeholder="Mohamed" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
                        {form4.formState.errors.firstName && <p className="text-destructive text-xs mt-1">{form4.formState.errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Nom *</label>
                        <input {...form4.register("lastName")} placeholder="Benali" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
                        {form4.formState.errors.lastName && <p className="text-destructive text-xs mt-1">{form4.formState.errors.lastName.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Email professionnel *</label>
                        <input {...form4.register("email")} type="email" placeholder="m.benali@votreentreprise.ma" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
                        {form4.formState.errors.email && <p className="text-destructive text-xs mt-1">{form4.formState.errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Téléphone *</label>
                        <input {...form4.register("phone")} type="tel" placeholder="+212 6 XX XX XX XX" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
                        {form4.formState.errors.phone && <p className="text-destructive text-xs mt-1">{form4.formState.errors.phone.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Entreprise *</label>
                        <input {...form4.register("company")} placeholder="Nom de votre entreprise" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
                        {form4.formState.errors.company && <p className="text-destructive text-xs mt-1">{form4.formState.errors.company.message}</p>}
                      </div>
                    </div>
                    {error && <p className="text-destructive text-sm mb-4 bg-destructive/10 px-4 py-3 rounded-xl">{error}</p>}
                    <div className="flex gap-3">
                      <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-foreground font-semibold hover:border-primary transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Retour
                      </button>
                      <motion.button
                        onClick={submit}
                        disabled={submitting}
                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                      >
                        {submitting ? "Envoi en cours..." : (<><Send className="w-4 h-4" /> Envoyer mon brief</>)}
                      </motion.button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Vos données sont traitées conformément à notre politique de confidentialité. Réponse garantie sous 48h.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
