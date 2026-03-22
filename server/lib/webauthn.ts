/**
 * server/lib/webauthn.ts
 * Phase 2 — WebAuthn / FIDO2 (biométrie FaceID / Fingerprint)
 *
 * Basé sur @simplewebauthn/server
 * Flow :
 *   1. Register  — /api/client/webauthn/register-challenge → options
 *                  /api/client/webauthn/register-verify    → store credential
 *   2. Authenticate — /api/client/webauthn/auth-challenge  → options
 *                     /api/client/webauthn/auth-verify     → issue JWT
 */

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/types";

/* ─── Configuration ───────────────────────────────────────── */
export const RP_NAME    = "Epitaphe360";
export const RP_ID      = process.env.WEBAUTHN_RP_ID      ?? "epitaphe360.com";
export const RP_ORIGIN  = process.env.WEBAUTHN_RP_ORIGIN  ?? "https://epitaphe360.com";

/* ─── Génération du challenge d'enregistrement ────────────── */
export async function createRegistrationChallenge(opts: {
  userId:    number;
  userEmail: string;
  userName:  string;
  existingCredentialIds?: string[]; // base64url
}) {
  const options = await generateRegistrationOptions({
    rpName:                  RP_NAME,
    rpID:                    RP_ID,
    userID:                  new TextEncoder().encode(String(opts.userId)),
    userName:                opts.userEmail,
    userDisplayName:         opts.userName,
    timeout:                 60_000,
    attestationType:         "none",
    authenticatorSelection: {
      authenticatorAttachment: "platform",   // FaceID / Touch ID — pas clé physique
      userVerification:        "required",
      residentKey:             "preferred",
    },
    excludeCredentials: (opts.existingCredentialIds ?? []).map((id) => ({
      id,
      transports: ["internal" as const],
    })),
  });

  return options; // options.challenge est le challenge base64url
}

/* ─── Vérification de l'enregistrement ───────────────────── */
export async function verifyRegistration(opts: {
  response:  RegistrationResponseJSON;
  challenge: string; // challenge stocké côté serveur
}): Promise<{
  credentialId:    string;
  publicKey:       string;
  counter:         number;
  deviceName:      string;
  aaguid:          string | undefined;
}> {
  const verification = await verifyRegistrationResponse({
    response:              opts.response,
    expectedChallenge:     opts.challenge,
    expectedOrigin:        RP_ORIGIN,
    expectedRPID:          RP_ID,
    requireUserVerification: true,
  });

  if (!verification.verified || !verification.registrationInfo) {
    throw new Error("Vérification WebAuthn échouée");
  }

  const { credential, aaguid } = verification.registrationInfo;

  // Détecter nom de l'appareil depuis aaguid (simplification)
  const deviceName = guessDeviceName(aaguid, opts.response.authenticatorAttachment);

  return {
    credentialId: credential.id,
    publicKey:    Buffer.from(credential.publicKey).toString("base64url"),
    counter:      credential.counter,
    deviceName,
    aaguid,
  };
}

/* ─── Génération du challenge d'authentification ─────────── */
export async function createAuthChallenge(opts: {
  credentialIds: string[]; // credentials existants du compte
}) {
  const options = await generateAuthenticationOptions({
    rpID:                RP_ID,
    timeout:             60_000,
    userVerification:    "required",
    allowCredentials:    opts.credentialIds.map((id) => ({
      id,
      transports: ["internal" as const],
    })),
  });

  return options;
}

/* ─── Vérification de l'authentification ─────────────────── */
export async function verifyAuthentication(opts: {
  response:       AuthenticationResponseJSON;
  challenge:      string;
  credentialId:   string;
  publicKey:      string; // base64url
  counter:        number;
}) {
  const verification = await verifyAuthenticationResponse({
    response:          opts.response,
    expectedChallenge: opts.challenge,
    expectedOrigin:    RP_ORIGIN,
    expectedRPID:      RP_ID,
    credential: {
      id:          opts.credentialId,
      publicKey:   Buffer.from(opts.publicKey, "base64url"),
      counter:     opts.counter,
      transports:  ["internal"],
    },
    requireUserVerification: true,
  });

  if (!verification.verified) {
    throw new Error("Authentification biométrique échouée");
  }

  return {
    newCounter: verification.authenticationInfo.newCounter,
  };
}

/* ─── Helper : deviner le nom de l'appareil ──────────────── */
function guessDeviceName(
  aaguid: string | undefined,
  attachment: string | null | undefined
): string {
  // Quelques AAGUID connus (liste partielle)
  const KNOWN: Record<string, string> = {
    "adce0002-35bc-c60a-648b-0b25f1f05503": "Chrome sur Windows Hello",
    "08987058-cadc-4b81-b6e1-30de50dcbe96": "Windows Hello",
    "9ddd1817-af5a-4672-a2b9-3e3dd95000a9": "Windows Hello",
    "6028b017-b1d4-4c02-b4b3-afcdafc96bb2": "Windows Hello",
    "dd4ec289-e01d-41c9-bb89-70fa845d4bf2": "iCloud Keychain",
    "531126d6-e717-415c-9320-3d9aa6981239": "Dashlane",
    "bada5566-a7aa-401f-bd96-45619a55120d": "1Password",
  };

  if (aaguid && KNOWN[aaguid]) return KNOWN[aaguid];
  if (attachment === "platform") return "Appareil (biométrie)";
  return "Clé de sécurité physique";
}
