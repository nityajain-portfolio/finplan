import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getCashflow } from '../lib/api';
import { shortFmt, fmt } from '../lib/fmt';
import PageHeader from '../components/PageHeader';
import YearSelector from '../components/YearSelector';
import KpiCard from '../components/KpiCard';

export default function CashflowPage() {
  const router = useRouter();
  const clientId = router.query.client;
  const [year, setYear] = useState(2024);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!clientId) return;
    getCashflow(clientId, year).then(r => setData(r.data));
  }, [clientId, year]);

  // Build chart: net operating, investing, financing per month
  const monthMap = {};
  data.forEach(r => {
    if (!monthMap[r.month]) monthMap[r.month] = { month: r.month.slice(2), operating:0, investing:0, financing:0 };
    const val = parseFloat(r.total) * (r.direction === 'inflow' ? 1 : -1);
    monthMap[r.month][r.flow_type] = (monthMap[r.month][r.flow_type] || 0) + val;
  });
  const chartData = Object.values(monthMap).sort((a,b)=>a.month>b.month?1:-1);
  chartData.forEach(d => { d.net = (d.operating||0) + (d.investing||0) + (d.financing||0); });

  // Running cash balance
  let balance = 0;
  chartData.forEach(d => { balance += d.net; d.runningBalance = balance; });

  const totalOp  = chartData.reduce((s,d)=>s+(d.operating||0),0);
  const totalInv = chartData.reduce((s,d)=>s+(d.investing||0),0);
  const totalFin = chartData.reduce((s,d)=>s+(d.financing||0),0);

  if (!clientId) return <div className="text-[var(--muted)]">Select a client first.</div>;

  return (
    <div>
      <PageHeader
        title="Cash Flow"
        subtitle="Operating, investing, and financing cash movements"
        actions={<YearSelector year={year} onChange={setYear} />}
      />

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard label="Operating Cash Flow"  value={shortFmt(totalOp)}  color={totalOp  >= 0 ? 'teal' : 'red'} />
        <KpiCard label="Investing Cash Flow"  value={shortFmt(totalInv)} color={totalInv >= 0 ? 'teal' : 'gold'} />
        <KpiCard label="Financing Cash Flow"  value={shortFmt(totalFin)} color={totalFin >= 0 ? 'teal' : 'gold'} />
        <KpiCard label="Net Cash Flow"        value={shortFmt(totalOp+totalInv+totalFin)} color={(totalOp+totalInv+totalFin)>=0?'teal':'red'} />
      </div>

      <div className="card mb-6">
        <h2 className="font-display text-lg text-white mb-6">Monthly Cash Flows by Category · {year}</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ left:10, right:20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill:'#8FA4BC', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={shortFmt} tick={{ fill:'#8FA4BC', fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={v => shortFmt(v)} contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
            <Legend formatter={v => <span style={{ color:'#8FA4BC', fontSize:11 }}>{v}</span>} />
            <Bar dataKey="operating"  name="Operating"  fill="#00B4A6" radius={[4,4,0,0]} />
            <Bar dataKey="investing"  name="Investing"  fill="#60A5FA" radius={[4,4,0,0]} />
            <Bar dataKey="financing"  name="Financing"  fill="#E8A23A" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="font-display text-lg text-white mb-6">Cumulative Net Cash Position · {year}</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ left:10, right:20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill:'#8FA4BC', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={shortFmt} tick={{ fill:'#8FA4BC', fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={v => shortFmt(v)} contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
            <Line type="monotone" dataKey="runningBalance" name="Cumulative Cash" stroke="#00B4A6" strokeWidth={2.5} dot={{ fill:'#00B4A6', r:4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
