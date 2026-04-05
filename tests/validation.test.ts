import { describe, it, expect } from "vitest";
import { z } from "zod";

/**
 * Tests unitaires pour la validation des schémas Zod utilisés dans les routes.
 * Ces tests ne nécessitent pas de connexion DB.
 */

// ─── Password validation replica (doit correspondre à lib/auth.ts) ───────────
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) return { valid: false, error: "Le mot de passe est requis" };
  if (password.length < 12) return { valid: false, error: "Le mot de passe doit contenir au moins 12 caractères" };
  if (!/[A-Z]/.test(password)) return { valid: false, error: "Le mot de passe doit contenir au moins une lettre majuscule" };
  if (!/[a-z]/.test(password)) return { valid: false, error: "Le mot de passe doit contenir au moins une lettre minuscule" };
  if (!/[0-9]/.test(password)) return { valid: false, error: "Le mot de passe doit contenir au moins un chiffre" };
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return { valid: false, error: "Le mot de passe doit contenir au moins un caractère spécial" };
  return { valid: true };
}

describe("validatePassword", () => {
  it("rejette un mot de passe vide", () => {
    expect(validatePassword("")).toEqual({ valid: false, error: "Le mot de passe est requis" });
  });

  it("rejette un mot de passe trop court (<12)", () => {
    expect(validatePassword("Abc1!")).toMatchObject({ valid: false });
  });

  it("rejette un mot de passe sans majuscule", () => {
    expect(validatePassword("abcdefghij1!")).toMatchObject({ valid: false });
  });

  it("rejette un mot de passe sans minuscule", () => {
    expect(validatePassword("ABCDEFGHIJ1!")).toMatchObject({ valid: false });
  });

  it("rejette un mot de passe sans chiffre", () => {
    expect(validatePassword("Abcdefghijkl!")).toMatchObject({ valid: false });
  });

  it("rejette un mot de passe sans caractère spécial", () => {
    expect(validatePassword("Abcdefghij12")).toMatchObject({ valid: false });
  });

  it("accepte un mot de passe valide", () => {
    expect(validatePassword("Abcdefgh1234!")).toEqual({ valid: true });
  });
});

// ─── Subscription Zod Schema ────────────────────────────────────────────────
const subscriptionSchema = z.object({
  planSlug: z.string().min(1).max(50),
  billingCycle: z.enum(["monthly", "annual"]),
});

describe("subscriptionSchema", () => {
  it("accepte des données valides", () => {
    const result = subscriptionSchema.safeParse({ planSlug: "pro", billingCycle: "monthly" });
    expect(result.success).toBe(true);
  });

  it("rejette un billingCycle invalide", () => {
    const result = subscriptionSchema.safeParse({ planSlug: "pro", billingCycle: "weekly" });
    expect(result.success).toBe(false);
  });

  it("rejette un planSlug vide", () => {
    const result = subscriptionSchema.safeParse({ planSlug: "", billingCycle: "annual" });
    expect(result.success).toBe(false);
  });

  it("rejette des données manquantes", () => {
    const result = subscriptionSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// ─── Devis Zod Schema ──────────────────────────────────────────────────────
const devisSchema = z.object({
  clientName: z.string().min(1).max(200),
  clientEmail: z.string().email().max(300),
  clientCompany: z.string().max(200).optional(),
  title: z.string().min(1).max(300),
  description: z.string().max(5000).optional(),
  items: z.array(z.object({
    label: z.string(),
    description: z.string().optional(),
    quantity: z.number().int().min(1),
    unitPrice: z.number().int().min(0),
    total: z.number().int().min(0),
  })).default([]),
  subtotal: z.number().int().min(0),
  taxRate: z.number().min(0).max(100).default(20),
  currency: z.string().max(10).default("MAD"),
  validUntil: z.string().optional(),
  clientId: z.number().int().optional(),
});

describe("devisSchema", () => {
  it("accepte un devis complet", () => {
    const result = devisSchema.safeParse({
      clientName: "Entreprise Test",
      clientEmail: "test@example.com",
      title: "Audit digital",
      subtotal: 50000,
      taxRate: 20,
      items: [{ label: "Audit", quantity: 1, unitPrice: 50000, total: 50000 }],
    });
    expect(result.success).toBe(true);
  });

  it("rejette un email invalide", () => {
    const result = devisSchema.safeParse({
      clientName: "Test",
      clientEmail: "not-an-email",
      title: "Audit",
      subtotal: 10000,
    });
    expect(result.success).toBe(false);
  });

  it("rejette un subtotal négatif", () => {
    const result = devisSchema.safeParse({
      clientName: "Test",
      clientEmail: "test@example.com",
      title: "Audit",
      subtotal: -100,
    });
    expect(result.success).toBe(false);
  });

  it("applique les valeurs par défaut", () => {
    const result = devisSchema.parse({
      clientName: "Test",
      clientEmail: "test@example.com",
      title: "Audit",
      subtotal: 10000,
    });
    expect(result.taxRate).toBe(20);
    expect(result.currency).toBe("MAD");
    expect(result.items).toEqual([]);
  });
});

// ─── Plan Zod Schemas ──────────────────────────────────────────────────────
const planCreateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50),
  description: z.string().max(1000).optional(),
  priceMonthly: z.number().int().min(0),
  priceAnnual: z.number().int().min(0),
  currency: z.string().max(5).default("MAD"),
  features: z.array(z.string()).default([]),
  maxProjects: z.number().int().min(1).default(1),
  maxUsers: z.number().int().min(1).default(1),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

describe("planCreateSchema", () => {
  it("accepte un plan valide", () => {
    const result = planCreateSchema.safeParse({
      name: "Pro",
      slug: "pro",
      priceMonthly: 99000,
      priceAnnual: 990000,
    });
    expect(result.success).toBe(true);
  });

  it("rejette un prix négatif", () => {
    const result = planCreateSchema.safeParse({
      name: "Pro",
      slug: "pro",
      priceMonthly: -100,
      priceAnnual: 990000,
    });
    expect(result.success).toBe(false);
  });

  it("rejette un nom vide", () => {
    const result = planCreateSchema.safeParse({
      name: "",
      slug: "pro",
      priceMonthly: 99000,
      priceAnnual: 990000,
    });
    expect(result.success).toBe(false);
  });
});
