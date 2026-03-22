/**
 * server/lib/push.ts
 * Phase 2 — Notifications Push Web (VAPID + web-push)
 *
 * Utilisation :
 *   • Génération des clés VAPID : node -e "require('web-push').generateVAPIDKeys()"
 *   • Stocker dans .env : VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL
 */

import webpush from "web-push";

/* ─── Configuration VAPID ─────────────────────────────────── */
const VAPID_EMAIL    = process.env.VAPID_EMAIL    ?? "mailto:contact@epitaphe360.com";
const VAPID_PUBLIC   = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE  = process.env.VAPID_PRIVATE_KEY;

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);
}

export { VAPID_PUBLIC };

/* ─── Types ──────────────────────────────────────────────── */
export interface PushSubscriptionKeys {
  p256dh: string;
  auth:   string;
}

export interface PushPayload {
  title:    string;
  body:     string;
  url?:     string;
  image?:   string;
  tag?:     string;
  actions?: Array<{ action: string; title: string }>;
}

/* ─── Envoi d'une notification ─────────────────────────────── */
export async function sendPushNotification(
  subscription: { endpoint: string; keys: PushSubscriptionKeys },
  payload: PushPayload
): Promise<{ success: boolean; error?: string }> {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    console.warn("[push] Clés VAPID non configurées — notification ignorée");
    return { success: false, error: "VAPID not configured" };
  }

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth:   subscription.keys.auth,
        },
      },
      JSON.stringify(payload),
      { TTL: 3600 }
    );
    return { success: true };
  } catch (err: any) {
    console.error("[push] Échec envoi notification :", err.statusCode, err.body);
    return { success: false, error: err.message };
  }
}

/* ─── Diffusion par catégorie (autonome — lit la DB) ─────── */
/**
 * Envoie une notification à tous les abonnés ayant au moins une des catégories données.
 * Charges les abonnés directement depuis la DB.
 */
export async function broadcastByCategory(
  categories: string[],
  payload: PushPayload & { icon?: string }
): Promise<{ sent: number; failed: number }> {
  // Import dynamique pour éviter les dépendances circulaires
  const { db }                = await import("../db.js");
  const { pushSubscriptions } = await import("../../shared/schema.js");
  const { sql }               = await import("drizzle-orm");

  // Récupérer tous les abonnés dont categories && inputCategories != {}
  const subs = await db.select().from(pushSubscriptions);
  const targets = subs.filter((s) =>
    categories.some((cat) => (s.categories ?? []).includes(cat) || (s.categories ?? []).includes("all"))
  );

  let sent = 0;
  let failed = 0;

  const results = await Promise.allSettled(
    targets.map((sub) =>
      sendPushNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.keysP256dh, auth: sub.keysAuth } },
        payload
      )
    )
  );

  for (const r of results) {
    if (r.status === "fulfilled" && r.value.success) sent++;
    else failed++;
  }

  return { sent, failed };
}
