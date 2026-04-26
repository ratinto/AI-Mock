import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  ChevronLeft, 
  Download, 
  Loader2, 
  FileText,
  User,
  Link as LinkIcon,
  BookOpen,
  Briefcase,
  Code,
  Award,
  Users,
  Clock,
  ChevronRight,
  Layers,
  Zap,
  MoreHorizontal,
  Pen,
  Camera,
  Monitor,
  Layout,
  Cpu,
  Terminal,
  Filter,
  Check,
  Eye,
  Type,
  X,
  ShieldCheck,
  AlertCircle,
  Globe,
  Upload,
  BarChart3,
  Search,
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIcon,
  Table,
  Undo2,
  Redo2,
  Maximize2,
  Settings,
  ChevronDown,
  FileCode,
  FileSearch,
  RefreshCcw,
  Share2
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { api } from '../lib/api';
import type { Resume, ResumeStructuredData } from '../domain/resume';

interface ResumeFeedback {
  score: number;
  ats_compatibility: number;
  readability: number;
  impact_metrics: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const INITIAL_RESUME_DATA: ResumeStructuredData = {
  title: '',
  target_role: '',
  general: { name: '', email: '', phone: '', summary: '', photo_url: '', nationality: '' },
  socialLinks: { github: '', linkedin: '', portfolio: '', leetcode: '', hackerrank: '', codechef: '', codeforces: '' },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certificates: [],
  coCurricular: []
};

const SECTIONS = [
  { id: 'general', label: 'Identity', icon: <User size={20} /> },
  { id: 'socialLinks', label: 'Network', icon: <LinkIcon size={20} /> },
  { id: 'education', label: 'Academic', icon: <BookOpen size={20} /> },
  { id: 'experience', label: 'Internships', icon: <Briefcase size={20} /> },
  { id: 'projects', label: 'Projects', icon: <Code size={20} /> },
  { id: 'skills', label: 'Arsenal', icon: <Sparkles size={20} /> },
  { id: 'coCurricular', label: 'Activities', icon: <Users size={20} /> },
];

const ResumeAI: React.FC = () => {
  const [view, setView] = useState<'library' | 'editor' | 'analysis-hub'>('library');
  const [editorMode, setEditorMode] = useState<'form' | 'latex'>('latex');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeResume, setActiveResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [compilingLatex, setCompilingLatex] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('general');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newResumeInfo, setNewResumeInfo] = useState({ title: '', role: '' });
  const [compileStatus, setCompileStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<ResumeFeedback | null>(null);
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null);
  
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const data = await api.listResumes();
      setResumes(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSelectResume = async (id: string) => {
    setLoading(true);
    try {
      const data = await api.getResume(id);
      setActiveResume(data);
      if (data.latex_code) {
         setCompiledPdfUrl(`https://latexonline.cc/compile?text=${encodeURIComponent(data.latex_code)}&force=true`);
      } else {
         setCompiledPdfUrl(null);
      }
      setView('editor');
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleOpenAnalysis = async (resume: Resume) => {
     setLoading(true);
     try {
        const data = await api.getResume(resume.id);
        setActiveResume(data);
        setView('analysis-hub');
        handleAnalyze(data);
     } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAnalyze = async (resumeToAnalyze?: Resume) => {
    const target = resumeToAnalyze || activeResume;
    if (!target) return;
    setAnalyzing(true);
    try {
      const result = await api.evaluateResume({ 
        id: target.id, 
        data: target.data, 
        target_role: target.target_role 
      });
      setFeedback(result.feedback || result);
    } catch (err) { console.error(err); } finally { setAnalyzing(false); }
  };

  const handleCreateResume = async () => {
    if (!newResumeInfo.title || !newResumeInfo.role) return;
    setLoading(true);
    try {
      const data = await api.createResume(newResumeInfo.title, newResumeInfo.role, INITIAL_RESUME_DATA);
      setResumes([data, ...resumes]);
      handleSelectResume(data.id);
      setShowNewModal(false);
      setNewResumeInfo({ title: '', role: '' });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleUpdateResume = async () => {
    if (!activeResume) return;
    setSaving(true);
    try {
      await api.updateResume(activeResume.id, activeResume.title, activeResume.target_role, activeResume.data, activeResume.latex_code);
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleRecompile = async () => {
    if (!activeResume?.latex_code) return;
    setCompilingLatex(true);
    setCompileStatus('idle');
    try {
      // In Visual Mode: Parse LaTeX to JSON. In Code Mode: Compile true PDF.
      if (editorMode === 'form') {
         const result = await api.parseLatex(activeResume.latex_code);
         if (result && result.data) {
            setActiveResume(prev => prev ? { ...prev, data: result.data } : null);
            setCompileStatus('success');
         }
      } else {
         // Generate true PDF url for iframe
         const encodedLatex = encodeURIComponent(activeResume.latex_code);
         const pdfUrl = `https://latexonline.cc/compile?text=${encodedLatex}&force=true`;
         setCompiledPdfUrl(pdfUrl);
         setCompileStatus('success');
      }
      setTimeout(() => setCompileStatus('idle'), 2000);
    } catch (err) { 
      console.error(err); 
      setCompileStatus('error');
    } finally { setCompilingLatex(false); }
  };

  const downloadPDF = async () => {
    if (editorMode === 'latex' && compiledPdfUrl) {
       // Download the true PDF directly
       window.open(compiledPdfUrl, '_blank');
       return;
    }
    
    // Visual mode fallback
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${activeResume?.title || 'resume'}.pdf`);
  };

  const updateSection = (section: keyof ResumeStructuredData, value: any) => {
    if (!activeResume) return;
    setActiveResume({ ...activeResume, data: { ...activeResume.data, [section]: value } });
  };

  return (
    <div className="studio-root light-theme animate-fade">
      {/* Premium Studio Header */}
      <nav className="studio-nav header-glass">
         <div className="nav-left">
            <div className="studio-brand">
               <div className="brand-dot"></div>
               <span className="brand-text">Resume Studio</span>
            </div>
            <div className="editor-mode-tabs">
               <button className={editorMode === 'latex' ? 'active' : ''} onClick={() => setEditorMode('latex')}>
                  <Terminal size={14} /> Code Editor
               </button>
               <button className={editorMode === 'form' ? 'active' : ''} onClick={() => setEditorMode('form')}>
                  <Layers size={14} /> Visual Editor
               </button>
            </div>
         </div>
         
         <div className="nav-center">
            {view === 'editor' && (
               <div className="document-info">
                  <FileCode size={16} />
                  <span className="doc-name">{activeResume?.title || 'Untitled Draft'}</span>
               </div>
            )}
         </div>

         <div className="nav-right">
            {view !== 'library' ? (
               <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-secondary-studio" onClick={handleUpdateResume} disabled={saving}>
                     {saving ? <Loader2 className="spin" size={14} /> : <Save size={14} />}
                     Save
                  </button>
                  <button className="btn-primary-studio" onClick={downloadPDF}>
                     <Download size={14} /> Export
                  </button>
                  <div className="divider-v"></div>
                  <button className="icon-btn-studio" onClick={() => setView('library')} title="Exit">
                     <X size={18} />
                  </button>
               </div>
            ) : (
               <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-secondary-studio" onClick={() => setView('analysis-hub')}>
                     <Cpu size={14} /> Intel Hub
                  </button>
                  <button className="btn-primary-studio" onClick={() => setShowNewModal(true)}>
                     <Plus size={14} /> Create New
                  </button>
               </div>
            )}
         </div>
      </nav>

      <main className="studio-main">
        {loading && view === 'library' ? (
           <div className="studio-loader"><Loader2 className="spin" size={32} /></div>
        ) : (
          <>
            {view === 'library' && (
              <div className="registry-container">
                 <header className="registry-header">
                    <h2>Manuscript Registry</h2>
                    <p>Manage your professional high-fidelity drafts</p>
                 </header>
                 <div className="studio-grid">
                    <div className="studio-card create-new" onClick={() => setShowNewModal(true)}>
                       <div className="c-icon"><Plus size={32} strokeWidth={1} /></div>
                       <h3>New Draft</h3>
                    </div>
                    {(resumes || []).map(r => (
                      <div key={r.id} className="studio-card resume-item" onClick={() => handleSelectResume(r.id)}>
                         <div className="c-top">
                            <span className="c-status">Ready</span>
                            <div className="c-actions">
                               <button onClick={(e) => { e.stopPropagation(); handleOpenAnalysis(r); }}><Cpu size={16} /></button>
                               <button onClick={(e) => handleDeleteResume(r.id, e)}><Trash2 size={16} /></button>
                            </div>
                         </div>
                         <h3>{r.title}</h3>
                         <p>{r.target_role}</p>
                         <div className="c-footer">
                            <Clock size={12} /> {new Date(r.updated_at).toLocaleDateString()}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {view === 'analysis-hub' && (
               <div className="hub-layout">
                  <aside className="hub-sidebar">
                     <div className="upload-trigger" onClick={() => document.getElementById('hub-file')?.click()}>
                        <Upload size={24} />
                        <span>Analyze External PDF</span>
                        <input type="file" id="hub-file" hidden accept=".pdf" />
                     </div>
                     <div className="hub-list">
                        <label>Registry Drafts</label>
                        {(resumes || []).map(r => (
                           <div key={r.id} className={`hub-list-item ${activeResume?.id === r.id ? 'active' : ''}`} onClick={() => handleOpenAnalysis(r)}>
                              <FileText size={14} /> {r.title}
                           </div>
                        ))}
                     </div>
                  </aside>
                  <div className="hub-body">
                     {analyzing ? (
                        <div className="hub-loader"><Loader2 className="spin" size={48} /><h2>Evaluating Strategy...</h2></div>
                     ) : feedback ? (
                        <div className="hub-report animate-fade">
                           <div className="report-header">
                              <div className="report-score-box">
                                 <span className="score-val">{feedback.score}</span>
                                 <span className="score-lbl">Intel Score</span>
                              </div>
                              <div className="report-summary">
                                 <label>EXECUTIVE SUMMARY</label>
                                 <p>{feedback.summary}</p>
                              </div>
                           </div>
                           <div className="report-metrics">
                              <div className="r-metric"><strong>{feedback.ats_compatibility}%</strong> ATS Match</div>
                              <div className="r-metric"><strong>{feedback.readability}%</strong> Recruiter Score</div>
                           </div>
                           <div className="report-panels">
                              <div className="r-panel pos">
                                 <h6><ShieldCheck size={14} /> Strengths</h6>
                                 <ul>{feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                              </div>
                              <div className="r-panel neg">
                                 <h6><AlertCircle size={14} /> Critical Gaps</h6>
                                 <ul>{feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
                              </div>
                           </div>
                        </div>
                     ) : (
                        <div className="hub-empty-state"><Search size={48} /><p>Select a draft to view AI intel</p></div>
                     )}
                  </div>
               </div>
            )}

            {view === 'editor' && activeResume && (
              <div className="studio-workspace split-view">
                 <div className="editor-pane">
                    {editorMode === 'latex' ? (
                       <div className="latex-studio-container">
                          <div className="latex-top-tools">
                             <div className="tool-row">
                                <div className="tool-btn-grp">
                                   <button><Undo2 size={14} /></button>
                                   <button><Redo2 size={14} /></button>
                                </div>
                                <div className="divider-v"></div>
                                <div className="tool-btn-grp">
                                   <button><Bold size={14} /></button>
                                   <button><Italic size={14} /></button>
                                   <button><Type size={14} /></button>
                                </div>
                                <div className="divider-v"></div>
                                <div className="tool-btn-grp">
                                   <button><List size={14} /></button>
                                   <button><Table size={14} /></button>
                                   <button><ImageIcon size={14} /></button>
                                </div>
                             </div>
                             <div className="file-header">
                                <FileCode size={14} /> <span>main.tex</span>
                                <div className="status-tag">Editing</div>
                             </div>
                          </div>
                          <div className="code-editor-wrap">
                             <Editor
                                height="100%"
                                defaultLanguage="latex"
                                theme="vs"
                                value={activeResume.latex_code || ''}
                                onChange={(val) => setActiveResume({ ...activeResume, latex_code: val || '' })}
                                options={{ 
                                   minimap: { enabled: false }, 
                                   fontSize: 14, 
                                   lineHeight: 1.6,
                                   padding: { top: 20 },
                                   scrollbar: { vertical: 'hidden' },
                                   fontFamily: "'Fira Code', monospace"
                                }}
                             />
                          </div>
                       </div>
                    ) : (
                       <div className="visual-studio-container">
                          <aside className="visual-sidebar">
                             {SECTIONS.map(s => (
                                <button key={s.id} className={activeSectionId === s.id ? 'active' : ''} onClick={() => setActiveSectionId(s.id)} title={s.label}>
                                   {s.icon}
                                </button>
                             ))}
                          </aside>
                          <div className="visual-viewport">
                             <header className="view-h">
                                <h3>{activeSectionId.toUpperCase()}</h3>
                                <div className="accent-bar"></div>
                             </header>
                             <div className="view-body">
                                <SectionEditor sectionId={activeSectionId} data={activeResume.data} updateSection={updateSection} />
                             </div>
                          </div>
                       </div>
                    )}
                 </div>

                 <div className="resizer-handle"><div className="knob"></div></div>

                 <div className="preview-pane">
                    <div className="preview-toolbar">
                       <button className="btn-recompile-pro" onClick={handleRecompile} disabled={compilingLatex}>
                          {compilingLatex ? <Loader2 className="spin" size={16} /> : <RefreshCcw size={16} />}
                          <span>Recompile</span>
                       </button>
                       <div className="preview-controls">
                          <button className="p-icon-btn"><FileText size={16} /></button>
                          <button className="p-icon-btn" onClick={downloadPDF} title="Download PDF"><Download size={16} /></button>
                          <div className="divider-v"></div>
                          <div className="page-nav">
                             <button>-</button>
                             <span>1 / 1</span>
                             <button>+</button>
                          </div>
                       </div>
                    </div>
                    <div className="preview-body" style={{ padding: editorMode === 'latex' ? 0 : '40px', background: editorMode === 'latex' ? '#525659' : '#e9ecef' }}>
                       {editorMode === 'latex' ? (
                          compiledPdfUrl ? (
                             <iframe src={compiledPdfUrl} className="pdf-iframe" title="PDF Preview" />
                          ) : (
                             <div className="pdf-placeholder">
                                <FileCode size={48} style={{ color: '#adb5bd', marginBottom: '16px' }} />
                                <h3>Ready to Compile</h3>
                                <p>Write your LaTeX code and click Recompile to generate the PDF.</p>
                             </div>
                          )
                       ) : (
                          <div className="canvas-wrapper scale-80">
                             <div className="paper-manuscript preview-white-mode" ref={previewRef}>
                                <ResumePreviewContent data={activeResume.data} />
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modern Modal */}
      {showNewModal && (
        <div className="modal-overlay animate-fade">
           <div className="modal-content">
              <div className="modal-h">
                 <h4>New Manuscript</h4>
                 <button onClick={() => setShowNewModal(false)}><X size={18} /></button>
              </div>
              <div className="modal-b">
                 <Field label="Manuscript Title" value={newResumeInfo.title} onChange={v => setNewResumeInfo({...newResumeInfo, title: v})} />
                 <Field label="Target Role" value={newResumeInfo.role} onChange={v => setNewResumeInfo({...newResumeInfo, role: v})} />
              </div>
              <div className="modal-f">
                 <button className="btn-p-full" onClick={handleCreateResume}>Create Draft</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600;700;800;900&family=Fira+Code:wght@400;500&display=swap');
        
        .studio-root { height: 100vh; display: flex; flex-direction: column; background: #ffffff; color: #111111; font-family: 'Inter', sans-serif; overflow: hidden; }
        
        /* Light Theme Header */
        .header-glass { height: 64px; padding: 0 24px; background: #fff; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; z-index: 100; }
        .studio-brand { display: flex; align-items: center; gap: 10px; margin-right: 32px; }
        .brand-dot { width: 8px; height: 8px; background: #111; border-radius: 50%; }
        .brand-text { font-weight: 900; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .editor-mode-tabs { display: flex; background: #f8f9fa; border-radius: 8px; padding: 4px; gap: 4px; border: 1px solid #f0f0f0; }
        .editor-mode-tabs button { border: none; background: transparent; padding: 6px 16px; font-size: 0.75rem; font-weight: 700; color: #888; border-radius: 6px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
        .editor-mode-tabs button.active { background: #fff; color: #111; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        
        .document-info { display: flex; align-items: center; gap: 10px; color: #adb5bd; }
        .doc-name { font-size: 0.85rem; font-weight: 700; color: #111; }
        
        .btn-primary-studio { background: #111; color: #fff; border: none; padding: 8px 20px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .btn-secondary-studio { background: #fff; color: #111; border: 1px solid #f0f0f0; padding: 8px 16px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .icon-btn-studio { width: 36px; height: 36px; border: none; background: transparent; color: #adb5bd; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
        .icon-btn-studio:hover { background: #f8f9fa; color: #111; }
        .divider-v { width: 1px; height: 24px; background: #f0f0f0; margin: 0 8px; }

        .studio-main { flex: 1; overflow: hidden; background: #fff; display: flex; flex-direction: column; }
        
        /* Registry View */
        .registry-container { padding: 48px; max-width: 1400px; margin: 0 auto; width: 100%; overflow-y: auto; }
        .registry-header { margin-bottom: 40px; }
        .registry-header h2 { font-size: 2rem; font-weight: 900; letter-spacing: -1px; margin-bottom: 8px; }
        .registry-header p { color: #888; font-weight: 500; }
        
        .studio-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .studio-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 20px; padding: 24px; cursor: pointer; transition: 0.3s; position: relative; }
        .studio-card:hover { border-color: #111; transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
        .studio-card.create-new { border: 2px dashed #f0f0f0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; background: #fafafa; }
        .studio-card h3 { font-size: 1rem; font-weight: 800; margin-bottom: 4px; }
        .studio-card p { font-size: 0.8rem; color: #888; margin-bottom: 24px; }
        .c-status { font-size: 0.6rem; font-weight: 900; text-transform: uppercase; color: #059669; background: #ecfdf5; padding: 4px 10px; border-radius: 100px; }
        .c-actions { display: flex; gap: 8px; }
        .c-actions button { background: transparent; border: none; color: #ccc; cursor: pointer; transition: 0.2s; }
        .c-actions button:hover { color: #111; }
        .c-footer { margin-top: auto; padding-top: 16px; border-top: 1px solid #f9f9f9; display: flex; align-items: center; gap: 8px; font-size: 0.7rem; color: #999; font-weight: 600; }

        /* Workspace Split */
        .split-view { display: flex; height: 100%; width: 100%; overflow: hidden; }
        .editor-pane { flex: 1; min-width: 450px; background: #fff; border-right: 1px solid #f0f0f0; display: flex; flex-direction: column; }
        .resizer-handle { width: 8px; background: #fcfcfc; cursor: col-resize; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .resizer-handle:hover { background: #f0f0f0; }
        .knob { width: 2px; height: 32px; background: #dee2e6; border-radius: 1px; }
        .preview-pane { flex: 1.2; min-width: 450px; background: #f8f9fa; display: flex; flex-direction: column; }

        /* LaTeX Studio */
        .latex-studio-container { flex: 1; display: flex; flex-direction: column; }
        .latex-top-tools { background: #fff; padding: 8px 16px; border-bottom: 1px solid #f0f0f0; display: flex; flex-direction: column; gap: 8px; }
        .tool-row { display: flex; align-items: center; gap: 8px; }
        .tool-btn-grp { display: flex; gap: 2px; }
        .tool-btn-grp button { width: 32px; height: 32px; border: none; background: transparent; color: #666; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .tool-btn-grp button:hover { background: #f8f9fa; color: #111; }
        .file-header { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 700; color: #111; padding-top: 4px; }
        .status-tag { font-size: 0.6rem; background: #e7f5ff; color: #228be6; padding: 2px 8px; border-radius: 4px; margin-left: 12px; }
        .code-editor-wrap { flex: 1; background: #fff; }

        /* Visual Studio */
        .visual-studio-container { flex: 1; display: flex; width: 100%; }
        .visual-sidebar { width: 64px; border-right: 1px solid #f0f0f0; background: #fff; display: flex; flex-direction: column; align-items: center; padding-top: 24px; gap: 12px; }
        .visual-sidebar button { width: 40px; height: 40px; border-radius: 12px; border: none; background: transparent; color: #ccc; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .visual-sidebar button:hover { background: #f8f9fa; color: #111; }
        .visual-sidebar button.active { background: #f2f2f2; color: #111; }
        .visual-viewport { flex: 1; padding: 40px; overflow-y: auto; background: #fff; }
        .view-h { margin-bottom: 32px; }
        .view-h h3 { font-size: 0.75rem; font-weight: 900; letter-spacing: 0.1em; color: #bbb; margin-bottom: 4px; }
        .accent-bar { width: 24px; height: 3px; background: #111; }

        /* Preview Area */
        .preview-toolbar { height: 56px; background: #fff; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; flex-shrink: 0; }
        .btn-recompile-pro { background: #2f9e44; color: #fff; border: none; padding: 8px 20px; border-radius: 8px; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.2s; }
        .btn-recompile-pro:hover { background: #2b8a3e; transform: translateY(-1px); }
        .preview-controls { display: flex; align-items: center; gap: 8px; }
        .p-icon-btn { width: 32px; height: 32px; background: transparent; border: none; color: #888; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .page-nav { display: flex; align-items: center; gap: 12px; font-size: 0.75rem; font-weight: 700; color: #888; background: #f8f9fa; padding: 4px 12px; border-radius: 6px; }
        .preview-body { flex: 1; overflow-y: auto; display: flex; justify-content: center; align-items: center; }
        .canvas-wrapper { transform-origin: top center; box-shadow: 0 30px 60px rgba(0,0,0,0.15); border-radius: 4px; }
        .scale-80 { transform: scale(0.85); }
        .pdf-iframe { width: 100%; height: 100%; border: none; background: #525659; }
        .pdf-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #fff; text-align: center; }
        .pdf-placeholder h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; }
        .pdf-placeholder p { font-size: 0.9rem; color: #adb5bd; }
        
        /* THE CRITICAL FIX: Ensure font is NOT white on paper */
        .preview-white-mode { 
           width: 210mm; min-height: 297mm; background: #fff; padding: 15mm 20mm; 
           font-family: 'Libre Baskerville', serif; 
           color: #000000 !important; /* Force Black Text */
        }
        .preview-white-mode * { color: #000000 !important; }
        .preview-white-mode a { color: #228be6 !important; text-decoration: underline; }

        /* Field Overrides */
        .field-studio { margin-bottom: 24px; }
        .field-studio label { display: block; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #bbb; margin-bottom: 8px; }
        .field-studio input, .field-studio textarea { width: 100%; border: 1px solid #f0f0f0; background: #fafafa; padding: 12px 14px; border-radius: 10px; font-size: 0.9rem; font-weight: 500; outline: none; transition: 0.2s; }
        .field-studio input:focus, .field-studio textarea:focus { border-color: #111; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }

        /* Modal Refinement */
        .modal-overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.8); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content { background: #fff; width: 440px; border-radius: 24px; padding: 32px; box-shadow: 0 40px 100px rgba(0,0,0,0.1); border: 1px solid #f0f0f0; }
        .modal-h { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-h h4 { font-size: 1.2rem; font-weight: 900; }
        .btn-p-full { width: 100%; background: #111; color: #fff; border: none; padding: 14px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .btn-p-full:hover { background: #000; transform: translateY(-2px); }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const ResumePreviewContent: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null;
  return (
    <div className="academic-theme">
      <header style={{ marginBottom: '20pt' }}>
        <h1 style={{ fontSize: '24pt', marginBottom: '4pt' }}>{data.general?.name || 'Identity Name'}</h1>
        <div style={{ fontSize: '10pt', display: 'flex', flexDirection: 'column', gap: '2pt' }}>
           <div><strong>Phone:</strong> {data.general?.phone || '+91 0000000000'}</div>
           <div><strong>Email:</strong> {data.general?.email || 'email@example.com'}</div>
           <div style={{ display: 'flex', gap: '8pt', marginTop: '4pt' }}>
              {data.socialLinks?.linkedin && <a href={data.socialLinks.linkedin}>LinkedIn</a>}
              {data.socialLinks?.github && <span>• <a href={data.socialLinks.github}>Github</a></span>}
           </div>
        </div>
      </header>

      {data.general?.summary && (
         <section>
            <div className="section-h">Professional Summary</div>
            <p style={{ fontSize: '10pt', lineHeight: '1.5', textAlign: 'justify' }}>{data.general.summary}</p>
         </section>
      )}

      {data.education?.length > 0 && (
         <section>
            <div className="section-h">Education</div>
            {data.education.map((edu: any, i: number) => (
               <div key={i} style={{ marginBottom: '10pt' }}>
                  <div className="row-flex"><span>{edu.degree}</span><span>{edu.end_date}</span></div>
                  <div className="row-sub"><span style={{ fontStyle: 'italic' }}>{edu.institution}</span><strong>Grade: {edu.grade}</strong></div>
               </div>
            ))}
         </section>
      )}

      {data.experience?.length > 0 && (
         <section>
            <div className="section-h">Internships</div>
            {data.experience.map((exp: any, i: number) => (
               <div key={i} style={{ marginBottom: '12pt' }}>
                  <div className="row-flex"><span>{exp.role}</span><span>{exp.start_date} - {exp.end_date}</span></div>
                  <div className="row-sub"><span style={{ fontStyle: 'italic' }}>{exp.company}</span>{exp.incubated && <span style={{ fontStyle: 'italic' }}>{exp.incubated}</span>}</div>
                  {exp.description && (
                     <div className="bullet-list">
                        {(exp.description.split('\n') || []).map((line: string, li: number) => (
                           <div key={li} className="bullet-item">{line}</div>
                        ))}
                     </div>
                  )}
               </div>
            ))}
         </section>
      )}

      {data.projects?.length > 0 && (
         <section>
            <div className="section-h">Projects</div>
            {data.projects.map((proj: any, i: number) => (
               <div key={i} style={{ marginBottom: '14pt' }}>
                  <div className="row-flex"><span>{proj.name} ({proj.github && <a href={proj.github}>Github</a>}{proj.demo && <> ) ( <a href={proj.demo}>Demo</a></>})</span><span>{proj.date}</span></div>
                  <div style={{ fontSize: '10pt', fontWeight: 700, margin: '2pt 0' }}>Tech Stacks — <span style={{ fontWeight: 400 }}>{(proj.technologies || [])?.join?.(', ')}</span></div>
                  {proj.description && (
                     <div className="bullet-list">
                        {(proj.description.split('\n') || []).map((line: string, li: number) => (
                           <div key={li} className="bullet-item">{line}</div>
                        ))}
                     </div>
                  )}
               </div>
            ))}
         </section>
      )}

      {data.skills?.length > 0 && (
         <section>
            <div className="section-h">Skills</div>
            {data.skills.map((skill: any, i: number) => (
               <div key={i} style={{ fontSize: '10pt', marginBottom: '4pt' }}>
                  <strong>{skill.category}:</strong> {skill.items?.join?.(', ')}
               </div>
            ))}
         </section>
      )}
    </div>
  );
};

const SectionEditor: React.FC<{ sectionId: string, data: any, updateSection: any }> = ({ sectionId, data, updateSection }) => {
  if (!data) return null;
  const current = data[sectionId];
  switch (sectionId) {
    case 'general':
      return (
        <div className="animate-fade">
           <Field label="Full Name" value={current?.name || ''} onChange={v => updateSection('general', {...current, name: v})} />
           <Field label="Email" value={current?.email || ''} onChange={v => updateSection('general', {...current, email: v})} />
           <Field label="Phone" value={current?.phone || ''} onChange={v => updateSection('general', {...current, phone: v})} />
           <Field label="Summary" textarea value={current?.summary || ''} onChange={v => updateSection('general', {...current, summary: v})} />
        </div>
      );
    case 'socialLinks':
      return (
        <div className="animate-fade">
           <Field label="LinkedIn URL" value={current?.linkedin || ''} onChange={v => updateSection('socialLinks', {...current, linkedin: v})} />
           <Field label="GitHub URL" value={current?.github || ''} onChange={v => updateSection('socialLinks', {...current, github: v})} />
        </div>
      );
    default:
      return <ListView items={current || []} onUpdate={(v: any) => updateSection(sectionId, v)} sectionId={sectionId} />;
  }
};

const ListView: React.FC<{ items: any[], onUpdate: any, sectionId: string }> = ({ items, onUpdate, sectionId }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const getTemplate = () => {
    if (sectionId === 'experience') return {company:'', role:'', start_date:'', end_date:'', description:'', incubated: '', hidden: false};
    if (sectionId === 'education') return {institution:'', degree:'', end_date:'', grade: '', hidden: false};
    if (sectionId === 'projects') return {name:'', description:'', technologies:[], github:'', demo:'', date:'', hidden: false};
    if (sectionId === 'skills') return {category:'', items:[], hidden: false};
    return {name:'', hidden: false};
  };
  const getSummary = (item: any) => {
    if (sectionId === 'experience') return { title: item?.role || 'Role', subtitle: item?.company || 'Organization' };
    if (sectionId === 'education') return { title: item?.degree || 'Degree', subtitle: item?.institution || 'Institution' };
    if (sectionId === 'projects') return { title: item?.name || 'Project Name', subtitle: item?.date || 'Date' };
    if (sectionId === 'skills') return { title: item?.category || 'Category', subtitle: (item?.items || [])?.join?.(', ')?.substring(0, 30) };
    return { title: 'Entry', subtitle: 'Detail' };
  };
  if (editingIndex !== null) {
     const item = (items && items[editingIndex]) || getTemplate();
     const update = (newItem: any) => onUpdate((items || []).map((it, idx) => idx === editingIndex ? newItem : it));
     return (
        <div className="animate-fade">
           <button className="btn-secondary-studio" onClick={() => setEditingIndex(null)} style={{ marginBottom: '24px' }}>
              <ChevronLeft size={12} /> Back
           </button>
           {sectionId === 'experience' && (
              <>
                 <Field label="Job Title" value={item.role} onChange={v => update({...item, role: v})} />
                 <Field label="Organization" value={item.company} onChange={v => update({...item, company: v})} />
                 <Field label="Points" textarea value={item.description} onChange={v => update({...item, description: v})} />
              </>
           )}
           {sectionId === 'projects' && (
              <>
                 <Field label="Title" value={item.name} onChange={v => update({...item, name: v})} />
                 <Field label="Tech Stack" value={item.technologies?.join(', ')} onChange={v => update({...item, technologies: v.split(',').map(s=>s.trim())})} />
                 <Field label="Points" textarea value={item.description} onChange={v => update({...item, description: v})} />
              </>
           )}
           {sectionId === 'skills' && (
              <>
                 <Field label="Category" value={item.category} onChange={v => update({...item, category: v})} />
                 <Field label="Items" textarea value={item.items?.join(', ')} onChange={v => update({...item, items: v.split(',').map(s=>s.trim())})} />
              </>
           )}
           <button className="btn-primary-studio" onClick={() => setEditingIndex(null)} style={{ width: '100%', marginTop: '20px' }}>Save Entry</button>
        </div>
     );
  }
  return (
    <div className="item-list-view animate-fade">
       <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button className="btn-secondary-studio" onClick={() => {
             const newList = [...(items || []), getTemplate()];
             onUpdate(newList);
             setEditingIndex(newList.length - 1);
          }}>
             <Plus size={14} /> Add Item
          </button>
       </div>
       {(items || []).map((item, i) => {
          const summary = getSummary(item);
          return (
             <div key={i} className="item-summary-card">
                <div><h5>{summary.title}</h5><p>{summary.subtitle}</p></div>
                <button className="btn-secondary-studio" onClick={() => setEditingIndex(i)}>Edit</button>
             </div>
          );
       })}
    </div>
  );
};

const Field: React.FC<{ label: string, value: string, onChange: (v: string) => void, textarea?: boolean }> = ({ label, value, onChange, textarea }) => (
  <div className="field-studio">
    <label>{label}</label>
    {textarea ? (
      <textarea value={value || ''} onChange={e => onChange(e.target.value)} />
    ) : (
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} />
    )}
  </div>
);

export default ResumeAI;
