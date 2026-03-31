/**
 * Email service — Epitaphe 360
 * Wraps nodemailer with env-based SMTP configuration.
 * Falls back gracefully (console.log) when SMTP_HOST is not set.
 */
import nodemailer from "nodemailer";

const isDev = !process.env.SMTP_HOST;

const transporter = isDev
  ? null
  : nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

const FROM = process.env.EMAIL_FROM ?? "Epitaphe 360 <no-reply@epitaphe360.ma>";
const ADMIN = process.env.EMAIL_ADMIN ?? "contact@epitaphe360.ma";

async function send(options: nodemailer.SendMailOptions): Promise<void> {
  if (!transporter) {
    // Dev fallback — log instead of sending
    console.log("[EMAIL DEV]", options.subject, "→", options.to);
    console.log(options.text ?? options.html ?? "");
    return;
  }
  await transporter.sendMail({ from: FROM, ...options });
}

/* ── Emails newsletter ──────────────────────────────────────────────────── */

export async function sendNewsletterConfirmation(email: string): Promise<void> {
  await send({
    to: email,
    subject: "Bienvenue dans la newsletter Epitaphe 360 ✅",
    text: `Bonjour,\n\nVous êtes maintenant abonné(e) à la newsletter Epitaphe 360.\n\nVous recevrez nos dernières actualités, tendances et ressources directement dans votre boîte mail.\n\nÀ bientôt,\nL'équipe Epitaphe 360`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#d1295a">Bienvenue dans la newsletter Epitaphe 360 ✅</h2>
        <p>Bonjour,</p>
        <p>Vous êtes maintenant abonné(e) à la newsletter <strong>Epitaphe 360</strong>.</p>
        <p>Vous recevrez nos dernières actualités, tendances et ressources directement dans votre boîte mail.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="font-size:12px;color:#888">Pour vous désabonner, <a href="https://www.epitaphe360.ma/newsletter/unsubscribe?email=${encodeURIComponent(email)}">cliquez ici</a>.</p>
      </div>
    `,
  });
}

/* ── Emails brief projet ────────────────────────────────────────────────── */

export async function sendBriefConfirmation(email: string, name: string, projectType: string): Promise<void> {
  await send({
    to: email,
    subject: "Votre brief a bien été reçu — Epitaphe 360",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#d1295a">Votre brief a bien été reçu 🎉</h2>
        <p>Bonjour ${name},</p>
        <p>Nous avons bien reçu votre brief pour votre projet <strong>${projectType}</strong>.</p>
        <p>Notre équipe va l'analyser et vous contactera dans les <strong>48 heures ouvrées</strong> pour organiser un premier échange.</p>
        <p>En attendant, n'hésitez pas à nous joindre via WhatsApp ou par email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="font-size:12px;color:#888">Epitaphe 360 — Agence événementielle &amp; communication</p>
      </div>
    `,
  });
}

export async function sendBriefNotificationToAdmin(data: {
  name: string; email: string; company?: string; projectType: string; budget?: string; message?: string;
}): Promise<void> {
  await send({
    to: ADMIN,
    subject: `[Nouveau brief] ${data.name} — ${data.projectType}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#d1295a">Nouveau brief reçu</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;font-weight:bold;color:#555">Nom</td><td>${data.name}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555">Email</td><td>${data.email}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555">Société</td><td>${data.company ?? "—"}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555">Type de projet</td><td>${data.projectType}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555">Budget</td><td>${data.budget ?? "—"}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555">Message</td><td>${data.message ?? "—"}</td></tr>
        </table>
        <p style="margin-top:16px"><a href="https://www.epitaphe360.ma/admin/leads" style="background:#d1295a;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Voir dans le CMS →</a></p>
      </div>
    `,
  });
}

/* ── Emails formulaire contact ──────────────────────────────────────────── */

