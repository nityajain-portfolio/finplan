import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { getDashboard } from '../lib/api';
import { fmt, shortFmt, fmtPct, STREAM_COLORS, CATEGORY_COLORS } from '../lib/fmt';
import KpiCard from '../components/KpiCard';
import PageHeader from '../components/PageHeader';
import YearSelector from '../components/YearSelector';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0A1422] border border-white/10 rounded-xl p-3 shadow-xl text-xs">
      <div className="text-[var(--muted)] mb-2">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white font-medium">{shortFmt(p.value)}</span>
          <span className="text-[var(--muted)]">{p.name}</span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const clientId = router.query.client;
  const [year, setYear] = useState(2024);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    getDashboard(clientId, year).then(r => {
      setData(r.data);
      setLoading(false);
    });
  }, [clientId, year]);

  if (!clientId) return (
    <div className="flex items-center justify-center h-64 text-[var(--muted)]">
      Select a client from the Clients page to view their dashboard.
    </div>
  );

  if (loading) return <div className="text-[var(--muted)] text-sm animate-pulse">Loading dashboard…</div>;
  if (!data)   return <div className="text-red-400">Failed to load data.</div>;

  const { client, summary, revMonthly, costMonthly, revenueByStream, costByCategory, latestKpi, assets, liabilities, recentNotes } = data;

  // Build combined rev+cost monthly chart data
  const monthMap = {};
  revMonthly.forEach(r => {
    if (!monthMap[r.month_key]) monthMap[r.month_key] = { month: r.label };
    if (r.entry_type === 'actual')   monthMap[r.month_key].revenue   = parseFloat(r.revenue);
    if (r.entry_type === 'forecast') monthMap[r.month_key].forecast  = parseFloat(r.revenue);
  });
  costMonthly.forEach(c => {
    if (!monthMap[c.month_key]) monthMap[c.month_key] = { month: c.label };
    if (c.entry_type === 'actual') monthMap[c.month_key].costs = parseFloat(c.costs);
  });
  const chartData = Object.values(monthMap).sort((a, b) => a.month > b.month ? 1 : -1);
  chartData.forEach(d => { d.profit = (d.revenue || 0) - (d.costs || 0); });

  // Total assets / liabilities
  const totalAssets = assets.reduce((s, a) => s + parseFloat(a.total || 0), 0);
  const totalLiab   = liabilities.reduce((s, l) => s + parseFloat(l.total || 0), 0);
  const netWorth    = totalAssets - totalLiab;

  const noteColors = { observation:'text-blue-400', recommendation:'text-teal', risk:'text-red-400', opportunity:'text-emerald-400', meeting:'text-gold' };

  return (
    <div>
      <PageHeader
        title={client.company_name}
        subtitle={`${client.industry} · ${client.currency} · Fiscal Year ${year}`}
        actions={<YearSelector year={year} onChange={setYear} />}
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total Revenue"  value={shortFmt(summary.totalRevenue)} sub={`${year} actuals`} color="teal" />
        <KpiCard label="Total Costs"    value={shortFmt(summary.totalCosts)}   sub={`${year} actuals`} color="gold" />
        <KpiCard label="Gross Profit"   value={shortFmt(summary.grossProfit)}  sub={fmtPct(summary.grossMargin) + ' margin'} color="blue" />
        <KpiCard label="Net Margin"     value={latestKpi ? fmtPct(latestKpi.net_margin) : '—'} sub="Latest snapshot" color={parseFloat(latestKpi?.net_margin || 0) > 0.08 ? 'teal' : 'red'} />
      </div>

      {/* Secondary KPIs */}
      {latestKpi && (() => {
        const cr = parseFloat(latestKpi.current_ratio  || 0);
        const de = parseFloat(latestKpi.debt_to_equity || 0);
        const rg = parseFloat(latestKpi.revenue_growth || 0);
        const eb = parseFloat(latestKpi.ebitda         || 0);
        return (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <KpiCard label="EBITDA"         value={shortFmt(eb)}       sub="Latest quarter"   color="teal" />
            <KpiCard label="Current Ratio"  value={cr.toFixed(2)}      sub="> 1.5 is healthy" color={cr >= 1.5 ? 'teal' : 'red'} />
            <KpiCard label="Debt-to-Equity" value={de.toFixed(2)}      sub="Lower is better"  color={de < 1.2 ? 'teal' : 'gold'} />
            <KpiCard label="Revenue Growth" value={fmtPct(rg)}         sub="YoY"              color="blue" />
          </div>
        );
      })()}

      {/* Revenue + Cost Chart */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-lg text-white">Revenue vs Costs vs Profit</h2>
            <p className="text-[var(--muted)] text-xs mt-0.5">Monthly breakdown · {year}</p>
          </div>
          <div className="flex gap-4 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-teal inline-block"/>{year} Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gold inline-block"/>Costs</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-400 inline-block"/>Profit</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#00B4A6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00B4A6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#E8A23A" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#E8A23A" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#60A5FA" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#8FA4BC', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={shortFmt} tick={{ fill: '#8FA4BC', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue"  name="Revenue"  stroke="#00B4A6" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            <Area type="monotone" dataKey="costs"    name="Costs"    stroke="#E8A23A" strokeWidth={2} fill="url(#costGrad)" dot={false} />
            <Area type="monotone" dataKey="profit"   name="Profit"   stroke="#60A5FA" strokeWidth={2} fill="url(#profGrad)" dot={false} />
            {chartData.some(d => d.forecast) && (
              <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#00B4A6" strokeWidth={1.5} strokeDasharray="5 4" fill="none" dot={false} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue by Stream + Cost by Category */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="font-display text-lg text-white mb-1">Revenue by Channel</h2>
          <p className="text-[var(--muted)] text-xs mb-6">{year} actuals</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={revenueByStream} dataKey="total" nameKey="stream" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                {revenueByStream.map((_, i) => <Cell key={i} fill={STREAM_COLORS[i % STREAM_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => shortFmt(v)} contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
              <Legend formatter={(v) => <span style={{ color: '#8FA4BC', fontSize: 11 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-display text-lg text-white mb-1">Cost Breakdown</h2>
          <p className="text-[var(--muted)] text-xs mb-6">{year} actuals by category</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={costByCategory.slice(0,8)} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tickFormatter={shortFmt} tick={{ fill:'#8FA4BC', fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="category" tick={{ fill:'#8FA4BC', fontSize:10 }} axisLine={false} tickLine={false} width={130} />
              <Tooltip formatter={v => shortFmt(v)} contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
              <Bar dataKey="total" name="Cost" radius={[0,6,6,0]}>
                {costByCategory.slice(0,8).map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Balance Sheet Summary + Notes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-display text-lg text-white mb-4">Balance Sheet Snapshot</h2>
          <div className="space-y-3">
            {assets.map((a, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)] capitalize">{a.asset_type} Assets</span>
                <span className="font-mono text-sm text-teal">{fmt(a.total)}</span>
              </div>
            ))}
            <div className="border-t border-white/5 pt-3 flex justify-between">
              <span className="text-sm font-medium text-white">Total Assets</span>
              <span className="font-mono text-sm text-teal font-semibold">{fmt(totalAssets)}</span>
            </div>
            {liabilities.map((l, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)] capitalize">{l.liability_type} Liabilities</span>
                <span className="font-mono text-sm text-gold">{fmt(l.total)}</span>
              </div>
            ))}
            <div className="border-t border-white/5 pt-3 flex justify-between">
              <span className="text-sm font-medium text-white">Total Liabilities</span>
              <span className="font-mono text-sm text-gold font-semibold">{fmt(totalLiab)}</span>
            </div>
            <div className="border-t border-teal/20 pt-3 flex justify-between bg-teal/5 rounded-xl px-3 py-2">
              <span className="text-sm font-semibold text-white">Net Worth (Equity)</span>
              <span className={`font-mono text-sm font-bold ${netWorth >= 0 ? 'text-teal' : 'text-red-400'}`}>{fmt(netWorth)}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-display text-lg text-white mb-4">Recent Advisor Notes</h2>
          <div className="space-y-3">
            {recentNotes.map(n => (
              <div key={n.id} className="border-b border-white/5 pb-3 last:border-0">
                <div className="flex items-start gap-2">
                  <span className={`text-xs font-medium capitalize mt-0.5 ${noteColors[n.category] || 'text-[var(--muted)]'}`}>
                    [{n.category}]
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">{n.title}</div>
                    <div className="text-xs text-[var(--muted)] mt-0.5 line-clamp-2">{n.body}</div>
                    <div className="text-[10px] text-[var(--muted)]/60 mt-1">{new Date(n.note_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}