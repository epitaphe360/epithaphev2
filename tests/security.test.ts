import { describe, it, expect } from "vitest";
import crypto from "crypto";

/**
 * Tests unitaires pour les utilitaires de sécurité.
 */

// ─── HMAC Signature ─────────────────────────────────────────────────────────
function generateHmac(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

describe("HMAC Signature", () => {
  const secret = "test-secret-key-32-chars-minimum!";

  it("produit une signature hex de 64 caractères", () => {
    const sig = generateHmac("test-data", secret);
    expect(sig).toMatch(/^[a-f0-9]{64}$/);
  });

  it("produit des signatures différentes pour des données différentes", () => {
    const sig1 = generateHmac("data-1", secret);
    const sig2 = generateHmac("data-2", secret);
    expect(sig1).not.toBe(sig2);
  });

  it("produit des signatures reproductibles", () => {
    const sig1 = generateHmac("same-data", secret);
    const sig2 = generateHmac("same-data", secret);
    expect(sig1).toBe(sig2);
  });

  it("timing-safe compare fonctionne pour des signatures identiques", () => {
    const sig = generateHmac("data", secret);
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(sig, "hex");
    expect(crypto.timingSafeEqual(a, b)).toBe(true);
  });

  it("timing-safe compare échoue pour des signatures différentes", () => {
    const sig1 = generateHmac("data-1", secret);
    const sig2 = generateHmac("data-2", secret);
    const a = Buffer.from(sig1, "hex");
    const b = Buffer.from(sig2, "hex");
    expect(crypto.timingSafeEqual(a, b)).toBe(false);
  });
});

// ─── Devis Reference Generation ─────────────────────────────────────────────
describe("Devis Reference Format", () => {
  it("génère une référence au format DEV-YYYY-XXXXXXXX", () => {
    const year = new Date().getFullYear();
    const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
    const ref = `DEV-${year}-${rand}`;
    expect(ref).toMatch(/^DEV-\d{4}-[A-F0-9]{8}$/);
  });

  it("génère des références uniques", () => {
    const refs = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
      refs.add(`DEV-2025-${rand}`);
    }
    expect(refs.size).toBe(100);
  });
});

// ─── Input Sanitization ─────────────────────────────────────────────────────
function sanitizeLikePattern(input: string): string {
  if (!input) return "";
  return input.replace(/[%_\\]/g, "\\$&");
}

describe("sanitizeLikePattern", () => {
  it("échappe le caractère %", () => {
    expect(sanitizeLikePattern("test%drop")).toBe("test\\%drop");
  });

  it("échappe le caractère _", () => {
    expect(sanitizeLikePattern("test_drop")).toBe("test\\_drop");
  });

  it("échappe le caractère \\", () => {
    expect(sanitizeLikePattern("test\\drop")).toBe("test\\\\drop");
  });

  it("retourne une chaîne vide pour une entrée vide", () => {
    expect(sanitizeLikePattern("")).toBe("");
  });

  it("ne modifie pas une chaîne sans caractères spéciaux", () => {
    expect(sanitizeLikePattern("hello world")).toBe("hello world");
  });
});
