/**
 * Générateur de factures PDF — Epitaphe 360
 * Génère une facture professionnelle avec TVA 20% (Maroc).
 * Utilise PDFKit pour une génération côté serveur pure Node.js.
 *
 * La facture inclut :
 * - En-tête Epitaphe 360 + coordonnées
 * - Informations client
 * - Tableau de détail (description, PU HT, TVA 20%, TTC)
 * - Numéro de facture, date d'émission, conditions de paiement
 *
 * Retourne le PDF sous forme de Buffer et l'enregistre en base64 dans la DB.
 */

import PDFDocument from 'pdfkit';
import { db } from '../db';
import { invoices, payments, settings } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { sendMail } from './email';

/** Infos société lues depuis la table settings (group: 'invoice') */
interface CompanyInfo {
  companyName:   string;
  companyCity:   string;
  companyEmail:  string;
  rc:            string;
  ice:           string;
  if_number:     string;
  payment_terms: string;
}

/** Charger les paramètres société depuis la DB */
async function loadCompanyInfo(): Promise<CompanyInfo> {
  const rows = await db.select().from(settings).where(eq(settings.group, 'invoice'));
  const d: Record<string, string> = {};
  for (const row of rows) {
    d[row.key] = row.value ?? '';
  }
  return {
    companyName:   d.companyName   || 'Epitaphe 360',
    companyCity:   d.companyCity   || 'Casablanca, Maroc',
    companyEmail:  d.companyEmail  || 'contact@epitaphe360.com',
    rc:            d.rc            || '',
    ice:           d.ice           || '',
    if_number:     d.if_number     || '',
    payment_terms: d.payment_terms || 'Paiement immédiat',
  };
}

// Couleurs Epitaphe 360
const COLOR_PRIMARY  = '#1a1a2e';  // Bleu nuit
const COLOR_ACCENT   = '#4f46e5';  // Indigo
const COLOR_LIGHT    = '#f8f9fa';  // Gris clair
const COLOR_TEXT     = '#333333';
const COLOR_MUTED    = '#6b7280';

const TVA_RATE = 20; // 20% TVA Maroc

export interface InvoiceData {
  invoiceNumber:  string;
  paymentId?:     number;
  scoringResultId?: string;
  clientEmail:    string;
  clientName:     string;
  clientCompany?: string;
  toolId:         string;
  description:    string;
  amountHT:       number;  // centimes MAD
  currency?:      string;
}

export interface InvoiceResult {
  invoiceId:    number;
  invoiceNumber: string;
  pdfBase64:    string;
  amountHT:     number;
  amountTVA:    number;
  amountTTC:    number;
}

/** Formater un montant en centimes en dirhams avec 2 décimales */
function formatMAD(centimes: number, currency = 'MAD'): string {
  return `${(centimes / 100).toFixed(2)} ${currency}`;
}

/** Générer le numéro de facture séquentiel : FAC-YYYY-XXXX */
export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const allInvoices = await db.select({ id: invoices.id })
    .from(invoices)
    .orderBy(invoices.id);
  const seq = (allInvoices.length + 1).toString().padStart(4, '0');
  return `FAC-${year}-${seq}`;
}

