import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../api/authService';

export default function SettingsPage() {
  const { logout } = useAuth();
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwStatus, setPwStatus] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwStatus('error:Passwords do not match'); return; }
    setPwLoading(true);
    setPwStatus('');
    try {
      const res = await AuthService.changePassword(pwForm.currentPassword, pwForm.newPassword);
      if (res.success) {
        setPwStatus('success:Password changed successfully!');
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPwStatus('error:' + (err.response?.data?.message || 'Failed to change password'));
    } finally { setPwLoading(false); }
  };

  const [type, msg] = pwStatus.split(':');

  return (
    <div style={{ display: 'flex' }}>
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <Sidebar />
      <main className="main">
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 0' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0', marginBottom: 32 }}>
            <i className="bi bi-gear-fill" style={{ color: '#6366f1', marginRight: 10 }}></i>
            Settings
          </h1>

          {/* Change password */}
          <div className="card-box" style={{ padding: 28, marginBottom: 20 }}>
            <h2 style={{ color: '#e2e8f0', fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Change Password</h2>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>Choose a strong password to keep your account secure.</p>
            {pwStatus && (
              <div style={{ background: type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${type === 'success' ? '#10b981' : '#ef4444'}`, borderRadius: 10, padding: '10px 16px', color: type === 'success' ? '#10b981' : '#f87171', marginBottom: 16, fontSize: 14 }}>
                {msg}
              </div>
            )}
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[['currentPassword','Current Password'],['newPassword','New Password'],['confirmPassword','Confirm New Password']].map(([field, label]) => (
                <div key={field} className="form-group">
                  <label style={lbl}>{label}</label>
                  <input style={inp} type="password" value={pwForm[field]} onChange={(e) => setPwForm({ ...pwForm, [field]: e.target.value })} required placeholder="••••••••" />
                </div>
              ))}
              <button type="submit" className="btn-primary" disabled={pwLoading} style={{ padding: '12px 28px', fontWeight: 600, alignSelf: 'flex-start' }}>
                {pwLoading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Notification preferences */}
          <div className="card-box" style={{ padding: 28, marginBottom: 20 }}>
            <h2 style={{ color: '#e2e8f0', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Notifications</h2>
            {[['Email on new paper upload','Notify me when a paper is added in my branch'],['Email on paper approval','Notify me when my uploaded paper is approved']].map(([title, desc], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div><div style={{ color: '#e2e8f0', fontWeight: 500 }}>{title}</div><div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>{desc}</div></div>
                <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, flexShrink: 0 }}>
                  <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', inset: 0, background: '#6366f1', borderRadius: 24, cursor: 'pointer' }}></span>
                </label>
              </div>
            ))}
          </div>

          {/* Danger zone */}
          <div className="card-box" style={{ padding: 28, border: '1px solid rgba(239,68,68,0.2)' }}>
            <h2 style={{ color: '#f87171', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Danger Zone</h2>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>Once you sign out, you'll need to log in again.</p>
            <button className="btn-primary" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '10px 24px', fontWeight: 600 }} onClick={() => { if (confirm('Sign out?')) logout(); }}>
              <i className="bi bi-box-arrow-right" style={{ marginRight: 8 }}></i> Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
const lbl = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#94a3b8' };
const inp = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
