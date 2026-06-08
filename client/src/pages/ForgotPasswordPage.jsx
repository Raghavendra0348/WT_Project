import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthService } from '../api/authService';
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await AuthService.forgotPassword(email); setSent(true); }
    catch (err) { alert(err.response?.data?.message || 'Failed to send reset email'); }
    finally { setLoading(false); }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><i className="bi bi-journal-bookmark-fill"></i> PaperVault</div>
        <h1 className="auth-title">Reset Password</h1>
        {sent ? (
          <div style={{textAlign:'center',color:'#10b981',padding:20}}>✅ Check your email for the reset link!<br/><Link to="/login" style={{color:'#6366f1'}}>Back to Login</Link></div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Email address</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@rgukt.ac.in"/></div>
            <button type="submit" className="btn-primary" disabled={loading} style={{width:'100%'}}>{loading?'Sending…':'Send Reset Link'}</button>
            <p style={{textAlign:'center',marginTop:16,fontSize:14,color:'#94a3b8'}}><Link to="/login" style={{color:'#6366f1'}}>Back to Login</Link></p>
          </form>
        )}
      </div>
    </div>
  );
}
