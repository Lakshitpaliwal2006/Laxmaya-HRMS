import React, { useState, useEffect } from 'react';
import {
  DollarSign, Calendar, TrendingUp, TrendingDown, CreditCard, ChevronDown,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const months = [
  { num: 1, name: 'January', short: 'Jan' }, { num: 2, name: 'February', short: 'Feb' },
  { num: 3, name: 'March', short: 'Mar' }, { num: 4, name: 'April', short: 'Apr' },
  { num: 5, name: 'May', short: 'May' }, { num: 6, name: 'June', short: 'Jun' },
  { num: 7, name: 'July', short: 'Jul' }, { num: 8, name: 'August', short: 'Aug' },
  { num: 9, name: 'September', short: 'Sep' }, { num: 10, name: 'October', short: 'Oct' },
  { num: 11, name: 'November', short: 'Nov' }, { num: 12, name: 'December', short: 'Dec' },
];

// Custom tooltip - currency format ke saath
const CurrencyTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-xl text-xs">
      <div className="font-bold text-slate-800 dark:text-white mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2" style={{ color: p.color }}>
          <span className="font-semibold">{p.name}:</span>
          <span className="font-mono">₹{Number(p.value || 0).toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
};

const CountTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-xl text-xs">
      <div className="font-bold text-slate-800 dark:text-white mb-1">{label}</div>
      <div className="text-indigo-600 dark:text-indigo-400 font-semibold">
        Slips: {payload[0].value}
      </div>
    </div>
  );
};

