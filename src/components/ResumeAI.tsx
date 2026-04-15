import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const ResumeAI: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload and analysis
    setTimeout(() => {
      setIsUploading(false);
      setIsAnalyzed(true);
      setFileName("Candidate_Resume_2026.pdf");
    }, 2500);
  };

  return (
    <div className="animate-fade">
      <header style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Resume AI Analyzer</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Upload your resume to generate hyper-personalized interview questions.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div 
          className="dash-card" 
          style={{ 
            border: '2px dashed var(--border-subtle)', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '60px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.01)'
          }}
        >
          {!isAnalyzed ? (
            <>
              <div style={{ padding: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', marginBottom: '24px' }}>
                <Upload size={32} />
              </div>
              <h3 style={{ marginBottom: '12px' }}>{isUploading ? 'Analyzing Resume...' : 'Drop your resume here'}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>Supports PDF, DOCX up to 10MB</p>
              <button 
                className="btn-white" 
                onClick={handleUpload}
                disabled={isUploading}
                style={{ opacity: isUploading ? 0.7 : 1 }}
              >
                {isUploading ? 'Processing...' : 'Upload Resume'}
              </button>
            </>
          ) : (
            <>
              <div style={{ padding: '20px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginBottom: '24px' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ marginBottom: '12px' }}>Analysis Complete</h3>
              <p style={{ color: '#10b981', fontWeight: 600, marginBottom: '8px' }}>{fileName}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>We've optimized your next session based on your experience.</p>
              <button className="btn-outline" style={{ marginTop: '24px' }} onClick={() => setIsAnalyzed(false)}>
                Upload Different Resume
              </button>
            </>
          )}
        </div>

        <div className="dash-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#f59e0b" /> Insights Preview
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Primary Skills Found</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {['React.js', 'TypeScript', 'Node.js', 'Distributed Systems', 'PostgreSQL'].map(s => (
                  <span key={s} style={{ padding: '4px 10px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Key Experiences</div>
              <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Led a team of 4 to migrate legacy monolith to microservices.</li>
                <li>Optimized database queries reducing latency by 40%.</li>
              </ul>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>
                <AlertCircle size={16} /> Generated Focus Areas
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                Based on your background at Stripe, your next interview will focus on <strong>API Design Patterns</strong> and <strong>Concurrency Control</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAI;
