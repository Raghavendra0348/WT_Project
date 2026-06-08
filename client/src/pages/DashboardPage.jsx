import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import DownloadButton from '../components/DownloadButton';
import { PaperService, UserService } from '../api/paperService';
import { useAuth } from '../context/AuthContext';

const BRANCH_ALIAS = {
  civil: 'ce', ce: 'ce', cse: 'cse', ece: 'ece', eee: 'eee',
  me: 'me', mech: 'me', che: 'che', chem: 'che', mme: 'mme', metallurgy: 'mme',
};
const EXAM_TYPE_MAP = {
  mid1: ['mid1'], mid2: ['mid2'], mid3: ['mid3'], midterm: ['midterm'],
  endsem: ['final', 'model'], supply: ['model'],
};

function generateTrends(papers) {
  if (!papers?.length) return [];
  const map = {};
  papers.forEach((p) => {
    const sum = (p.downloads || 0) + (p.views || 0) + 1;
    map[p.subject] = (map[p.subject] || 0) + sum;
  });
  const sorted = Object.keys(map)
    .map((k) => ({ label: k, val: map[k] }))
    .sort((a, b) => b.val - a.val)
    .slice(0, 5);
  if (!sorted.length) return [];
  const topVal = sorted[0].val * 1.15;
  const colors = [
    'linear-gradient(90deg,#6366f1,#818cf8)',
    'linear-gradient(90deg,#10B981,#3B82F6)',
    'linear-gradient(90deg,#F59E0B,#EF4444)',
    'linear-gradient(90deg,#06b6d4,#6366f1)',
    'linear-gradient(90deg,#EC4899,#8B5CF6)',
  ];
  return sorted.map((s, i) => ({
    label: s.label.length > 20 ? s.label.substring(0, 18) + '…' : s.label,
    pct: Math.min(96, Math.max(10, Math.floor((s.val / topVal) * 100))),
    gradient: colors[i % colors.length],
  }));
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [allPapers, setAllPapers] = useState({ puc1: [], puc2: [], engg: [], all: [] });
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [stats, setStats] = useState({ downloads: '--', bookmarks: '--' });
  const [category, setCategory] = useState('engg');
  const [branch, setBranch] = useState('all');
  const [year, setYear] = useState('all');
  const [sem, setSem] = useState('all');
  const [examType, setExamType] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [papersRes, bookmarksRes, statsRes] = await Promise.allSettled([
        PaperService.getPapers({ limit: 200, status: 'approved' }),
        UserService.getBookmarks(),
        UserService.getStats(),
      ]);

      if (papersRes.status === 'fulfilled' && papersRes.value.success) {
        const data = papersRes.value.data;
        const grouped = { puc1: [], puc2: [], engg: [], all: [] };
        data.forEach((p) => {
          grouped.all.push(p);
          if (p.category === 'intermediate' && p.year === 1) grouped.puc1.push(p);
          if (p.category === 'intermediate' && p.year === 2) grouped.puc2.push(p);
          if (p.category === 'engineering') grouped.engg.push(p);
        });
        setAllPapers(grouped);
      }

      if (bookmarksRes.status === 'fulfilled' && bookmarksRes.value.success) {
        setBookmarkedIds(new Set(bookmarksRes.value.data.map((b) => b.id || b.paperId)));
      }

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const toggleBookmark = useCallback(async (paperId) => {
    const wasSaved = bookmarkedIds.has(paperId);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      wasSaved ? next.delete(paperId) : next.add(paperId);
      return next;
    });
    try {
      await UserService.toggleBookmark(paperId);
      const statsRes = await UserService.getStats();
      if (statsRes.success) setStats(statsRes.data);
    } catch {
      // revert
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        wasSaved ? next.add(paperId) : next.delete(paperId);
        return next;
      });
    }
  }, [bookmarkedIds]);

  // --- Filtering ---
  let papers = search
    ? allPapers.all.filter((p) => {
        const q = search.toLowerCase();
        return (
          p.title?.toLowerCase().includes(q) ||
          p.subject?.toLowerCase().includes(q) ||
          p.course?.toLowerCase().includes(q)
        );
      })
    : allPapers[category] || allPapers.all;

  if (!search && category === 'engg') {
    if (branch !== 'all') {
      papers = papers.filter((p) => {
        const mapped = BRANCH_ALIAS[String(p.course).toLowerCase()] || p.course;
        return mapped === branch;
      });
    }
    if (year !== 'all') {
      papers = papers.filter(
        (p) => String(p.year) === String(year) && String(p.semester) === String(sem)
      );
    }
  }

  if (examType !== 'all') {
    if (/^\d{4}$/.test(examType)) {
      papers = papers.filter((p) => String(p.examYear) === examType);
    } else {
      const allowed = EXAM_TYPE_MAP[examType] || [examType];
      papers = papers.filter((p) => allowed.includes(p.examType));
    }
  }

  const trends = generateTrends(allPapers[category] || allPapers.all);

  const branchCounts = {};
  allPapers.engg.forEach((p) => {
    const mapped = BRANCH_ALIAS[String(p.course).toLowerCase()] || p.course;
    branchCounts[mapped] = (branchCounts[mapped] || 0) + 1;
  });

  const examLabel = { mid1: 'Mid-1', mid2: 'Mid-2', mid3: 'Mid-3', midterm: 'Midterm', final: 'End Sem', model: 'Model/Supply' };

  return (
    <div style={{ display: 'flex' }}>
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <Sidebar />

      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="search-wrap">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              placeholder="Search papers by subject, branch, semester, year…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="topbar-right">
            <div className="user-chip">
              <div className="user-avatar">{user?.name?.charAt(0).toUpperCase() || 'S'}</div>
              <div className="user-info">
                <div className="user-name">{user?.name || 'Student'}</div>
                <div className="user-sub">{user?.course?.toUpperCase() || 'RGUKT'} · RGUKT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="hero">
          <div className="hero-text">
            <div className="hero-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="hero-title">Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋</div>
            <div className="hero-sub">Access RGUKT previous year question papers — PUC 1, PUC 2 &amp; Engineering (all branches)</div>
          </div>
          <div className="hero-deco">
            <div className="deco-badge"><div className="num">{allPapers.all.length || '--'}</div><div className="lbl">Papers</div></div>
            <div className="deco-badge"><div className="num">{stats.downloads}</div><div className="lbl">Downloaded</div></div>
            <div className="deco-badge"><div className="num">{stats.bookmarks}</div><div className="lbl">Saved</div></div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="quick-tabs">
          {[['puc1','journal-bookmark','PUC 1','1st Year Pre-University'],['puc2','journal-text','PUC 2','2nd Year Pre-University'],['engg','mortarboard','Engineering','B.Tech All Branches'],['all','collection','All Papers','Browse everything']].map(([cat,icon,title,desc]) => (
            <div key={cat} className={`quick-tab tab-${cat}${category === cat ? ' active-tab' : ''}`} onClick={() => { setCategory(cat); setBranch('all'); setYear('all'); setSem('all'); setExamType('all'); setSearch(''); }}>
              <div className="quick-tab-icon"><i className={`bi bi-${icon}`}></i></div>
              <div className="quick-tab-info"><div className="quick-tab-title">{title}</div><div className="quick-tab-desc">{desc}</div></div>
            </div>
          ))}
        </div>

        {/* Branch section (engineering only) */}
        {category === 'engg' && (
          <div id="branchSection">
            <div className="section-header"><div className="section-title">Select Your Branch</div></div>
            <div className="branch-grid">
              {[['cse','cpu','CSE','#6366f1'],['ece','broadcast-pin','ECE','#0891b2'],['eee','lightning-charge','EEE','#d97706'],['me','gear-wide-connected','ME','#059669'],['ce','building','Civil (CE)','#7c3aed'],['che','droplet-half','CHE','#e11d48'],['mme','hexagon','MME','#ca8a04']].map(([b,icon,label,color]) => (
                <a key={b} className={`branch-card${branch === b ? ' selected' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setBranch(b === branch ? 'all' : b); }}>
                  <i className={`bi bi-${icon}`} style={{ color }}></i>
                  <div className="branch-name">{label}</div>
                  <div className="branch-count">{branchCounts[b] || 0} papers</div>
                </a>
              ))}
            </div>
            {/* Sem chips */}
            <div className="filter-chips" style={{ marginTop: 24, paddingBottom: 10 }}>
              {[['all',null,null,'All Sems'],['1','1','1','E1S1'],['1','1','2','E1S2'],['2','2','1','E2S1'],['2','2','2','E2S2'],['3','3','1','E3S1'],['3','3','2','E3S2'],['4','4','1','E4S1'],['4','4','2','E4S2']].map(([,y,s,label], i) => (
                <div key={i} className={`chip${(y ? year===y&&sem===s : year==='all') ? ' active' : ''}`} onClick={() => { setYear(y||'all'); setSem(s||'all'); }}>{label}</div>
              ))}
            </div>
          </div>
        )}

        <div className="two-col">
          <div>
            {/* Exam type chips */}
            <div className="filter-chips" id="filterChips">
              {[['all','All'],['mid1','Mid-1'],['mid2','Mid-2'],['mid3','Mid-3'],['endsem','End Sem'],['supply','Supply'],['2025','2024–25'],['2024','2023–24'],['2023','2022–23']].map(([val,label]) => (
                <div key={val} className={`chip${examType === val ? ' active' : ''}`} onClick={() => setExamType(val)}>{label}</div>
              ))}
            </div>

            <div className="section-header">
              <div className="section-title">
                {search ? `Search Results for "${search}"` : category === 'engg' ? 'Engineering Question Papers' : category === 'puc1' ? 'PUC 1 Question Papers' : category === 'puc2' ? 'PUC 2 Question Papers' : 'All Papers'}
              </div>
            </div>

            {/* Papers grid */}
            <div className="papers-grid">
              {loading ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#64748b', gridColumn: '1/-1' }}>Loading papers…</div>
              ) : papers.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#64748b', gridColumn: '1/-1' }}>
                  <i className="bi bi-search" style={{ fontSize: 32, display: 'block', marginBottom: 10, opacity: 0.5 }}></i>
                  No papers found for these filters.
                </div>
              ) : papers.map((p) => {
                const cls = p.category === 'engineering' ? 'tag-engg' : (p.year == 1 ? 'tag-puc1' : 'tag-puc2');
                const tag = p.category === 'engineering' ? 'B.Tech' : 'PUC ' + p.year;
                const isBm = bookmarkedIds.has(p.id);
                return (
                  <div key={p.id} className="paper-card">
                    <button className={`btn-bookmark${isBm ? ' bookmarked' : ''}`} title={isBm ? 'Remove bookmark' : 'Save paper'} onClick={() => toggleBookmark(p.id)}>
                      <i className={`bi bi-bookmark${isBm ? '-fill' : ''}`}></i>
                    </button>
                    <span className={`paper-tag ${cls}`}>{tag}</span>
                    <div className="paper-name" style={{ paddingRight: 36 }}>{p.title || p.subject}</div>
                    <div className="paper-meta">{String(p.course).toUpperCase()} · Y{p.year}S{p.semester} · {p.examYear}</div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontWeight: 600 }}>
                        {examLabel[p.examType] || p.examType || ''}
                      </span>
                    </div>
                    <div className="paper-footer">
                      <div className="paper-stars">
                        {[...Array(5)].map((_, i) => <i key={i} className="bi bi-star-fill" style={{ color: '#f59e0b', fontSize: 11 }}></i>)}
                        <span>4.8</span>
                      </div>
                      <DownloadButton paperId={p.id} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trends */}
            <div className="section-header" style={{ marginTop: 24 }}>
              <div className="section-title">Popular Subjects</div>
            </div>
            <div className="card-box">
              {trends.length === 0 ? (
                <div style={{ padding: 20, color: '#64748b', fontSize: 13, textAlign: 'center' }}>No analytics yet.</div>
              ) : trends.map((t, i) => (
                <div key={i} className="prog-bar-wrap" style={i === trends.length - 1 ? { marginBottom: 0 } : {}}>
                  <span className="prog-label">{t.label}</span>
                  <div className="prog-bar"><div className="prog-fill" style={{ width: t.pct + '%', background: t.gradient }}></div></div>
                  <span className="prog-num">{t.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right col — bookmarks */}
          <div className="right-col">
            <div className="card-box">
              <div className="section-header" style={{ marginBottom: 8 }}>
                <div className="section-title">Saved Papers</div>
                <a className="see-all" href="/bookmarks">See all</a>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', padding: 10 }}>Loading…</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
