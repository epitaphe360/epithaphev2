/**
 * Utilitaire Analytics — GA4 + Microsoft Clarity
 * IDs chargés depuis VITE_GA4_ID et VITE_CLARITY_ID (variables d'env)
 * Usage : trackEvent("brief_submitted", { category: "evenements" })
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    clarity: (cmd: string, ...args: unknown[]) => void;
  }
}

/**
 * Initialise GA4 + Clarity en chargeant dynamiquement les scripts.
 * À appeler UNE SEULE FOIS depuis main.tsx après consentement.
 */
export function initAnalytics() {
  if (typeof window === "undefined") return;

  const ga4Id = import.meta.env.VITE_GA4_ID as string | undefined;
  const clarityId = import.meta.env.VITE_CLARITY_ID as string | undefined;

  // — Google Analytics 4 —
  if (ga4Id && ga4Id !== "G-XXXXXXXXXX" && ga4Id.startsWith("G-")) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: unknown[]) { window.dataLayer.push(args); };
    window.gtag("js", new Date());
    window.gtag("config", ga4Id, { anonymize_ip: true, send_page_view: true });
  }

  // — Microsoft Clarity —
  if (clarityId && clarityId !== "XXXXXXXXXX") {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${clarityId}`;
    document.head.appendChild(s);
  }
}

/** Envoyer un événement GA4 personnalisé */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, params ?? {});
    }
  } catch {
    // Silently fail in dev / ad-blocker context
  }
}

/** Marquer une conversion GA4 */
export function trackConversion(
  conversionId: string,
  params?: Record<string, string | number>
) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: conversionId,
        ...params,
      });
    }
  } catch {
    // Silently fail
  }
}

/** Clarity — identifier un utilisateur */
export function identifyUser(userId: string, properties?: Record<string, string>) {
  try {
    if (typeof window !== "undefined" && typeof window.clarity === "function") {
      window.clarity("identify", userId, properties);
    }
  } catch {
    // Silently fail
  }
}

/** Clarity — définir un tag de session */
export function setSessionTag(key: string, value: string) {
  try {
    if (typeof window !== "undefined" && typeof window.clarity === "function") {
      window.clarity("set", key, value);
    }
  } catch {
    // Silently fail
  }
}

/** Events prédéfinis — raccourcis */
export const Analytics = {
  briefSubmitted: (category: string) =>
    trackEvent("brief_submitted", { event_category: category }),

  contactFormSent: () =>
    trackEvent("contact_form_sent", { event_category: "lead_gen" }),

  newsletterSignup: () =>
    trackEvent("newsletter_signup", { event_category: "engagement" }),

  vigilanceScoreViewed: (score: number) =>
    trackEvent("vigilance_score_viewed", { score }),

  pageView: (pagePath: string, pageTitle: string) =>
    trackEvent("page_view", { page_path: pagePath, page_title: pageTitle }),
} as const;
