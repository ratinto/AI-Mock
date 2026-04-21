import React from 'react';
import { CheckCircle2, TrendingUp, ChevronRight, Activity, Target, Zap, AlertCircle } from 'lucide-react';

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

const Report: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="animate-fade" style={{ paddingBottom: '100px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
            <Activity size={14} /> Performance Analysis
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '8px' }}>Session Report</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>SDE Technical Round • Completed April 15, 2026</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 0.8, letterSpacing: '-4px' }}>A-</div>
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
          <MetricBar label="Technical Accuracy" score={85} />
          <MetricBar label="Logic & Reasoning" score={92} />
          <MetricBar label="Communication" score={78} />
          <MetricBar label="Implementation Speed" score={88} />
        </div>

        {/* Breakdown */}
        <div className="dash-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
           <div>
              <h4 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontWeight: 800, fontSize: '1.1rem' }}>
                <Zap size={18} fill="currentColor" /> Key Strengths
              </h4>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Exceptional explanation of distributed systems. Your use of the CAP theorem to justify architectural choices was precise and demonstrated seniority.
              </p>
           </div>
           <div>
              <h4 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontWeight: 800, fontSize: '1.1rem' }}>
                <AlertCircle size={18} /> Critical Gaps
              </h4>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Missing edge case validation in your binary search implementation. Ensure null checks and duplicate handling are part of your initial code walk-through.
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
              "In my previous role, I used gRPC for synchronous communication and RabbitMQ for asynchronous tasks to ensure decoupling and improved system resilience during peak loads..."
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginBottom: '16px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Expert Benchmark</div>
            <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--text-main)', border: '1px solid var(--text-main)', color: '#fff', fontSize: '0.95rem', lineHeight: 1.6, minHeight: '180px' }}>
              "A robust distributed system leverages synchronous gRPC for low-latency internal communication and asynchronous message brokers (like Kafka or RabbitMQ) for event-driven orchestration, specifically to handle traffic spikes without cascading failures."
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="btn-black" onClick={onBack} style={{ padding: '16px 48px', fontSize: '1rem' }}>
          Dismiss Report & Return <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Report;
