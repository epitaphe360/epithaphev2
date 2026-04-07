// ========================================
// CMS Dashboard — Login Page — Light Luxury Theme
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

  useEffect(() => {
    document.body.setAttribute('data-admin-page', 'true');
    return () => document.body.removeAttribute('data-admin-page');
  }, []);

  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 6;
  const canSubmit = isEmailValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) { setError('Veuillez remplir correctement tous les champs'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      if (!res.ok) {
        const errorData = res.headers.get('content-type')?.includes('application/json')
          ? await res.json()
          : { error: `Erreur serveur (${res.status})` };
        throw new Error(errorData.error || 'Identifiants incorrects');
      }
      const data = await res.json();
      login(data.token, data.user);
      setLocation('/admin');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex" style={{ background: '#F8FAFC', fontFamily: "'Fira Sans', system-ui, sans-serif" }}>
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-2/5 p-12"
        style={{ background: 'linear-gradient(160deg, #1E293B 0%, #0F172A 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #EC4899, #be185d)', boxShadow: '0 0 20px rgba(236,72,153,0.4)' }}
          >
            E
          </div>
          <div className="leading-none">
            <span className="text-white font-bold text-lg tracking-tight block">Epitaphe</span>
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: '#EC4899' }}>360 CMS</span>
          </div>
        </div>

        <div>
          <h1
            className="text-4xl text-white leading-snug mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            Gérez votre<br />
            <span style={{ color: '#EC4899' }}>présence digitale</span><br />
            en toute sérénité.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Tableau de bord centralisé pour piloter votre contenu,
            vos clients et votre stratégie de communication.
          </p>
        </div>

        <p className="text-slate-600 text-xs">© 2026 Epitaphe 360 — Tous droits réservés</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #EC4899, #be185d)' }}
          >
            E
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">Epitaphe 360</span>
        </div>

        <div className="w-full max-w-sm">
          <h2
            className="text-3xl text-gray-900 mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            Connexion
          </h2>
          <p className="text-gray-500 text-sm mb-8">Espace administrateur Epitaphe 360</p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl border flex items-start gap-3"
              style={{ background: 'rgba(236,72,153,0.05)', borderColor: 'rgba(236,72,153,0.2)' }}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#EC4899' }} />
              <p className="text-sm" style={{ color: '#be185d' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                  style={{ color: emailFocused ? '#EC4899' : '#94A3B8' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="admin@epitaphe360.ma"
                  required
                  className="w-full rounded-xl pl-10 pr-10 py-3 text-sm font-medium outline-none transition-all"
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${emailFocused ? '#EC4899' : '#E2E8F0'}`,
                    boxShadow: emailFocused ? '0 0 0 3px rgba(236,72,153,0.08)' : 'none',
                    color: '#1E293B',
                  }}
                />
                {email && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {isEmailValid ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                  style={{ color: passwordFocused ? '#EC4899' : '#94A3B8' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl pl-10 pr-10 py-3 text-sm font-medium outline-none transition-all"
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${passwordFocused ? '#EC4899' : '#E2E8F0'}`,
                    boxShadow: passwordFocused ? '0 0 0 3px rgba(236,72,153,0.08)' : 'none',
                    color: '#1E293B',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#94A3B8' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#EC4899'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94A3B8'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && !isPasswordValid && (
                <p className="text-xs text-amber-500 flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Minimum 6 caractères
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="w-full h-12 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 mt-2"
              style={canSubmit ? {
                background: 'linear-gradient(135deg, #EC4899, #be185d)',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(236,72,153,0.35)',
              } : {
                background: '#F1F5F9',
                color: '#94A3B8',
                cursor: 'not-allowed',
              }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Connexion...</span></>
                : <><span>Se connecter</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/admin/forgot-password"
              onClick={(e) => { e.preventDefault(); setLocation('/admin/forgot-password'); }}
              className="text-xs transition-colors"
              style={{ color: '#94A3B8' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#EC4899'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94A3B8'}
            >
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Fira+Sans:wght@400;500;600&display=swap');`}</style>
      </div>
    </div>
  );
};