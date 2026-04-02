// ========================================
// Admin — Page réinitialisation mot de passe
// ========================================
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Loader2, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { post } from '../lib/api';

export const ResetPasswordPage: React.FC = () => {
  const [, setLocation] = useLocation();
  // Lire le token dans l'URL
  const token = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('token') ?? ''
    : '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas'); return; }
    if (!token) { setError('Token manquant ou invalide'); return; }
    setError('');
    setLoading(true);
    try {
      await post('/api/admin/reset-password', { token, password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0B1121] border border-[#1E293B] rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#E63946] to-[#F08080] rounded-xl flex items-center justify-center shadow-lg shadow-[#E63946]/30">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
          </div>

          {success ? (
            <div className="text-center">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Mot de passe réinitialisé</h2>
              <p className="text-slate-400 text-sm mb-6">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
              <button onClick={() => setLocation('/admin/login')} className="text-[#E63946] hover:underline text-sm">
                Se connecter
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white text-center mb-2">Nouveau mot de passe</h1>
              <p className="text-slate-400 text-sm text-center mb-8">Choisissez un mot de passe fort (min. 12 car.).</p>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nouveau mot de passe"
                    required
                    className="w-full pl-12 pr-12 py-3 bg-[#020617] border border-[#1E293B] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E63946]/40 focus:border-[#E63946]/50"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Confirmer le mot de passe"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-[#020617] border border-[#1E293B] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E63946]/40 focus:border-[#E63946]/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full py-3 bg-[#E63946] hover:bg-[#D62839] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Réinitialiser
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
