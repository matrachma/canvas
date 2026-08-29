export const SIPGN_DASHBOARD_CODE = `import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend, LabelList 
} from 'recharts';

import { 
  Users, Star, MessageSquareWarning, Target, 
  AlertCircle, SmartphoneNfc, Activity, Search, Filter, 
  Download, CheckCircle2, Clock, ShieldAlert, ArrowUpRight, 
  ChevronRight, RefreshCw, FileText, Check, ChevronDown, 
  Info, AlertTriangle, Layers, TrendingUp, TrendingDown
} from 'lucide-react';

// Data laporan periode 17 - 23 Agustus 2026
const dailyTrendData = [
  { tanggal: '17 Agu', masuk: 223 },
  { tanggal: '18 Agu', masuk: 662 }, // Peak harian
  { tanggal: '19 Agu', masuk: 602 },
  { tanggal: '20 Agu', masuk: 475 },
  { tanggal: '21 Agu', masuk: 372 }, 
  { tanggal: '22 Agu', masuk: 105 },
  { tanggal: '23 Agu', masuk: 78 }, // Total 2.517 tiket
];

const broadcastData = [
  { name: 'Gagal (Database/Kontak)', value: 5355, detail: 'Didominasi Message Undeliverable' },
  { name: 'Terkirim', value: 76460, detail: 'Sukses terkirim' },
];

const userDemographicsData = [
  { tipe: 'KA SPPG', totalPengguna: 759, percentage: '47.3%' },
  { tipe: 'Pengawas Keuangan', totalPengguna: 70, percentage: '4.4%' },
  { tipe: 'Pengawas Gizi', totalPengguna: 42, percentage: '2.6%' },
  { tipe: 'Perwakilan Yayasan', totalPengguna: 19, percentage: '1.2%' },
  { tipe: 'Korwil', totalPengguna: 11, percentage: '0.7%' },
  { tipe: 'KA Yayasan', totalPengguna: 7, percentage: '0.4%' },
  { tipe: 'Lainnya', totalPengguna: 702, percentage: '43.7%' },
];

const initialTopIssues = [
  { id: 1, issue: 'Kendala Portal Rumah SIPGN', count: 210, category: 'Portal Akses', severity: 'Critical' },
  { id: 2, issue: 'Tidak Dapat Memperbarui Data PM di MPM', count: 165, category: 'Data & Sync', severity: 'High' },
  { id: 3, issue: 'POP Edit/Hapus Work Order', count: 162, category: 'POP System', severity: 'Medium' },
  { id: 4, issue: 'Akses MPM Khusus KA SPPG', count: 155, category: 'Akses User', severity: 'Medium' },
  { id: 5, issue: 'KPM Tidak Muncul di MPM', count: 141, category: 'Data & Sync', severity: 'High' },
  { id: 6, issue: 'HRIS Tidak Bisa Login SSO', count: 132, category: 'Authentication', severity: 'Medium' },
  { id: 7, issue: 'Update Data di MPM', count: 131, category: 'Data & Sync', severity: 'Medium' },
  { id: 8, issue: 'HRIS Update Data Kepegawaian', count: 121, category: 'HRIS System', severity: 'Medium' },
];

const initialActionPlan = [
  {
    id: 1,
    title: 'Optimalisasi Kapasitas Traffic Portal SIPGN',
    category: 'Infrastruktur',
    priority: 'Kritis',
    desc: 'Atasi kendala antrean traffic saat login Portal Rumah SIPGN yang menyumbang 210 tiket. Lakukan load balancing untuk mencegah bottleneck traffic bersamaan.',
    status: 'In Progress',
    assignee: 'Tim Infra & DevOps'
  },
  {
    id: 2,
    title: 'Edukasi Ketentuan Edit/Hapus Work Order POP',
    category: 'Edukasi User',
    priority: 'Tinggi',
    desc: 'Berikan panduan komprehensif bahwa Work Order yang masuk tahap persiapan tidak dapat dihapus/diedit. Ini bukan bug, melainkan ketentuan sistem.',
    status: 'Pending',
    assignee: 'Tim Support & Sosialisasi'
  },
  {
    id: 3,
    title: 'Penyelesaian Duplikasi Data MPM & Sinkronisasi SDMO',
    category: 'Data Integration',
    priority: 'Tinggi',
    desc: 'Lanjutkan pembersihan duplikasi KPM di modul MPM dan atasi keterlambatan sinkronisasi data email dari SDMO ke SIPHR.',
    status: 'In Progress',
    assignee: 'Tim Support & Data'
  },
  {
    id: 4,
    title: 'Mitigasi Tumpukan Backlog Modul MPM & POP',
    category: 'Service Desk Ops',
    priority: 'Sedang',
    desc: 'Fokus urai backlog terbesar pada Portal MPM (80 tiket Pending, 16 Eskalasi) dan POP (52 tiket Pending). Kejar pengguna via email untuk kelengkapan data.',
    status: 'Pending',
    assignee: 'Command Center Ops'
  },
  {
    id: 5,
    title: 'Pertahankan Efisiensi Pengiriman WhatsApp',
    category: 'WhatsApp Gateway',
    priority: 'Sedang',
    desc: 'Pantau stabilitas sistem broadcast setelah berhasil menurunkan rasio kegagalan kirim ke 7,00%. Fokus optimasi database nomor yang tidak valid.',
    status: 'Completed',
    assignee: 'Helpdesk Tier-1'
  }
];

const PIE_COLORS = ['#ef4444', '#10b981'];

const KpiCard = ({ title, value, subtitle, icon: Icon, colorClass, badge, trend, isPositive }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110 pointer-events-none" />

    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={"p-3 rounded-xl " + colorClass + " bg-opacity-10 flex items-center justify-center"}>
          <Icon className={"w-6 h-6 " + colorClass.replace('bg-', 'text-')} />
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        {trend && (
          <span className={"text-xs font-bold flex items-center px-2 py-0.5 rounded-full " + (isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50')}>
            {isPositive ? <TrendingDown className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1" />}
            {trend}
          </span>
        )}
      </div>
    </div>

    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
      <p className="text-xs text-slate-500 font-medium leading-relaxed">{subtitle}</p>
      {badge && (
        <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-700 rounded-md whitespace-nowrap ml-2">
          {badge}
        </span>
      )}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-800">
        <p className="font-bold text-slate-300 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={"item-" + index} className="flex items-center space-x-2 py-0.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-300">{entry.name}:</span>
            <span className="font-bold text-white">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [actionItems, setActionItems] = useState(initialActionPlan);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredIssues = useMemo(() => {
    return initialTopIssues.filter(item => {
      const matchesSearch = item.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const totalTickets = useMemo(() => {
    return dailyTrendData.reduce((acc, curr) => acc + curr.masuk, 0);
  }, []);

  const toggleActionStatus = (id) => {
    setActionItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Completed' ? 'In Progress' : item.status === 'In Progress' ? 'Pending' : 'Completed';
        showToast("Status " + item.title.substring(0, 25) + "... diperbarui ke " + nextStatus);
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-3 sm:p-6 md:p-8 font-sans text-slate-900 antialiased">

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-bounce border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <header className="mb-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center">
          <Activity className="w-4 h-4 mr-1.5 text-blue-600 shrink-0" />
          Service Desk & Command Center
        </p>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Summary Laporan Eskalasi SIPGN & IoT
        </h1>
        <p className="text-slate-500 mt-1 font-medium text-xs sm:text-sm">
          Periode Evaluasi: 17 - 23 Agustus 2026
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <KpiCard 
          title="Skor CSAT (Pelayanan)" 
          value="4.76" 
          subtitle="Tingkat kepuasan stabil didukung panduan agen yang empatik." 
          icon={Star} 
          colorClass="bg-amber-500 text-amber-500" 
          trend="-0.02" 
          isPositive={false} 
          badge="Skor Target: 4.50" 
        />
        <KpiCard 
          title="Resolution Rate" 
          value="86.0%" 
          subtitle={"Total " + totalTickets.toLocaleString() + " Tiket (43,9% Solved & 42,1% Closed)"} 
          icon={Activity} 
          colorClass="bg-indigo-600 text-indigo-600" 
          badge="Target >80%" 
        />
        <KpiCard 
          title="Fokus Isu Utama" 
          value="Portal SIPGN" 
          subtitle="Kendala antrean traffic saat login Portal Rumah SIPGN." 
          icon={SmartphoneNfc} 
          colorClass="bg-red-500 text-red-500" 
          badge="210 Tiket" 
        />
        <KpiCard 
          title="Kegagalan Broadcast" 
          value="5,355" 
          subtitle="Penurunan drastis pasca perbaikan anomali sistem (7.00% Failed Rate)." 
          icon={MessageSquareWarning} 
          colorClass="bg-emerald-500 text-emerald-500" 
          trend="-24,66%" 
          isPositive={true} 
          badge="Sistem Normal" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-blue-600" />
                Tren Tiket Harian
              </h3>
              <span className="text-xs font-semibold text-slate-400">Total: 2,517</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Puncak volume tiket terjadi pada tanggal <strong className="text-slate-800">18 Agustus (662 tiket)</strong>. Volume turun 23% dari minggu sebelumnya.
            </p>
          </div>

          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrendData} margin={{ top: 25, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="tanggal" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="masuk" name="Tiket Masuk" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorMasuk)">
                  <LabelList dataKey="masuk" position="top" offset={10} style={{ fontSize: '10px', fill: '#1e293b', fontWeight: 'bold' }} />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-100 pb-3 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                Isu Utama & Eskalasi Sistem
              </h3>
              <p className="text-xs text-slate-500">Breakdown 8 kategori keluhan terbesar minggu ini</p>
            </div>

            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari isu..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse min-w-[400px]">
              <thead>
                <tr className="bg-slate-50/70 border-y border-slate-200/70">
                  <th className="py-2.5 px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Deskripsi Isu</th>
                  <th className="py-2.5 px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Volume Tiket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIssues.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3 px-3">
                      <p className="text-xs text-slate-900 font-bold group-hover:text-blue-600 transition-colors">{item.issue}</p>
                      <span className="inline-block mt-0.5 text-[10px] text-slate-400 font-medium">{item.category}</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block bg-slate-100 text-slate-800 text-xs font-extrabold px-3 py-1 rounded-full">
                        {item.count.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredIssues.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-xs text-slate-400">
                      Tidak ditemukan isu dengan kata kunci "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <Target className="w-4 h-4 mr-2 text-slate-700" />
                Statistik Broadcast WhatsApp
              </h3>
              <span className="text-xs font-semibold text-slate-500">Tingkat Kegagalan: 7.00%</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Performa stabil. Sebagian besar kegagalan (<strong className="text-rose-600">5.355</strong>) disebabkan oleh error <i>Message Undeliverable</i> pada database.
            </p>
          </div>

          <div className="h-72 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={broadcastData} 
                  cx="50%" 
                  cy="45%" 
                  innerRadius={65} 
                  outerRadius={85} 
                  paddingAngle={4} 
                  dataKey="value" 
                  stroke="none"
                >
                  {broadcastData.map((entry, index) => (
                    <Cell key={"cell-" + index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center" 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#334155' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-start">
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0 mt-0.5" />
            <span>Resolusi tercapai: Anomali template notifikasi berhasil diperbaiki, efisiensi rasio pengiriman kembali normal.</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  Demografi Pengguna Aktif
                </h3>
                <p className="text-xs text-slate-400 font-medium">Distribusi berdasarkan Tipe Pengguna (Total 1.606 Unik)</p>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userDemographicsData} layout="vertical" margin={{ top: 5, right: 45, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="tipe" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} 
                  width={130} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="totalPengguna" 
                  name="Total Pengguna" 
                  fill="#2563eb" 
                  radius={[0, 6, 6, 0]} 
                  barSize={14}
                >
                  <LabelList 
                    dataKey="totalPengguna" 
                    position="right" 
                    offset={8} 
                    style={{ fontSize: '11px', fill: '#0f172a', fontWeight: 'bold' }} 
                    formatter={(v) => v > 0 ? v.toLocaleString() : '0'} 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-center justify-between">
            <span>Dominasi Pengguna: <strong>KA SPPG (47.3%)</strong></span>
            <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md">759 User</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border-t-4 border-t-blue-600 border-x border-b border-slate-200/80 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-wide">
                Action Plan Strategis & Instruksi Eksekusi
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Rekomendasi tindak lanjut teknis berdasarkan Laporan 17 - 23 Agustus 2026
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
            {"Progres: " + actionItems.filter(i => i.status === 'Completed').length + " / " + actionItems.length + " Selesai"}
          </div>
        </div>

        <div className="space-y-4">
          {actionItems.map((item, index) => (
            <div 
              key={item.id} 
              className={"p-5 rounded-xl border transition-all " + (
                item.status === 'Completed' 
                  ? 'bg-emerald-50/40 border-emerald-200' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              )}
            >
              <div className="flex items-start">
                <button 
                  onClick={() => toggleActionStatus(item.id)} 
                  className={"mt-0.5 shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors cursor-pointer mr-4 " + (
                    item.status === 'Completed' 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-slate-300 hover:border-blue-500 text-transparent'
                  )}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                <div className="flex-grow">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h4 className={"text-base font-bold " + (item.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900')}>
                      {(index + 1) + ". " + item.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={"text-[10px] font-bold px-2.5 py-0.5 rounded-full " + (
                        item.priority === 'Kritis' ? 'bg-red-100 text-red-700' :
                        item.priority === 'Tinggi' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                      )}>
                        {"Prioritas: " + item.priority}
                      </span>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                        {item.assignee}
                      </span>
                    </div>
                  </div>

                  <p className={"text-xs sm:text-sm leading-relaxed mt-1 " + (item.status === 'Completed' ? 'text-slate-400' : 'text-slate-600')}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-400 border-t border-slate-200/60 pt-6">
        <p>Command Center & Service Desk SIPGN &copy; 2026. Data Real-time berdasarkan Laporan Mingguan 17–23 Agustus 2026.</p>
      </footer>

    </div>
  );
}`;

