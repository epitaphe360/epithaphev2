// ========================================
// CMS Dashboard - Agency Premium Edition
// ========================================

import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
  Users,
  Target,
  FileText,
  MessageSquare,
  Mail,
  Newspaper,
  BarChart2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Layers,
  Globe,
  MapPin,
  Smartphone,
  MousePointerClick,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DashboardStats {
  articles: number;
  events: number;
  pages: number;
  leads: number;
  newLeads: number;
  references: number;
  caseStudies: number;
  testimonials: number;
  teamMembers: number;
  services: number;
  newsletter: number;
  contacts: number;
  recentLeads: any[];
  recentArticles: any[];
}

interface ChartPoint {
  date: string;
  articles: number;
  leads: number;
}

const StatCard = ({ title, value, subtext, trend, icon: Icon, color = '#EC4899', delay }: any) => (
  <div
    className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 transition-all duration-500 hover:border-[#EC4899]/30 hover:shadow-xl hover:shadow-[#EC4899]/8 hover:-translate-y-0.5"
    style={{ animation: `fadeInUp 0.6s ease-out ${delay}s backwards` }}
  >
    <div className="absolute top-0 right-0 p-5 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500">
      <Icon className="w-20 h-20 text-gray-900 transform translate-x-4 -translate-y-4" />
    </div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-2xl bg-gray-100/50 border border-gray-300/40 text-[#EC4899] group-hover:bg-[#EC4899] group-hover:text-gray-700 transition-colors">
          <Icon className="w-[18px] h-[18px]" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            trend > 0
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend > 0 ? '+' : ''}{trend}
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-xs font-semibold tracking-[0.12em] uppercase mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
      </div>
      <p className="text-gray-500 text-xs mt-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]/80"></span>
        {subtext}
      </p>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200 p-4 rounded-xl shadow-2xl">
        <p className="text-gray-400 text-xs mb-2 font-medium uppercase tracking-wider">{label}</p>
        <div className="space-y-1">
          {payload[0] && (
            <p className="text-gray-900 text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EC4899]"></span>
              {payload[0].value} Articles
            </p>
          )}
          {payload[1] && (
            <p className="text-gray-300 text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              {payload[1].value} Leads
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

function buildChartData(recentArticles: any[], recentLeads: any[]): ChartPoint[] {
  const days = 14;
  const map: Record<string, ChartPoint> = {};

  for (let i = days - 1; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const key = format(d, 'dd MMM', { locale: fr });
    map[key] = { date: key, articles: 0, leads: 0 };
  }

  for (const a of recentArticles) {
    try {
      const key = format(parseISO(a.createdAt), 'dd MMM', { locale: fr });
      if (map[key]) map[key].articles++;
    } catch {}
  }

  for (const l of recentLeads) {
    try {
      const key = format(parseISO(l.createdAt), 'dd MMM', { locale: fr });
      if (map[key]) map[key].leads++;
    } catch {}
  }

  return Object.values(map);
}

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30J');

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    try {
      const { getApi } = await import('../lib/api');
      const api = getApi();
      const res = await api.stats.getDashboard();
      const s: DashboardStats = res;
      setStats(s);
      setChartData(buildChartData(s.recentArticles ?? [], s.recentLeads ?? []));
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-2 border-[#EC4899]/20 border-t-[#EC4899] rounded-full animate-spin" />
          <p className="mt-4 text-[#EC4899]/50 text-xs font-bold uppercase tracking-widest animate-pulse">Chargement du tableau de bord</p>
        </div>
      </div>
    );
  }

  const s = stats;
  const conversionRate = s && (s.leads + s.contacts) > 0
    ? Math.round((s.leads / (s.leads + s.contacts)) * 100)
    : 0;

  return (
    <div className="min-h-full p-4 md:p-6 lg:p-8 text-gray-700 fade-in">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeInUp 0.8s ease-out; }
      `}</style>

      <div className="mx-auto w-full max-w-7xl">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 md:mb-10">
          <div>
            <h2 className="text-[#EC4899] font-bold text-xs uppercase tracking-widest mb-2">Vue d'ensemble</h2>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F08080] to-[#EC4899]">Agence</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-gray-200">
            {['7J', '30J', '90J', '1A'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  selectedPeriod === period
                    ? 'bg-[#EC4899] text-gray-900 shadow-lg shadow-[#EC4899]/20'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* BENTO STATS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
          <StatCard title="Contenus publiés" value={(s?.articles ?? 0) + (s?.events ?? 0)} subtext={`${s?.articles ?? 0} articles · ${s?.events ?? 0} événements`} icon={FileText} delay={0} />
          <StatCard title="Leads & Contacts" value={(s?.leads ?? 0) + (s?.contacts ?? 0)} subtext={`${s?.newLeads ?? 0} nouveau${(s?.newLeads ?? 0) !== 1 ? 'x' : ''} ce mois`} trend={s?.newLeads ?? 0} icon={Users} delay={0.1} />
          <StatCard title="Abonnés newsletter" value={s?.newsletter ?? 0} subtext="Abonnés actifs" icon={Mail} delay={0.2} />
          <StatCard title="Taux conversion" value={`${conversionRate}%`} subtext="Leads / (Leads + Contacts)" icon={Target} delay={0.3} />
        </div>

        {/* CHART + DEVICES */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6 mb-6">

          {/* Chart */}
          <div className="xl:col-span-3 rounded-3xl bg-white border border-gray-200 p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900">Activité — 14 derniers jours</h3>
                <p className="text-gray-500 text-sm mt-1">Articles créés et leads reçus</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-[#EC4899]"></span> Articles
                </span>
                <span className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> Leads
                </span>
              </div>
            </div>
            <div className="h-[280px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} dx={-10} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="articles" stroke="#EC4899" strokeWidth={2.5} fillOpacity={1} fill="url(#colorArticles)" />
                  <Area type="monotone" dataKey="leads" stroke="#a855f7" strokeWidth={2.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorLeads)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Content counts */}
          <div className="xl:col-span-1 space-y-4">
            <div className="rounded-3xl bg-white border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Inventaire Contenu</h3>
              <div className="space-y-3">
                {[
                  { label: 'Services', value: s?.services ?? 0, icon: Layers },
                  { label: 'Références', value: s?.references ?? 0, icon: CheckCircle2 },
                  { label: 'Études de cas', value: s?.caseStudies ?? 0, icon: BarChart2 },
                  { label: 'Témoignages', value: s?.testimonials ?? 0, icon: MessageSquare },
                  { label: 'Pages', value: s?.pages ?? 0, icon: Globe },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Icon className="w-3.5 h-3.5 text-slate-600" />
                      {label}
                    </div>
                    <span className="text-gray-900 font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/admin/articles/new">
              <button className="w-full py-3.5 bg-[#EC4899] hover:bg-[#c8313d] text-gray-900 rounded-2xl font-bold tracking-wide transition-all shadow-lg shadow-[#EC4899]/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> NOUVEL ARTICLE
              </button>
            </Link>
          </div>
        </div>

        {/* BOTTOM — Recent activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 pb-8">

          {/* Recent leads */}
          <div className="rounded-3xl bg-white border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Derniers Leads</h3>
              <Link href="/admin/leads">
                <span className="text-xs text-gray-500 hover:text-[#EC4899] transition-colors cursor-pointer">Voir tout →</span>
              </Link>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {(s?.recentLeads ?? []).length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">Aucun lead récent</div>
              ) : (
                (s?.recentLeads ?? []).slice(0, 5).map((lead: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-100/40 transition">
                    <div className="w-8 h-8 rounded-full bg-[#EC4899]/20 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-[#EC4899]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium truncate">{lead.name ?? lead.email ?? 'Lead'}</p>
                      <p className="text-xs text-gray-500 truncate">{lead.projectType ?? lead.email ?? ''}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      lead.status === 'NEW' ? 'bg-amber-500/10 text-amber-400' :
                      lead.status === 'WON' ? 'bg-emerald-500/10 text-emerald-400' :
                      'bg-slate-700 text-gray-500'
                    }`}>{lead.status ?? 'NEW'}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent articles */}
          <div className="rounded-3xl bg-white border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Derniers Articles</h3>
              <Link href="/admin/articles">
                <span className="text-xs text-gray-500 hover:text-[#EC4899] transition-colors cursor-pointer">Voir tout →</span>
              </Link>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {(s?.recentArticles ?? []).length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">Aucun article récent</div>
              ) : (
                (s?.recentArticles ?? []).slice(0, 5).map((article: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-100/40 transition">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Newspaper className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium truncate">{article.title}</p>
                      <p className="text-xs text-gray-500">
                        {article.createdAt ? format(parseISO(article.createdAt), 'dd MMM yyyy', { locale: fr }) : ''}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      article.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400' :
                      'bg-slate-700 text-gray-500'
                    }`}>{article.status === 'PUBLISHED' ? 'Publié' : 'Brouillon'}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
