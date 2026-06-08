import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { UserService } from '../api/paperService';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', course: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [stats, setStats] = useState({ downloads: 0, bookmarks: 0, uploads: 0 });

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', course: user.course || '', bio: user.bio || '' });
    UserService.getStats().then((res) => { if (res.success) setStats(res.data); }).catch(console.error);
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      const res = await UserService.updateProfile({ name: form.name, course: form.course, bio: form.bio });
      if (res.success) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) { alert(e.response?.data?.message || 'Failed to update profile'); }
    finally { setLoading(false); }
  };

  const STAT_ITEMS = [
    { label: 'Downloads', value: stats.downloads, icon: 'cloud-download', color: '#10b981' },
    { label: 'Bookmarks', value: stats.bookmarks, icon: 'bookmark-heart', color: '#6366f1' },
    { label: 'Uploads', value: stats.uploads, icon: 'cloud-arrow-up', color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <Sidebar />
      <main className="main">
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 0' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0', marginBottom: 32 }}>
            <i className="bi bi-person-badge-fill" style={{ color: '#6366f1', marginRight: 10 }}></i>
            My Profile
          </h1>

          {/* Avatar + stats */}
          <div className="card-box" style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24, padding: '24px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#e2e8f0', fontSize: 20, fontWeight: 700 }}>{user?.name || 'Student'}</div>
              <div style={{ color: '#64748b', fontSize: 14, marginTop: 2 }}>{user?.email}</div>
              <div style={{ display: 'inline-block', marginTop: 8, padding: '3px 12px', borderRadius: 99, background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontSize: 12, fontWeight: 600 }}>
                {user?.role === 'admin' ? '🛡️ Admin' : '🎓 Student'}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
            {STAT_ITEMS.map((s) => (
              <div key={s.label} className="card-box" style={{ textAlign: 'center', padding: 20 }}>
                <i className={`bi bi-${s.icon}`} style={{ fontSize: 24, color: s.color, display: 'block', marginBottom: 8 }}></i>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Edit form */}
          <div className="card-box" style={{ padding: 28 }}>
            <h2 style={{ color: '#e2e8f0', fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Edit Profile</h2>
            {saved && <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', borderRadius: 10, padding: '10px 16px', color: '#10b981', marginBottom: 16, fontSize: 14 }}>✅ Profile updated!</div>}
            <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group">
                <label style={lbl}>Full Name</label>
                <input style={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label style={lbl}>Email</label>
                <input style={{ ...inp, opacity: 0.5 }} value={form.email} disabled />
              </div>
              <div className="form-group">
                <label style={lbl}>Branch / Course</label>
                <select style={inp} value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
                  {['CSE','ECE','EEE','ME','CE','CHE','MME','PUC1','PUC2'].map((b) => <option key={b} value={b.toLowerCase()}>{b}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Bio (optional)</label>
                <textarea style={{ ...inp, height: 80, resize: 'vertical' }} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us a bit about yourself…"></textarea>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px 28px', fontWeight: 600 }}>
                  {loading ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
const lbl = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#94a3b8' };
const inp = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