export const ANALYTICS_TEMPLATE_CODE = `import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid 
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, Zap, Sparkles, Check } from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 45000, target: 40000 },
  { month: 'Feb', revenue: 52000, target: 45000 },
  { month: 'Mar', revenue: 49000, target: 50000 },
  { month: 'Apr', revenue: 63000, target: 55000 },
  { month: 'May', revenue: 58000, target: 60000 },
  { month: 'Jun', revenue: 71000, target: 65000 },
];

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('monthly');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Metrics
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2 text-white">
              Executive Growth Pulse
            </h1>
            <p className="text-sm text-slate-400">Monitoring realtime platform performance and revenue.</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700">
            {['monthly', 'quarterly', 'yearly'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={"px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all " + (
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">$338,000</div>
            <div className="mt-2 flex items-center text-xs text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> +18.4% vs last period
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Active Customers</span>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white">14,290</div>
            <div className="mt-2 flex items-center text-xs text-blue-400 font-medium">
              <Zap className="w-3.5 h-3.5 mr-1" /> +1,240 new signups
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">System Uptime</span>
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white">99.98%</div>
            <div className="mt-2 flex items-center text-xs text-emerald-400 font-medium">
              <Check className="w-3.5 h-3.5 mr-1" /> All services operational
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-white">Revenue vs Target Growth</h3>
              <p className="text-xs text-slate-400">Comparing actual realized vs budgeted target</p>
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={(v) => "$" + (v/1000) + "k"} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }} 
                  itemStyle={{ color: '#e2e8f0' }} 
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} name="Actual Revenue" />
                <Bar dataKey="target" fill="#3b82f6" fillOpacity={0.3} radius={[6, 6, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}`;

