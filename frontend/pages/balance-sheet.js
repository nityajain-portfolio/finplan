import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAssets, getLiabilities } from '../lib/api';
import { fmt, shortFmt } from '../lib/fmt';
import PageHeader from '../components/PageHeader';
import KpiCard from '../components/KpiCard';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ASSET_COLORS  = ['#00B4A6','#60A5FA','#A78BFA','#34D399'];
const LIAB_COLORS   = ['#F87171','#E8A23A','#FB923C'];

export default function BalanceSheetPage() {
  const router = useRouter();
  const clientId = router.query.client;
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);

  useEffect(() => {
    if (!clientId) return;
    Promise.all([getAssets(clientId), getLiabilities(clientId)]).then(([a, l]) => {
      setAssets(a.data);
      setLiabilities(l.data);
    });
  }, [clientId]);

  const totalAssets  = assets.reduce((s, a) => s + parseFloat(a.current_value || a.purchase_value || 0), 0);
  const totalLiab    = liabilities.reduce((s, l) => s + parseFloat(l.outstanding_balance || 0), 0);
  const equity       = totalAssets - totalLiab;
  const currentRatio = (() => {
    const ca = assets.filter(a => a.asset_type === 'current').reduce((s,a) => s+parseFloat(a.current_value||0),0);
    const cl = liabilities.filter(l => l.liability_type === 'current').reduce((s,l) => s+parseFloat(l.outstanding_balance||0),0);
    return cl ? (ca / cl).toFixed(2) : '—';
  })();

  const assetGroups = ['current','fixed','intangible','investment'];
  const assetPie = assetGroups.map(t => ({
    name: t.charAt(0).toUpperCase()+t.slice(1),
    value: assets.filter(a => a.asset_type === t).reduce((s,a) => s+parseFloat(a.current_value||0),0)
  })).filter(d => d.value > 0);

  const liabGroups = ['current','long-term'];
  const liabPie = liabGroups.map(t => ({
    name: t.charAt(0).toUpperCase()+t.slice(1),
    value: liabilities.filter(l => l.liability_type === t).reduce((s,l) => s+parseFloat(l.outstanding_balance||0),0)
  })).filter(d => d.value > 0);

  if (!clientId) return <div className="text-[var(--muted)]">Select a client first.</div>;

  return (
    <div>
      <PageHeader title="Balance Sheet" subtitle="Assets, liabilities, and net equity snapshot" />

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total Assets"      value={shortFmt(totalAssets)} color="teal" />
        <KpiCard label="Total Liabilities" value={shortFmt(totalLiab)}   color="gold" />
        <KpiCard label="Net Equity"        value={shortFmt(equity)}       color={equity >= 0 ? 'teal' : 'red'} />
        <KpiCard label="Current Ratio"     value={currentRatio}           sub="> 1.5 is healthy" color={parseFloat(currentRatio) >= 1.5 ? 'teal' : 'red'} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="font-display text-lg text-white mb-4">Asset Mix</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={assetPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4}>
                {assetPie.map((_, i) => <Cell key={i} fill={ASSET_COLORS[i % ASSET_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => shortFmt(v)} contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
              <Legend formatter={v => <span style={{ color:'#8FA4BC', fontSize:11 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 className="font-display text-lg text-white mb-4">Liability Mix</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={liabPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4}>
                {liabPie.map((_, i) => <Cell key={i} fill={LIAB_COLORS[i % LIAB_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => shortFmt(v)} contentStyle={{ background:'#0A1422', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12 }} />
              <Legend formatter={v => <span style={{ color:'#8FA4BC', fontSize:11 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Assets Table */}
        <div className="card overflow-auto">
          <h2 className="font-display text-lg text-white mb-4">Assets</h2>
          <table className="fin-table">
            <thead><tr><th>Asset</th><th>Type</th><th className="text-right">Current Value</th></tr></thead>
            <tbody>
              {assets.map((a, i) => (
                <tr key={i}>
                  <td className="text-sm text-white">{a.asset_name}</td>
                  <td><span className="badge badge-actual capitalize">{a.asset_type}</span></td>
                  <td className="text-right font-mono text-sm text-teal">{fmt(a.current_value || a.purchase_value)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="text-sm font-semibold text-white pt-4">Total Assets</td>
                <td className="text-right font-mono font-bold text-teal">{fmt(totalAssets)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Liabilities Table */}
        <div className="card overflow-auto">
          <h2 className="font-display text-lg text-white mb-4">Liabilities</h2>
          <table className="fin-table">
            <thead><tr><th>Liability</th><th>Type</th><th className="text-right">Outstanding</th><th className="text-right">Rate</th></tr></thead>
            <tbody>
              {liabilities.map((l, i) => (
                <tr key={i}>
                  <td>
                    <div className="text-sm text-white">{l.liability_name}</div>
                    {l.lender && <div className="text-xs text-[var(--muted)]">{l.lender}</div>}
                  </td>
                  <td><span className={`badge ${l.liability_type === 'current' ? 'badge-forecast' : 'bg-red-500/10 text-red-400'} capitalize`}>{l.liability_type}</span></td>
                  <td className="text-right font-mono text-sm text-gold">{fmt(l.outstanding_balance)}</td>
                  <td className="text-right text-sm text-[var(--muted)]">{l.interest_rate ? l.interest_rate+'%' : '—'}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="text-sm font-semibold text-white pt-4">Total Liabilities</td>
                <td className="text-right font-mono font-bold text-gold">{fmt(totalLiab)}</td>
                <td/>
              </tr>
              <tr>
                <td colSpan="2" className="text-sm font-semibold text-teal">Net Equity</td>
                <td className={`text-right font-mono font-bold ${equity >= 0 ? 'text-teal' : 'text-red-400'}`}>{fmt(equity)}</td>
                <td/>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
