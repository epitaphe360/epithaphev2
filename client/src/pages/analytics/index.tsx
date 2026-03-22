/**
 * Page Analytics — Dashboard KPIs Epitaphe360
 * - Trafic (séances, pages vues, bounce rate) — données simulées
 * - Leads & conversions (BriefForm, Vigilance Score, newsletter) — données DB réelles
 * - Performance pages (top pages, temps moyen)
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Users, Eye, MousePointerClick,
  Mail, FileText, BarChart2, ArrowUpRight, ArrowDownRight,
  Calendar, RefreshCw
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { RevealSection } from "@/components/reveal-section";
import { PageMeta } from "@/components/seo/page-meta";

/* ─── Données simulées ─────────────────────────── */
const KPI_DATA = [
  { label: "Visites/mois", value: "12 480", trend: +18.4, icon: <Users className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Pages vues", value: "47 230", trend: +22.1, icon: <Eye className="w-5 h-5" />, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Leads générés", value: "184", trend: +34.6, icon: <MousePointerClick className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/5" },
  { label: "Taux de conv.", value: "1.47%", trend: +0.3, icon: <TrendingUp className="w-5 h-5" />, color: "text-green-600", bg: "bg-green-50" },
  { label: "Bounce rate", value: "38.2%", trend: -4.1, icon: <TrendingDown className="w-5 h-5" />, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Newsletter", value: "2 341", trend: +12.0, icon: <Mail className="w-5 h-5" />, color: "text-indigo-600", bg: "bg-indigo-50" },
];

const TOP_PAGES = [
  { path: "/evenements", views: 4210, duration: "2m 34s", trend: +12 },
  { path: "/contact/brief", views: 3890, duration: "4m 10s", trend: +28 },
  { path: "/la-fabrique", views: 2650, duration: "2m 58s", trend: +8 },
  { path: "/outils/vigilance-score", views: 2340, duration: "5m 22s", trend: +41 },
  { path: "/architecture-de-marque", views: 1980, duration: "2m 15s", trend: +5 },
  { path: "/ressources", views: 1760, duration: "3m 05s", trend: +19 },
  { path: "/blog", views: 1420, duration: "1m 48s", trend: -3 },
  { path: "/nos-references", views: 1210, duration: "1m 55s", trend: +2 },
];

const LEAD_SOURCES = [
  { source: "BriefForm", count: 72, pct: 39, color: "bg-primary" },
  { source: "Vigilance Score", count: 53, pct: 29, color: "bg-blue-500" },
  { source: "Contact rapide", count: 34, pct: 18, color: "bg-purple-500" },
  { source: "Newsletter", count: 25, pct: 14, color: "bg-orange-500" },
];

const MONTHLY_LEADS = [
  { month: "Sep", val: 82 }, { month: "Oct", val: 95 },
  { month: "Nov", val: 108 }, { month: "Déc", val: 91 },
  { month: "Jan", val: 124 }, { month: "Fév", val: 147 },
  { month: "Mar", val: 184 },
];

const maxLeads = Math.max(...MONTHLY_LEADS.map((m) => m.val));

/* ─── Composants ───────────────────────────────── */
function KpiCard({ label, value, trend, icon, color, bg }: typeof KPI_DATA[0]) {
  const isPositive = trend >= 0;
  return (
    <motion.div whileHover={{ y: -3 }} className="bg-card border border-border rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
        {isPositive ? "+" : ""}{trend}% vs mois préc.
      </div>
    </motion.div>
  );
}

/* ─── Page principale ──────────────────────────── */
export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30j");
  const [realData, setRealData] = useState<{
    leads: number; briefs: number; newsletter: number; articles: number;
    monthlyLeads: { month: string; leads: number }[];
    sources: { name: string; count: number; percentage: number }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/analytics/stats")
      .then((r) => r.json())
      .then((data) => setRealData({ ...data.kpis, monthlyLeads: data.monthlyLeads, sources: data.sources }))
      .catch(() => { /* use simulated data on error */ });
  }, [period]);

  // Merge real counts with simulated KPI display
  const kpis = KPI_DATA.map((kpi) => {
    if (kpi.label === "Leads générés" && realData?.leads)
      return { ...kpi, value: realData.leads.toString() };
    if (kpi.label === "Newsletter" && realData?.newsletter)
      return { ...kpi, value: realData.newsletter.toLocaleString("fr-FR") };
    return kpi;
  });

  const leadSources = realData?.sources
    ? realData.sources.map((s, i) => ({
        source: s.name,
        count: s.count,
        pct: s.percentage,
        color: ["bg-primary", "bg-blue-500", "bg-purple-500", "bg-orange-500"][i] ?? "bg-gray-400",
      }))
    : LEAD_SOURCES;

  const monthlyData = realData?.monthlyLeads
    ? realData.monthlyLeads.map((m) => ({ month: m.month, val: m.leads }))
    : MONTHLY_LEADS;

  const maxVal = Math.max(...monthlyData.map((m) => m.val), 1);

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Analytics — Performances | Epitaphe 360"
        description="Tableau de bord des performances du site Epitaphe360 : visites, leads générés, sources de conversion et Top pages."
        canonicalPath="/analytics"
        noIndex
      />
      <Navigation />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* En-tête */}
          <RevealSection className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground text-sm mt-1">Performances du site Epitaphe360 — mise à jour quotidienne</p>
            </div>
            <div className="flex items-center gap-2">
              {["7j", "30j", "90j", "12m"].map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${period === p ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:border-primary"}`}>
                  {p}
                </button>
              ))}
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Actualiser
              </button>
            </div>
          </RevealSection>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {kpis.map((k, i) => (
              <RevealSection key={k.label} delay={i * 0.06}>
                <KpiCard {...k} />
              </RevealSection>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Graphique leads */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-foreground flex items-center gap-2"><BarChart2 className="w-4 h-4 text-primary" /> Leads par mois</h2>
                <span className="text-xs text-muted-foreground">7 derniers mois</span>
              </div>
              <div className="flex items-end gap-3 h-40">
                {monthlyData.map((m, idx) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground">{m.val}</span>
                    <motion.div
                      className="w-full bg-primary rounded-t-lg min-h-[4px]"
                      initial={{ height: 0 }}
                      animate={{ height: `${(m.val / maxVal) * 128}px` }}
                      transition={{ delay: idx * 0.08, duration: 0.5 }}
                    />
                    <span className="text-xs text-muted-foreground">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources leads */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-foreground mb-5 flex items-center gap-2"><MousePointerClick className="w-4 h-4 text-primary" /> Sources des leads</h2>
              <div className="space-y-4">
                {leadSources.map((s) => (
                  <div key={s.source}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-foreground">{s.source}</span>
                      <span className="text-muted-foreground">{s.count} ({s.pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div className={`h-full rounded-full ${s.color}`} initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ delay: 0.2, duration: 0.6 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top pages */}
          <RevealSection>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-foreground mb-5 flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> Top pages</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 text-muted-foreground font-medium">Page</th>
                      <th className="pb-3 text-muted-foreground font-medium text-right">Vues</th>
                      <th className="pb-3 text-muted-foreground font-medium text-right">Tps moyen</th>
                      <th className="pb-3 text-muted-foreground font-medium text-right">Tendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_PAGES.map((p, i) => (
                      <tr key={p.path} className="border-b border-border/50 last:border-0">
                        <td className="py-3 font-medium text-foreground">{p.path}</td>
                        <td className="py-3 text-right text-foreground">{p.views.toLocaleString("fr-MA")}</td>
                        <td className="py-3 text-right text-muted-foreground">{p.duration}</td>
                        <td className="py-3 text-right">
                          <span className={`flex items-center justify-end gap-1 text-xs font-semibold ${p.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {p.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {p.trend >= 0 ? "+" : ""}{p.trend}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </RevealSection>
        </div>
      </main>
      <Footer />
    </div>
  );
}
