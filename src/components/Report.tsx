import React from 'react';
import { CheckCircle2, TrendingUp, ChevronRight } from 'lucide-react';

const MetricBar = ({ label, score, color }: { label: string, score: number, color: string }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{score}%</span>
    </div>
    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '10px' }}></div>
    </div>
  </div>
);

const Report: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="animate-fade">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Interview Report</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Session completed on April 15, 2026 • SDE Technical Round</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>A-</div>
           <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Overall Rating</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
        {/* Score Card */}
        <div className="dash-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Performance Metrics</h3>
          <MetricBar label="Technical Correctness" score={85} color="#3b82f6" />
          <MetricBar label="Clarity of Thought" score={92} color="#10b981" />
          <MetricBar label="Communication Skills" score={78} color="#f59e0b" />
          <MetricBar label="Coding Efficiency" score={88} color="#8b5cf6" />
        </div>

        {/* Breakdown */}
        <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div>
              <h4 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 700 }}>
                <CheckCircle2 size={18} /> Key Strengths
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Exceptional explanation of distributed systems. Your use of the CAP theorem to justify architectural choices was very impressive.
              </p>
           </div>
           <div>
              <h4 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 700 }}>
                <TrendingUp size={18} /> Growth Areas
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Work on detailing edge cases in your coding solutions. The binary search implementation missed a check for null inputs.
              </p>
           </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="dash-card" style={{ marginBottom: '48px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Answer Comparison</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', fontWeight: 700 }}>Your Answer (STT Transcript)</div>
            <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', minHeight: '150px' }}>
              "In my previous role, I used gRPC for synchronous communication and RabbitMQ for asynchronous tasks to ensure decoupling..."
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '12px', textTransform: 'uppercase', fontWeight: 700 }}>Ideal Expert Answer</div>
            <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.9rem', minHeight: '150px' }}>
              "A robust system uses a mix of synchronous APIs (REST/gRPC) for low-latency needs and message brokers (Kafka/RabbitMQ) for event-driven workflows, ensuring high availability and fault tolerance."
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="btn-white" onClick={onBack}>
          Return to Dashboard <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Report;
