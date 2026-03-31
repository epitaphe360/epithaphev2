payment_schema = '''

// ============================================================
// PAIEMENT — Plans d'abonnement plateforme (Type 2)
// ============================================================

export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),                          // Starter, Pro, Expert
  slug: varchar("slug", { length: 50 }).notNull().unique(), // starter | pro | expert
  description: text("description"),
  priceMonthly: integer("price_monthly").notNull(),      // en centimes MAD (ex: 99000 = 990 MAD)
  priceAnnual: integer("price_annual").notNull(),        // rabais annuel
  currency: varchar("currency", { length: 5 }).default("MAD"),
  features: json("features").$type<string[]>().default([]),
  maxProjects: integer("max_projects").default(1),
  maxUsers: integer("max_users").default(1),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
});
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;

// ============================================================
// PAIEMENT — Abonnements clients actifs (Type 2)
// ============================================================

export const clientSubscriptions = pgTable("client_subscriptions", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clientAccounts.id).notNull(),
  planId: integer("plan_id").references(() => subscriptionPlans.id).notNull(),
  status: varchar("status", { length: 20 }).default("active"), // active | cancelled | expired | trial
  billingCycle: varchar("billing_cycle", { length: 10 }).default("monthly"),    // monthly | annual
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertClientSubscriptionSchema = createInsertSchema(clientSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertClientSubscription = z.infer<typeof insertClientSubscriptionSchema>;
export type ClientSubscription = typeof clientSubscriptions.$inferSelect;

// ============================================================
// PAIEMENT — Devis (Type 1 — analyse + plan d'action)
// ============================================================

export const devis = pgTable("devis", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 30 }).notNull().unique(), // DEV-2026-0001
  clientId: integer("client_id").references(() => clientAccounts.id),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientCompany: text("client_company"),
  clientPhone: text("client_phone"),
  // Contenu du devis
  title: text("title").notNull(),
  description: text("description"),
  items: json("items").$type<Array<{
    label: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>>().default([]),
  subtotal: integer("subtotal").notNull(),               // centimes MAD
  taxRate: integer("tax_rate").default(20),              // TVA %
  taxAmount: integer("tax_amount").notNull(),
  total: integer("total").notNull(),
  currency: varchar("currency", { length: 5 }).default("MAD"),
  // Statut
  status: varchar("status", { length: 20 }).default("draft"),  // draft | sent | viewed | accepted | refused | expired
  validUntil: timestamp("valid_until"),
  // Source
  sourceTool: varchar("source_tool", { length: 50 }),   // commpulse | talentprint | ...
  scoringData: json("scoring_data"),                     // résultats du scoring ayant généré le devis
  // Notes internes
  adminNotes: text("admin_notes"),
  // Paiement / stripe
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDevisSchema = createInsertSchema(devis).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDevis = z.infer<typeof insertDevisSchema>;
export type Devis = typeof devis.$inferSelect;

// ============================================================
// PAIEMENT — Transactions / Paiements effectués
// ============================================================

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clientAccounts.id),
  devisId: integer("devis_id").references(() => devis.id),
  subscriptionId: integer("subscription_id").references(() => clientSubscriptions.id),
  type: varchar("type", { length: 20 }).notNull(), // devis | subscription
  amount: integer("amount").notNull(),              // centimes MAD
  currency: varchar("currency", { length: 5 }).default("MAD"),
  status: varchar("status", { length: 20 }).default("pending"), // pending | paid | failed | refunded
  paymentMethod: varchar("payment_method", { length: 30 }),     // card | virement | cheque
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeChargeId: text("stripe_charge_id"),
  receiptUrl: text("receipt_url"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
'''

with open('shared/schema.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Check if already added
if 'subscriptionPlans' in content:
    print('Already present, skipping')
else:
    with open('shared/schema.ts', 'a', encoding='utf-8') as f:
        f.write(payment_schema)
    print('Payment schema appended successfully')