const PayrollOverview = () => {
  const [selectedMonth, setSelectedMonth] = useState(8);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [stats, setStats] = useState({ totalGross: 0, totalNet: 0, totalDisbursed: 0, totalDeductions: 0 });
  const [recordsCount, setRecordsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [yearlyData, setYearlyData] = useState([]);
  const [yearlyLoading, setYearlyLoading] = useState(false);
  const [activeMetric, setActiveMetric] = useState(null); // 'disbursed' | 'gross' | 'deductions' | 'slips' | null

  const toast = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/salaries/all', {
        params: { month: selectedMonth, year: selectedYear },
      });
      if (res.data.success) {
        setRecordsCount(res.data.records?.length || 0);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (error) {
      toast.error('Failed to load payroll summary');
    } finally {
      setLoading(false);
    }
  };

  // Poore saal ka real data - month by month fetch karke
  const fetchYearlyData = async () => {
    try {
      setYearlyLoading(true);
      const requests = months.map((m) =>
        api.get('/salaries/all', { params: { month: m.num, year: selectedYear } })
      );
      const responses = await Promise.all(requests);

      const combined = responses.map((res, idx) => {
        const data = res.data;
        const recs = data?.records || [];
        const pfTotal = recs.reduce((sum, r) => sum + Number(r.deductions?.pf || 0), 0);
        const taxTotal = recs.reduce((sum, r) => sum + Number(r.deductions?.tax || 0), 0);
        const otherTotal = recs.reduce((sum, r) => sum + Number(r.deductions?.unpaidLeaveDeduction || 0) + Number(r.deductions?.other || 0), 0);

        return {
          month: months[idx].short,
          totalDisbursed: data?.stats?.totalDisbursed || 0,
          totalGross: data?.stats?.totalGross || 0,
          pf: pfTotal,
          tax: taxTotal,
          other: otherTotal,
          slips: recs.length,
        };
      });

      setYearlyData(combined);
    } catch (error) {
      toast.error('Failed to load yearly trend data');
    } finally {
      setYearlyLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchYearlyData();
    setActiveMetric(null); // year change hone pe purana chart band kar do
  }, [selectedYear]);

  const toggleMetric = (key) => {
    setActiveMetric((prev) => (prev === key ? null : key));
  };

  const renderChart = () => {
    if (yearlyLoading) {
      return (
        <div className="p-16 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs">Crunching {selectedYear} numbers...</span>
        </div>
      );
    }

    if (activeMetric === 'disbursed') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={yearlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="disbursedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CurrencyTooltip />} />
            <Area
              type="monotone"
              dataKey="totalDisbursed"
              name="Disbursed"
              stroke="#059669"
              strokeWidth={2.5}
              fill="url(#disbursedFill)"
              dot={{ r: 3, fill: '#059669' }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (activeMetric === 'gross') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CurrencyTooltip />} />
            <Bar dataKey="totalGross" name="Gross Payroll" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={34} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (activeMetric === 'deductions') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CurrencyTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="pf" name="PF" stackId="ded" fill="#fb7185" radius={[0, 0, 0, 0]} maxBarSize={34} />
            <Bar dataKey="tax" name="Tax/TDS" stackId="ded" fill="#e11d48" radius={[0, 0, 0, 0]} maxBarSize={34} />
            <Bar dataKey="other" name="Other" stackId="ded" fill="#9f1239" radius={[6, 6, 0, 0]} maxBarSize={34} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (activeMetric === 'slips') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} axisLine={false} tickLine={false} />
            <Tooltip content={<CountTooltip />} />
            <Bar dataKey="slips" name="Processed Slips" fill="#818cf8" radius={[6, 6, 0, 0]} maxBarSize={34} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  const metricTitles = {
    disbursed: `Total Disbursed — ${selectedYear} Trend`,
    gross: `Gross Payroll — ${selectedYear} Trend`,
    deductions: `Deductions Breakdown (PF / Tax / Other) — ${selectedYear}`,
    slips: `Headcount Processed — ${selectedYear}`,
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card flex items-center gap-2 w-fit">
        <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
        <span className="text-xs text-slate-500 dark:text-slate-400">Cycle:</span>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          {months.map((m) => (
            <option key={m.num} value={m.num}>{m.name}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value={2026}>2026</option>
          <option value={2025}>2025</option>
        </select>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs">Loading payroll summary...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Total Disbursed - clickable */}
          <button
            onClick={() => toggleMetric('disbursed')}
            className={`text-left p-5 rounded-2xl bg-white dark:bg-slate-900/80 border shadow-sm dark:shadow-card flex items-center justify-between transition-all hover:-translate-y-0.5 ${
              activeMetric === 'disbursed' ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Disbursed</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                ₹{stats.totalDisbursed?.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block flex items-center gap-1">
                Disbursed net salary <ChevronDown className={`w-3 h-3 transition-transform ${activeMetric === 'disbursed' ? 'rotate-180' : ''}`} />
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </button>

          {/* Gross Payroll - clickable */}
          <button
            onClick={() => toggleMetric('gross')}
            className={`text-left p-5 rounded-2xl bg-white dark:bg-slate-900/80 border shadow-sm dark:shadow-card flex items-center justify-between transition-all hover:-translate-y-0.5 ${
              activeMetric === 'gross' ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Gross Payroll</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                ₹{stats.totalGross?.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block flex items-center gap-1">
                Pre-deductions volume <ChevronDown className={`w-3 h-3 transition-transform ${activeMetric === 'gross' ? 'rotate-180' : ''}`} />
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </button>

          {/* Total Deductions - clickable */}
          <button
            onClick={() => toggleMetric('deductions')}
            className={`text-left p-5 rounded-2xl bg-white dark:bg-slate-900/80 border shadow-sm dark:shadow-card flex items-center justify-between transition-all hover:-translate-y-0.5 ${
              activeMetric === 'deductions' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Deductions</span>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                ₹{stats.totalDeductions?.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block flex items-center gap-1">
                PF, TDS & Adjustments <ChevronDown className={`w-3 h-3 transition-transform ${activeMetric === 'deductions' ? 'rotate-180' : ''}`} />
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </button>

          {/* Processed Slips - clickable (optional - hata sakte ho) */}
          <button
            onClick={() => toggleMetric('slips')}
            className={`text-left p-5 rounded-2xl bg-white dark:bg-slate-900/80 border shadow-sm dark:shadow-card flex items-center justify-between transition-all hover:-translate-y-0.5 ${
              activeMetric === 'slips' ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Processed Slips</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{recordsCount}</div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block flex items-center gap-1">
                Staff in cycle <ChevronDown className={`w-3 h-3 transition-transform ${activeMetric === 'slips' ? 'rotate-180' : ''}`} />
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}

      {/* Chart panel - jo card active hai uska graph yaha */}
      {activeMetric && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card transition-colors">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">{metricTitles[activeMetric]}</h4>
          {renderChart()}
        </div>
      )}
    </div>
  );
};

export default PayrollOverview;
