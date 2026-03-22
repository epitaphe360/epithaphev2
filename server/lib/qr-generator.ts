/**
 * server/lib/qr-generator.ts
 * Phase 2 — QR Codes avec UTM Deep Linking
 *
 * Génère des SVG couleur #1A1A1A sur fond blanc,
 * 400×400px, correction d'erreur niveau H (30%)
 */

import QRCode from "qrcode";

const BASE_URL = process.env.APP_URL ?? "https://epitaphe360.com";

/* ─── Types ──────────────────────────────────────────────── */
export interface QRParams {
  targetPath:   string;                // ex: "/evenements/salons"
  utmSource:    string;               // ex: "qrcode"
  utmMedium:    string;               // ex: "print"
  utmCampaign:  string;              // ex: "gitex-2025"
  utmContent?:  string;              // ex: "stand-b12"
}

/* ─── Construire l'URL finale avec UTM ───────────────────── */
export function buildQRUrl(params: QRParams): string {
  const url = new URL(`${BASE_URL}${params.targetPath}`);
  url.searchParams.set("utm_source",   params.utmSource);
  url.searchParams.set("utm_medium",   params.utmMedium);
  url.searchParams.set("utm_campaign", params.utmCampaign);
  if (params.utmContent) url.searchParams.set("utm_content", params.utmContent);
  return url.toString();
}

/* ─── Générer le SVG du QR Code ──────────────────────────── */
export async function generateQRSvg(params: QRParams): Promise<string> {
  const url = buildQRUrl(params);

  const svg = await QRCode.toString(url, {
    type:                 "svg",
    errorCorrectionLevel: "H",   // 30% correction — meilleur pour impression
    width:                400,
    margin:               2,
    color: {
      dark:  "#1A1A1A",          // couleur du QR
      light: "#FFFFFF",          // fond blanc
    },
  });

  return svg;
}

/* ─── Générer le PNG (Buffer) ─────────────────────────────── */
export async function generateQRPng(params: QRParams): Promise<Buffer> {
  const url = buildQRUrl(params);

  const buffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: "H",
    width:                400,
    margin:               2,
    color: {
      dark:  "#1A1A1A",
      light: "#FFFFFF",
    },
  });

  return buffer;
}

/* ─── Valider les paramètres UTM ─────────────────────────── */
export function validateQRParams(params: Partial<QRParams>): string | null {
  if (!params.targetPath?.startsWith("/")) return "targetPath doit commencer par /";
  if (!params.utmSource)   return "utmSource est requis";
  if (!params.utmMedium)   return "utmMedium est requis";
  if (!params.utmCampaign) return "utmCampaign est requis";
  return null; // valide
}
