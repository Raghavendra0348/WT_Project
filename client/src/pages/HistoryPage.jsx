import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import apiClient from '../api/apiClient';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/users/view-history')
      .then((res) => { if (res.data.success) setHistory(res.data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <Sidebar />
      <main className="main">
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 0' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            <i className="bi bi-clock-history" style={{ color: '#6366f1', marginRight: 10 }}></i>
            View History
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: 32 }}>Recently viewed papers</p>

          {loading ? (
            <div style={center}>Loading history…</div>
          ) : history.length === 0 ? (
            <div style={center}>
              <i className="bi bi-clock" style={{ fontSize: 48, opacity: 0.3, display: 'block', marginBottom: 12 }}></i>
              <p>No viewing history yet.</p>
              <a href="/dashboard" style={{ color: '#6366f1' }}>Browse papers →</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {history.map((item, i) => {
                const p = item.Paper || item.paper || item;
                return (
                  <div key={i} className="card-box" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className="bi bi-eye" style={{ color: '#6366f1', fontSize: 20 }}></i>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 15 }}>{p.title || p.subject || 'Unknown Paper'}</div>
                      <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>
                        {String(p.course || '').toUpperCase()} · {p.examYear || ''}
                        {item.viewedAt && <span style={{ marginLeft: 8, color: '#475569' }}>· {new Date(item.viewedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
const center = { padding: 60, textAlign: 'center', color: '#64748b', fontSize: 15 };
