import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getClients, createClient } from '../lib/api';
import PageHeader from '../components/PageHeader';

const INDUSTRIES = ['Apparel & Fashion','Retail','Technology','Healthcare','Manufacturing','Food & Beverage','Real Estate','Professional Services','Other'];

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ company_name:'', industry:'', contact_name:'', contact_email:'', contact_phone:'', currency:'USD', status:'active' });

  const load = async () => {
    setLoading(true);
    const r = await getClients();
    setClients(r.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.company_name) return;
    await createClient(form);
    setShowModal(false);
    setForm({ company_name:'', industry:'', contact_name:'', contact_email:'', contact_phone:'', currency:'USD', status:'active' });
    load();
  };

  const statusColor = (s) => ({ active:'badge-actual', inactive:'bg-red-500/10 text-red-400', prospect:'badge-forecast' }[s] || '');

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle="Manage all your financial planning clients"
        actions={
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ New Client</button>
        }
      />

      {loading ? (
        <div className="text-[var(--muted)] text-sm">Loading clients…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clients.map(c => (
            <div
              key={c.id}
              onClick={() => router.push(`/dashboard?client=${c.id}`)}
              className="card cursor-pointer hover:border-teal/30 hover:bg-white/5 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center text-teal font-display font-bold text-lg">
                  {c.company_name[0]}
                </div>
                <span className={`badge ${statusColor(c.status)}`}>{c.status}</span>
              </div>
              <h3 className="font-display font-semibold text-white group-hover:text-teal transition-colors">{c.company_name}</h3>
              <p className="text-[var(--muted)] text-xs mt-1">{c.industry}</p>
              {c.contact_name && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-gold text-[10px] font-bold">
                    {c.contact_name[0]}
                  </div>
                  <span className="text-xs text-[var(--muted)]">{c.contact_name}</span>
                  {c.contact_email && <span className="text-xs text-[var(--muted)] ml-auto truncate">{c.contact_email}</span>}
                </div>
              )}
              <div className="mt-3 text-xs text-teal/60 group-hover:text-teal transition-colors">View Dashboard →</div>
            </div>
          ))}

          {clients.length === 0 && (
            <div className="col-span-3 text-center py-16 text-[var(--muted)]">
              <div className="text-4xl mb-4">◈</div>
              <div className="text-lg font-display mb-2">No clients yet</div>
              <div className="text-sm">Click "New Client" to add your first client.</div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A1422] border border-white/10 rounded-2xl p-8 w-full max-w-lg">
            <h2 className="font-display text-xl text-white mb-6">New Client</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--muted)] mb-1.5 block">Company Name *</label>
                <input className="fin-input" placeholder="Acme Corp" value={form.company_name} onChange={e=>setForm({...form,company_name:e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[var(--muted)] mb-1.5 block">Industry</label>
                  <select className="fin-input" value={form.industry} onChange={e=>setForm({...form,industry:e.target.value})}>
                    <option value="">Select…</option>
                    {INDUSTRIES.map(i=><option key={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)] mb-1.5 block">Currency</label>
                  <select className="fin-input" value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}>
                    <option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>INR</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--muted)] mb-1.5 block">Contact Name</label>
                <input className="fin-input" placeholder="Jane Smith" value={form.contact_name} onChange={e=>setForm({...form,contact_name:e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[var(--muted)] mb-1.5 block">Email</label>
                  <input className="fin-input" type="email" placeholder="jane@example.com" value={form.contact_email} onChange={e=>setForm({...form,contact_email:e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)] mb-1.5 block">Phone</label>
                  <input className="fin-input" placeholder="+1-555-0100" value={form.contact_phone} onChange={e=>setForm({...form,contact_phone:e.target.value})} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button className="btn-primary flex-1" onClick={handleCreate}>Create Client</button>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
