import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getRevMonthly, getRevByStream, addRevenue } from '../lib/api';
import { fmt, shortFmt, STREAM_COLORS } from '../lib/fmt';
import PageHeader from '../components/PageHeader';
import YearSelector from '../components/YearSelector';
import KpiCard from '../components/KpiCard';

export default function RevenuePage() {
  const router = useRouter();
  const clientId = router.query.client;
  const [year, setYear] = useState(2024);
  const [monthly, setMonthly] = useState([]);
  const [byStream, setByStream] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ entry_date:'', amount:'', entry_type:'actual', notes:'' });

  const load = async () => {
    if (!clientId) return;
    setLoading(true);
    const [m, s] = await Promise.all([getRevMonthly(clientId, year), getRevByStream(clientId, year)]);
    setMonthly(m.data);
    setByStream(s.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [clientId, year]);

  // Build monthly totals chart data
  const monthMap = {};
  monthly.forEach(r => {
    if (!monthMap[r.month]) monthMap[r.month] = { month: r.month };
    monthMap[r.month][r.entry_type === 'actual' ? 'actual' : 'forecast'] =
      (monthMap[r.month][r.entry_type === 'actual' ? 'actual' : 'forecast'] || 0) + parseFloat(r.total);
  });
  const chartData = Object.values(monthMap).sort((a, b) => a.month > b.month ? 1 : -1)
    .map(d => ({ ...d, month: d.month.slice(2) })); // strip year for label

  const totalActual   = chartData.reduce((s, d) => s + (d.actual   || 0), 0);
  const totalForecast = chartData.reduce((s, d) => s + (d.forecast || 0), 0);
  const topChannel    = byStream[0];

  // Stream chart for bar (by month per stream) — stream x month table
  const streamMonths = {};
  monthly.forEach(r => {
    if (!streamMonths[r.stream]) streamMonths[r.stream] = {};
    const mo = r.month.slice(2);
    streamMonths[r.stream][mo] = (streamMonths[r.stream][mo] || 0) + parseFloat(r.total);
  });
  const allMonths = [...new Set(monthly.map(r => r.month.slice(2)))].sort();
  const stackedData = allMonths.map(mo => {
    const obj = { month: mo };
    Object.keys(streamMonths).forEach(s => { obj[s] = streamMonths[s][mo] || 0; });
    return obj;
  });
  const streamNames = Object.keys(streamMonths);

  const handleAdd = async () => {
    if (!form.entry_date || !form.amount) return;
    await addRevenue(clientId, form);
    setShowAdd(false);
    setForm({ entry_date:'', amount:'', entry_type:'actual', notes:'' });
    load();
  };

  if (!clientId) return <div className="text-[var(--muted)]">Select a client first.</div>;

  return (
    <div>
      <PageHeader
        title="Revenue Analysis"
        subtitle="Monthly actuals, forecasts, and channel breakdown"
        actions={
          <div className="flex gap-3">
            <YearSelector year={year} onChange={setYear} />
            <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Add Entry</button>
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <KpiCard label="Total Actual Revenue" value={shortFmt(totalActual)} sub={String(year)} color="teal" />
        <KpiCard label="Forecast Revenue"     value={totalForecast ? shortFmt(totalForecast) : '—'} sub="Remaining months" color="gold" />
        <KpiCard label="Top Channel"          value={topChannel?.stream || '—'} sub={topChannel ? shortFmt(topChannel.total) : ''} color="blue" />
      </div>

      {/* Monthly actual vs forecast bar */}
      <div className="card mb-6">
        <h2 className="font-display text-lg text-white mb-1">Monthly Revenue · {year}</h2>
        <p className="text-[var(--muted)] text-xs mb-6">Actual (solid) vs Forecast (dashed)</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill:'#8FA4BC', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={shortFmt} tick={{ fill:'#8FA4BC', fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={v => shortFmt(v)} contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
            <Legend formatter={v => <span style={{ color:'#8FA4BC', fontSize:11 }}>{v}</span>} />
            <Bar dataKey="actual"   name="Actual"   fill="#00B4A6" radius={[4,4,0,0]} />
            <Bar dataKey="forecast" name="Forecast" fill="#E8A23A" radius={[4,4,0,0]} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Stacked by stream */}
        <div className="card">
          <h2 className="font-display text-lg text-white mb-1">Revenue by Channel · Monthly</h2>
          <p className="text-[var(--muted)] text-xs mb-6">Stacked bars per sales channel</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stackedData} margin={{ left: 5, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill:'#8FA4BC', fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={shortFmt} tick={{ fill:'#8FA4BC', fontSize:10 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={v => shortFmt(v)} contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
              {streamNames.map((s, i) => (
                <Bar key={s} dataKey={s} stackId="a" fill={STREAM_COLORS[i % STREAM_COLORS.length]}
                  radius={i === streamNames.length - 1 ? [4,4,0,0] : [0,0,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie by stream */}
        <div className="card">
          <h2 className="font-display text-lg text-white mb-1">Channel Share · {year}</h2>
          <p className="text-[var(--muted)] text-xs mb-6">% of total actual revenue</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byStream} dataKey="total" nameKey="stream" cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={3}>
                {byStream.map((_, i) => <Cell key={i} fill={STREAM_COLORS[i % STREAM_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => shortFmt(v)} contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
              <Legend formatter={v => <span style={{ color:'#8FA4BC', fontSize:11 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
          {/* Table under pie */}
          <table className="fin-table mt-4">
            <thead><tr><th>Channel</th><th className="text-right">Total</th><th className="text-right">Share</th></tr></thead>
            <tbody>
              {byStream.map((s, i) => {
                const share = totalActual ? (parseFloat(s.total) / totalActual * 100).toFixed(1) : 0;
                return (
                  <tr key={i}>
                    <td className="text-sm text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: STREAM_COLORS[i % STREAM_COLORS.length] }}/>
                      {s.stream}
                    </td>
                    <td className="text-right font-mono text-sm text-teal">{fmt(s.total)}</td>
                    <td className="text-right text-sm text-[var(--muted)]">{share}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A1422] border border-white/10 rounded-2xl p-8 w-full max-w-md">
            <h2 className="font-display text-xl text-white mb-6">Add Revenue Entry</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--muted)] mb-1.5 block">Month (first of month)</label>
                <input type="date" className="fin-input" value={form.entry_date} onChange={e=>setForm({...form,entry_date:e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)] mb-1.5 block">Amount ($)</label>
                <input type="number" className="fin-input" placeholder="0.00" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)] mb-1.5 block">Type</label>
                <select className="fin-input" value={form.entry_type} onChange={e=>setForm({...form,entry_type:e.target.value})}>
                  <option value="actual">Actual</option>
                  <option value="forecast">Forecast</option>
                  <option value="budget">Budget</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--muted)] mb-1.5 block">Notes</label>
                <input className="fin-input" placeholder="Optional note" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-primary flex-1" onClick={handleAdd}>Add Entry</button>
              <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
