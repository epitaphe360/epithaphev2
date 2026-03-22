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
