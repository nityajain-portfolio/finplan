import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getDashboard } from '../lib/api';
import { fmt, shortFmt, fmtPct, STREAM_COLORS, CATEGORY_COLORS } from '../lib/fmt';
import KpiCard from '../components/KpiCard';
import PageHeader from '../components/PageHeader';
import YearSelector from '../components/YearSelector';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'10px 14px' }}>
      <div style={{ color:'#8FA4BC', marginBottom:6, fontSize:11 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, fontSize:11 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background: p.color }} />
          <span style={{ color:'white', fontWeight:500 }}>{shortFmt(p.value)}</span>
          <span style={{ color:'#8FA4BC' }}>{p.name}</span>
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
    }).catch(() => setLoading(false));
  }, [clientId, year]);

  if (!clientId) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:256, color:'#8FA4BC' }}>
      Select a client from the Clients page to view their dashboard.
    </div>
  );

  if (loading) return <div style={{ color:'#8FA4BC', fontSize:14 }}>Loading dashboard...</div>;
  if (!data)   return <div style={{ color:'#f87171' }}>Failed to load data.</div>;

  const { client, summary, revMonthly, costMonthly, revenueByStream: rawStreamData, costByCategory: rawCategoryData, latestKpi, assets, liabilities, recentNotes } = data;

  // Parse MySQL decimal strings to numbers so Recharts renders correctly
  const revenueByStream = (rawStreamData || []).map(r => ({ ...r, total: parseFloat(r.total || 0) })).filter(r => r.total > 0);
  const costByCategory  = (rawCategoryData || []).map(r => ({ ...r, total: parseFloat(r.total || 0) })).filter(r => r.total > 0);

  const monthMap = {};
  revMonthly.forEach(r => {
    if (!monthMap[r.month_key]) monthMap[r.month_key] = { month: r.label };
    if (r.entry_type === 'actual')   monthMap[r.month_key].revenue  = parseFloat(r.revenue);
    if (r.entry_type === 'forecast') monthMap[r.month_key].forecast = parseFloat(r.revenue);
  });
  costMonthly.forEach(c => {
    if (!monthMap[c.month_key]) monthMap[c.month_key] = { month: c.label };
    if (c.entry_type === 'actual') monthMap[c.month_key].costs = parseFloat(c.costs);
  });
  const chartData = Object.values(monthMap).sort((a, b) => a.month > b.month ? 1 : -1);
  chartData.forEach(d => { d.profit = (d.revenue || 0) - (d.costs || 0); });

  const totalAssets = assets.reduce((s, a) => s + parseFloat(a.total || 0), 0);
  const totalLiab   = liabilities.reduce((s, l) => s + parseFloat(l.total || 0), 0);
  const netWorth    = totalAssets - totalLiab;

  const kpi = latestKpi ? {
    ebitda:        parseFloat(latestKpi.ebitda         || 0),
    currentRatio:  parseFloat(latestKpi.current_ratio  || 0),
    debtToEquity:  parseFloat(latestKpi.debt_to_equity || 0),
    revenueGrowth: parseFloat(latestKpi.revenue_growth || 0),
    netMargin:     parseFloat(latestKpi.net_margin      || 0),
    grossMargin:   parseFloat(latestKpi.gross_margin    || 0),
  } : null;

  const noteColors = {
    observation: '#60A5FA', recommendation: '#00B4A6',
    risk: '#f87171', opportunity: '#34D399', meeting: '#E8A23A',
  };

  return (
    <div>
      <PageHeader
        title={client.company_name}
        subtitle={client.industry + ' · ' + client.currency + ' · Fiscal Year ' + year}
        actions={<YearSelector year={year} onChange={setYear} />}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total Revenue" value={shortFmt(summary.totalRevenue)} sub={year + ' actuals'} color="teal" />
        <KpiCard label="Total Costs"   value={shortFmt(summary.totalCosts)}   sub={year + ' actuals'} color="gold" />
        <KpiCard label="Gross Profit"  value={shortFmt(summary.grossProfit)}  sub={fmtPct(summary.grossMargin) + ' margin'} color="blue" />
        <KpiCard label="Net Margin"    value={kpi ? fmtPct(kpi.netMargin) : '-'} sub="Latest snapshot" color={kpi && kpi.netMargin > 0.08 ? 'teal' : 'red'} />
      </div>

      {kpi && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <KpiCard label="EBITDA"         value={shortFmt(kpi.ebitda)}            sub="Latest quarter"   color="teal" />
          <KpiCard label="Current Ratio"  value={kpi.currentRatio.toFixed(2)}     sub="> 1.5 is healthy" color={kpi.currentRatio >= 1.5 ? 'teal' : 'red'} />
          <KpiCard label="Debt-to-Equity" value={kpi.debtToEquity.toFixed(2)}     sub="Lower is better"  color={kpi.debtToEquity < 1.2 ? 'teal' : 'gold'} />
          <KpiCard label="Revenue Growth" value={fmtPct(kpi.revenueGrowth)}       sub="YoY"              color="blue" />
        </div>
      )}

      <div className="card mb-6">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <h2 className="font-display text-lg text-white">Revenue vs Costs vs Profit</h2>
            <p style={{ color:'#8FA4BC', fontSize:12, marginTop:2 }}>Monthly breakdown · {year}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top:5, right:20, left:10, bottom:5 }}>
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
            <XAxis dataKey="month" tick={{ fill:'#8FA4BC', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={shortFmt} tick={{ fill:'#8FA4BC', fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue"  name="Revenue"  stroke="#00B4A6" strokeWidth={2} fill="url(#revGrad)"  dot={false} />
            <Area type="monotone" dataKey="costs"    name="Costs"    stroke="#E8A23A" strokeWidth={2} fill="url(#costGrad)" dot={false} />
            <Area type="monotone" dataKey="profit"   name="Profit"   stroke="#60A5FA" strokeWidth={2} fill="url(#profGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="font-display text-lg text-white mb-1">Revenue by Channel</h2>
          <p style={{ color:'#8FA4BC', fontSize:12, marginBottom:24 }}>{year} actuals</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={revenueByStream} dataKey="total" nameKey="stream" cx="50%" cy="45%" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {revenueByStream.map((_, i) => (
                  <Cell key={i} fill={STREAM_COLORS[i % STREAM_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={v => shortFmt(v)} contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
              <Legend formatter={v => <span style={{ color:'#8FA4BC', fontSize:11 }}>{v}</span>} wrapperStyle={{ paddingTop:12, lineHeight:'22px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-display text-lg text-white mb-1">Cost Breakdown</h2>
          <p style={{ color:'#8FA4BC', fontSize:12, marginBottom:24 }}>{year} actuals by category</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={costByCategory.slice(0, 8)} layout="vertical" margin={{ left:10, right:20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tickFormatter={shortFmt} tick={{ fill:'#8FA4BC', fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="category" tick={{ fill:'#8FA4BC', fontSize:10 }} axisLine={false} tickLine={false} width={130} />
              <Tooltip formatter={v => shortFmt(v)} contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
              <Bar dataKey="total" name="Cost" radius={[0, 6, 6, 0]}>
                {costByCategory.slice(0, 8).map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-display text-lg text-white mb-4">Balance Sheet Snapshot</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {assets.map((a, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:14, color:'#8FA4BC', textTransform:'capitalize' }}>{a.asset_type} Assets</span>
                <span className="font-mono" style={{ fontSize:14, color:'#00B4A6' }}>{fmt(a.total)}</span>
              </div>
            ))}
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:12, display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:14, fontWeight:500, color:'white' }}>Total Assets</span>
              <span className="font-mono" style={{ fontSize:14, color:'#00B4A6', fontWeight:600 }}>{fmt(totalAssets)}</span>
            </div>
            {liabilities.map((l, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:14, color:'#8FA4BC', textTransform:'capitalize' }}>{l.liability_type} Liabilities</span>
                <span className="font-mono" style={{ fontSize:14, color:'#E8A23A' }}>{fmt(l.total)}</span>
              </div>
            ))}
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:12, display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:14, fontWeight:500, color:'white' }}>Total Liabilities</span>
              <span className="font-mono" style={{ fontSize:14, color:'#E8A23A', fontWeight:600 }}>{fmt(totalLiab)}</span>
            </div>
            <div style={{ borderTop:'1px solid rgba(0,180,166,0.2)', marginTop:4, padding:'10px 12px', background:'rgba(0,180,166,0.05)', borderRadius:12, display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:14, fontWeight:600, color:'white' }}>Net Worth (Equity)</span>
              <span className="font-mono" style={{ fontSize:14, fontWeight:700, color: netWorth >= 0 ? '#00B4A6' : '#f87171' }}>{fmt(netWorth)}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-display text-lg text-white mb-4">Recent Advisor Notes</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {recentNotes.map(n => (
              <div key={n.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', paddingBottom:12 }}>
                <div style={{ display:'flex', gap:8 }}>
                  <span style={{ fontSize:11, fontWeight:500, color: noteColors[n.category] || '#8FA4BC', marginTop:2, whiteSpace:'nowrap' }}>
                    [{n.category}]
                  </span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, color:'white', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.title}</div>
                    <div className="line-clamp-2" style={{ fontSize:12, color:'#8FA4BC', marginTop:2 }}>{n.body}</div>
                    <div style={{ fontSize:10, color:'rgba(143,164,188,0.6)', marginTop:4 }}>
                      {new Date(n.note_date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                    </div>
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