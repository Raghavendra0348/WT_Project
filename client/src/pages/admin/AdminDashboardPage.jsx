import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import apiClient from '../../api/apiClient';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, papers: 0, pending: 0, downloads: 0 });
  const [recentPapers, setRecentPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      apiClient.get('/admin/stats'),
      apiClient.get('/papers?limit=5&status=approved'),
    ]).then(([statsRes, papersRes]) => {
      if (statsRes.status === 'fulfilled' && statsRes.value.data.success) setStats(statsRes.value.data.data);
      if (papersRes.status === 'fulfilled' && papersRes.value.data.success) setRecentPapers(papersRes.value.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: 'Total Users', value: stats.users, icon: 'people-fill', color: '#6366f1' },
    { label: 'Total Papers', value: stats.papers, icon: 'file-earmark-text-fill', color: '#10b981' },
    { label: 'Pending Review', value: stats.pending, icon: 'hourglass-split', color: '#f59e0b' },
    { label: 'Total Downloads', value: stats.downloads, icon: 'cloud-download-fill', color: '#06b6d4' },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <Sidebar />
      <main className="main">
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 0' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            <i className="bi bi-speedometer2" style={{ color: '#6366f1', marginRight: 10 }}></i>
            Admin Dashboard
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: 32 }}>System overview and management</p>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
            {STAT_CARDS.map((s) => (
              <div key={s.label} className="card-box" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `rgba(${s.color === '#6366f1' ? '99,102,241' : s.color === '#10b981' ? '16,185,129' : s.color === '#f59e0b' ? '245,158,11' : '6,182,212'},0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`bi bi-${s.icon}`} style={{ color: s.color, fontSize: 22 }}></i>
                  </div>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0', lineHeight: 1 }}>{loading ? '…' : s.value}</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{s.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
            <a href="/admin/approvals" style={{ textDecoration: 'none' }}>
              <div className="card-box" style={{ padding: 24, cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-2px)' } }}>
                <i className="bi bi-check2-circle" style={{ fontSize: 28, color: '#10b981', display: 'block', marginBottom: 10 }}></i>
                <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 16 }}>Review Pending Papers</div>
                <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{stats.pending} papers waiting for approval</div>
              </div>
            </a>
            <a href="/admin/users" style={{ textDecoration: 'none' }}>
              <div className="card-box" style={{ padding: 24, cursor: 'pointer' }}>
                <i className="bi bi-people-fill" style={{ fontSize: 28, color: '#6366f1', display: 'block', marginBottom: 10 }}></i>
                <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 16 }}>Manage Users</div>
                <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>View and manage all accounts</div>
              </div>
            </a>
          </div>

          {/* Recent papers */}
          <div className="card-box" style={{ padding: 24 }}>
            <h2 style={{ color: '#e2e8f0', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Recently Added Papers</h2>
            {recentPapers.length === 0 ? (
              <div style={{ color: '#64748b', padding: 20, textAlign: 'center' }}>No papers yet.</div>
            ) : recentPapers.map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ color: '#e2e8f0', fontWeight: 500 }}>{p.title || p.subject}</div>
                  <div style={{ color: '#64748b', fontSize: 13 }}>{String(p.course).toUpperCase()} · {p.examYear}</div>
                </div>
                <span style={{ padding: '3px 12px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: 12, fontWeight: 600 }}>Approved</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
