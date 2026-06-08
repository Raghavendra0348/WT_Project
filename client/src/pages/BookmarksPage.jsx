import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DownloadButton from '../components/DownloadButton';
import { UserService } from '../api/paperService';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBookmarks(); }, []);

  async function loadBookmarks() {
    try {
      const res = await UserService.getBookmarks();
      if (res.success) setBookmarks(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const removeBookmark = async (paperId) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== paperId));
    try { await UserService.toggleBookmark(paperId); }
    catch { loadBookmarks(); }
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
            <i className="bi bi-bookmark-heart-fill" style={{ color: '#6366f1', marginRight: 10 }}></i>
            Saved Papers
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: 32 }}>{bookmarks.length} paper{bookmarks.length !== 1 ? 's' : ''} saved</p>

          {loading ? (
            <div style={center}>Loading your saved papers…</div>
          ) : bookmarks.length === 0 ? (
            <div style={center}>
              <i className="bi bi-bookmark" style={{ fontSize: 48, opacity: 0.3, display: 'block', marginBottom: 12 }}></i>
              <p>No saved papers yet.</p>
              <a href="/dashboard" style={{ color: '#6366f1' }}>Browse papers →</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bookmarks.map((p) => (
                <div key={p.id} className="card-box" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="bi bi-file-earmark-text" style={{ color: '#6366f1', fontSize: 20 }}></i>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title || p.subject}</div>
                    <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>
                      {String(p.course).toUpperCase()} · Y{p.year}S{p.semester} · {p.examYear} · {examLabel[p.examType] || p.examType}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <DownloadButton paperId={p.id} className="btn-view" />
                    <button className="btn-bookmark bookmarked" title="Remove bookmark" onClick={() => removeBookmark(p.id)}>
                      <i className="bi bi-bookmark-fill"></i>
                    </button>
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
