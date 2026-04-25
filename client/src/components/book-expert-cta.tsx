/**
 * BookExpertCTA — Formulaire interne de demande de RDV expert (Transform).
 *
 * Branché sur POST /api/scoring/:id/request-expert (server/scoring-routes.ts).
 * Aucun outil tiers (Cal.com / Calendly) — l'équipe est notifiée par email
 * et reprend contact sous 24 h ouvrées.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookExpertCTAProps {
  /** UUID du résultat de scoring. Si absent, l'API utilise "none". */
  scoringResultId?: string;
  toolId?: string;
  toolColor?: string;
  /** Score global (0-100) — affiché à l'expert dans la notification interne. */
  globalScore?: number;
}

type Channel = 'visio' | 'telephone' | 'presentiel';
type Slot = 'matin' | 'apres-midi' | 'soir' | 'flexible';

interface FormState {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyName: string;
  jobTitle: string;
  companySize: string;
  message: string;
  preferredSlot: Slot;
  preferredChannel: Channel;
}

const INITIAL: FormState = {
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  companyName: '',
  jobTitle: '',
  companySize: '',
  message: '',
  preferredSlot: 'flexible',
  preferredChannel: 'visio',
};

export function BookExpertCTA({
  scoringResultId,
  toolId,
  toolColor = '#C8A96E',
  globalScore,
}: BookExpertCTAProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.contactName.trim() || form.contactName.trim().length < 2) {
      setError('Merci d\'indiquer votre nom complet.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      setError('Merci d\'indiquer une adresse email valide.');
      return;
    }

    setSubmitting(true);
    try {
      const id = scoringResultId ?? 'none';
      const res = await fetch(`/api/scoring/${id}/request-expert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error ?? 'Une erreur est survenue.');
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur réseau.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-8 text-center border border-[#C8A96E]/40 bg-gradient-to-br from-[#C8A96E]/15 to-[#C8A96E]/5"
      >
        <div className="text-4xl mb-3">✓</div>
        <h3 className="text-xl font-bold text-white mb-2">
          Demande reçue — merci !
        </h3>
        <p className="text-gray-300 text-sm max-w-md mx-auto">
          Un expert Transform™ d'Epitaphe&nbsp;360 vous contacte sous 24&nbsp;h
          ouvrées sur <span className="text-white font-medium">{form.contactEmail}</span>.
        </p>
        <p className="text-xs text-gray-500 mt-4">
          Aucun engagement à ce stade — premier échange découverte gratuit.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="rounded-2xl p-8 border"
      style={{
        background: `linear-gradient(135deg, ${toolColor}18, ${toolColor}06)`,
        borderColor: `${toolColor}40`,
      }}
    >
      <div className="text-center mb-6">
        <div className="text-3xl mb-3">🎯</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Activez vos résultats avec un expert humain
        </h3>
        <p className="text-gray-300 text-sm max-w-xl mx-auto">
          Votre rapport Intelligence™ a identifié vos leviers prioritaires.
          Un consultant Epitaphe&nbsp;360 vous propose un plan d'activation
          sur mesure (Transform™) — premier échange découverte gratuit.
        </p>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {!open ? (
          <motion.div
            key="cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-block px-8 py-4 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ backgroundColor: toolColor }}
            >
              Demander un RDV avec un Expert Transform™ →
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Sans engagement · Réponse sous 24&nbsp;h ouvrées
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={submit}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Nom complet *"
                value={form.contactName}
                onChange={v => update('contactName', v)}
                placeholder="Prénom Nom"
                required
              />
              <Field
                label="Email professionnel *"
                type="email"
                value={form.contactEmail}
                onChange={v => update('contactEmail', v)}
                placeholder="vous@entreprise.ma"
                required
              />
              <Field
                label="Téléphone"
                value={form.contactPhone}
                onChange={v => update('contactPhone', v)}
                placeholder="+212 6 ..."
              />
              <Field
                label="Entreprise"
                value={form.companyName}
                onChange={v => update('companyName', v)}
                placeholder="Nom de votre entreprise"
              />
              <Field
                label="Fonction"
                value={form.jobTitle}
                onChange={v => update('jobTitle', v)}
                placeholder="DRH, DirCom, CEO..."
              />
              <SelectField
                label="Taille entreprise"
                value={form.companySize}
                onChange={v => update('companySize', v)}
                options={[
                  { value: '', label: '— Indifférent —' },
                  { value: '1-10', label: '1-10 collaborateurs' },
                  { value: '11-50', label: '11-50 collaborateurs' },
                  { value: '51-250', label: '51-250 collaborateurs' },
                  { value: '251-1000', label: '251-1 000 collaborateurs' },
                  { value: '1000+', label: 'Plus de 1 000 collaborateurs' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Format préféré"
                value={form.preferredChannel}
                onChange={v => update('preferredChannel', v as Channel)}
                options={[
                  { value: 'visio', label: 'Visio (Teams / Meet)' },
                  { value: 'telephone', label: 'Téléphone' },
                  { value: 'presentiel', label: 'Présentiel (Casablanca)' },
                ]}
              />
              <SelectField
                label="Créneau préféré"
                value={form.preferredSlot}
                onChange={v => update('preferredSlot', v as Slot)}
                options={[
                  { value: 'flexible', label: 'Flexible' },
                  { value: 'matin', label: 'Matin (9h–12h)' },
                  { value: 'apres-midi', label: 'Après-midi (14h–17h)' },
                  { value: 'soir', label: 'Soir (17h–19h)' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Message (optionnel)
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={e => update('message', e.target.value)}
                placeholder="Vos enjeux, contraintes, attentes..."
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#C8A96E] focus:outline-none"
                maxLength={2000}
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
                disabled={submitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-lg text-sm font-bold text-black transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: toolColor }}
              >
                {submitting ? 'Envoi…' : 'Envoyer ma demande'}
              </button>
            </div>

            <p className="text-[11px] text-gray-600 text-center pt-2">
              {scoringResultId && toolId
                ? `Votre score (${globalScore ?? '—'}/100) sur ${toolId} sera transmis à l'expert.`
                : 'Vos coordonnées sont uniquement transmises à notre équipe Transform.'}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#C8A96E] focus:outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white focus:border-[#C8A96E] focus:outline-none"
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-black text-white">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
