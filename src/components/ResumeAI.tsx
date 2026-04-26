import React, { useRef } from 'react';
import { 
  Plus, Trash2, Save, ChevronLeft, Download, Loader2, FileText,
  User, Link as LinkIcon, BookOpen, Briefcase, Code, Users, Clock,
  Layers, Cpu, Terminal, Type, X, Upload, Search, FileCode, RefreshCcw, Sparkles
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { useResumeEditor } from '../hooks/useResumeEditor';
import { LatexEditorPanel } from './resume/LatexEditorPanel';
import { ResumeEvaluationPanel } from './resume/ResumeEvaluationPanel';
import { SectionEditor, Field } from './resume/ResumeFormSection';
import { ResumePreviewContent } from './resume/ResumePreviewContent';
import type { Resume } from '../domain/resume';

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
  const editorHook = useResumeEditor();
  const {
    view, setView,
    editorMode, setEditorMode,
    resumes,
    activeResume, setActiveResume,
    loading,
    saving,
    compilingLatex,
    analyzing,
    activeSectionId, setActiveSectionId,
    showNewModal, setShowNewModal,
    newResumeInfo, setNewResumeInfo,
    feedback,
    compiledPdfUrl,
    handleSelectResume,
    handleDeleteResume,
    handleOpenAnalysis,
    handleCreateResume,
    handleUpdateResume,
    handleRecompile,
    updateSection
  } = editorHook;

  const previewRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (editorMode === 'latex' && compiledPdfUrl) {
       window.open(compiledPdfUrl, '_blank');
       return;
    }
    
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${activeResume?.title || 'resume'}.pdf`);
  };

  return (
    <div className="studio-root light-theme animate-fade">
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
                    {(resumes || []).map((r: Resume) => (
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
                            <Clock size={12} /> {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}
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
                        {(resumes || []).map((r: Resume) => (
                           <div key={r.id} className={`hub-list-item ${activeResume?.id === r.id ? 'active' : ''}`} onClick={() => handleOpenAnalysis(r)}>
                              <FileText size={14} /> {r.title}
                           </div>
                        ))}
                     </div>
                  </aside>
                  <div className="hub-body">
                     <ResumeEvaluationPanel analyzing={analyzing} feedback={feedback} />
                  </div>
               </div>
            )}

            {view === 'editor' && activeResume && (
              <div className="studio-workspace split-view">
                 <div className="editor-pane">
                    {editorMode === 'latex' ? (
                       <LatexEditorPanel activeResume={activeResume} setActiveResume={setActiveResume} />
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

export default ResumeAI;
