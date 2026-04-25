import { useEffect, useState } from 'react';
import { useSearch } from 'wouter';
import { motion } from 'framer-motion';

interface ScoringResult {
  id: string;
  toolId: string;
  globalScore: number;
  maturityLevel: number;
  tier: string;
  aiReport: unknown;
  companyName?: string;
}

export default function PaiementSucces() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const resultId = params.get('result') ?? '';
  const toolId   = params.get('tool')   ?? '';
  const method   = params.get('method') ?? '';

  const [result, setResult]   = useState<ScoringResult | null>(null);
  const [loading, setLoading] = useState(!!resultId);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (!resultId) return;
    let tries = 0;
    const poll = async () => {
      try {
        const res = await fetch(`/api/scoring/result/${resultId}`);
        if (!res.ok) throw new Error('Résultat introuvable');
        const data = await res.json() as ScoringResult;
        if (data.tier === 'intelligence' || tries >= 10) {
          setResult(data);
          setLoading(false);
        } else {
          tries++;
          setTimeout(poll, 3000);
        }
      } catch {
        setFetchError('Impossible de charger votre rapport. Vérifiez votre email.');
        setLoading(false);
      }
    };
    poll();
  }, [resultId]);

  const toolPath = toolId ? `/outils/${toolId}` : '/outils';

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full text-center space-y-6"
      >
        {loading ? (
          <>
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-white">Génération de votre rapport en cours…</h1>
            <p className="text-gray-400 text-sm">
              Votre paiement a bien été reçu. Le rapport Intelligence™ est en cours de génération (2–3 min).
            </p>
          </>
        ) : fetchError ? (
          <>
            <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto border border-yellow-500/30">
              <span className="text-4xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Rapport en cours de préparation</h1>
            <p className="text-gray-400 text-sm">{fetchError}</p>
            <p className="text-gray-500 text-xs">Vous recevrez votre rapport par email sous peu.</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto border border-green-500/30">
              <span className="text-3xl text-green-400 font-bold">OK</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Paiement confirmé !</h1>
            <p className="text-gray-400 text-sm">
              {result?.tier === 'intelligence'
                ? "Votre rapport Intelligence™ est prêt. Une copie a également été envoyée par email."
                : "Votre paiement a été reçu. Votre rapport sera envoyé par email sous peu."}
            </p>
            {method && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs text-green-400">
                Paiement via {method === 'paypal' ? 'PayPal' : method === 'cmi' ? 'CMI (carte bancaire)' : 'Virement bancaire'}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              {result?.tier === 'intelligence' && toolId && (
                <a
                  href={`${toolPath}?result=${resultId}&paid=1`}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all"
                >
                  Voir mon rapport
                </a>
              )}
              <a
                href="/outils"
                className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:border-gray-500 transition-all"
              >
                Retour aux outils
              </a>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
