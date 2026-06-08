import { useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { PaperService } from '../api/paperService';
import { useAuth } from '../context/AuthContext';

const BRANCHES = ['CSE','ECE','EEE','ME','CE','CHE','MME'];
const EXAM_TYPES = [
  { value: 'mid1', label: 'Mid-1' },
  { value: 'mid2', label: 'Mid-2' },
  { value: 'mid3', label: 'Mid-3' },
  { value: 'midterm', label: 'Midterm' },
  { value: 'final', label: 'End Semester' },
  { value: 'model', label: 'Model / Supply' },
];

export default function UploadPage() {
  const { isAdmin } = useAuth();
  const fileRef = useRef();

  const [form, setForm] = useState({
    title: '', subject: '', course: 'CSE', category: 'engineering',
    year: '1', semester: '1', examYear: new Date().getFullYear(),
    examType: 'mid1', description: '',
  });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [message, setMessage] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { alert('Only PDF files are allowed'); return; }
    if (f.size > 50 * 1024 * 1024) { alert('File must be under 50 MB'); return; }
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { alert('Please select a PDF file'); return; }
    setStatus('uploading');
    setProgress(0);
    setMessage('');

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('file', file);

    try {
      const res = await PaperService.createPaper(fd, setProgress);
      if (res.success) {
        setStatus('success');
        setMessage(isAdmin ? '✅ Paper uploaded and published!' : '✅ Paper submitted for review. An admin will approve it shortly.');
        setFile(null);
        setForm({ title: '', subject: '', course: 'CSE', category: 'engineering', year: '1', semester: '1', examYear: new Date().getFullYear(), examType: 'mid1', description: '' });
        setProgress(0);
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Upload failed. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <Sidebar />
      <main className="main">
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 0' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            <i className="bi bi-cloud-arrow-up-fill" style={{ color: '#6366f1', marginRight: 10 }}></i>
            Upload Question Paper
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: 32 }}>
            {isAdmin ? 'Papers you upload are immediately published.' : 'Papers are reviewed by admins before being published.'}
          </p>

          {status === 'success' && (
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', borderRadius: 12, padding: '16px 20px', marginBottom: 24, color: '#10b981', fontWeight: 500 }}>
              {message}
            </div>
          )}
          {status === 'error' && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: 12, padding: '16px 20px', marginBottom: 24, color: '#ef4444', fontWeight: 500 }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Drop zone */}
            <div
              className="card-box"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? '#6366f1' : 'rgba(99,102,241,0.3)'}`,
                borderRadius: 16, padding: '40px 24px', textAlign: 'center', cursor: 'pointer',
                background: dragOver ? 'rgba(99,102,241,0.08)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              <input ref={fileRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
              {file ? (
                <>
                  <i className="bi bi-file-earmark-pdf" style={{ fontSize: 48, color: '#ef4444', display: 'block', marginBottom: 12 }}></i>
                  <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 16 }}>{file.name}</div>
                  <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  <button type="button" style={{ marginTop: 12, background: 'rgba(239,68,68,0.15)', border: 'none', color: '#f87171', padding: '6px 16px', borderRadius: 99, cursor: 'pointer', fontSize: 13 }}
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <i className="bi bi-cloud-arrow-up" style={{ fontSize: 48, color: '#6366f1', display: 'block', marginBottom: 12, opacity: 0.7 }}></i>
                  <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 16 }}>Drop PDF here or click to browse</div>
                  <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>Maximum file size: 50 MB</div>
                </>
              )}
            </div>

            {/* Progress bar */}
            {status === 'uploading' && (
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden', height: 8 }}>
                <div style={{ height: '100%', width: progress + '%', background: 'linear-gradient(90deg,#6366f1,#818cf8)', borderRadius: 99, transition: 'width 0.3s' }}></div>
              </div>
            )}

            {/* Form fields */}
            <div className="card-box" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Paper Title</label>
                <input style={inp} value={form.title} onChange={set('title')} required placeholder="e.g. Data Structures Mid-1 2023" />
              </div>
              <div className="form-group">
                <label style={lbl}>Subject</label>
                <input style={inp} value={form.subject} onChange={set('subject')} required placeholder="e.g. Data Structures" />
              </div>
              <div className="form-group">
                <label style={lbl}>Category</label>
                <select style={inp} value={form.category} onChange={set('category')}>
                  <option value="engineering">Engineering (B.Tech)</option>
                  <option value="intermediate">Intermediate (PUC)</option>
                </select>
              </div>
              {form.category === 'engineering' && (
                <div className="form-group">
                  <label style={lbl}>Branch</label>
                  <select style={inp} value={form.course} onChange={set('course')}>
                    {BRANCHES.map((b) => <option key={b} value={b.toLowerCase()}>{b}</option>)}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label style={lbl}>Year</label>
                <select style={inp} value={form.year} onChange={set('year')}>
                  {[1,2,3,4].map((y) => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={lbl}>Semester</label>
                <select style={inp} value={form.semester} onChange={set('semester')}>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>
              <div className="form-group">
                <label style={lbl}>Exam Type</label>
                <select style={inp} value={form.examType} onChange={set('examType')}>
                  {EXAM_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={lbl}>Exam Year</label>
                <input style={inp} type="number" value={form.examYear} onChange={set('examYear')} min="2010" max="2030" required />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Description (optional)</label>
                <textarea style={{ ...inp, height: 80, resize: 'vertical' }} value={form.description} onChange={set('description')} placeholder="Any additional notes about this paper…"></textarea>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={status === 'uploading'}
              style={{ padding: '14px 32px', fontSize: 16, fontWeight: 600, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              {status === 'uploading' ? (
                <><i className="bi bi-hourglass-split" style={{ animation: 'spin 1s linear infinite' }}></i> Uploading {progress}%…</>
              ) : (
                <><i className="bi bi-cloud-arrow-up-fill"></i> Upload Paper</>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

const lbl = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#94a3b8' };
const inp = {
  width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#e2e8f0',
  fontSize: 14, outline: 'none', boxSizing: 'border-box',
};
