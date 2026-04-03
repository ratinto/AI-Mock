import React, { useState, useRef, useCallback } from 'react';
import { Upload, CheckCircle2, AlertCircle, Sparkles, FileText, X, Loader2 } from 'lucide-react';
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

  // Drag and drop handlers
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
      // Simulate progressive loading
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + Math.random() * 15, 85));
      }, 300);

      const text = await extractTextFromPDF(selectedFile);

      if (!text || text.trim().length < 20) {
        clearInterval(progressInterval);
        setError('Could not extract meaningful text from this PDF. It may be image-based or empty.');
        setIsUploading(false);
        setProgress(0);
        return;
      }

      const parsed = parseResumeText(text, selectedFile.name);
      
      clearInterval(progressInterval);
      setProgress(100);

      // Small delay for the progress bar to reach 100%
      await new Promise(r => setTimeout(r, 400));

      setResumeData(parsed);
      saveResumeData(parsed);

      // Also save to user profile
      const user = auth.getCurrentUser();
      if (user) {
        profile.updateUser(user.email, { resumeData: parsed });
      }
    } catch (err) {
      console.error('PDF parse error:', err);
      setError('Failed to parse PDF. Please try a different file.');
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
    <div className="animate-fade">
      <header style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Resume AI Analyzer</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Upload your resume to generate hyper-personalized interview questions.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Upload Area */}
        <div
          ref={dropRef}
          className={`dash-card resume-drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? '#6366f1' : 'var(--border-subtle)'}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            textAlign: 'center',
            background: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.01)',
            transition: 'all 0.3s ease',
          }}
        >
          {!isAnalyzed ? (
            <>
              <input
                id="resume-file-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {isUploading ? (
                <>
                  <div style={{ padding: '20px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', marginBottom: '24px' }}>
                    <Loader2 size={32} className="spin-animation" style={{ color: '#6366f1' }} />
                  </div>
                  <h3 style={{ marginBottom: '12px' }}>Extracting Resume Text...</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                    Parsing PDF structure and identifying key information
                  </p>
                  {/* Progress bar */}
                  <div style={{ width: '100%', maxWidth: '280px' }}>
                    <div style={{
                      height: '4px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                        borderRadius: '10px',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {Math.round(progress)}% complete
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    padding: '20px',
                    borderRadius: '50%',
                    background: isDragging ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.05)',
                    marginBottom: '24px',
                    transition: 'all 0.3s ease',
                  }}>
                    <Upload size={32} style={{ color: isDragging ? '#6366f1' : 'inherit' }} />
                  </div>
                  <h3 style={{ marginBottom: '12px' }}>
                    {isDragging ? 'Drop your resume here' : 'Drag & drop your resume'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                    Supports PDF files up to 10MB
                  </p>
                  {fileName && (
                    <div style={{
                      marginBottom: '14px',
                      color: '#fff',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '8px 16px',
                      borderRadius: '12px',
                    }}>
                      <FileText size={16} />
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{fileName}</span>
                    </div>
                  )}
                  {error && (
                    <div style={{ marginBottom: '14px', color: '#ef4444', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                      className="btn-outline"
                      onClick={() => document.getElementById('resume-file-input')?.click()}
                    >
                      Choose File
                    </button>
                    <button
                      className="btn-white"
                      onClick={handleAnalyze}
                      style={{ opacity: !selectedFile ? 0.5 : 1 }}
                    >
                      Analyze Resume
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div style={{ padding: '20px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginBottom: '24px' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ marginBottom: '12px' }}>Analysis Complete</h3>
              <p style={{ color: '#10b981', fontWeight: 600, marginBottom: '8px' }}>{resumeData?.fileName}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
                Found <strong style={{ color: '#fff' }}>{resumeData?.skills.length}</strong> skills and <strong style={{ color: '#fff' }}>{resumeData?.experiences.length}</strong> key experiences.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '24px' }}>
                Parsed {new Date(resumeData?.parsedAt ?? '').toLocaleString()}
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn-outline"
                  onClick={() => setShowPreview(!showPreview)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileText size={16} /> {showPreview ? 'Hide' : 'Preview'} Text
                </button>
                <button
                  className="btn-outline"
                  onClick={handleReset}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                  <X size={16} /> Upload Different
                </button>
              </div>
            </>
          )}
        </div>

        {/* Insights Panel */}
        <div className="dash-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#f59e0b" /> Insights Preview
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!isAnalyzed && (
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Upload and analyze a resume to unlock personalized insights.
              </div>
            )}

            {/* Skills */}
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Primary Skills Found</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {isAnalyzed && resumeData!.skills.length > 0 ? (
                  resumeData!.skills.slice(0, 12).map(s => (
                    <span key={s} style={{
                      padding: '4px 10px',
                      borderRadius: '100px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      fontSize: '0.8rem',
                      color: '#a5b4fc',
                    }}>{s}</span>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No insights yet</span>
                )}
              </div>
              {isAnalyzed && resumeData!.skills.length > 12 && (
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  +{resumeData!.skills.length - 12} more skills detected
                </div>
              )}
            </div>

            {/* Experiences */}
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Key Experiences</div>
              {isAnalyzed && resumeData!.experiences.length > 0 ? (
                <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {resumeData!.experiences.slice(0, 4).map((exp, i) => (
                    <li key={i} style={{ lineHeight: 1.5 }}>{exp}</li>
                  ))}
                </ul>
              ) : (
                <div style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {isAnalyzed ? 'No specific experience bullets detected — try a resume with bullet points.' : 'No insights yet'}
                </div>
              )}
            </div>

            {/* Focus Areas */}
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>
                <AlertCircle size={16} /> Generated Focus Areas
              </div>
              {isAnalyzed && resumeData!.focusAreas.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                    Based on your resume, your next interview should focus on:
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {resumeData!.focusAreas.map(area => (
                      <span key={area} style={{
                        padding: '6px 14px',
                        borderRadius: '100px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#93c5fd',
                      }}>
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>
                  {isAnalyzed ? 'Not enough data to derive focus areas.' : 'Analyze a resume to generate focus areas.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Raw Text Preview Modal */}
      {showPreview && resumeData && (
        <div className="dash-card" style={{ marginTop: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} /> Extracted Text Preview
            </h3>
            <button className="btn-outline" onClick={() => setShowPreview(false)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <X size={14} /> Close
            </button>
          </div>
          <div style={{
            maxHeight: '400px',
            overflow: 'auto',
            padding: '20px',
            borderRadius: '16px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-wrap',
            fontFamily: '"Fira Code", "Menlo", monospace',
          }}>
            {resumeData.extractedText}
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {resumeData.extractedText.length.toLocaleString()} characters extracted
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAI;
