import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DownloadButton from '../components/DownloadButton';
import { UserService } from '../api/paperService';

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    UserService.getDownloadHistory()
      .then((res) => { if (res.success) setDownloads(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const examLabel = { mid1:'Mid-1', mid2:'Mid-2', mid3:'Mid-3', midterm:'Midterm', final:'End Sem', model:'Model/Supply' };

  return (
    <div style={{ display: 'flex' }}>
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <Sidebar />
      <main className="main">
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 0' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            <i className="bi bi-cloud-download-fill" style={{ color: '#6366f1', marginRight: 10 }}></i>
            My Downloads
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: 32 }}>Papers you've previously downloaded</p>

          {loading ? (
            <div style={center}>Loading download history…</div>
          ) : downloads.length === 0 ? (
            <div style={center}>
              <i className="bi bi-cloud-download" style={{ fontSize: 48, opacity: 0.3, display: 'block', marginBottom: 12 }}></i>
              <p>No downloads yet.</p>
              <a href="/dashboard" style={{ color: '#6366f1' }}>Browse papers →</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {downloads.map((item, i) => {
                const p = item.Paper || item.paper || item;
                return (
                  <div key={i} className="card-box" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className="bi bi-check-circle-fill" style={{ color: '#10b981', fontSize: 20 }}></i>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title || p.subject || 'Unknown Paper'}</div>
                      <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>
                        {String(p.course || '').toUpperCase()} · {examLabel[p.examType] || p.examType || ''} · {p.examYear || ''}
                        {item.createdAt && <span style={{ marginLeft: 8 }}>· Downloaded {new Date(item.createdAt).toLocaleDateString('en-IN')}</span>}
                      </div>
                    </div>
                    {p.id && <DownloadButton paperId={p.id} className="btn-view" />}
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
