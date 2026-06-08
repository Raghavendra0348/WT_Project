import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = `${import.meta.env.VITE_API_URL || ''}/api/auth/google/callback`;
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <i className="bi bi-journal-bookmark-fill"></i> PaperVault
        </div>
        <h1 className="auth-title">Sign in to your account</h1>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@rgukt.ac.in" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" />
          </div>
          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <Link to="/forgot-password" style={{ color: '#6366f1', fontSize: 13 }}>Forgot password?</Link>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <a href={googleUrl} className="btn-google">
          <img src="https://www.google.com/favicon.ico" alt="" style={{ width: 18, height: 18 }} />
          Continue with Google
        </a>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#94a3b8' }}>
          Don't have an account? <Link to="/register" style={{ color: '#6366f1' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