export const SIMPLE_COUNTER_CODE = `import React, { useState } from 'react';
import { Plus, Minus, RotateCcw, Heart } from 'lucide-react';

export default function CounterApp() {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 flex items-center justify-center p-6 text-white">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center space-y-6">
        <div className="inline-flex p-3 bg-white/10 rounded-2xl">
          <Heart 
            className={"w-8 h-8 cursor-pointer transition-all " + (liked ? 'text-rose-400 fill-rose-400 scale-110' : 'text-white/80')} 
            onClick={() => setLiked(!liked)} 
          />
        </div>
        
        <div>
          <h2 className="text-2xl font-black tracking-tight">Interactive Counter</h2>
          <p className="text-xs text-white/70 mt-1">Rendered instantly with Canvas React playground</p>
        </div>

        <div className="text-6xl font-extrabold tracking-tight bg-white/5 py-6 rounded-2xl border border-white/10">
          {count}
        </div>

        <div className="flex justify-center gap-3">
          <button 
            onClick={() => setCount(count - 1)}
            className="p-4 bg-white/10 hover:bg-white/20 active:scale-95 rounded-2xl font-bold transition-all"
          >
            <Minus className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setCount(0)}
            className="p-4 bg-white/10 hover:bg-white/20 active:scale-95 rounded-2xl font-bold transition-all text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-5 h-5" /> Reset
          </button>

          <button 
            onClick={() => setCount(count + 1)}
            className="p-4 bg-white text-indigo-900 hover:bg-white/90 active:scale-95 rounded-2xl font-bold shadow-lg transition-all"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}`;

export const TEMPLATES = [
  { id: 'sipgn', name: 'Dashboard Laporan SIPGN (Default)', code: SIPGN_DASHBOARD_CODE },
  { id: 'analytics', name: 'Executive SaaS Analytics', code: ANALYTICS_TEMPLATE_CODE },
  { id: 'counter', name: 'Interactive Counter & Cards', code: SIMPLE_COUNTER_CODE },
];
