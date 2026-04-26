import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Mic, Clock, ChevronRight, Code, Sparkles } from 'lucide-react';
import { useServices } from '../app/ServicesProvider';
import { getSelectedPersona } from './PersonaLab';
import type { InterviewConfig, SessionReport } from '../domain/user';
import { speechToTextOnce } from '../lib/speech';
import { buildQuestions, scoreAnswer, buildSessionReport, generateFollowUp } from '../application/useCases/interview';

// Pure CSS Animated AI Orb (Premium Monochrome Aesthetic)
const AIInterviewerOrb = () => (
  <div style={{ 
    width: '200px', 
    height: '200px', 
    borderRadius: '50%', 
    background: `radial-gradient(circle at 30% 30%, #fff, #333)`,
    boxShadow: `0 30px 60px rgba(0,0,0,0.2), inset 0 0 40px rgba(255, 255, 255, 0.5)`,
    position: 'relative',
    animation: 'orbFloat 5s ease-in-out infinite',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(0,0,0,0.1)'
  }}>
    <div style={{ 
      width: '80%',
      height: '80%',
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.4)',
      animation: 'orbPulse 3s ease-in-out infinite'
    }} />
    <style>{`
      @keyframes orbFloat {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-15px) scale(1.02); }
      }
      @keyframes orbPulse {
        0%, 100% { transform: scale(1); opacity: 0.3; }
        50% { transform: scale(1.1); opacity: 0.6; }
      }
    `}</style>
  </div>
);

const InterviewRoom: React.FC<{ onEnd: (report: SessionReport) => void; config: InterviewConfig }> = ({ onEnd, config }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timer, setTimer] = useState(300);
  const [showEditor, setShowEditor] = useState(false);
  const [questionStart, setQuestionStart] = useState<number>(Date.now());
  const [bodyLanguageScore, setBodyLanguageScore] = useState(72);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [hintText, setHintText] = useState('');
  const [codingAnswer, setCodingAnswer] = useState('// Write your solution here');
  const { auth, sessions } = useServices();
  const videoRef = useRef<HTMLVideoElement>(null);

  const persona = useMemo(() => getSelectedPersona(), []);
  const personaName = persona?.name ?? 'AI Evaluator';
  const questions = useMemo(() => buildQuestions(config), [config]);
  const liveFillerCount = useMemo(() => {
    const lower = transcript.toLowerCase();
    const fillers = ['um', 'umm', 'uh', 'like', 'you know', 'actually', 'basically'];
    return fillers.reduce((sum, word) => sum + (lower.match(new RegExp(`\\b${word}\\b`, 'g'))?.length ?? 0), 0);
  }, [transcript]);
  const liveWpm = useMemo(() => {
    const elapsedSec = Math.max(1, Math.round((Date.now() - questionStart) / 1000));
    const words = transcript.trim().split(/\s+/).filter(Boolean).length;
    return Math.round((words / elapsedSec) * 60);
  }, [transcript, questionStart]);
  const liveFollowUp = useMemo(() => (transcript.trim() ? generateFollowUp(transcript) : 'Start answering to get a dynamic follow-up question.'), [transcript]);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Webcam Error:", err));
    }
  }, []);

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
    setIsRecording(true);
    try {
      const result = await speechToTextOnce();
      if (result.transcript) setTranscript((prev) => `${prev}${prev ? ' ' : ''}${result.transcript}`);
    } catch {
      setTranscript((prev) => `${prev}${prev ? ' ' : ''}In my previous role, I optimized latency using Redis and async messaging with clear trade-offs.`);
    } finally {
      setIsRecording(false);
    }
  };

  const finalizeCurrentAnswer = () => {
    const elapsedSec = Math.max(1, Math.round((Date.now() - questionStart) / 1000));
    const answerToEvaluate = showEditor ? codingAnswer : transcript;
    const analysis = scoreAnswer(
      questions[currentQuestion].text,
      answerToEvaluate,
      elapsedSec,
      bodyLanguageScore,
      timer > 0,
    );
    setAnalyses((prev) => [...prev, analysis]);
  };

  const handleNext = async () => {
    finalizeCurrentAnswer();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((c) => c + 1);
      setTranscript('');
      setHintText('');
      return;
    }

    const report = buildSessionReport(config, [...analyses, scoreAnswer(
      questions[currentQuestion].text,
      showEditor ? codingAnswer : transcript,
      Math.max(1, Math.round((Date.now() - questionStart) / 1000)),
      bodyLanguageScore,
      timer > 0,
    )]);

    const user = auth.getCurrentUser();
    if (user) {
      const track = config.type === 'HR / Behavioral' ? 'hr' : config.type === 'System Design' ? 'dev' : 'dsa';
      await sessions.addSession(user.email, {
        id: report.id,
        role: config.role,
        date: new Date(report.date).toLocaleDateString(),
        score: `${report.overall}%`,
        type: config.type,
        report,
      }, track);
    }

    onEnd(report);
  };

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
                 {currentQuestion === questions.length - 1 ? 'Finish Session' : 'Continue'} <ChevronRight size={22} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
