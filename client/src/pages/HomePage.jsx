import { Link } from 'react-router-dom';
export default function HomePage() {
  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#0f172a,#1e293b)',color:'#fff',gap:24,textAlign:'center',padding:24}}>
      <i className="bi bi-journal-bookmark-fill" style={{fontSize:64,color:'#6366f1'}}></i>
      <h1 style={{fontSize:48,fontWeight:800,margin:0}}>PaperVault</h1>
      <p style={{color:'#94a3b8',fontSize:18,maxWidth:500}}>RGUKT Question Paper Repository — Access PUC &amp; Engineering previous year papers instantly.</p>
      <div style={{display:'flex',gap:16}}>
        <Link to="/login" className="btn-primary" style={{padding:'12px 32px',borderRadius:99,fontSize:16,fontWeight:600}}>Sign In</Link>
        <Link to="/register" style={{padding:'12px 32px',borderRadius:99,fontSize:16,fontWeight:600,background:'rgba(99,102,241,0.15)',color:'#818cf8',textDecoration:'none'}}>Register</Link>
      </div>
    </div>
  );
}
