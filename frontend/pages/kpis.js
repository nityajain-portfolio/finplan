import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import { getKpis } from '../lib/api';
import { fmtPct, shortFmt } from '../lib/fmt';
import PageHeader from '../components/PageHeader';
import KpiCard from '../components/KpiCard';

export default function KpisPage() {
  const router = useRouter();
  const clientId = router.query.client;
  const [kpis, setKpis] = useState([]);

  useEffect(() => {
    if (!clientId) return;
    getKpis(clientId).then(r => setKpis(r.data));
  }, [clientId]);

  // Parse all MySQL decimal strings to real numbers up front
  const parsed = kpis.map(k => ({
    snapshot_date:  k.snapshot_date,
    gross_margin:   parseFloat(k.gross_margin   || 0),
    net_margin:     parseFloat(k.net_margin     || 0),
    current_ratio:  parseFloat(k.current_ratio  || 0),
    debt_to_equity: parseFloat(k.debt_to_equity || 0),
    revenue_growth: parseFloat(k.revenue_growth || 0),
    ebitda:         parseFloat(k.ebitda         || 0),
  }));

  const latest = parsed[parsed.length - 1];

  const chartData = parsed.map(k => ({
    date:             new Date(k.snapshot_date).toLocaleDateString('en-US', { month:'short', year:'2-digit' }),
    'Gross Margin %': parseFloat((k.gross_margin   * 100).toFixed(1)),
    'Net Margin %':   parseFloat((k.net_margin     * 100).toFixed(1)),
    'Rev Growth %':   parseFloat((k.revenue_growth * 100).toFixed(1)),
    'Current Ratio':  parseFloat(k.current_ratio.toFixed(2)),
    'D/E Ratio':      parseFloat(k.debt_to_equity.toFixed(2)),
    EBITDA:           k.ebitda,
  }));

  const radarData = latest ? [
    { metric: 'Gross Margin',  value: parseFloat((latest.gross_margin   * 100).toFixed(1)), benchmark: 35 },
    { metric: 'Net Margin',    value: parseFloat((latest.net_margin     * 100).toFixed(1)), benchmark: 10 },
    { metric: 'Curr Ratio x20',value: parseFloat((latest.current_ratio  * 20).toFixed(1)),  benchmark: 30 },
    { metric: 'Rev Growth',    value: parseFloat((latest.revenue_growth * 100).toFixed(1)), benchmark: 10 },
    { metric: 'Low D/E',       value: parseFloat(((2 - latest.debt_to_equity) * 25).toFixed(1)), benchmark: 25 },
  ] : [];

  if (!clientId) return <div style={{ color:'#8FA4BC' }}>Select a client first.</div>;

  return (
    <div>
      <PageHeader title="KPI & Financial Ratios" subtitle="Quarterly health snapshots and trend analysis" />

      {latest && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Gross Margin"   value={fmtPct(latest.gross_margin)}   sub="Latest quarter" color={latest.gross_margin >= 0.35 ? 'teal' : 'gold'} />
          <KpiCard label="Net Margin"     value={fmtPct(latest.net_margin)}     sub="Latest quarter" color={latest.net_margin   >= 0.08 ? 'teal' : 'red'}  />
          <KpiCard label="EBITDA"         value={shortFmt(latest.ebitda)}       sub="Latest quarter" color="blue" />
          <KpiCard label="Revenue Growth" value={fmtPct(latest.revenue_growth)} sub="YoY"            color="teal" />
        </div>
      )}

      <div className="card mb-6">
        <h2 className="font-display text-lg text-white mb-6">Margin Trends Over Time</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ left:10, right:20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill:'#8FA4BC', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'#8FA4BC', fontSize:11 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
            <Legend formatter={v => <span style={{ color:'#8FA4BC', fontSize:11 }}>{v}</span>} />
            <Line type="monotone" dataKey="Gross Margin %" stroke="#00B4A6" strokeWidth={2} dot={{ r:4 }} />
            <Line type="monotone" dataKey="Net Margin %"   stroke="#60A5FA" strokeWidth={2} dot={{ r:4 }} />
            <Line type="monotone" dataKey="Rev Growth %"   stroke="#E8A23A" strokeWidth={2} dot={{ r:4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-display text-lg text-white mb-6">Liquidity & Leverage Trends</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ left:10, right:20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill:'#8FA4BC', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#8FA4BC', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
              <Legend formatter={v => <span style={{ color:'#8FA4BC', fontSize:11 }}>{v}</span>} />
              <Line type="monotone" dataKey="Current Ratio" stroke="#34D399" strokeWidth={2} dot={{ r:4 }} />
              <Line type="monotone" dataKey="D/E Ratio"     stroke="#F87171" strokeWidth={2} dot={{ r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {radarData.length > 0 && (
          <div className="card">
            <h2 className="font-display text-lg text-white mb-6">Financial Health Radar</h2>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill:'#8FA4BC', fontSize:11 }} />
                <Radar name="Client"    dataKey="value"     stroke="#00B4A6" fill="#00B4A6" fillOpacity={0.25} strokeWidth={2} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#E8A23A" fill="#E8A23A" fillOpacity={0.1}  strokeWidth={1.5} strokeDasharray="4 2" />
                <Legend formatter={v => <span style={{ color:'#8FA4BC', fontSize:11 }}>{v}</span>} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card mt-6" style={{ overflowX:'auto' }}>
        <h2 className="font-display text-lg text-white mb-4">All KPI Snapshots</h2>
        <table className="fin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th style={{ textAlign:'right' }}>Gross Margin</th>
              <th style={{ textAlign:'right' }}>Net Margin</th>
              <th style={{ textAlign:'right' }}>EBITDA</th>
              <th style={{ textAlign:'right' }}>Current Ratio</th>
              <th style={{ textAlign:'right' }}>D/E</th>
              <th style={{ textAlign:'right' }}>Rev Growth</th>
            </tr>
          </thead>
          <tbody>
            {parsed.map((k, i) => (
              <tr key={i}>
                <td style={{ fontSize:14, color:'white' }}>
                  {new Date(k.snapshot_date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                </td>
                <td className="font-mono" style={{ textAlign:'right', fontSize:14, color:'#00B4A6' }}>{fmtPct(k.gross_margin)}</td>
                <td className="font-mono" style={{ textAlign:'right', fontSize:14, color:'#60A5FA' }}>{fmtPct(k.net_margin)}</td>
                <td className="font-mono" style={{ textAlign:'right', fontSize:14, color:'#8FA4BC' }}>{shortFmt(k.ebitda)}</td>
                <td className="font-mono" style={{ textAlign:'right', fontSize:14, color: k.current_ratio  >= 1.5 ? '#00B4A6' : '#f87171' }}>{k.current_ratio.toFixed(2)}</td>
                <td className="font-mono" style={{ textAlign:'right', fontSize:14, color: k.debt_to_equity <  1.2 ? '#00B4A6' : '#E8A23A' }}>{k.debt_to_equity.toFixed(2)}</td>
                <td className="font-mono" style={{ textAlign:'right', fontSize:14, color:'#8FA4BC' }}>{k.revenue_growth ? fmtPct(k.revenue_growth) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}