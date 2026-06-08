import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../api/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await AuthService.register({ name: form.name, email: form.email, password: form.password });
      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        navigate('/complete-profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><i className="bi bi-journal-bookmark-fill"></i> PaperVault</div>
        <h1 className="auth-title">Create your account</h1>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {[['name','text','Full Name','John Doe'],['email','email','Email','you@rgukt.ac.in'],['password','password','Password','••••••••'],['confirmPassword','password','Confirm Password','••••••••']].map(([field, type, label, placeholder]) => (
            <div key={field} className="form-group">
              <label>{label}</label>
              <input type={type} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required placeholder={placeholder} />
            </div>
          ))}
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#94a3b8' }}>
          Already have an account? <Link to="/login" style={{ color: '#6366f1' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
