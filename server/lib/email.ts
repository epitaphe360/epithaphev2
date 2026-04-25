// ========================================
// Service Email — Nodemailer
// ========================================
// Configure via variables d'env :
//   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
//   EMAIL_FROM, EMAIL_FROM_NAME
//   FRONTEND_URL (pour les liens dans les emails)
// ========================================

import nodemailer, { type Transporter } from "nodemailer";

// ── Configuration ─────────────────────────────────────────────────────────────
const SMTP_HOST     = process.env.SMTP_HOST     || "smtp.gmail.com";
const SMTP_PORT     = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_SECURE   = process.env.SMTP_SECURE === "true";
const SMTP_USER     = process.env.SMTP_USER     || "";
const SMTP_PASS     = process.env.SMTP_PASS     || "";
const EMAIL_FROM    = process.env.EMAIL_FROM    || "noreply@epitaphe360.com";
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "Epitaphe 360";
const FRONTEND_URL  = process.env.FRONTEND_URL  || "https://epitaphe360.com";

// ── Transporter ───────────────────────────────────────────────────────────────
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    if (!SMTP_USER || !SMTP_PASS) {
      console.warn("[EMAIL] SMTP_USER ou SMTP_PASS non configurés — emails désactivés");
      // Retourne un transporter fictif qui log sans envoyer
      return nodemailer.createTransport({ jsonTransport: true } as any);
    }
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

// ── Envoi générique ────────────────────────────────────────────────────────────
export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}): Promise<boolean> {
  try {
    const t = getTransporter();
    const info = await t.sendMail({
      from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]+>/g, ""),
      attachments: options.attachments,
    });
    console.log(`[EMAIL] Envoyé à ${options.to}: ${options.subject} (${info.messageId})`);
    return true;
  } catch (err) {
    console.error("[EMAIL] Erreur d'envoi:", err);
    return false;
  }
}

