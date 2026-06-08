import { useState } from 'react';
import { PaperService } from '../api/paperService';
import Toast from './Toast';

export default function DownloadButton({ paperId, className = 'btn-view' }) {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);
    setShowToast(true);
    try {
      await PaperService.downloadPaper(paperId);
    } catch (e) {
      alert('Download failed: ' + (e.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className={className} onClick={handleDownload} disabled={loading}>
        {loading ? (
          <>
            <i className="bi bi-hourglass-split" style={{ animation: 'spin 1s linear infinite' }}></i>{' '}
            Preparing…
          </>
        ) : (
          <>
            <i className="bi bi-download"></i> Download
          </>
        )}
      </button>

      {showToast && (
        <Toast
          message="Preparing your download…"
          sub="(may take a few seconds)"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
