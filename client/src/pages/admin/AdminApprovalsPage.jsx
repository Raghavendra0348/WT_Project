import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import apiClient from '../../api/apiClient';

export default function AdminApprovalsPage() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await apiClient.get('/papers?status=pending&limit=100');
      if (res.data.success) setPapers(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const approve = async (id) => {
    setActionId(id);
    try {
      await apiClient.put(`/papers/${id}`, { status: 'approved' });
      setPapers((p) => p.filter((x) => x.id !== id));
    } catch (e) { alert(e.response?.data?.message || 'Failed to approve'); }
    finally { setActionId(null); }
  };

  const reject = async (id) => {
    if (!confirm('Reject and delete this paper?')) return;
    setActionId(id);
    try {
      await apiClient.delete(`/papers/${id}`);
      setPapers((p) => p.filter((x) => x.id !== id));
    } catch (e) { alert(e.response?.data?.message || 'Failed to reject'); }
    finally { setActionId(null); }
  };

  const examLabel = { mid1:'Mid-1', mid2:'Mid-2', mid3:'Mid-3', midterm:'Midterm', final:'End Sem', model:'Model/Supply' };

  return (
    <div style={{ display: 'flex' }}>
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <Sidebar />
      <main className="main">
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 0' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            <i className="bi bi-check2-circle" style={{ color: '#6366f1', marginRight: 10 }}></i>
            Paper Approvals
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: 32 }}>
            {papers.length} paper{papers.length !== 1 ? 's' : ''} pending review
          </p>

          {loading ? (
            <div style={center}>Loading pending papers…</div>
          ) : papers.length === 0 ? (
            <div style={center}>
              <i className="bi bi-check-circle" style={{ fontSize: 48, color: '#10b981', opacity: 0.5, display: 'block', marginBottom: 12 }}></i>
              <p>All caught up! No papers pending review.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {papers.map((p) => (
                <div key={p.id} className="card-box" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 16 }}>{p.title || p.subject}</div>
                      <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
                        {String(p.course).toUpperCase()} · Y{p.year}S{p.semester} · {p.examYear} · {examLabel[p.examType] || p.examType}
                      </div>
                      {p.description && <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 6, fontStyle: 'italic' }}>{p.description}</div>}
                      <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ padding: '2px 10px', borderRadius: 99, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: 12, fontWeight: 600 }}>⏳ Pending</span>
                        {p.User && <span style={{ padding: '2px 10px', borderRadius: 99, background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontSize: 12 }}>by {p.User.name}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                      <button
                        className="btn-primary"
                        disabled={actionId === p.id}
                        onClick={() => approve(p.id)}
                        style={{ padding: '8px 18px', fontSize: 14, fontWeight: 600, background: 'linear-gradient(135deg,#10b981,#059669)' }}
                      >
                        <i className="bi bi-check2"></i> Approve
                      </button>
                      <button
                        disabled={actionId === p.id}
                        onClick={() => reject(p.id)}
                        style={{ padding: '8px 18px', fontSize: 14, fontWeight: 600, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: 10, cursor: 'pointer' }}
                      >
                        <i className="bi bi-x"></i> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
const center = { padding: 60, textAlign: 'center', color: '#64748b', fontSize: 15 };
