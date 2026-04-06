/**
 * CMI — Centre Monétique Interbancaire (Maroc)
 * Intégration du paiement en ligne via la passerelle CMI.
 *
 * Flux : POST form redirect vers CMI → callback URL → vérification HMAC.
 *
 * Variables d'environnement requises :
 *   CMI_MERCHANT_ID   — Identifiant marchand fourni par CMI
 *   CMI_STORE_KEY     — Clé secrète du magasin (HMAC-SHA512)
 *   CMI_CLIENT_ID     — Client ID fourni par CMI
 *   CMI_OKURL         — URL de retour après paiement réussi
 *   CMI_FAILURL       — URL de retour après paiement échoué
 *   CMI_SHOPURL       — URL principale du site
 *   CMI_GATEWAY_URL   — URL de la passerelle CMI (TEST ou PROD)
 *                       TEST: https://testpayment.cmi.co.ma/fim/est3Dgate
 *                       PROD: https://payment.cmi.co.ma/fim/est3Dgate
 */

import { createHmac } from 'crypto';

const CMI_MERCHANT_ID = process.env.CMI_MERCHANT_ID ?? '';
const CMI_STORE_KEY   = process.env.CMI_STORE_KEY   ?? '';
const CMI_CLIENT_ID   = process.env.CMI_CLIENT_ID   ?? '';
const CMI_GATEWAY_URL = process.env.CMI_GATEWAY_URL
  ?? 'https://testpayment.cmi.co.ma/fim/est3Dgate';

const APP_URL = process.env.APP_URL ?? 'https://epitaphe360.com';

/**
 * Générer la signature HMAC-SHA512 pour CMI.
 * La signature est calculée sur la concaténation triée des paramètres.
 */
function computeCMIHash(params: Record<string, string>): string {
  // CMI spécification : trier les clés alphabétiquement, concaténer avec |
  const sortedKeys = Object.keys(params).sort();
  const hashStr = sortedKeys.map(k => params[k]).join('|') + `|${CMI_STORE_KEY}`;
  return createHmac('sha512', CMI_STORE_KEY).update(hashStr).digest('hex').toUpperCase();
}

export interface CMIPaymentForm {
  gatewayUrl: string;
  fields: Record<string, string>;
}

/**
 * Générer les champs du formulaire CMI à soumettre côté client
 * @param amountMAD — montant en dirhams (ex: 490.00)
 * @param orderId   — référence commande unique
 * @param description — libellé de la transaction
 * @param email     — email du payeur
 * @param lang      — langue ('fr' | 'ar' | 'en'), défaut 'fr'
 */
export function generateCMIForm(
  amountMAD: number,
  orderId: string,
  description: string,
  email: string,
  lang: 'fr' | 'ar' | 'en' = 'fr',
): CMIPaymentForm {
  const callbackUrl = `${APP_URL}/api/payments/cmi/callback`;
  const okUrl   = process.env.CMI_OKURL   ?? `${APP_URL}/paiement/succes`;
  const failUrl = process.env.CMI_FAILURL ?? `${APP_URL}/paiement/echec`;
  const shopUrl = process.env.CMI_SHOPURL ?? APP_URL;

  // Montant formaté avec 2 décimales, sans séparateur de milliers
  const amountStr = amountMAD.toFixed(2);
  const currency  = '504'; // Code ISO 4217 pour MAD (Dirham marocain)

  const params: Record<string, string> = {
    clientid:       CMI_MERCHANT_ID,
    storetype:      '3D_PAY_HOSTING',
    hash_algorithm: 'ver3',
    trantype:       'PreAuth',
    amount:         amountStr,
    currency:       currency,
    oid:            orderId,
    okUrl:          okUrl,
    failUrl:        failUrl,
    lang:           lang,
    BillToName:     'Client',
    BillToEmailAddress: email,
    encoding:       'UTF-8',
    callbackUrl:    callbackUrl,
    shopurl:        shopUrl,
    description:    description.slice(0, 255),
    rnd:            Date.now().toString(),
  };

  // Ajouter le hash au dictionnaire (non inclus dans le calcul)
  const hash = computeCMIHash(params);

  const fields: Record<string, string> = {
    ...params,
    hash,
    // clientid dans certaines versions doit être séparé
    clientId: CMI_CLIENT_ID || CMI_MERCHANT_ID,
  };

  return { gatewayUrl: CMI_GATEWAY_URL, fields };
}

/**
 * Vérifier le callback CMI (POST depuis la passerelle).
 * Retourne true si la signature est valide et le statut est approuvé.
 */
export function verifyCMICallback(body: Record<string, string>): {
  valid: boolean;
  approved: boolean;
  orderId: string;
  transactionId: string;
  amount: string;
} {
  const { hash, Response: responseCode, oid, TransId, amount, ...rest } = body;

  // Recalculer le hash sans les champs hash et Response
  const paramsToHash: Record<string, string> = {};
  for (const [k, v] of Object.entries(rest)) {
    if (k !== 'hash' && k !== 'Response') paramsToHash[k] = v;
  }
  if (oid)    paramsToHash['oid']    = oid;
  if (amount) paramsToHash['amount'] = amount;

  const expectedHash = computeCMIHash(paramsToHash);
  const valid    = expectedHash === (hash ?? '').toUpperCase();
  const approved = responseCode === 'Approved';

  return {
    valid,
    approved,
    orderId:       oid    ?? '',
    transactionId: TransId ?? '',
    amount:        amount ?? '',
  };
}