/** Générer le PDF de la facture en Buffer */
function buildPDFBuffer(data: InvoiceData & {
  amountTVA:   number;
  amountTTC:   number;
  issuedAt:    Date;
  companyInfo: CompanyInfo;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data',  chunk => chunks.push(chunk));
    doc.on('end',   ()    => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width - 100; // largeur utile

    // ── En-tête ──────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 90).fill(COLOR_PRIMARY);

    doc.fillColor('#ffffff')
      .fontSize(24)
      .font('Helvetica-Bold')
      .text(data.companyInfo.companyName, 50, 25);

    doc.fontSize(10)
      .font('Helvetica')
      .text('Agence Marketing & Communication Digitale', 50, 55)
      .text(`${data.companyInfo.companyCity} — ${data.companyInfo.companyEmail}`, 50, 68);

    doc.fillColor(COLOR_ACCENT)
      .fontSize(28)
      .font('Helvetica-Bold')
      .text('FACTURE', doc.page.width - 200, 30, { width: 150, align: 'right' });

    doc.fillColor('#ffffff')
      .fontSize(11)
      .font('Helvetica')
      .text(`N° ${data.invoiceNumber}`, doc.page.width - 200, 65, { width: 150, align: 'right' });

    // ── Informations facture + client ─────────────────────
    const startY = 115;

    // Bloc gauche : infos facture
    doc.fillColor(COLOR_TEXT)
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Date d\'émission :', 50, startY);
    doc.font('Helvetica')
      .text(data.issuedAt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }), 50, startY + 15);

    doc.font('Helvetica-Bold')
      .text('Condition de paiement :', 50, startY + 35);
    doc.font('Helvetica')
      .text(data.companyInfo.payment_terms, 50, startY + 50);

    // Bloc droit : infos client
    doc.rect(doc.page.width - 250, startY - 10, 200, 95)
      .fill(COLOR_LIGHT);

    doc.fillColor(COLOR_TEXT)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('FACTURÉ À', doc.page.width - 240, startY);
    doc.font('Helvetica')
      .text(data.clientName, doc.page.width - 240, startY + 15);
    if (data.clientCompany) {
      doc.text(data.clientCompany, doc.page.width - 240, startY + 30);
    }
    doc.fillColor(COLOR_MUTED)
      .text(data.clientEmail, doc.page.width - 240, startY + (data.clientCompany ? 45 : 30));

    // ── Tableau des prestations ───────────────────────────
    const tableTop = startY + 125;
    const colX = { desc: 50, pu: 310, tva: 390, ttc: 460 };

    // En-tête tableau
    doc.rect(50, tableTop, W, 25).fill(COLOR_ACCENT);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10);
    doc.text('Description', colX.desc + 5, tableTop + 8);
    doc.text('HT (MAD)', colX.pu,          tableTop + 8, { width: 70, align: 'right' });
    doc.text('TVA 20%',  colX.tva,         tableTop + 8, { width: 60, align: 'right' });
    doc.text('TTC (MAD)', colX.ttc,        tableTop + 8, { width: 70, align: 'right' });

    // Ligne de prestation
    const rowY = tableTop + 30;
    doc.rect(50, rowY - 5, W, 40).fill(COLOR_LIGHT);

    doc.fillColor(COLOR_TEXT).font('Helvetica-Bold').fontSize(10)
      .text(data.description, colX.desc + 5, rowY, { width: 250 });
    doc.font('Helvetica').fontSize(9)
      .text(`Outil : ${data.toolId.toUpperCase()}`, colX.desc + 5, rowY + 15, { width: 250 });

    doc.font('Helvetica').fontSize(10)
      .text(formatMAD(data.amountHT, ''),      colX.pu,   rowY + 5, { width: 70, align: 'right' })
      .text(formatMAD(data.amountTVA, ''),     colX.tva,  rowY + 5, { width: 60, align: 'right' })
      .text(formatMAD(data.amountTTC, ''),     colX.ttc,  rowY + 5, { width: 70, align: 'right' });

    // Séparateur
    doc.moveTo(50, rowY + 45).lineTo(50 + W, rowY + 45).strokeColor('#dddddd').stroke();

    // ── Totaux ────────────────────────────────────────────
    const totTop = rowY + 60;
    const totX   = colX.pu;
    const totW   = 70 + 10 + 60 + 10 + 70; // largeur totale colonnes HT+TVA+TTC

    doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(10);
    doc.text('Total HT :',           50,   totTop, { continued: false });
    doc.text(formatMAD(data.amountHT),  totX, totTop, { width: totW, align: 'right' });

    doc.text('TVA 20% :',            50,   totTop + 18);
    doc.text(formatMAD(data.amountTVA), totX, totTop + 18, { width: totW, align: 'right' });

    doc.rect(50, totTop + 35, W, 28).fill(COLOR_PRIMARY);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(12);
    doc.text('TOTAL TTC :',              55,   totTop + 43);
    doc.text(formatMAD(data.amountTTC),  totX, totTop + 43, { width: totW, align: 'right' });

    // ── Pied de page ──────────────────────────────────────
    const footerY = doc.page.height - 60;
    doc.rect(0, footerY, doc.page.width, 60).fill(COLOR_LIGHT);

    doc.fillColor(COLOR_MUTED).fontSize(8).font('Helvetica');
    const legalLine = [data.companyInfo.companyName,
      data.companyInfo.rc  ? `RC : ${data.companyInfo.rc}`   : null,
      data.companyInfo.ice ? `ICE : ${data.companyInfo.ice}` : null,
      data.companyInfo.if_number ? `IF : ${data.companyInfo.if_number}` : null,
    ].filter(Boolean).join(' — ');
    doc.text(legalLine, 50, footerY + 10, { align: 'center', width: W });
    doc.text(
      `Cette facture est générée automatiquement. TVA à 20% conformément à la législation marocaine.`,
      50, footerY + 25, { align: 'center', width: W },
    );
    doc.text(
      `Facture N° ${data.invoiceNumber} — www.epitaphe360.com`,
      50, footerY + 40, { align: 'center', width: W },
    );

    doc.end();
  });
}

