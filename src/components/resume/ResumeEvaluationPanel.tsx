import React from 'react';
import { ShieldCheck, AlertCircle, Loader2, Search } from 'lucide-react';
import type { ResumeFeedback } from '../../hooks/useResumeEditor';

interface ResumeEvaluationPanelProps {
  analyzing: boolean;
  feedback: ResumeFeedback | null;
}

export const ResumeEvaluationPanel: React.FC<ResumeEvaluationPanelProps> = ({ analyzing, feedback }) => {
  if (analyzing) {
    return (
      <div className="hub-loader">
        <Loader2 className="spin" size={48} />
        <h2>Evaluating Strategy...</h2>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="hub-empty-state">
        <Search size={48} />
        <p>Select a draft to view AI intel</p>
      </div>
    );
  }

  return (
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
  );
};
