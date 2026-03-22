/**
 * BiometricSetup.tsx
 * Phase 2 — Configuration WebAuthn / FIDO2
 *
 * Composant à utiliser dans l'espace client (paramètres / sécurité)
 * Permet d'enregistrer ou supprimer un appareil biométrique (FaceID, Touch ID, Windows Hello)
 *
 * Dépendance : @simplewebauthn/browser
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fingerprint, Shield, Trash2, CheckCircle2,
  AlertCircle, Loader2, Plus, Smartphone,
} from "lucide-react";
import { startRegistration } from "@simplewebauthn/browser";

const TOKEN_KEY = "epitaphe_client_token";

interface Credential {
  id: number;
  deviceName: string;
  createdAt: string;
  lastUsedAt: string | null;
}

function fmtDate(d: string | null) {
  if (!d) return "Jamais utilisé";
  return new Date(d).toLocaleDateString("fr-MA", { day: "2-digit", month: "short", year: "numeric" });
}

export function BiometricSetup() {
  const [creds, setCreds]   = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [deleting, setDeleting]       = useState<number | null>(null);
  const [error, setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  const apiHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token ?? ""}`,
  };

  const loadCredentials = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/client/webauthn/credentials", { headers: apiHeaders });
      if (!res.ok) throw new Error("Erreur serveur");
      setCreds(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadCredentials(); }, [loadCredentials]);

  async function registerBiometric() {
    if (!token) return;
    setError(null);
    setSuccess(null);
    setRegistering(true);

    try {
      // Étape 1 : récupérer le challenge
      const challengeRes = await fetch("/api/client/webauthn/register-challenge", {
        method: "POST",
        headers: apiHeaders,
      });
      if (!challengeRes.ok) throw new Error(await challengeRes.text());
      const options = await challengeRes.json();

      // Étape 2 : déclenchement du geste biométrique (FaceID / Touch ID)
      const registrationResponse = await startRegistration({ optionsJSON: options });

      // Étape 3 : vérification côté serveur
      const verifyRes = await fetch("/api/client/webauthn/register-verify", {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify(registrationResponse),
      });
      if (!verifyRes.ok) {
        const err = await verifyRes.json().catch(() => ({}));
        throw new Error((err as any).error ?? "Vérification échouée");
      }
      const result = await verifyRes.json();

      setSuccess(`Appareil "${result.deviceName}" enregistré avec succès !`);
      await loadCredentials();
    } catch (e: any) {
      if (e.name === "NotAllowedError") {
        setError("Geste biométrique annulé ou non autorisé.");
      } else {
        setError(e.message ?? "Enregistrement échoué");
      }
    } finally {
      setRegistering(false);
    }
  }

  async function deleteCredential(id: number) {
    if (!token) return;
    setDeleting(id);
    setError(null);
    try {
      const res = await fetch(`/api/client/webauthn/credentials/${id}`, {
        method: "DELETE",
        headers: apiHeaders,
      });
      if (!res.ok) throw new Error("Suppression échouée");
      setCreds((c) => c.filter((cr) => cr.id !== id));
      setSuccess("Appareil supprimé.");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  }

  if (!("PublicKeyCredential" in window)) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-700 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        L'authentification biométrique n'est pas supportée par ce navigateur.
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-[#C8A96E]/10 rounded-xl">
          <Fingerprint className="w-5 h-5 text-[#C8A96E]" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Authentification Biométrique</h3>
          <p className="text-xs text-gray-500">FaceID · Touch ID · Windows Hello</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 bg-[#C8A96E]/5 text-[#C8A96E] text-xs font-medium px-3 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5" />
          FIDO2 / WebAuthn
        </div>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-600 text-sm mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl text-emerald-600 text-sm mb-4">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des credentials */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#C8A96E]" />
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {creds.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Smartphone className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucun appareil enregistré</p>
            </div>
          )}
          {creds.map((cred) => (
            <div key={cred.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Fingerprint className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{cred.deviceName}</p>
                  <p className="text-xs text-gray-400">
                    Ajouté le {fmtDate(cred.createdAt)} · Dernière utilisation : {fmtDate(cred.lastUsedAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteCredential(cred.id)}
                disabled={deleting === cred.id}
                className="p-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition disabled:opacity-40"
                title="Supprimer cet appareil"
              >
                {deleting === cred.id
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Trash2 className="w-4 h-4" />
                }
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bouton enregistrer */}
      <button
        onClick={registerBiometric}
        disabled={registering}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C8A96E] text-white text-sm font-medium hover:bg-[#b8965e] transition disabled:opacity-60"
      >
        {registering ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            En attente du geste biométrique…
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Enregistrer un nouvel appareil
          </>
        )}
      </button>

      <p className="text-[10px] text-gray-400 text-center mt-3">
        Votre clé privée reste sur votre appareil. Epitaphe360 ne stocke jamais votre biométrie.
      </p>
    </section>
  );
}
