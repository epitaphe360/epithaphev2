/**
 * VigRecap — Document PDF du rapport Vigilance Score™
 * Utilise @react-pdf/renderer
 * Export: generateVigilancePDF(score, level, answers) → déclenche le téléchargement
 */
import { pdf, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

/* ─── Styles ──────────────────────────────────── */
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    padding: 40,
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: "2 solid #e5e7eb",
  },
  brand: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#d1295a" },
  brandSub: { fontSize: 9, color: "#6b7280", marginTop: 2 },
  docTitle: { fontSize: 9, color: "#6b7280", textAlign: "right" },
  date: { fontSize: 8, color: "#9ca3af", marginTop: 2, textAlign: "right" },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 10, color: "#111827" },
  scoreBox: {
    backgroundColor: "#fdf2f8",
    borderRadius: 8,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },
  scoreBig: { fontSize: 52, fontFamily: "Helvetica-Bold", color: "#d1295a" },
  scoreLabel: { fontSize: 11, color: "#6b7280" },
  levelBadge: {
    backgroundColor: "#d1295a",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  levelText: { color: "#ffffff", fontSize: 10, fontFamily: "Helvetica-Bold" },
  barRow: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 },
  barLabel: { width: 110, fontSize: 9, color: "#374151" },
  barBg: { flex: 1, backgroundColor: "#f3f4f6", height: 8, borderRadius: 4 },
  barFill: { backgroundColor: "#d1295a", height: 8, borderRadius: 4 },
  barPct: { width: 30, fontSize: 9, textAlign: "right", color: "#6b7280" },
  recBox: {
    backgroundColor: "#fdf2f8",
    borderRadius: 6,
    padding: 14,
    borderLeft: "3 solid #d1295a",
  },
  recTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#d1295a", marginBottom: 4 },
  recText: { fontSize: 9.5, color: "#374151", lineHeight: 1.5 },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", borderTop: "1 solid #e5e7eb", paddingTop: 10 },
  footerText: { fontSize: 8, color: "#9ca3af" },
  qRow: { flexDirection: "row", marginBottom: 6, gap: 8 },
  qDot: { width: 14, height: 14, backgroundColor: "#d1295a", borderRadius: 7, marginTop: 1, flexShrink: 0 },
  qText: { fontSize: 9.5, color: "#374151", flex: 1, lineHeight: 1.4 },
  qAnswer: { fontSize: 9, color: "#6b7280", marginTop: 2, fontStyle: "italic" },
});

/* ─── Types ───────────────────────────────────── */
interface QuestionResult {
  category: string;
  question: string;
  answer: string;
  score: number;
  maxScore: number;
}

interface VigReport {
  score: number;
  level: string;
  levelDescription: string;
  recommendation: string;
  questions: QuestionResult[];
  date: string;
  companyEmail?: string;
}

/* ─── Document PDF ────────────────────────────── */
function VigReportPDF({ data }: { data: VigReport }) {
  return (
    <Document title={`Vigilance Score™ — Epitaphe360 — ${data.date}`} author="Epitaphe360">
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>epitaphe360</Text>
            <Text style={styles.brandSub}>Communication & Événementiel · Casablanca, Maroc</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>Rapport Vigilance Score™ QHSE</Text>
            <Text style={styles.date}>Généré le {data.date}</Text>
            {data.companyEmail && <Text style={styles.date}>{data.companyEmail}</Text>}
          </View>
        </View>

        {/* Score global */}
        <View style={styles.scoreBox}>
          <Text style={styles.scoreBig}>{data.score}</Text>
          <View>
            <Text style={styles.scoreLabel}>Score sur 100</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{data.level}</Text>
            </View>
          </View>
        </View>

        {/* Résultats par domaine */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résultats par domaine</Text>
          {data.questions.map((q) => {
            const pct = Math.round((q.score / q.maxScore) * 100);
            return (
              <View key={q.category} style={styles.barRow}>
                <Text style={styles.barLabel}>{q.category}</Text>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${pct}%` }]} />
                </View>
                <Text style={styles.barPct}>{pct}%</Text>
              </View>
            );
          })}
        </View>

        {/* Description & recommandation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analyse & Recommandations</Text>
          <Text style={[styles.recText, { marginBottom: 10 }]}>{data.levelDescription}</Text>
          <View style={styles.recBox}>
            <Text style={styles.recTitle}>Recommandation Epitaphe360</Text>
            <Text style={styles.recText}>{data.recommendation}</Text>
          </View>
        </View>

        {/* Détail réponses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail des réponses</Text>
          {data.questions.map((q, i) => (
            <View key={i} style={styles.qRow}>
              <View style={styles.qDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.qText}><Text style={{ fontFamily: "Helvetica-Bold" }}>{q.category} : </Text>{q.question}</Text>
                <Text style={styles.qAnswer}>→ {q.answer} ({q.score}/{q.maxScore} pts)</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pied de page */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>© Epitaphe360 — www.epitaphe360.ma — +212 5 22 XX XX XX</Text>
          <Text style={styles.footerText}>Ce rapport est confidentiel et destiné à l'usage interne de votre organisation.</Text>
        </View>
      </Page>
    </Document>
  );
}

/* ─── API publique ────────────────────────────── */
export async function generateVigilancePDF(data: VigReport): Promise<void> {
  const blob = await pdf(<VigReportPDF data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Vigilance-Score-Epitaphe360-${data.score}pts.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export type { VigReport, QuestionResult };
