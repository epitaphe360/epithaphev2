/**
 * PayPal REST API v2 — Orders
 * Gère la création, capture et vérification des paiements PayPal.
 * Compatible Maroc (PayPal fonctionne au Maroc pour les marchands enregistrés).
 *
 * Variables d'environnement requises :
 *   PAYPAL_CLIENT_ID     — App Client ID (sandbox ou production)
 *   PAYPAL_CLIENT_SECRET — App Client Secret
 *   PAYPAL_MODE          — 'sandbox' | 'live' (défaut: 'sandbox')
 *   APP_URL              — URL de base de l'app (pour les URLs de retour)
 */

const PAYPAL_MODE = process.env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox';
const PAYPAL_BASE_URL = PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CLIENT_ID     = process.env.PAYPAL_CLIENT_ID     ?? '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET ?? '';

// Cache du token d'accès
let cachedToken: { access_token: string; expires_at: number } | null = null;

/** Obtenir un token OAuth2 via client_credentials */
async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expires_at > now + 60_000) {
    return cachedToken.access_token;
  }

  const credentials = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type':  'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[PayPal] OAuth2 échoué: ${res.status} — ${err}`);
  }

  const data = await res.json() as { access_token: string; expires_in: number };
  cachedToken = {
    access_token: data.access_token,
    expires_at: now + data.expires_in * 1000,
  };
  return cachedToken.access_token;
}

export interface PayPalOrderResult {
  orderId: string;
  approvalUrl: string;
  status: string;
}

/**
 * Créer une commande PayPal (CAPTURE intent)
 * @param amountMAD — montant en dirhams (pas centimes) ex: 49.00
 * @param description — libellé affiché chez PayPal
 * @param customId — référence interne (scoringResultId ou paymentRef)
 */
export async function createPayPalOrder(
  amountMAD: number,
  description: string,
  customId: string,
): Promise<PayPalOrderResult> {
  const token = await getAccessToken();
  const appUrl = process.env.APP_URL ?? 'https://epitaphe360.com';

  const body = {
    intent: 'CAPTURE',
    purchase_units: [{
      custom_id: customId,
      description: description.slice(0, 127),
      amount: {
        currency_code: 'USD',              // PayPal ne supporte pas MAD directement
        value: (amountMAD / 10).toFixed(2), // conversion approximative MAD → USD (1 USD ≈ 10 MAD)
      },
    }],
    application_context: {
      brand_name: 'Epitaphe 360',
      landing_page: 'BILLING',
      user_action: 'PAY_NOW',
      return_url: `${appUrl}/api/payments/paypal/success`,
      cancel_url: `${appUrl}/api/payments/paypal/cancel`,
    },
  };

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[PayPal] Création commande échouée: ${res.status} — ${err}`);
  }

  const data = await res.json() as {
    id: string;
    status: string;
    links: Array<{ href: string; rel: string }>;
  };

  const approveLink = data.links.find(l => l.rel === 'approve');
  if (!approveLink) throw new Error('[PayPal] Lien d\'approbation manquant dans la réponse');

  return {
    orderId:     data.id,
    approvalUrl: approveLink.href,
    status:      data.status,
  };
}

export interface PayPalCaptureResult {
  captureId:      string;
  status:         string;   // COMPLETED | PENDING | DECLINED
  amountUSD:      string;
  customId:       string;
  payerEmail:     string;
  payerName:      string;
}

/** Capturer un paiement après approbation PayPal */
export async function capturePayPalOrder(orderId: string): Promise<PayPalCaptureResult> {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type':  'application/json',
    },
    body: '{}',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[PayPal] Capture échouée: ${res.status} — ${err}`);
  }

  const data = await res.json() as {
    id: string;
    status: string;
    purchase_units: Array<{
      custom_id?: string;
      payments?: {
        captures?: Array<{
          id: string;
          status: string;
          amount: { value: string; currency_code: string };
        }>;
      };
    }>;
    payer?: {
      email_address?: string;
      name?: { given_name?: string; surname?: string };
    };
  };

  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  if (!capture) throw new Error('[PayPal] Capture introuvable dans la réponse');

  return {
    captureId:  capture.id,
    status:     capture.status,
    amountUSD:  capture.amount.value,
    customId:   data.purchase_units?.[0]?.custom_id ?? '',
    payerEmail: data.payer?.email_address ?? '',
    payerName:  [data.payer?.name?.given_name, data.payer?.name?.surname].filter(Boolean).join(' '),
  };
}

/** Vérifier l'état d'une commande PayPal (utile pour les webhooks) */
export async function getPayPalOrderStatus(orderId: string): Promise<string> {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`[PayPal] Récupération ordre échouée: ${res.status}`);

  const data = await res.json() as { status: string };
  return data.status;
}