/**
 * Créer et persister une facture en base + envoyer par email.
 * Retourne les données de la facture créée.
 */
export async function createAndSendInvoice(data: InvoiceData): Promise<InvoiceResult> {
  const amountTVA = Math.round(data.amountHT * TVA_RATE / 100);
  const amountTTC = data.amountHT + amountTVA;
  const issuedAt  = new Date();
  const currency  = data.currency ?? 'MAD';

  // Charger la configuration société depuis la DB
  const companyInfo = await loadCompanyInfo();

  // Générer le PDF
  const pdfBuffer = await buildPDFBuffer({
    ...data,
    amountTVA,
    amountTTC,
    issuedAt,
    companyInfo,
  });
  const pdfBase64 = pdfBuffer.toString('base64');

  // Insérer en base
  const [invoice] = await db.insert(invoices).values({
    invoiceNumber:  data.invoiceNumber,
    paymentId:      data.paymentId,
    scoringResultId: data.scoringResultId,
    clientEmail:    data.clientEmail,
    clientName:     data.clientName,
    clientCompany:  data.clientCompany,
    toolId:         data.toolId,
    description:    data.description,
    amountHT:       data.amountHT,
    tvaRate:        TVA_RATE,
    amountTVA:      amountTVA,
    amountTTC:      amountTTC,
    currency:       currency,
    status:         'sent',
    pdfBase64:      pdfBase64,
    issuedAt:       issuedAt,
    sentAt:         issuedAt,
  }).returning();

  // Lier le paiement à cette facture si l'ID est fourni
  if (data.paymentId) {
    await db.update(payments)
      .set({ invoiceId: invoice.id })
      .where(eq(payments.id, data.paymentId));
  }

  // Envoyer par email avec le PDF en pièce jointe
  try {
    await sendMail({
      to:      data.clientEmail,
      subject: `Facture ${data.invoiceNumber} — Epitaphe 360`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a2e; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">Epitaphe 360</h2>
            <p style="margin: 5px 0; opacity: 0.8;">Votre facture est disponible</p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
            <p>Bonjour <strong>${data.clientName}</strong>,</p>
            <p>Merci pour votre paiement. Veuillez trouver ci-joint votre facture <strong>${data.invoiceNumber}</strong>.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background: #e9ecef;">
                <td style="padding: 8px; font-weight: bold;">Prestation</td>
                <td style="padding: 8px;">${data.description}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Montant HT</td>
                <td style="padding: 8px;">${(data.amountHT / 100).toFixed(2)} ${currency}</td>
              </tr>
              <tr style="background: #e9ecef;">
                <td style="padding: 8px; font-weight: bold;">TVA 20%</td>
                <td style="padding: 8px;">${(amountTVA / 100).toFixed(2)} ${currency}</td>
              </tr>
              <tr style="background: #1a1a2e; color: white;">
                <td style="padding: 10px; font-weight: bold; font-size: 16px;">TOTAL TTC</td>
                <td style="padding: 10px; font-size: 16px;">${(amountTTC / 100).toFixed(2)} ${currency}</td>
              </tr>
            </table>
            <p style="color: #6b7280; font-size: 12px;">
              TVA à 20% conformément à la législation fiscale marocaine.
            </p>
            <p>Cordialement,<br><strong>L'équipe Epitaphe 360</strong></p>
          </div>
        </div>
      `,
      attachments: [{
        filename: `facture-${data.invoiceNumber}.pdf`,
        content:  pdfBuffer,
        contentType: 'application/pdf',
      }],
    });
  } catch (emailError) {
    console.error('[Invoice] Envoi email facture échoué:', emailError);
    // Ne pas bloquer le flux si l'email échoue
  }

  return {
    invoiceId:     invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    pdfBase64,
    amountHT:      data.amountHT,
    amountTVA,
    amountTTC,
  };
}
