/**
 * IntelligencePricing - Sélection et paiement du rapport Intelligence
 * CDC BMI 360: Discover -> Intelligence -> Transform
 * Méthodes supportées: CMI (carte bancaire MAR), PayPal, Virement bancaire
 */
import { useState, useRef, useEffect } from 'react';
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
  respondentEmail?: string;
  respondentName?: string;
  onSuccess: (data: {
    globalScore: number;
    maturityLevel: number;
    pillarScores: Record<string, number>;
    aiReport: unknown;
  }) => void;
  onBack: () => void;
}

type PaymentMethod = 'cmi' | 'paypal' | 'virement';

const WHAT_YOU_GET = [
  { icon: '🧠', label: 'Analyse IA complète de tous vos piliers' },
  { icon: '📊', label: 'Diagnostic expert personnalisé par dimension' },
  { icon: '🎯', label: 'Plan d\'action 90 jours priorisé' },
  { icon: '⚡', label: 'Quick wins à mettre en place immédiatement' },
  { icon: '🔍', label: 'Identification de vos risques clés' },
  { icon: '📈', label: 'Benchmark sectoriel et recommandations stratégiques' },
  { icon: '🚀', label: 'Accès au programme Transform (sur devis)' },
];

const PAYMENT_METHODS: Array<{ id: PaymentMethod; icon: string; label: string; desc: string }> = [
  { id: 'cmi',      icon: '💳', label: 'Carte bancaire',  desc: 'CMI · 3D Secure · Maroc' },
  { id: 'paypal',   icon: '🅿️', label: 'PayPal',          desc: 'Paiement international' },
  { id: 'virement', icon: '🏦', label: 'Virement',         desc: 'Sous 24-48h' },
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
  respondentEmail,
  respondentName,
  onSuccess,
  onBack,
}: IntelligencePricingProps) {
  const [email, setEmail]               = useState(respondentEmail ?? '');
  const [name, setName]                 = useState(respondentName ?? '');
  const [method, setMethod]             = useState<PaymentMethod>('cmi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError]               = useState('');

  // CMI: auto-submit d'un formulaire caché après réception des champs
  const cmiFormRef = useRef<HTMLFormElement>(null);
  const [cmiFormData, setCmiFormData] = useState<{
    gatewayUrl: string;
    fields: Record<string, string>;
  } | null>(null);

  useEffect(() => {
    if (cmiFormData && cmiFormRef.current) {
      cmiFormRef.current.submit();
    }
  }, [cmiFormData]);

  const priceTTC = Math.round(intelligencePrice * 1.20);
  const virRef = `INT-${toolId.toUpperCase().slice(0, 3)}-${resultId.slice(0, 6).toUpperCase()}`;

  const validateForm = () => {
    if (!email.trim() || !name.trim()) {
      setError('Veuillez renseigner votre nom et email.');
      return false;
    }
    return true;
  };

  /** CMI - initier + soumettre le formulaire passerelle */
  const handleCMI = async () => {
    if (!validateForm()) return;
    setError('');
    setIsProcessing(true);
    try {
      const res = await fetch('/api/scoring/intelligence-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scoringResultId: resultId,
          toolId,
          email,
          companyName,
          method: 'cmi',
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Erreur ${res.status}`);
      }
      const data = await res.json();
      // Déclenche l'auto-submit dans useEffect
      setCmiFormData({ gatewayUrl: data.gatewayUrl, fields: data.formFields });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'initiation CMI.');
      setIsProcessing(false);
    }
  };

  /** PayPal - initier + redirection vers la page d'approbation */
  const handlePayPal = async () => {
    if (!validateForm()) return;
    setError('');
    setIsProcessing(true);
    try {
      const res = await fetch('/api/scoring/intelligence-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scoringResultId: resultId,
          toolId,
          email,
          companyName,
          method: 'paypal',
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Erreur ${res.status}`);
      }
      const data = await res.json();
      window.location.href = data.approvalUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'initiation PayPal.');
      setIsProcessing(false);
    }
  };

  /** Mode test - simulation sans transaction réelle */
  const handleSimulatePayment = async () => {
    if (!validateForm()) return;
    setError('');
    setIsSimulating(true);
    try {
      const res = await fetch(`/api/scoring/${resultId}/simulate-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: enrichedAnswers,
          email,
          respondentName: name,
          companyName,
          sector,
          companySize,
          toolId, // fallback si resultId est local
        }),
      });
      if (!res.ok) {
        const contentType = res.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) {
          throw new Error(`Erreur serveur (${res.status}). Vérifiez votre connexion.`);
        }
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Erreur ${res.status}`);
      }
      const data = await res.json();
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

  const handlePay = () => {
    if (method === 'cmi')    handleCMI();
    else if (method === 'paypal') handlePayPal();
    // Virement: pas de bouton pay, uniquement les coordonnées
  };

  return (
    <div className="space-y-6">
      {/* Formulaire caché pour CMI (auto-soumis) */}
      {cmiFormData && (
        <form ref={cmiFormRef} method="POST" action={cmiFormData.gatewayUrl} style={{ display: 'none' }}>
          {Object.entries(cmiFormData.fields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
        </form>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ backgroundColor: `${toolColor}20`, color: toolColor }}>
          Intelligence · {toolLabel}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Votre rapport Intelligence vous attend
        </h2>
        <p className="text-gray-400 text-sm">
          Un rapport IA complet, personnalisé et actionnable - livré en moins de 2 minutes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ce que vous obtenez */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 bg-gray-900/50 border border-gray-800">
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

        {/* Panneau paiement */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 border space-y-5"
          style={{ borderColor: `${toolColor}40`, background: `linear-gradient(135deg, ${toolColor}10, transparent)` }}>

          {/* Prix */}
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-0.5">
              {intelligencePrice.toLocaleString('fr-MA')} MAD
              <span className="text-sm font-normal text-gray-500 ml-2">HT</span>
            </div>
            <div className="text-xs text-gray-500">
              Soit {priceTTC.toLocaleString('fr-MA')} MAD TTC (TVA 20%) · Paiement sécurisé
            </div>
          </div>

          {/* Champs communs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nom complet *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Prénom Nom" required disabled={isProcessing}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email professionnel *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="vous@entreprise.ma" required disabled={isProcessing}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none" />
            </div>
          </div>

          {/* Sélecteur de méthode */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Méthode de paiement</p>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map(m => (
                <button key={m.id} type="button" onClick={() => setMethod(m.id)}
                  disabled={isProcessing}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs transition-all ${
                    method === m.id
                      ? 'border-current font-semibold'
                      : 'border-gray-700 text-gray-500 hover:border-gray-500'
                  }`}
                  style={method === m.id ? { borderColor: toolColor, color: toolColor, backgroundColor: `${toolColor}15` } : {}}>
                  <span className="text-lg">{m.icon}</span>
                  <span>{m.label}</span>
                  <span className="text-[10px] opacity-60 hidden sm:block">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contenu selon méthode */}
          {method === 'virement' ? (
            <div className="rounded-xl p-4 bg-gray-900/60 border border-gray-700 space-y-2">
              <p className="text-xs font-semibold text-gray-300 mb-2">Coordonnées bancaires</p>
              <div className="text-xs space-y-1.5 text-gray-400">
                <p>Bénéficiaire : <span className="text-white">Epitaphe360 SARL</span></p>
                <p>Montant : <span className="text-white">{priceTTC.toLocaleString('fr-MA')} MAD TTC</span></p>
                <p>Référence : <span className="font-mono text-white">{virRef}</span></p>
                <p className="text-gray-500 text-[10px] pt-1">
                  Votre rapport sera généré dès réception du virement (24-48h). Indiquez impérativement la référence.
                </p>
              </div>
            </div>
          ) : (
            <>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="button" onClick={handlePay} disabled={isProcessing || isSimulating}
                className="w-full py-4 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: toolColor }}>
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Redirection vers la passerelle...
                  </span>
                ) : method === 'cmi' ? (
                  `💳 Payer ${priceTTC.toLocaleString('fr-MA')} MAD TTC par carte`
                ) : (
                  `🅿️ Payer ${priceTTC.toLocaleString('fr-MA')} MAD TTC via PayPal`
                )}
              </button>
              <p className="text-xs text-gray-600 text-center">
                {method === 'cmi'
                  ? 'Redirection sécurisée vers la passerelle CMI (3D Secure)'
                  : 'Redirection vers PayPal - retour automatique après paiement'}
              </p>
            </>
          )}

          {error && method === 'virement' && <p className="text-red-400 text-xs">{error}</p>}

          {/* --- Bouton simulation paiement (TEST) ------------------- */}
          <div className="pt-3 border-t border-dashed border-yellow-600/40">
            <p className="text-xs text-yellow-500/80 font-semibold mb-2 flex items-center gap-1">
              <span>⚡</span> Mode test
            </p>
            <button type="button" disabled={isProcessing || isSimulating}
              onClick={handleSimulatePayment}
              className="w-full py-3 rounded-xl text-sm font-bold border border-yellow-500/50 text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSimulating ? (
                <>
                  <span className="w-4 h-4 border-2 border-yellow-400/40 border-t-yellow-400 rounded-full animate-spin" />
                  Simulation en cours...
                </>
              ) : (
                <>🧪 Simuler le paiement (TEST)</>
              )}
            </button>
            <p className="text-xs text-yellow-600/60 text-center mt-1.5">
              Génère un paiement factice + facture + rapport IA sans transaction réelle
            </p>
          </div>
        </motion.div>
      </div>

      <button onClick={onBack} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
        ← Retour aux résultats Discover
      </button>
    </div>
  );
}