// ── HTML Escaping (XSS prevention for email templates) ─────────────────────────
function esc(str: string | null | undefined): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Template de base ───────────────────────────────────────────────────────────
function baseTemplate(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin:0; padding:0; background:#f4f4f5; font-family:'Segoe UI',Arial,sans-serif; }
    .wrapper { max-width:600px; margin:0 auto; padding:32px 16px; }
    .card { background:#fff; border-radius:12px; padding:40px; box-shadow:0 2px 8px rgba(0,0,0,.08); }
    .logo { font-size:24px; font-weight:800; color:#E63946; margin-bottom:32px; }
    h1 { font-size:22px; font-weight:700; color:#111; margin:0 0 16px; }
    p { font-size:15px; color:#444; line-height:1.6; margin:0 0 16px; }
    .btn { display:inline-block; background:#E63946; color:#fff !important; text-decoration:none;
           padding:14px 28px; border-radius:8px; font-weight:600; font-size:15px; margin:8px 0 24px; }
    .footer { margin-top:32px; font-size:12px; color:#888; text-align:center; }
    .divider { border:none; border-top:1px solid #eee; margin:24px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="logo">Epitaphe 360</div>
      ${content}
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Epitaphe 360 · Tous droits réservés<br/>
      <a href="${FRONTEND_URL}" style="color:#E63946;">${FRONTEND_URL}</a>
    </div>
  </div>
</body>
</html>`;
}

// ========================================
// EMAILS SPÉCIFIQUES
// ========================================

// ── 1. Confirmation newsletter ────────────────────────────────────────────────
export async function sendNewsletterConfirmation(to: string): Promise<boolean> {
  return sendMail({
    to,
    subject: "Bienvenue dans la newsletter Epitaphe 360 🎉",
    html: baseTemplate("Bienvenue !", `
      <h1>Bienvenue dans notre newsletter !</h1>
      <p>Merci de vous être abonné(e) à la newsletter d'<strong>Epitaphe 360</strong>.</p>
      <p>Vous recevrez désormais nos dernières actualités, études de cas et tendances en matière d'événementiel et de communication d'entreprise.</p>
      <a href="${FRONTEND_URL}" class="btn">Découvrir notre univers</a>
      <hr class="divider" />
      <p style="font-size:13px;color:#888;">
        Pour vous désabonner, <a href="${FRONTEND_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(to)}" style="color:#E63946;">cliquez ici</a>.
      </p>
    `),
  });
}

// ── 2. Reset mot de passe admin ───────────────────────────────────────────────
export async function sendAdminPasswordReset(to: string, token: string): Promise<boolean> {
  const link = `${FRONTEND_URL}/admin/reset-password?token=${token}`;
  return sendMail({
    to,
    subject: "Réinitialisation de votre mot de passe — Epitaphe Admin",
    html: baseTemplate("Réinitialisation du mot de passe", `
      <h1>Réinitialisation de mot de passe</h1>
      <p>Vous avez demandé la réinitialisation de votre mot de passe administrateur.</p>
      <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe. Ce lien est valable <strong>1 heure</strong>.</p>
      <a href="${link}" class="btn">Réinitialiser mon mot de passe</a>
      <hr class="divider" />
      <p style="font-size:13px;color:#888;">
        Si vous n'avez pas fait cette demande, ignorez cet email.<br/>
        Lien : <a href="${link}" style="color:#E63946;">${link}</a>
      </p>
    `),
  });
}

// ── 3. Reset mot de passe client ──────────────────────────────────────────────
export async function sendClientPasswordReset(to: string, name: string, token: string): Promise<boolean> {
  const link = `${FRONTEND_URL}/espace-client/reset-password?token=${token}`;
  return sendMail({
    to,
    subject: "Réinitialisation de votre mot de passe — Espace Client",
    html: baseTemplate("Réinitialisation du mot de passe", `
      <h1>Bonjour ${esc(name)},</h1>
      <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre Espace Client Epitaphe 360.</p>
      <p>Cliquez sur le bouton ci-dessous. Ce lien est valable <strong>1 heure</strong>.</p>
      <a href="${link}" class="btn">Réinitialiser mon mot de passe</a>
      <hr class="divider" />
      <p style="font-size:13px;color:#888;">
        Si vous n'avez pas fait cette demande, ignorez cet email.<br/>
        Lien : <a href="${link}" style="color:#E63946;">${link}</a>
      </p>
    `),
  });
}

// ── 4. Notification admin — nouveau message de contact ────────────────────────
export async function sendContactNotification(opts: {
  adminEmail: string;
  fromName: string;
  fromEmail: string;
  company?: string;
  message: string;
}): Promise<boolean> {
  return sendMail({
    to: opts.adminEmail,
    subject: `Nouveau message de contact — ${opts.fromName}`,
    html: baseTemplate("Nouveau message de contact", `
      <h1>Nouveau message de contact</h1>
      <p><strong>De :</strong> ${esc(opts.fromName)} (${esc(opts.fromEmail)})${opts.company ? ` — ${esc(opts.company)}` : ""}</p>
      <hr class="divider" />
      <p style="white-space:pre-wrap;">${esc(opts.message)}</p>
      <hr class="divider" />
      <a href="${FRONTEND_URL}/admin/contacts" class="btn">Voir dans l'admin</a>
    `),
  });
}

// ── 5. Confirmation client — brief projet reçu ───────────────────────────────
export async function sendBriefConfirmation(to: string, name: string, projectType: string): Promise<boolean> {
  return sendMail({
    to,
    subject: "Votre brief a bien été reçu — Epitaphe 360",
    html: baseTemplate("Brief reçu", `
      <h1>Merci ${esc(name)} !</h1>
      <p>Nous avons bien reçu votre brief pour un projet de type <strong>${esc(projectType)}</strong>.</p>
      <p>Notre équipe va analyser votre demande et vous contactera dans les <strong>48 heures ouvrées</strong>.</p>
      <a href="${FRONTEND_URL}/contact" class="btn">Nous contacter</a>
    `),
  });
}

// ── 6. Notification interne — nouveau brief projet ───────────────────────────
export async function sendBriefNotification(opts: {
  adminEmail: string;
  clientName: string;
  clientEmail: string;
  projectType: string;
  budget?: string;
  description?: string;
}): Promise<boolean> {
  return sendMail({
    to: opts.adminEmail,
    subject: `Nouveau brief projet — ${esc(opts.clientName)} (${esc(opts.projectType)})`,
    html: baseTemplate("Nouveau brief projet", `
      <h1>Nouveau brief reçu</h1>
      <p><strong>Client :</strong> ${esc(opts.clientName)} (${esc(opts.clientEmail)})</p>
      <p><strong>Type de projet :</strong> ${esc(opts.projectType)}</p>
      ${opts.budget ? `<p><strong>Budget :</strong> ${esc(opts.budget)}</p>` : ""}
      ${opts.description ? `<p><strong>Description :</strong> ${esc(opts.description)}</p>` : ""}
      <hr class="divider" />
      <a href="${FRONTEND_URL}/admin/leads" class="btn">Voir dans l'admin</a>
    `),
  });
}

// ── 7. Notification client — nouveau message de l'agence ─────────────────────
export async function sendAgencyMessageNotification(opts: {
  to: string;
  clientName: string;
  projectTitle: string;
  message: string;
}): Promise<boolean> {
  return sendMail({
    to: opts.to,
    subject: `Nouveau message sur votre projet "${esc(opts.projectTitle)}"`,
    html: baseTemplate("Nouveau message", `
      <h1>Bonjour ${esc(opts.clientName)},</h1>
      <p>Votre équipe projet vous a envoyé un nouveau message concernant <strong>${esc(opts.projectTitle)}</strong> :</p>
      <div style="background:#f8f8f8;border-left:4px solid #E63946;padding:16px;border-radius:4px;margin:16px 0;">
        <p style="margin:0;white-space:pre-wrap;">${esc(opts.message)}</p></p>
      </div>
      <a href="${FRONTEND_URL}/espace-client" class="btn">Voir dans mon espace</a>
    `),
  });
}

// ========================================
// BMI 360™ — Tunnel Discover → Intelligence → Transform
// ========================================

const TOOL_LABELS: Record<string, string> = {
  commpulse:    'CommPulse™',
  talentprint:  'TalentPrint™',
  impacttrace:  'ImpactTrace™',
  safesignal:   'SafeSignal™',
  eventimpact:  'EventImpact™',
  spacescore:   'SpaceScore™',
  finnarrative: 'FinNarrative™',
};

function toolLabel(toolId: string): string {
  return TOOL_LABELS[toolId] ?? toolId;
}

/**
 * Hint des prix Intelligence™ pour les emails de relance (sans créer
 * de dépendance circulaire avec scoring-routes). Source de vérité = serveur.
 */
export const INTELLIGENCE_PRICES_HINT: Record<string, number> = {
  commpulse:    4900,
  talentprint:  7500,
  impacttrace:  8400,
  safesignal:   7900,
  eventimpact:  7900,
  spacescore:   6500,
  finnarrative: 9900,
};

// ── 8. Discover — Score gratuit livré + upsell Intelligence ───────────────────
export async function sendDiscoverScoreEmail(opts: {
  to: string;
  name?: string;
  toolId: string;
  globalScore: number;
  maturityLevel: number;
  resultId: string;
  intelligencePriceMad: number;
}): Promise<boolean> {
  const reportUrl = `${FRONTEND_URL}/outils/${opts.toolId}?result=${opts.resultId}`;
  return sendMail({
    to: opts.to,
    subject: `Votre score Discover™ ${toolLabel(opts.toolId)} : ${opts.globalScore}/100`,
    html: baseTemplate("Votre rapport Discover™ est prêt", `
      <h1>Bonjour ${esc(opts.name ?? '')},</h1>
      <p>Merci d'avoir réalisé votre diagnostic <strong>${esc(toolLabel(opts.toolId))}</strong>.</p>
      <div style="background:#f8f8f8;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
        <div style="font-size:42px;font-weight:800;color:#C8A96E;">${opts.globalScore}<span style="font-size:18px;color:#888;">/100</span></div>
        <div style="font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.1em;">Niveau de maturité ${opts.maturityLevel}/5</div>
      </div>
      <p>Votre rapport Discover™ couvre <strong>4 piliers visibles</strong> sur 7. Pour débloquer le rapport complet généré par notre IA experte, passez au tier Intelligence™.</p>
      <p><strong>Le rapport Intelligence™ inclut :</strong></p>
      <ul style="font-size:14px;color:#444;line-height:1.8;">
        <li>Analyse experte par pilier (7 dimensions complètes)</li>
        <li>Plan d'action 30/60/90 jours priorisé</li>
        <li>Quick wins à mettre en œuvre immédiatement</li>
        <li>Identification de vos risques clés</li>
        <li>Accès au programme Transform avec un expert humain</li>
      </ul>
      <a href="${reportUrl}" class="btn">Débloquer mon rapport Intelligence™ — ${opts.intelligencePriceMad.toLocaleString('fr-MA')} MAD HT</a>
      <hr class="divider" />
      <p style="font-size:13px;color:#888;">Lien direct : <a href="${reportUrl}" style="color:#C8A96E;">${reportUrl}</a></p>
    `),
  });
}

// ── 9. Discover — Relance J+1, J+3, J+7 ───────────────────────────────────────
export async function sendDiscoverRelance(opts: {
  to: string;
  name?: string;
  toolId: string;
  globalScore: number;
  resultId: string;
  intelligencePriceMad: number;
  relanceStep: 1 | 3 | 7;
}): Promise<boolean> {
  const reportUrl = `${FRONTEND_URL}/outils/${opts.toolId}?result=${opts.resultId}`;
  const subjects: Record<number, string> = {
    1: `Vos 3 leviers d'action immédiats — ${toolLabel(opts.toolId)}`,
    3: `Ne laissez pas votre diagnostic prendre la poussière`,
    7: `Dernière chance — votre rapport Intelligence™ vous attend`,
  };
  const intros: Record<number, string> = {
    1: `Vous avez obtenu un score de <strong>${opts.globalScore}/100</strong> sur ${esc(toolLabel(opts.toolId))}. Voici comment passer à l'action.`,
    3: `Votre diagnostic révèle des leviers d'amélioration concrets. L'inaction coûte plus cher que le rapport complet.`,
    7: `Votre rapport Discover™ reste accessible. Le rapport complet Intelligence™ avec plan 90 jours est encore à portée de clic.`,
  };
  return sendMail({
    to: opts.to,
    subject: subjects[opts.relanceStep],
    html: baseTemplate("Passez à l'action", `
      <h1>${esc(opts.name ?? 'Bonjour')},</h1>
      <p>${intros[opts.relanceStep]}</p>
      <p><strong>Le rapport Intelligence™ vous donne :</strong></p>
      <ul style="font-size:14px;color:#444;line-height:1.8;">
        <li>Une analyse IA personnalisée de tous vos piliers</li>
        <li>Un plan d'action 90 jours immédiatement applicable</li>
        <li>Une session de 30 min offerte avec un expert</li>
      </ul>
      <a href="${reportUrl}" class="btn">Débloquer mon rapport — ${opts.intelligencePriceMad.toLocaleString('fr-MA')} MAD HT</a>
      <hr class="divider" />
      <p style="font-size:13px;color:#888;">Si ce message ne vous intéresse plus, ignorez-le simplement.</p>
    `),
  });
}

// ── 10. Transform — Confirmation client demande RDV expert ────────────────────
export async function sendExpertRequestConfirmation(opts: {
  to: string;
  name: string;
  toolId?: string;
}): Promise<boolean> {
  return sendMail({
    to: opts.to,
    subject: `Votre demande de RDV expert est bien reçue`,
    html: baseTemplate("Demande reçue", `
      <h1>Merci ${esc(opts.name)},</h1>
      <p>Nous avons bien reçu votre demande de consultation${opts.toolId ? ` concernant <strong>${esc(toolLabel(opts.toolId))}</strong>` : ''}.</p>
      <p>Un expert Epitaphe360 vous contactera <strong>sous 24 heures ouvrées</strong> pour planifier ensemble votre session de diagnostic et de plan d'action.</p>
      <p>Préparez si possible :</p>
      <ul style="font-size:14px;color:#444;line-height:1.8;">
        <li>Votre rapport Intelligence™ (déjà généré)</li>
        <li>2 ou 3 enjeux prioritaires de votre organisation</li>
        <li>Vos contraintes calendaires des 2 prochaines semaines</li>
      </ul>
      <a href="${FRONTEND_URL}" class="btn">Visiter Epitaphe 360</a>
    `),
  });
}

// ── 11. Transform — Notification interne équipe expert ────────────────────────
export async function sendExpertRequestNotification(opts: {
  adminEmail: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  companyName?: string;
  jobTitle?: string;
  toolId?: string;
  message?: string;
  preferredSlot?: string;
  preferredChannel?: string;
  consultationId: string;
  scoringResultId?: string;
  globalScore?: number;
}): Promise<boolean> {
  return sendMail({
    to: opts.adminEmail,
    subject: `🎯 Nouvelle demande RDV expert — ${esc(opts.contactName)}${opts.companyName ? ` (${esc(opts.companyName)})` : ''}`,
    html: baseTemplate("Nouvelle demande RDV expert", `
      <h1>Nouvelle demande de RDV Transform™</h1>
      <p><strong>Contact :</strong> ${esc(opts.contactName)} &lt;${esc(opts.contactEmail)}&gt;</p>
      ${opts.contactPhone ? `<p><strong>Téléphone :</strong> ${esc(opts.contactPhone)}</p>` : ''}
      ${opts.companyName ? `<p><strong>Société :</strong> ${esc(opts.companyName)}${opts.jobTitle ? ` — ${esc(opts.jobTitle)}` : ''}</p>` : ''}
      ${opts.toolId ? `<p><strong>Outil source :</strong> ${esc(toolLabel(opts.toolId))}</p>` : ''}
      ${opts.globalScore !== undefined ? `<p><strong>Score Intelligence™ :</strong> ${opts.globalScore}/100</p>` : ''}
      ${opts.preferredSlot ? `<p><strong>Créneau préféré :</strong> ${esc(opts.preferredSlot)}</p>` : ''}
      ${opts.preferredChannel ? `<p><strong>Canal :</strong> ${esc(opts.preferredChannel)}</p>` : ''}
      ${opts.message ? `<hr class="divider" /><p><strong>Message :</strong></p><p style="white-space:pre-wrap;">${esc(opts.message)}</p>` : ''}
      <hr class="divider" />
      <p style="font-size:12px;color:#888;">ID consultation : <code>${esc(opts.consultationId)}</code>${opts.scoringResultId ? ` · ID scoring : <code>${esc(opts.scoringResultId)}</code>` : ''}</p>
      <a href="${FRONTEND_URL}/admin/consultations" class="btn">Ouvrir dans l'admin</a>
    `),
  });
}
