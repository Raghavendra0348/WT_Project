import Sidebar from '../components/Sidebar';
export default function AboutPage() {
  return (
    <div style={{display:'flex'}}>
      <Sidebar />
      <main className="main" style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16,color:'#94a3b8'}}>
        <i className="bi bi-tools" style={{fontSize:48,opacity:0.4}}></i>
        <h2 style={{color:'#e2e8f0'}}>AboutPage</h2>
        <p>Coming soon — being ported from HTML.</p>
      </main>
    </div>
  );
}
