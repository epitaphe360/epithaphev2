// ========================================
// Admin — Page mot de passe oublié
// ========================================
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Loader2, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { post } from '../lib/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Email invalide'); return; }
    setError('');
    setLoading(true);
    try {
      await post('/api/admin/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#E63946] to-[#F08080] rounded-xl flex items-center justify-center shadow-lg shadow-[#E63946]/30">
              <span className="text-gray-900 font-bold text-2xl">E</span>
            </div>
          </div>

          {success ? (
            <div className="text-center">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Email envoyé</h2>
              <p className="text-gray-500 text-sm mb-6">
                Si ce compte existe, vous recevrez un email avec les instructions de réinitialisation.
              </p>
              <button
                onClick={() => setLocation('/admin/login')}
                className="text-[#E63946] hover:underline text-sm"
              >
                Retour à la connexion
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Mot de passe oublié</h1>
              <p className="text-gray-500 text-sm text-center mb-8">
                Entrez votre email pour recevoir un lien de réinitialisation.
              </p>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E63946]/40 focus:border-[#E63946]/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#E63946] hover:bg-[#D62839] text-gray-900 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Envoyer le lien
                </button>
              </form>

              <button
                onClick={() => setLocation('/admin/login')}
                className="mt-6 w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />Retour à la connexion
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
