// ========================================
// NOUVELLE PAGE DE CONNEXION - DESIGN PREMIUM 2026
// ========================================

import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Loader2, ArrowRight, Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const NewLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { login } = useAuthStore();
  const [, setLocation] = useLocation();

  // ✅ Add data-admin-page attribute for CSS rules
  useEffect(() => {
    document.body.setAttribute('data-admin-page', 'true');
    return () => document.body.removeAttribute('data-admin-page');
  }, []);

  // Validation en temps réel
  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 6;
  const canSubmit = isEmailValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setError('Veuillez remplir correctement tous les champs');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email === 'admin@epitaph.ma' && password === 'admin123') {
        const mockUser = {
          id: '1',
          name: 'Administrateur',
          email: 'admin@epitaph.ma',
          role: 'ADMIN' as const
        };
        const mockToken = 'mock-jwt-token-' + Date.now();

        login(mockToken, mockUser);
        setLocation('/admin');
      } else {
        throw new Error('Identifiants incorrects');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E63946] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6 animate-fadeInUp">

        {/* Logo & Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-[#E63946] to-[#F08080] shadow-2xl shadow-[#E63946]/50">
            <span className="text-3xl font-bold text-white">E</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Bienvenue
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Connectez-vous à votre espace administrateur
          </p>
        </div>

        {/* Form Container */}
        <div className="relative">
          {/* Glassmorphism Card */}
          <div className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm animate-shake">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#E63946] to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-300 ${emailFocused ? 'opacity-50' : ''}`}></div>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${emailFocused ? 'text-[#E63946]' : 'text-slate-500'}`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      placeholder="admin@epitaph.ma"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-[#E63946]/50 focus:bg-white/10 transition-all duration-300"
                    />
                    {email && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isEmailValid ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-300 ${passwordFocused ? 'opacity-50' : ''}`}></div>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${passwordFocused ? 'text-purple-400' : 'text-slate-500'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                {password && !isPasswordValid && (
                  <p className="text-xs text-amber-400 flex items-center gap-1.5 mt-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Le mot de passe doit contenir au moins 6 caractères
                  </p>
                )}
              </div>

              {/* Demo Info */}
              <div className="pt-2 pb-2">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-xs text-blue-300 text-center font-medium">
                    🔑 Demo: <span className="font-mono">admin@epitaph.ma</span> / <span className="font-mono">admin123</span>
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !canSubmit}
                className={`w-full h-14 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  canSubmit
                    ? 'bg-gradient-to-r from-[#E63946] to-[#F08080] hover:shadow-[#E63946]/50 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] text-white'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Decorative Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#E63946]/20 to-purple-600/20 rounded-3xl blur-2xl -z-10 opacity-50"></div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-xs text-slate-500">
            © 2026 Epitaphe — Tous droits réservés
          </p>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
};

export default NewLoginPage;
