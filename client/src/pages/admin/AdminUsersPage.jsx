import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { UserService } from '../../api/paperService';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await UserService.getUsers();
      if (res.success) setUsers(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    setActionId(user.id);
    try {
      await UserService.updateUser(user.id, { role: newRole });
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (e) { alert(e.response?.data?.message || 'Failed to update role'); }
    finally { setActionId(null); }
  };

  const deleteUser = async (user) => {
    if (!confirm(`Delete ${user.name}'s account? This cannot be undone.`)) return;
    setActionId(user.id);
    try {
      await UserService.deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (e) { alert(e.response?.data?.message || 'Failed to delete user'); }
    finally { setActionId(null); }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'flex' }}>
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <Sidebar />
      <main className="main">
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 0' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            <i className="bi bi-people-fill" style={{ color: '#6366f1', marginRight: 10 }}></i>
            User Management
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: 24 }}>{users.length} registered users</p>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 42px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {loading ? (
            <div style={center}>Loading users…</div>
          ) : filtered.length === 0 ? (
            <div style={center}>No users found.</div>
          ) : (
            <div className="card-box" style={{ overflow: 'hidden', padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['User','Course','Role','Joined','Actions'].map((h) => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                            <div style={{ color: '#64748b', fontSize: 12 }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: 13 }}>{String(u.course || 'N/A').toUpperCase()}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: u.role === 'admin' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.1)', color: u.role === 'admin' ? '#818cf8' : '#10b981' }}>
                          {u.role === 'admin' ? '🛡️ Admin' : '🎓 User'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#64748b', fontSize: 13 }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button disabled={actionId === u.id} onClick={() => toggleRole(u)}
                            style={{ padding: '6px 12px', fontSize: 12, fontWeight: 600, borderRadius: 8, border: '1px solid rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.1)', color: '#818cf8', cursor: 'pointer' }}>
                            {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                          </button>
                          <button disabled={actionId === u.id} onClick={() => deleteUser(u)}
                            style={{ padding: '6px 12px', fontSize: 12, fontWeight: 600, borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
const center = { padding: 60, textAlign: 'center', color: '#64748b', fontSize: 15 };
