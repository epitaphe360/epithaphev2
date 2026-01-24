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
  ArrowRight,
  Loader2,
  Users,
  Target,
  MousePointerClick,
  Smartphone,
  MapPin,
  Clock,
  MoreHorizontal,
  Zap,
  Globe
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

// --- Interfaces ---
interface Stats {
  views: number;
  visitors: number;
  growth: number;
  revenue: number;
  conversionRate: number;
  bounceRate: number;
  avgSessionDuration: string;
}

interface ChartData {
  date: string;
  views: number;
  visitors: number;
  conversions: number;
}

interface TopPage {
  title: string;
  path: string;
  views: number;
  change: number;
}

// --- Components ---

const StatCard = ({ title, value, subtext, trend, icon: Icon, delay }: any) => (
  <div 
    className="group relative overflow-hidden rounded-3xl bg-[#0B1121] border border-[#1E293B] p-5 transition-all duration-500 hover:border-[#E63946]/30 hover:shadow-2xl hover:shadow-[#E63946]/10"
    style={{ animation: `fadeInUp 0.6s ease-out ${delay}s backwards` }}
  >
    <div className="absolute top-0 right-0 p-5 opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.08]">
      <Icon className="w-20 h-20 text-white transform translate-x-4 -translate-y-4" />
    </div>
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-2xl bg-[#1E293B]/50 border border-[#334155]/40 text-[#E63946] group-hover:bg-[#E63946] group-hover:text-white transition-colors">
          <Icon className="w-[18px] h-[18px]" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            trend > 0 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <h3 className="text-slate-400 text-xs font-semibold tracking-[0.12em] uppercase mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">{value}</span>
      </div>
      <p className="text-slate-500 text-xs mt-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E63946]/80"></span>
        {subtext}
      </p>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-gray-700/50 p-4 rounded-xl shadow-2xl">
        <p className="text-gray-400 text-xs mb-2 font-medium uppercase tracking-wider">{label}</p>
        <div className="space-y-1">
          <p className="text-white text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E63946]"></span>
            {payload[0].value.toLocaleString()} Vues
          </p>
          <p className="text-gray-300 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            {payload[1].value.toLocaleString()} Visiteurs
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30J');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setStats({
      views: 128450,
      visitors: 34280,
      growth: 23.5,
      revenue: 12840,
      conversionRate: 4.8,
      bounceRate: 32.4,
      avgSessionDuration: '3m 45s',
    });

    const mockChartData: ChartData[] = Array.from({ length: 14 }, (_, i) => {
      const date = subDays(new Date(), 13 - i);
      const baseViews = 2000 + Math.random() * 3000;
      return {
        date: format(date, 'dd MMM', { locale: fr }),
        views: Math.floor(baseViews),
        visitors: Math.floor(baseViews * 0.6),
        conversions: Math.floor(baseViews * 0.05),
      };
    });

    setChartData(mockChartData);

    setTopPages([
      { title: 'Accueil - Agence', path: '/', views: 45231, change: 12.5 },
      { title: 'Portfolio & Case Studies', path: '/portfolio', views: 28402, change: 8.2 },
      { title: 'Services Digital', path: '/services', views: 19200, change: -2.4 },
      { title: 'Contact & Devis', path: '/contact', views: 12500, change: 15.8 },
    ]);

    setLoading(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-500/50 text-xs font-bold uppercase tracking-widest animate-pulse">Chargement de l'interface</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-4 md:p-6 lg:p-8 text-slate-200 fade-in">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>

      <div className="mx-auto w-full max-w-7xl">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 md:gap-6 mb-8 md:mb-10">
        <div>
          <h2 className="text-[#E63946] font-bold text-xs uppercase tracking-widest mb-2">Vue d'ensemble</h2>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F08080] to-[#E63946]">Agence</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-[#0B1121] p-1 rounded-2xl border border-[#1E293B]">
          {['7J', '30J', '90J', '1A'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                selectedPeriod === period
                  ? 'bg-[#E63946] text-white shadow-lg shadow-[#E63946]/20'
                  : 'text-slate-500 hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* --- BENTO GRID LAYOUT --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        
        {/* Main Stats */}
        <StatCard 
          title="Trafic Total" 
          value={formatNumber(stats?.views || 0)} 
          subtext="+12.5k vs mois dernier" 
          trend={12.5} 
          icon={Eye} 
          delay={0}
        />
        <StatCard 
          title="Visiteurs Uniques" 
          value={formatNumber(stats?.visitors || 0)} 
          subtext="Nouveaux prospects" 
          trend={8.2} 
          icon={Users} 
          delay={0.1}
        />
        <StatCard 
          title="Engagement" 
          value={`${stats?.avgSessionDuration}`} 
          subtext="Durée moyenne" 
          trend={-2.4} 
          icon={Clock} 
          delay={0.2}
        />
        <StatCard 
          title="Conversion" 
          value={`${stats?.conversionRate}%`} 
          subtext="Objectif : 5.0%" 
          trend={5.4} 
          icon={Target} 
          delay={0.3}
        />

        {/* Big Chart Section - Spans 3 columns */}
        <div className="sm:col-span-2 xl:col-span-3 rounded-3xl bg-[#0B1121] border border-[#1E293B] p-5 md:p-6 relative overflow-hidden group">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base md:text-lg font-bold text-white">Analyse d'Audience</h3>
              <p className="text-slate-500 text-sm mt-1">Évolution des visites et conversions</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="w-2 h-2 rounded-full bg-[#E63946]"></span> Vues
              </span>
              <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="w-2 h-2 rounded-full bg-[#457B9D]/50"></span> Visiteurs
              </span>
            </div>
          </div>
          
          <div className="h-[280px] md:h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E63946" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E63946" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#457B9D" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#475569" 
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#475569" 
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#3b82f6" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#a855f7" 
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  fillOpacity={1} 
                  fill="url(#colorVisitors)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column - Devices & Actions */}
        <div className="sm:col-span-2 xl:col-span-1 space-y-4 md:space-y-6">
          {/* Device Stats */}
          <div className="rounded-3xl bg-[#0B1121] border border-[#1E293B] p-5 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-white mb-4 md:mb-6">Appareils</h3>
            <div className="space-y-4 md:space-y-6">
              <div className="group">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-[#E63946] group-hover:text-white transition-colors">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <span className="text-slate-300 font-medium">Mobile</span>
                  </div>
                  <span className="text-white font-bold">58%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E63946] w-[58%] rounded-full"></div>
                </div>
              </div>

              <div className="group">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      <MousePointerClick className="w-4 h-4" />
                    </div>
                    <span className="text-slate-300 font-medium">Desktop</span>
                  </div>
                  <span className="text-white font-bold">38%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[38%] rounded-full"></div>
                </div>
              </div>

              <div className="group">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-slate-300 font-medium">Tablette</span>
                  </div>
                  <span className="text-white font-bold">4%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-[4%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <Link href="/admin/articles/new">
            <button className="w-full py-3.5 bg-blue-600 hover:bg-[#E63946] text-white rounded-2xl font-bold tracking-wide transition-all shadow-lg shadow-blue-900/40 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              NOUVEAU POST
            </button>
          </Link>
        </div>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 pb-8">
        
        {/* Top Pages */}
        <div className="rounded-3xl bg-[#0B1121] border border-[#1E293B] overflow-hidden">
          <div className="p-6 border-b border-[#1E293B] flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Pages Populaires</h3>
            <button className="text-slate-500 hover:text-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="p-2">
            <table className="w-full">
              <tbody>
                {topPages.map((page, index) => (
                  <tr key={index} className="group hover:bg-[#1E293B]/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600 font-mono text-xs">{(index + 1).toString().padStart(2, '0')}</span>
                        <div className="p-2 rounded-lg bg-[#1E293B] group-hover:bg-[#E63946]/20 group-hover:text-[#E63946] transition-colors">
                          <Globe className="w-4 h-4 text-slate-400 group-hover:text-[#E63946]" />
                        </div>
                        <div>
                          <p className="text-slate-200 font-medium text-sm group-hover:text-white">{page.title}</p>
                          <p className="text-slate-500 text-xs">{page.path}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <p className="text-white font-bold text-sm">{formatNumber(page.views)}</p>
                    </td>
                    <td className="p-4 text-right">
                      <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${
                        page.change > 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                      }`}>
                        {page.change > 0 ? '+' : ''}{page.change}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Regions Map Placeholder - Styled as a "Network" */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0B1121] to-[#111827] border border-[#1E293B] p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-white">Audience Globale</h3>
              <p className="text-slate-500 text-sm mt-1">Impact géographique</p>
            </div>
            <div className="p-2 rounded-xl bg-[#E63946]/10 border border-blue-500/20 text-[#E63946]">
              <MapPin className="w-5 h-5" />
            </div>
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center my-8">
            {/* Abstract Map Representation */}
            <div className="relative w-full h-48">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#E63946]/5 rounded-full blur-3xl group-hover:bg-[#E63946]/10 transition-all duration-700"></div>
              
              {/* Nodes */}
              <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-[#E63946] rounded-full animate-ping opacity-75"></div>
              <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-blue-400 rounded-full"></div>
              
              <div className="absolute top-[50%] right-[30%] w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-75 delay-300"></div>
              <div className="absolute top-[50%] right-[30%] w-2 h-2 bg-purple-400 rounded-full"></div>

              <div className="absolute bottom-[30%] left-[45%] w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75 delay-700"></div>
              <div className="absolute bottom-[30%] left-[45%] w-2 h-2 bg-emerald-400 rounded-full"></div>
              
              {/* Connecting Lines (SVG overlay could go here) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path d="M 120 80 Q 200 120 280 100" stroke="url(#lineGrad)" strokeWidth="1" fill="none" opacity="0.3" />
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-[#1E293B] pt-6">
            <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Maroc</p>
              <p className="text-white font-bold text-lg">45%</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">France</p>
              <p className="text-white font-bold text-lg">28%</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">USA</p>
              <p className="text-white font-bold text-lg">12%</p>
            </div>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
};

export default DashboardPage;
