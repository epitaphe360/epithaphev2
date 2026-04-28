import { useSearch } from 'wouter';
import { motion } from 'framer-motion';
import { PageMeta } from '@/components/seo/page-meta';

export default function PaiementEchec() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const reason = params.get('reason') ?? '';
  const toolId = params.get('tool')   ?? '';

  const reasonLabel: Record<string, string> = {
    capture_failed: 'La capture du paiement a échoué.',
    missing_token:  'Token de paiement manquant.',
    not_found:      'Paiement introuvable.',
    server_error:   'Une erreur serveur est survenue.',
    cancelled:      'Le paiement a été annulé.',
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 py-20">
      <PageMeta
        title="Paiement non abouti"
        description="Votre paiement n'a pas pu être finalisé. Aucun montant n'a été débité. Contactez notre équipe pour assistance."
        canonicalPath="/paiement-echec"
        noIndex
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full text-center space-y-6"
      >
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto border border-red-500/30">
          <span className="text-3xl text-red-400 font-bold">X</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Paiement non abouti</h1>
        <p className="text-gray-400 text-sm">
          {reasonLabel[reason] ?? "Votre paiement n'a pas pu être finalisé."}
        </p>
        <p className="text-gray-500 text-xs">
          Aucun montant n'a été débité. Vous pouvez réessayer ou contacter notre équipe.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          {toolId && (
            <a
              href={`/outils/${toolId}`}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all"
            >
              Réessayer le paiement
            </a>
          )}
          <a
            href="/contact"
            className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:border-gray-500 transition-all"
          >
            Contacter le support
          </a>
        </div>
      </motion.div>
    </div>
  );
}
