import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Mic, MicOff, Clock, ChevronRight, Code, Palette, Sparkles, Video, CornerDownLeft } from 'lucide-react';
import { useServices } from '../app/ServicesProvider';
import { getSelectedPersona } from './PersonaLab';

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

const InterviewRoom: React.FC<{ onEnd: (report: any) => void, track?: 'dsa' | 'hr' | 'dev', role?: string }> = ({ onEnd, track = 'dsa', role = 'SDE' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [timer, setTimer] = useState(300); 
  const [showEditor, setShowEditor] = useState(false);
  const { auth, sessions } = useServices();
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const persona = useMemo(() => getSelectedPersona(), []);
  const personaName = persona?.name ?? 'AI Evaluator';

  const questions = [
    {
      text: "Can you walk me through your experience with microservices architecture and how you handle inter-service communication?",
      type: "System Design"
    },
    {
      text: "Given an array of integers, find the maximum subarray sum. What is the time complexity of your approach?",
      type: "DSA"
    },
    {
      text: "Tell me about a time you had a conflict with a teammate. How did you resolve it?",
      type: "HR"
    }
  ];

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
    const interval = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startSTT = () => {
    setIsRecording(true);
    setTimeout(() => {
      setTranscript("In my previous role, I optimized inter-service latency by implementing a gRPC-based communication layer with a fallback to RabbitMQ for asynchronous reliability...");
      setIsRecording(false);
    }, 2500);
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
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: timer < 60 ? '#ef4444' : 'var(--text-main)', fontWeight: 800, fontSize: '1.25rem', padding: '8px 20px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <Clock size={22} /> {formatTime(timer)}
            </div>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '48px', letterSpacing: '-1.5px' }}>
            {questions[currentQuestion].text}
          </h2>

          {showEditor ? (
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
               <div style={{ flexGrow: 1, background: '#000', borderRadius: '20px', padding: '32px', color: '#fff', fontFamily: 'monospace', fontSize: '1rem', lineHeight: 1.6, overflow: 'auto', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ opacity: 0.4 }}>// Technical implementation workspace</span><br/>
                  <span style={{ color: '#569cd6' }}>async function</span> <span style={{ color: '#dcdcaa' }}>evaluateSolution</span>() {'{'}<br/>
                  &nbsp;&nbsp;<span style={{ opacity: 0.4 }}>/* Write your logic here */</span><br/>
                  {'}'}
               </div>
               <button className="btn-white" onClick={() => setShowEditor(false)} style={{ width: 'fit-content' }}>Close IDE</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
              <button className="btn-white" onClick={() => setShowEditor(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={18} /> Open Source Editor
              </button>
              <button className="btn-white" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Palette size={18} /> Digital Whiteboard
              </button>
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
                onClick={() => {
                  if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(c => c + 1);
                    setTranscript("");
                  } else {
                    onEnd({});
                  }
                }}
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
