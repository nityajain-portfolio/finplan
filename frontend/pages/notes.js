import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getNotes, addNote } from '../lib/api';
import PageHeader from '../components/PageHeader';

const CAT_COLORS = {
  observation:    { bg:'bg-blue-500/10',    text:'text-blue-400',    dot:'bg-blue-400' },
  recommendation: { bg:'bg-teal/10',        text:'text-teal',        dot:'bg-teal' },
  risk:           { bg:'bg-red-500/10',      text:'text-red-400',     dot:'bg-red-400' },
  opportunity:    { bg:'bg-emerald-500/10',  text:'text-emerald-400', dot:'bg-emerald-400' },
  meeting:        { bg:'bg-gold/10',         text:'text-gold',        dot:'bg-gold' },
};

export default function NotesPage() {
  const router = useRouter();
  const clientId = router.query.client;
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ note_date: new Date().toISOString().slice(0,10), title:'', body:'', category:'observation' });

  const load = () => {
    if (!clientId) return;
    getNotes(clientId).then(r => setNotes(r.data));
  };

  useEffect(() => { load(); }, [clientId]);

  const handleAdd = async () => {
    if (!form.title || !form.body) return;
    await addNote(clientId, form);
    setShowModal(false);
    setForm({ note_date: new Date().toISOString().slice(0,10), title:'', body:'', category:'observation' });
    load();
  };

  const filtered = filter === 'all' ? notes : notes.filter(n => n.category === filter);

  if (!clientId) return <div className="text-[var(--muted)]">Select a client first.</div>;

  return (
    <div>
      <PageHeader
        title="Advisor Notes"
        subtitle="Observations, recommendations, risks, and opportunities"
        actions={<button className="btn-primary" onClick={() => setShowModal(true)}>+ New Note</button>}
      />

      {/* Category filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {['all','observation','recommendation','risk','opportunity','meeting'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
              filter === cat ? 'bg-teal text-white' : 'bg-white/5 text-[var(--muted)] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notes grid */}
      <div className="space-y-4">
        {filtered.map(n => {
          const c = CAT_COLORS[n.category] || CAT_COLORS.observation;
          return (
            <div key={n.id} className={`card border border-white/5 relative`}>
              <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${c.dot}`}/>
              <div className="flex items-start justify-between pl-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`badge ${c.bg} ${c.text} capitalize`}>{n.category}</span>
                    <span className="text-xs text-[var(--muted)]">
                      {new Date(n.note_date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-white text-lg mb-2">{n.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{n.body}</p>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--muted)]">
            <div className="text-3xl mb-3">✎</div>
            <div className="font-display text-lg mb-1">No notes yet</div>
            <div className="text-sm">Add your first note to start tracking insights for this client.</div>
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A1422] border border-white/10 rounded-2xl p-8 w-full max-w-lg">
            <h2 className="font-display text-xl text-white mb-6">New Advisor Note</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[var(--muted)] mb-1.5 block">Date</label>
                  <input type="date" className="fin-input" value={form.note_date} onChange={e=>setForm({...form,note_date:e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)] mb-1.5 block">Category</label>
                  <select className="fin-input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    <option value="observation">Observation</option>
                    <option value="recommendation">Recommendation</option>
                    <option value="risk">Risk</option>
                    <option value="opportunity">Opportunity</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--muted)] mb-1.5 block">Title</label>
                <input className="fin-input" placeholder="e.g. Q2 Performance Review" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)] mb-1.5 block">Note</label>
                <textarea className="fin-input min-h-[120px] resize-none" placeholder="Your detailed note…" value={form.body} onChange={e=>setForm({...form,body:e.target.value})} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-primary flex-1" onClick={handleAdd}>Save Note</button>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