export async function sendContactConfirmation(email: string, name: string): Promise<void> {
  await send({
    to: email,
    subject: "Votre message a bien été reçu — Epitaphe 360",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#d1295a">Message bien reçu ✅</h2>
        <p>Bonjour ${name},</p>
        <p>Merci pour votre message. Notre équipe vous contactera dans les plus brefs délais.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="font-size:12px;color:#888">Epitaphe 360 — Agence événementielle &amp; communication</p>
      </div>
    `,
  });
}

export async function sendContactNotificationToAdmin(data: {
  name: string; email: string; subject: string; message: string;
}): Promise<void> {
  await send({
    to: ADMIN,
    subject: `[Contact] ${data.name} — ${data.subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#d1295a">Nouveau message de contact</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;font-weight:bold;color:#555">Nom</td><td>${data.name}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555">Email</td><td>${data.email}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555">Sujet</td><td>${data.subject}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555">Message</td><td style="white-space:pre-wrap">${data.message}</td></tr>
        </table>
        <p style="margin-top:16px"><a href="https://www.epitaphe360.ma/admin/contacts" style="background:#d1295a;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Voir dans le CMS →</a></p>
      </div>
    `,
  });
}

/* ── Emails Scoring / Lead Gen ───────────────────────────────────────────────────────────── */

export async function sendScoringResultEmail(email: string, name: string, data: { sourceTool: string, magicLinkUrl: string }): Promise<void> {
  await send({
    to: email,
    subject: `Vos résultats d'audit ${data.sourceTool} sont prêts ! — Epitaphe 360`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:12px;">
        <h2 style="color:#6366F1;margin-bottom:8px;">Votre diagnostic ${data.sourceTool} est prêt ! 🚀</h2>
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Merci d'avoir complété notre diagnostic <strong>${data.sourceTool}</strong>. L'analyse de vos réponses est terminée.</p>
        <p>Pour des raisons de confidentialité, votre rapport détaillé et vos recommandations sont stockés dans votre Espace Privé Epitaphe360, généré à l'instant pour vous.</p>
        
        <div style="text-align: center; margin: 36px 0;">
          <a href="${data.magicLinkUrl}" style="background-color: #6366F1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Découvrir mon plan d'action</a>
        </div>
        
        <p style="font-size:14px;"><em>Ce bouton (Magic Link) vous connecte automatiquement et de façon sécurisée à votre Espace Client.</em></p>
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0" />
        <p style="font-size:12px;color:#888;text-align:center;">
          <strong>Epitaphe 360</strong> — Intelligence Stratégique & Audit<br/>
          <a href="https://epitaphe360.ma" style="color:#888;">www.epitaphe360.ma</a>
        </p>
      </div>
    `,
  });
}

export async function sendScoringNotificationToAdmin(data: { name: string; email: string; company?: string; sourceTool: string }): Promise<void> {
  await send({
    to: ADMIN,
    subject: `✨ [Lead Qualifié] Nouveau profil capturé via ${data.sourceTool}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background-color:#fafafa;border-radius:12px">
        <h2 style="color:#111;margin-top:0;">⚡ Nouveau Lead Capturé (Email-Gate)</h2>
        <div style="background:#fff;padding:20px;border-radius:8px;margin-top:16px;">
          <table style="width:100%;border-collapse:collapse;font-size:15px;">
            <tr><td style="padding:8px 0;color:#555;width:30%;"><strong>Nom</strong></td><td>${data.name}</td></tr>
            <tr><td style="padding:8px 0;color:#555;"><strong>Email</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#555;"><strong>Société</strong></td><td>${data.company ?? "Non renseigné"}</td></tr>
            <tr><td style="padding:8px 0;color:#555;"><strong>Outil Source</strong></td><td><span style="background:#e0e7ff;color:#4f46e5;padding:4px 8px;border-radius:4px;font-size:13px;font-weight:bold;">${data.sourceTool}</span></td></tr>
          </table>
        </div>
        <p style="margin-top:24px;text-align:center;">
          <a href="https://www.epitaphe360.ma/admin/clients" style="background:#111;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">Voir dans le Dashboard Admin →</a>
        </p>
      </div>
    `,
  });
}

// ── Utilitaires génériques ──────────────────────────────────────────────────

/** Envoi générique — wraps le transporteur interne */
export async function sendEmail(options: nodemailer.SendMailOptions): Promise<void> {
  await send(options);
}

/** Confirmation de paiement / abonnement */
export async function sendPaymentConfirmation(
  email: string,
  name: string,
  data: {
    type: "subscription" | "devis";
    planName?: string;
    amount: number;
    currency?: string;
    billingCycle?: string;
    reference?: string;
  }
): Promise<void> {
  const amountFormatted = (data.amount / 100).toLocaleString("fr-MA", {
    style: "currency",
    currency: data.currency ?? "MAD",
    minimumFractionDigits: 0,
  });

  const subject =
    data.type === "subscription"
      ? `✅ Confirmation d'abonnement — ${data.planName ?? "Epitaphe360"}`
      : `✅ Devis accepté — ${data.reference ?? ""}`.trim();

  const bodyHtml =
    data.type === "subscription"
      ? `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#fafafa;border-radius:12px">
          <h2 style="color:#111;margin-top:0;">Bienvenue sur Epitaphe360 ${data.planName} !</h2>
          <p>Bonjour ${name},</p>
          <p>Votre abonnement <strong>${data.planName}</strong> est maintenant actif.</p>
          <table style="width:100%;border-collapse:collapse;font-size:15px;margin-top:16px;">
            <tr><td style="padding:6px 0;color:#555;"><strong>Plan</strong></td><td>${data.planName}</td></tr>
            <tr><td style="padding:6px 0;color:#555;"><strong>Montant</strong></td><td>${amountFormatted} / ${data.billingCycle === "annual" ? "an" : "mois"}</td></tr>
          </table>
          <p style="margin-top:24px;">
            <a href="https://www.epitaphe360.ma/espace-client/abonnement" style="background:#111;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Gérer mon abonnement →</a>
          </p>
        </div>`
      : `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#fafafa;border-radius:12px">
          <h2 style="color:#111;margin-top:0;">Devis ${data.reference} accepté</h2>
          <p>Bonjour ${name},</p>
          <p>Nous avons bien reçu votre acceptation du devis <strong>${data.reference}</strong>.</p>
          <p>Montant : <strong>${amountFormatted}</strong></p>
          <p>Notre équipe vous contactera très prochainement pour démarrer votre projet.</p>
          <p style="margin-top:24px;">
            <a href="https://www.epitaphe360.ma/espace-client" style="background:#111;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Accéder à mon espace →</a>
          </p>
        </div>`;

  await send({ from: FROM, to: email, subject, html: bodyHtml });
}
