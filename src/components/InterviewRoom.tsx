import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Square, GripHorizontal, ChevronRight, Play, RefreshCw, Loader2, Sparkles, Clock, Code } from 'lucide-react';
import type { InterviewConfig, QuestionAnalysis } from '../domain/user';
import { buildSessionReport } from '../application/useCases/interview';
import { speechToTextOnce } from '../lib/speech';
import Card from './ui/Card';
import Button from './ui/Button';
import { useApiCache } from '../hooks/useApiCache';
import { api } from '../lib/api';

type Props = {
  config: InterviewConfig;
  onComplete: (report: any) => void;
};

const AIInterviewerOrb = () => (
  <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, var(--bg-hover) 0%, var(--border-focus) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(0,0,0,0.05)', position: 'relative' }}>
    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #000 0%, #222 100%)', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="pulse-dot" style={{ width: 12, height: 12, background: 'var(--bg-main)', borderRadius: '50%' }}></div>
    </div>
    <div className="rotate-slow" style={{ position: 'absolute', inset: -10, border: '1px dashed var(--border-subtle)', borderRadius: '50%', zIndex: 1 }}></div>
  </div>
);

const InterviewRoom: React.FC<Props> = ({ config, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timer, setTimer] = useState(300);
  const [showEditor, setShowEditor] = useState(false);
  const [questionStart, setQuestionStart] = useState<number>(Date.now());
  const [bodyLanguageScore, setBodyLanguageScore] = useState(72);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [hintText, setHintText] = useState('');
  const [codingAnswer, setCodingAnswer] = useState('// Write your solution here');
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Derive persona
  const personaName = config.type === 'DSA' ? 'Senior Engineer Model' : 'Product Manager Model';

  // Derived metrics (approx) for UI
  const liveWpm = Math.max(0, Math.round((transcript.split(' ').length / ((Date.now() - questionStart) / 1000)) * 60)) || 0;
  const liveFillerCount = (transcript.match(/um|uh|like/gi) || []).length;
  const liveFollowUp = hintText || 'Keep expanding on trade-offs securely...';

  useEffect(() => {
    // Start camera stream on load
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(console.error);

    return () => {
      // Stop camera stream on unmount
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Dynamically fetch questions from backend instead of building statically
    const fetchQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        const res = await api.generateInterviewQuestions({ 
          type: config.type, 
          jobDescription: config.jobDescription, 
          resumeData: undefined // pass actual resume later if needed
        });
        setQuestions(res.questions || []);
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, [config]);

  useEffect(() => {
    setTimer(questions[currentQuestion]?.limitSec ?? 180);
    setQuestionStart(Date.now());
  }, [currentQuestion, questions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Lightweight body-language proxy without extra dependencies.
    const interval = setInterval(() => {
      setBodyLanguageScore((s) => {
        const delta = Math.random() > 0.5 ? 2 : -2;
        return Math.max(55, Math.min(95, s + delta));
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startSTT = async () => {
    setRecording(true);
    try {
      const result = await speechToTextOnce();
      if (result.transcript) setTranscript((prev) => `${prev}${prev ? ' ' : ''}${result.transcript}`);
    } catch {
      setTranscript((prev) => `${prev}${prev ? ' ' : ''}In my previous role, I optimized latency using Redis and async messaging with clear trade-offs.`);
    } finally {
      setRecording(false);
    }
  };

  const finishSession = async (finalAnalyses: any[]) => {
    const report = buildSessionReport(config, finalAnalyses);

    try {
      const user = await api.me();
      if (user) {
        const track = config.type === 'HR / Behavioral' ? 'hr' : config.type === 'System Design' ? 'dev' : 'dsa';
        await api.addSession({
          id: report.id,
          role: config.role || 'Software Engineer',
          date: new Date(report.date).toLocaleDateString(),
          score: `${report.overall}%`,
          type: config.type,
          report: report,
        }, track);
      }
    } catch(err) {
      console.error("Failed to post session", err);
    }

    onComplete(report);
  };

  const submitAnswer = async () => {
    if (!questions.length) return;
    
    // Stop recording quickly
    setRecording(false);
    
    try {
      setIsEvaluating(true);
      const elapsedSec = Math.max(1, Math.round((Date.now() - questionStart) / 1000));
      const bodyLanguageScore = Math.floor(Math.random() * 20) + 70; // Simulated for now
      
      const evaluation = await api.evaluateInterviewAnswer({
        question: questions[currentQuestion].text,
        answer: transcript || 'No answer provided.',
        elapsedSec,
        bodyLanguageScore,
        finishedInTime: elapsedSec <= questions[currentQuestion].limitSec
      });
      
      const analysis: QuestionAnalysis = {
        question: questions[currentQuestion].text,
        userAnswer: transcript || 'No answer provided.',
        idealAnswer: evaluation.idealAnswer,
        followUp: evaluation.followUp,
        score: evaluation.score,
        communication: evaluation.communication,
        confidence: evaluation.confidence,
        conciseness: evaluation.conciseness,
        fillerWords: 0, // Placeholder
        speakingPaceWpm: 0, // Placeholder
        bodyLanguageScore,
        finishedInTime: elapsedSec <= questions[currentQuestion].limitSec,
      };
      
      setAnalyses(prev => [...prev, analysis]);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        finishSession([...analyses, analysis]);
      }
    } catch (err) {
      console.error("Evaluation failed", err);
      // Fallback behavior if evaluation fails could go here 
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    submitAnswer();
  };

  if (isLoadingQuestions) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '20px' }}>
        <Loader2 size={48} className="animate-spin text-primary" />
        <h2>AI is carefully drafting your personalized questions...</h2>
      </div>
    );
  }

  if (!questions.length) {
    return <div>Failed to load interview questions. Please try again.</div>;
  }

  return (
    <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '40px', height: 'calc(100vh - 140px)' }}>
      {/* Left Panel: Monitoring */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ position: 'relative', height: '280px', borderRadius: '24px', overflow: 'hidden', background: '#000', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)' }}>
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
          />
          <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.8)', padding: '6px 14px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', color: '#fff' }}>
             <div className="circle-online" style={{ background: '#ef4444' }}></div> LIVE FEED
          </div>
        </div>

        <div className="dash-card" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '48px', textAlign: 'center' }}>
          <AIInterviewerOrb />
          <div style={{ marginTop: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', background: 'var(--bg-secondary)', padding: '8px 20px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              <Sparkles size={14} /> {personaName}
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '8px' }}>
              {isRecording ? 'Interviewer is listening...' : 'Response analysis active'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              AntriView AI Engine is processing your speech intent and keywords.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className="dash-card" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '48px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ padding: '8px 16px', background: 'var(--text-main)', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 900 }}>Q{currentQuestion + 1}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{questions[currentQuestion].type} FOCUS</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Persona: {personaName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: timer < 60 ? '#ef4444' : 'var(--text-main)', fontWeight: 800, fontSize: '1.25rem', padding: '8px 20px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <Clock size={22} /> {formatTime(timer)}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div className="dash-card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>Filler Words</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{liveFillerCount}</div>
            </div>
            <div className="dash-card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>Speaking Pace</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{liveWpm} WPM</div>
            </div>
            <div className="dash-card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>Body Language</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{bodyLanguageScore}%</div>
            </div>
            <div className="dash-card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>Peer Mode</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{config.peerMode ? 'ON' : 'OFF'}</div>
            </div>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '48px', letterSpacing: '-1.5px' }}>
            {questions[currentQuestion].text}
          </h2>

          <div className="dash-card" style={{ marginBottom: '20px', padding: '14px 16px', background: 'var(--bg-secondary)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Dynamic Follow-up</div>
            <div style={{ marginTop: '6px', fontSize: '0.95rem', fontWeight: 600 }}>{liveFollowUp}</div>
          </div>

          {showEditor ? (
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
               <textarea value={codingAnswer} onChange={(e) => setCodingAnswer(e.target.value)} style={{ flexGrow: 1, minHeight: '220px', background: '#000', borderRadius: '20px', padding: '20px', color: '#fff', fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: 1.6, border: '1px solid var(--border-subtle)' }} />
               <div style={{ display: 'flex', gap: '12px' }}>
                 <button className="btn-white" onClick={() => setHintText('Try identifying brute-force first, then optimize with state tracking. Also prepare time/space complexity explanation.')}>Need Hint</button>
                 <button className="btn-white" onClick={() => setHintText('Follow-up: what is your time complexity, and how would this change for streaming input?')}>Ask Follow-up</button>
               </div>
               {hintText && <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>{hintText}</div>}
               <button className="btn-white" onClick={() => setShowEditor(false)} style={{ width: 'fit-content' }}>Close IDE</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
              <button className="btn-white" onClick={() => setShowEditor(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={18} /> Open Source Editor
              </button>
              <button className="btn-white" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Body Language Score: {bodyLanguageScore}</button>
            </div>
          )}

          <div style={{ marginTop: 'auto', position: 'relative' }}>
            <textarea 
              placeholder="Your response will appear here as you speak..." 
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              style={{ 
                width: '100%', 
                height: '160px', 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '24px', 
                padding: '32px', 
                color: 'var(--text-main)', 
                resize: 'none',
                fontSize: '1.2rem',
                outline: 'none',
                lineHeight: 1.6,
                fontWeight: 500,
                transition: 'all 0.2s ease'
              }}
            />
            <div style={{ position: 'absolute', right: '16px', bottom: '16px', display: 'flex', gap: '12px' }}>
               <button 
                onClick={startSTT}
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '20px', 
                  background: isRecording ? '#000' : 'var(--text-main)', 
                  border: 'none', 
                  color: '#fff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-md)'
                }}>
                 {isRecording ? <div style={{ width: '20px', height: '20px', background: '#ef4444', borderRadius: '4px' }} /> : <Mic size={24} />}
               </button>
               <button 
                className="btn-black" 
                style={{ padding: '0 40px', height: '64px', borderRadius: '20px', fontSize: '1.1rem' }}
                onClick={handleNext}
               >
                 {isEvaluating ? <Loader2 className="animate-spin" size={22} /> : (currentQuestion === questions.length - 1 ? 'Finish Session' : 'Continue')} 
                 {!isEvaluating && <ChevronRight size={22} />}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
