import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserService } from '../api/paperService';

const BRANCHES = ['CSE','ECE','EEE','ME','CE','CHE','MME'];

export default function CompleteProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ course: 'cse', category: 'engineering', year: '1' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await UserService.updateProfile(form);
      if (res.success) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f172a,#1e293b)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#e2e8f0', marginBottom: 8 }}>
            <i className="bi bi-journal-bookmark-fill" style={{ color: '#6366f1', marginRight: 8 }}></i>PaperVault
          </div>
          <h1 style={{ fontSize: 22, color: '#e2e8f0', fontWeight: 600, marginBottom: 6 }}>Complete Your Profile</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Tell us about yourself so we can show you relevant papers.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={lbl}>What are you studying?</label>
            <select style={inp} value={form.category} onChange={(e) => { setForm({ ...form, category: e.target.value }); }}>
              <option value="engineering">Engineering (B.Tech)</option>
              <option value="intermediate">Intermediate (PUC 1 / PUC 2)</option>
            </select>
          </div>

          {form.category === 'engineering' ? (
            <>
              <div>
                <label style={lbl}>Branch</label>
                <select style={inp} value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value.toLowerCase() })}>
                  {BRANCHES.map((b) => <option key={b} value={b.toLowerCase()}>{b}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Current Year</label>
                <select style={inp} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>
                  {[1,2,3,4].map((y) => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
            </>
          ) : (
            <div>
              <label style={lbl}>PUC Year</label>
              <select style={inp} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value, course: 'intermediate' })}>
                <option value="1">PUC 1 (First Year)</option>
                <option value="2">PUC 2 (Second Year)</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '14px', fontWeight: 700, fontSize: 16, borderRadius: 12, marginTop: 8 }}>
            {loading ? 'Saving…' : 'Continue to Dashboard →'}
          </button>
        </form>
      </div>
    </div>
  );
}
const lbl = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#94a3b8' };
const inp = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
