import React from 'react';
import { ChevronRight, Activity, Target, Zap, AlertCircle } from 'lucide-react';
import type { SessionReport } from '../domain/user';

const MetricBar = ({ label, score }: { label: string, score: number }) => (
  <div style={{ marginBottom: '24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color: 'var(--text-main)' }}>{score}%</span>
    </div>
    <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ width: `${score}%`, height: '100%', background: 'var(--text-main)', borderRadius: '10px' }}></div>
    </div>
  </div>
);

const Report: React.FC<{ onBack: () => void; report: SessionReport | null }> = ({ onBack, report }) => {
  if (!report) {
    return (
      <div className="dash-card">
        <h3>No report available yet.</h3>
        <button className="btn-black" onClick={onBack} style={{ marginTop: '16px' }}>Back to dashboard</button>
      </div>
    );
  }

  const latest = report.questionAnalyses[report.questionAnalyses.length - 1];

  return (
    <div className="animate-fade" style={{ paddingBottom: '100px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
            <Activity size={14} /> Performance Analysis
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '8px' }}>Session Report</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>{report.config.role} • {report.config.type} • Completed {new Date(report.date).toLocaleString()}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 0.8, letterSpacing: '-4px' }}>{report.overall}%</div>
           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 800, marginTop: '12px' }}>Overall Grade</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
        {/* Score Card */}
        <div className="dash-card" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <Target size={20} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Core Competencies</h3>
          </div>
          <MetricBar label="Technical Accuracy" score={report.technicalKnowledge} />
          <MetricBar label="Logic & Reasoning" score={report.problemSolving} />
          <MetricBar label="Communication" score={report.communication} />
          <MetricBar label="Confidence" score={report.confidence} />
          <MetricBar label="Conciseness" score={report.conciseness} />
          <MetricBar label="Body Language" score={report.bodyLanguage} />
        </div>

        {/* Breakdown */}
        <div className="dash-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
           <div>
              <h4 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontWeight: 800, fontSize: '1.1rem' }}>
                <Zap size={18} fill="currentColor" /> Key Strengths
              </h4>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {report.strengths.join(' ')}
              </p>
           </div>
           <div>
              <h4 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontWeight: 800, fontSize: '1.1rem' }}>
                <AlertCircle size={18} /> Critical Gaps
              </h4>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {report.improvements.join(' ')}
              </p>
           </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="dash-card" style={{ marginBottom: '48px', padding: '40px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '32px' }}>Insight Comparison</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Your Response</div>
            <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', fontSize: '0.95rem', lineHeight: 1.6, minHeight: '180px' }}>
              "{latest?.userAnswer || 'No answer captured'}"
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginBottom: '16px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Expert Benchmark</div>
            <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--text-main)', border: '1px solid var(--text-main)', color: '#fff', fontSize: '0.95rem', lineHeight: 1.6, minHeight: '180px' }}>
              "{latest?.idealAnswer || 'Benchmark unavailable'}"
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button className="btn-white" onClick={() => window.print()} style={{ padding: '16px 32px', fontSize: '1rem' }}>
          Download PDF Report
        </button>
        <button className="btn-black" onClick={onBack} style={{ padding: '16px 48px', fontSize: '1rem' }}>
          Dismiss Report & Return <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Report;
