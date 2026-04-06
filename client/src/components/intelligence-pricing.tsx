/**
 * IntelligencePricing — Sélection et paiement du rapport Intelligence™
 * CDC BMI 360™ : Discover → Intelligence → Transform
 */
import { useState } from 'react';
import { motion } from 'framer-motion';

interface EnrichedAnswer {
  value: number;
  pillar: string;
  weight: number;
}

interface IntelligencePricingProps {
  toolId: string;
  toolLabel: string;
  toolColor: string;
  intelligencePrice: number;
  resultId: string;
  enrichedAnswers: Record<string, EnrichedAnswer>;
  companyName?: string;
  sector?: string;
  companySize?: string;
  onSuccess: (data: {
    globalScore: number;
    maturityLevel: number;
    pillarScores: Record<string, number>;
    aiReport: unknown;
  }) => void;
  onBack: () => void;
}

const WHAT_YOU_GET = [
  { icon: '🧠', label: 'Analyse IA complète de tous vos pilliers' },
  { icon: '📊', label: 'Diagnostic expert personnalisé par dimension' },
  { icon: '🎯', label: 'Plan d\'action 90 jours prioritisé' },
  { icon: '⚡', label: 'Quick wins à mettre en place immédiatement' },
  { icon: '🔍', label: 'Identification de vos risques clés' },
  { icon: '📈', label: 'Benchmark sectoriel et recommandations stratégiques' },
  { icon: '🚀', label: 'Accès au programme Transform (sur devis)' },
];

export function IntelligencePricing({
  toolId,
  toolLabel,
  toolColor,
  intelligencePrice,
  resultId,
  enrichedAnswers,
  companyName,
  sector,
  companySize,
  onSuccess,
  onBack,
}: IntelligencePricingProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      setError('Veuillez renseigner votre nom et email.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/scoring/${resultId}/unlock-intelligence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: enrichedAnswers,
          companyName,
          sector,
          companySize,
          email,
          respondentName: name,
          voiceType: 'direction',
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error ?? `Erreur ${response.status}`);
      }

      const data = await response.json();
      onSuccess({
        globalScore: data.globalScore,
        maturityLevel: data.maturityLevel,
        pillarScores: data.pillarScores,
        aiReport: data.aiReport,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!email.trim() || !name.trim()) {
      setError('Veuillez renseigner votre nom et email pour simuler le paiement.');
      return;
    }
    setError('');
    setIsSimulating(true);

    try {
      const response = await fetch(`/api/scoring/${resultId}/simulate-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: enrichedAnswers,
          email,
          respondentName: name,
          companyName,
          sector,
          companySize,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error ?? `Erreur ${response.status}`);
      }

      const data = await response.json();
      onSuccess({
        globalScore:   data.globalScore,
        maturityLevel: data.maturityLevel,
        pillarScores:  data.pillarScores,
        aiReport:      data.aiReport,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation échouée. Réessayez.');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ backgroundColor: `${toolColor}20`, color: toolColor }}>
          Intelligence™ · {toolLabel}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Votre rapport Intelligence™ vous attend
        </h2>
        <p className="text-gray-400 text-sm">
          Un rapport IA complet, personnalisé et actionnable — livré en moins de 2 minutes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ce que vous obtenez */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 bg-gray-900/50 border border-gray-800"
        >
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Ce que vous obtenez
          </h3>
          <ul className="space-y-3">
            {WHAT_YOU_GET.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="shrink-0 text-base">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Formulaire paiement */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 border"
          style={{ borderColor: `${toolColor}40`, background: `linear-gradient(135deg, ${toolColor}10, transparent)` }}
        >
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-white mb-1">
              {intelligencePrice.toLocaleString('fr-MA')} MAD
            </div>
            <div className="text-xs text-gray-500">Hors taxes · Paiement sécurisé</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Votre nom complet *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Prénom Nom"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-opacity-100"
                style={{ '--tw-ring-color': toolColor } as React.CSSProperties}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Votre email professionnel *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@entreprise.ma"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none"
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || isSimulating}
              className="w-full py-4 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: toolColor }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Génération du rapport IA en cours…
                </span>
              ) : (
                `Générer mon rapport Intelligence™ →`
              )}
            </button>
            <p className="text-xs text-gray-600 text-center">
              Votre rapport sera envoyé par email. Le paiement sera confirmé par notre équipe sous 24h.
            </p>
          </form>

          {/* ─── Bouton simulation paiement (TEST) ─────────────────── */}
          <div className="mt-4 pt-4 border-t border-dashed border-yellow-600/40">
            <p className="text-xs text-yellow-500/80 font-semibold mb-2 flex items-center gap-1">
              <span>⚡</span> Mode test
            </p>
            <button
              type="button"
              disabled={isLoading || isSimulating}
              onClick={handleSimulatePayment}
              className="w-full py-3 rounded-xl text-sm font-bold border border-yellow-500/50 text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSimulating ? (
                <>
                  <span className="w-4 h-4 border-2 border-yellow-400/40 border-t-yellow-400 rounded-full animate-spin" />
                  Simulation en cours…
                </>
              ) : (
                <>🧪 Simuler le paiement (TEST)</>
              )}
            </button>
            <p className="text-xs text-yellow-600/60 text-center mt-1.5">
              Génère un paiement factice + facture + rapport IA sans transaction réelle
            </p>
          </div>

          {/* Instructions virement */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 mb-2 font-medium">Virement bancaire :</p>
            <div className="text-xs text-gray-600 space-y-0.5">
              <p>Bénéficiaire : <span className="text-gray-400">Epitaphe360 SARL</span></p>
              <p>Montant : <span className="text-gray-400">{intelligencePrice.toLocaleString('fr-MA')} MAD</span></p>
              <p>Référence : <span className="text-gray-400">INT-{toolId.toUpperCase().slice(0, 3)}-{resultId.slice(0, 6).toUpperCase()}</span></p>
            </div>
          </div>
        </motion.div>
      </div>

      <button
        onClick={onBack}
        className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
      >
        ← Retour aux résultats Discover
      </button>
    </div>
  );
}
