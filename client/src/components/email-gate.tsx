import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ChevronRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const emailGateSchema = z.object({
  email: z.string().email('Format email invalide'),
  name: z.string().min(2, 'Votre nom est requis'),
});

export type EmailGateData = z.infer<typeof emailGateSchema>;

interface EmailGateProps {
  toolName: string;
  toolColor: string;
  onUnlock: (data: EmailGateData) => void;
  isLoading?: boolean;
}

export function EmailGate({ toolName, toolColor, onUnlock, isLoading }: EmailGateProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EmailGateData>({
    resolver: zodResolver(emailGateSchema),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur-xl p-8"
      style={{ boxShadow: `0 0 40px ${toolColor}15` }}
    >
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, transparent, ${toolColor}, transparent)` }} />
      
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4 border" style={{ borderColor: `${toolColor}30` }}>
          <Lock className="w-8 h-8" style={{ color: toolColor }} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Analyse terminée
        </h3>
        <p className="text-sm text-gray-400">
          Entrez votre email pour accéder à votre diagnostic détaillé et l'espace VIP.
        </p>
      </div>

      <form onSubmit={handleSubmit(onUnlock)} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1 block">
            Nom complet
          </label>
          <input
            {...register('name')}
            className={`w-full bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2`}
            style={{ '--tw-ring-color': toolColor } as React.CSSProperties}
            placeholder="Ex: Jean Dupont"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
           <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1 block">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              {...register('email')}
              className={`w-full bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2`}
              style={{ '--tw-ring-color': toolColor } as React.CSSProperties}
              placeholder="votre@email.com"
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-white font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: toolColor }}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Voir mes résultats'}
          {!isLoading && <ChevronRight className="w-5 h-5" />}
        </button>
      </form>
      <p className="text-[10px] text-gray-500 text-center mt-6">
        Vos données sont sécurisées. En continuant, vous créez votre Espace Client Epitaphe360.
      </p>
    </motion.div>
  );
}