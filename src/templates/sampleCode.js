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

export const DEFAULT_STARTER_TEMPLATES = [
  { id: 'analytics', name: 'Executive SaaS Analytics', code: ANALYTICS_TEMPLATE_CODE },
  { id: 'counter', name: 'Interactive Counter & Cards', code: SIMPLE_COUNTER_CODE },
];
