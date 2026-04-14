import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getCostSummary, getCostByCategory, getCostFixedVar } from '../lib/api';
import { shortFmt, fmt, CATEGORY_COLORS } from '../lib/fmt';
import PageHeader from '../components/PageHeader';
import YearSelector from '../components/YearSelector';
import KpiCard from '../components/KpiCard';

export default function CostsPage() {
  const router = useRouter();
  const clientId = router.query.client;
  const [year, setYear] = useState(2024);
  const [summary, setSummary] = useState([]);
  const [byCategory, setByCategory] = useState([]);
  const [fixedVar, setFixedVar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    Promise.all([
      getCostSummary(clientId, year),
      getCostByCategory(clientId, year),
      getCostFixedVar(clientId, year),
    ]).then(([s, c, fv]) => {
      setSummary(s.data);
      setByCategory(c.data);
      setFixedVar(fv.data);
      setLoading(false);
    });
  }, [clientId, year]);

  const monthMap = {};
  summary.forEach(r => {
    if (!monthMap[r.month]) monthMap[r.month] = { month: r.month.slice(2) };
    monthMap[r.month][r.entry_type === 'actual' ? 'actual' : 'forecast'] = parseFloat(r.total_costs);
  });
  const chartData = Object.values(monthMap).sort((a, b) => a.month > b.month ? 1 : -1);
  const totalActual = chartData.reduce((s, d) => s + (d.actual || 0), 0);

  const fixed    = fixedVar.find(r => r.cost_type === 'fixed')?.total || 0;
  const variable = fixedVar.find(r => r.cost_type === 'variable')?.total || 0;
  const semiVar  = fixedVar.find(r => r.cost_type === 'semi-variable')?.total || 0;

  const fixedVarPie = [
    { name: 'Fixed',         value: parseFloat(fixed) },
    { name: 'Variable',      value: parseFloat(variable) },
    { name: 'Semi-Variable', value: parseFloat(semiVar) },
  ].filter(d => d.value > 0);

  if (!clientId) return <div className="text-[var(--muted)]">Select a client first.</div>;

  return (
    <div>
      <PageHeader
        title="Cost Analysis"
        subtitle="Fixed, variable, and category-level cost breakdown"
        actions={<YearSelector year={year} onChange={setYear} />}
      />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <KpiCard label="Total Costs"    value={shortFmt(totalActual)} sub={String(year)} color="gold" />
        <KpiCard label="Fixed Costs"    value={shortFmt(fixed)} sub={totalActual ? ((fixed/totalActual)*100).toFixed(0)+'% of total' : '—'} color="blue" />
        <KpiCard label="Variable Costs" value={shortFmt(variable)} sub={totalActual ? ((variable/totalActual)*100).toFixed(0)+'% of total' : '—'} color="teal" />
      </div>

      <div className="card mb-6">
        <h2 className="font-display text-lg text-white mb-6">Monthly Cost Trend · {year}</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill:'#8FA4BC', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={shortFmt} tick={{ fill:'#8FA4BC', fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={v => shortFmt(v)} contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
            <Bar dataKey="actual"   name="Actual"   fill="#E8A23A" radius={[4,4,0,0]} />
            <Bar dataKey="forecast" name="Forecast" fill="#60A5FA" radius={[4,4,0,0]} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-display text-lg text-white mb-1">Fixed vs Variable</h2>
          <p className="text-[var(--muted)] text-xs mb-4">Cost structure breakdown</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={fixedVarPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4}>
                {fixedVarPie.map((_, i) => <Cell key={i} fill={['#60A5FA','#E8A23A','#A78BFA'][i]} />)}
              </Pie>
              <Tooltip formatter={v => shortFmt(v)} contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
              <Legend formatter={v => <span style={{ color:'#8FA4BC', fontSize:11 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card overflow-auto">
          <h2 className="font-display text-lg text-white mb-4">Cost by Category</h2>
          <table className="fin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Type</th>
                <th className="text-right">Amount</th>
                <th className="text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {byCategory.map((c, i) => {
                const share = totalActual ? (parseFloat(c.total) / totalActual * 100).toFixed(1) : 0;
                const typeColors = { fixed:'badge-actual', variable:'badge-forecast', 'semi-variable':'bg-purple-500/10 text-purple-400' };
                return (
                  <tr key={i}>
                    <td>
                      <span className="flex items-center gap-2 text-sm text-white">
                        <span className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}/>
                        {c.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td><span className={`badge ${typeColors[c.cost_type] || ''}`}>{c.cost_type}</span></td>
                    <td className="text-right font-mono text-sm text-gold">{fmt(c.total)}</td>
                    <td className="text-right text-sm text-[var(--muted)]">{share}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
