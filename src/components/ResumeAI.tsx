import React, { useState, useRef, useCallback } from 'react';
import { Upload, CheckCircle2, AlertCircle, Sparkles, FileText, X, Loader2, ArrowUpCircle } from 'lucide-react';
import { extractTextFromPDF, parseResumeText } from '../lib/resumeParser';
import type { ResumeData } from '../domain/user';
import { useServices } from '../app/ServicesProvider';

const STORAGE_KEY = 'antriview_resume_data';

function loadSavedResume(): ResumeData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveResumeData(data: ResumeData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const ResumeAI: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(() => loadSavedResume());
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [progress, setProgress] = useState(0);
  const dropRef = useRef<HTMLDivElement>(null);
  const { auth, profile } = useServices();

  const isAnalyzed = !!resumeData;

  const handleFile = (f: File) => {
    if (!f.type.includes('pdf')) {
      setError('Please upload a PDF file.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB.');
      return;
    }
    setSelectedFile(f);
    setFileName(f.name);
    setResumeData(null);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current && !dropRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please upload a resume first.');
      return;
    }
    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + Math.random() * 15, 85));
      }, 300);

      const text = await extractTextFromPDF(selectedFile);

      if (!text || text.trim().length < 20) {
        clearInterval(progressInterval);
        setError('Could not extract meaningful text from this PDF.');
        setIsUploading(false);
        setProgress(0);
        return;
      }

      const parsed = parseResumeText(text, selectedFile.name);
      
      clearInterval(progressInterval);
      setProgress(100);

      await new Promise(r => setTimeout(r, 400));

      setResumeData(parsed);
      saveResumeData(parsed);

      const user = auth.getCurrentUser();
      if (user) {
        profile.updateUser(user.email, { resumeData: parsed });
      }
    } catch (err) {
      console.error('PDF parse error:', err);
      setError('Failed to parse PDF.');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setResumeData(null);
    setSelectedFile(null);
    setFileName(null);
    setError(null);
    setShowPreview(false);
    localStorage.removeItem(STORAGE_KEY);
    const user = auth.getCurrentUser();
    if (user) {
      profile.updateUser(user.email, { resumeData: undefined });
    }
  };

  return (
    <div className="animate-fade" style={{ paddingBottom: '100px' }}>
      <header style={{ marginBottom: '48px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '8px' }}>Resume Intelligence</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Upload your resume to generate hyper-personalized interview simulations.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '40px' }}>
        {/* Upload Area */}
        <div
          ref={dropRef}
          className={`dash-card ${isDragging ? 'dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? 'var(--text-main)' : 'var(--border-subtle)'}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 40px',
            textAlign: 'center',
            background: isDragging ? 'var(--bg-secondary)' : '#fff',
            transition: 'all 0.3s ease',
            borderRadius: '24px',
            minHeight: '400px'
          }}
        >
          {!isAnalyzed ? (
            <>
              <input id="file-input" type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />

              {isUploading ? (
                <div style={{ width: '100%', maxWidth: '300px' }}>
                  <div style={{ padding: '20px', borderRadius: '50%', background: 'var(--bg-secondary)', marginBottom: '24px', display: 'inline-flex' }}>
                    <Loader2 size={32} className="spin-animation" style={{ color: 'var(--text-main)' }} />
                  </div>
                  <h3 style={{ fontWeight: 800, marginBottom: '16px' }}>Processing PDF...</h3>
                  <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'var(--text-main)', transition: 'width 0.3s ease' }} />
                  </div>
                  <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>{Math.round(progress)}% EXTRACTED</p>
                </div>
              ) : (
                <>
                  <div style={{ padding: '24px', borderRadius: '50%', background: 'var(--bg-secondary)', marginBottom: '32px' }}>
                    <ArrowUpCircle size={40} strokeWidth={1.5} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>{isDragging ? 'Drop to start analysis' : 'Upload your resume'}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px', maxWidth: '340px' }}>Drag and drop your PDF here or click Browse to select.</p>
                  
                  {fileName && (
                    <div style={{ marginBottom: '24px', padding: '12px 20px', background: 'var(--bg-secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-subtle)' }}>
                      <FileText size={18} />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{fileName}</span>
                    </div>
                  )}

                  {error && <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem', marginBottom: '24px' }}><AlertCircle size={16} inline /> {error}</div>}

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="btn-white" onClick={() => document.getElementById('file-input')?.click()}>Browse Files</button>
                    <button className="btn-black" onClick={handleAnalyze} disabled={!selectedFile} style={{ opacity: selectedFile ? 1 : 0.5 }}>Analyze Intelligence</button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="animate-fade" style={{ width: '100%' }}>
              <div style={{ padding: '24px', borderRadius: '50%', background: 'var(--bg-secondary)', color: 'var(--text-main)', display: 'inline-flex', marginBottom: '32px' }}>
                <CheckCircle2 size={40} />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '8px' }}>Analysis Successful</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px' }}>Found {resumeData?.skills.length} skills and {resumeData?.experiences.length} key experiences.</p>
              
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button className="btn-white" onClick={() => setShowPreview(!showPreview)}>{showPreview ? 'Hide' : 'Review'} Raw Text</button>
                <button className="btn-white" onClick={handleReset} style={{ color: '#ef4444' }}>Clear Archive</button>
              </div>
            </div>
          )}
        </div>

        {/* Insights Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="dash-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} /> Detected Skills
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {isAnalyzed && resumeData!.skills.length > 0 ? (
                resumeData!.skills.slice(0, 10).map(s => (
                  <span key={s} style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', fontWeight: 700 }}>{s}</span>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Waiting for data analysis...</p>
              )}
            </div>
          </div>

          <div className="dash-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} /> Experience Bullets
            </h3>
            {isAnalyzed ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {resumeData!.experiences.slice(0, 3).map((exp, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '12px', borderLeft: '2px solid var(--text-main)' }}>{exp}</div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Waiting for data analysis...</p>
            )}
          </div>

          <div className="dash-card" style={{ padding: '32px', background: 'var(--text-main)', color: '#fff', border: 'none' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
              <AlertCircle size={18} /> Session Focus
            </h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.6 }}>Based on your background, we'll specialize your mock sessions in these areas.</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
               {isAnalyzed ? resumeData!.focusAreas.slice(0, 3).map(f => (
                 <span key={f} style={{ padding: '4px 10px', borderRadius: '100px', background: 'rgba(255,255,255,0.15)', fontSize: '0.75rem', fontWeight: 700 }}>{f}</span>
               )) : <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>Awaiting analysis...</span>}
            </div>
          </div>
        </div>
      </div>

      {showPreview && resumeData && (
        <div className="dash-card animate-fade" style={{ marginTop: '40px', padding: '40px' }}>
          <h3 style={{ fontWeight: 800, marginBottom: '24px' }}>Extracted Metadata</h3>
          <div style={{ maxHeight: '400px', overflow: 'auto', padding: '24px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-muted)', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {resumeData.extractedText}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAI;
