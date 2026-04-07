import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Clock, ChevronRight, Code, Palette, Sparkles } from 'lucide-react';
import { useServices } from '../app/ServicesProvider';

// Pure CSS Animated AI Orb (Premium Aesthetic)
const AIInterviewerOrb = () => (
  <div style={{ 
    width: '180px', 
    height: '180px', 
    borderRadius: '50%', 
    background: 'radial-gradient(circle at 30% 30%, #ffffff, #3b82f6)',
    boxShadow: '0 0 60px rgba(59, 130, 246, 0.4), inset 0 0 40px rgba(255, 255, 255, 0.4)',
    position: 'relative',
    animation: 'orbFloat 4s ease-in-out infinite, orbPulse 2s ease-in-out infinite',
    filter: 'blur(1px)'
  }}>
    <div style={{ 
      position: 'absolute', 
      top: '20%', 
      left: '20%', 
      width: '30%', 
      height: '30%', 
      background: 'white', 
      borderRadius: '50%', 
      filter: 'blur(8px)',
      opacity: 0.6
    }} />
    <style>{`
      @keyframes orbFloat {
        0%, 100% { transform: translateY(0) scale(1.05); }
        50% { transform: translateY(-20px) scale(0.95); }
      }
      @keyframes orbPulse {
        0%, 100% { box-shadow: 0 0 60px rgba(59, 130, 246, 0.4); }
        50% { box-shadow: 0 0 100px rgba(59, 130, 246, 0.6); }
      }
    `}</style>
  </div>
);

const InterviewRoom: React.FC<{ onEnd: (report: any) => void, track?: 'dsa' | 'hr' | 'dev', role?: string }> = ({ onEnd, track = 'dsa', role = 'SDE' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [showEditor, setShowEditor] = useState(false);
  const { auth, sessions } = useServices();
  
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Webcam Setup
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Webcam Error:", err));
    }
  }, []);

  // Timer logic
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
    // In a real app, use Web Speech API here
    setTimeout(() => {
      setTranscript("In my previous role at Google, I used gRPC for synchronous communication and RabbitMQ for asynchronous tasks to ensure decoupling...");
      setIsRecording(false);
    }, 3000);
  };

  return (
    <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '32px', height: 'calc(100vh - 120px)' }}>
      {/* Left Panel: Webcam & Interviewer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ position: 'relative', height: '260px', borderRadius: '32px', overflow: 'hidden', background: '#000', border: '1px solid var(--border-subtle)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
          />
          <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.6)', padding: '6px 14px', borderRadius: '100px', fontSize: '0.7rem', backdropFilter: 'blur(8px)', fontWeight: 700, letterSpacing: '1px' }}>
             <div className="circle-online"></div> REC LIVE
          </div>
        </div>

        <div style={{ flexGrow: 1, borderRadius: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '40px' }}>
          <AIInterviewerOrb />
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 16px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '12px' }}>
              <Sparkles size={14} /> AI ENGINE ACTIVE
            </div>
            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Listening to your response...</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Press Mic to start speaking</p>
          </div>
        </div>
      </div>

      {/* Right Panel: Question & Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="dash-card" style={{ flexGrow: 1, position: 'relative', display: 'flex', flexDirection: 'column', padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>QUESTION {currentQuestion + 1} OF 3</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{questions[currentQuestion].type} Round</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: timer < 60 ? '#ef4444' : '#fff', fontWeight: 800, fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '12px' }}>
              <Clock size={20} /> {formatTime(timer)}
            </div>
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: '1.35', marginBottom: '40px', letterSpacing: '-0.5px' }}>
            {questions[currentQuestion].text}
          </h2>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }} onClick={() => setShowEditor(!showEditor)}>
              <Code size={18} /> {showEditor ? 'Hide Editor' : 'Open IDE'}
            </button>
            <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
              <Palette size={18} /> Whiteboard
            </button>
          </div>

          {showEditor && (
             <div style={{ flexGrow: 1, background: '#0a0a0a', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-subtle)', fontFamily: '"Fira Code", monospace', color: '#d4d4d4', marginBottom: '32px', fontSize: '0.95rem', lineHeight: '1.6', overflow: 'auto' }}>
               <span style={{ color: '#6a9955' }}>// Implement your solution below</span><br/>
               <span style={{ color: '#569cd6' }}>function</span> <span style={{ color: '#dcdcaa' }}>solveInterviewQuestion</span>() {'{'}<br/>
               &nbsp;&nbsp;<span style={{ color: '#6a9955' }}>/* Logic here */</span><br/>
               &nbsp;&nbsp;<span style={{ color: '#c586c0' }}>return</span> <span style={{ color: '#ce9178' }}>"optimal approach"</span>;<br/>
               {'}'}
             </div>
          )}

          <div style={{ marginTop: 'auto' }}>
            <div style={{ position: 'relative' }}>
              <textarea 
                placeholder="Type your answer or use voice input..." 
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                style={{ 
                  width: '100%', 
                  height: '140px', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '24px', 
                  padding: '24px', 
                  color: '#fff', 
                  resize: 'none',
                  fontSize: '1.1rem',
                  outline: 'none',
                  transition: '0.3s',
                  lineHeight: '1.6'
                }}
              />
              <div style={{ position: 'absolute', right: '16px', bottom: '16px', display: 'flex', gap: '12px' }}>
                 <button 
                  onClick={startSTT}
                  style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '16px', 
                    background: isRecording ? '#ef4444' : 'rgba(255,255,255,0.08)', 
                    border: 'none', 
                    color: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: '0.3s',
                    boxShadow: isRecording ? '0 0 20px rgba(239, 68, 68, 0.4)' : 'none'
                  }}>
                   {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                 </button>
                 <button 
                  className="btn-white" 
                  style={{ padding: '0 28px', height: '56px', borderRadius: '16px', fontSize: '1rem', fontWeight: 700 }}
                  onClick={() => {
                    if (currentQuestion < questions.length - 1) {
                      setCurrentQuestion(c => c + 1);
                      setTranscript("");
                    } else {
                      const user = auth.getCurrentUser();
                      if (user) {
                        const scores = ['A', 'A-', 'B+', 'B', 'B-'];
                        const randomScore = scores[Math.floor(Math.random() * scores.length)];
                        
                        sessions.addSession(user.email, {
                          id: Date.now().toString(),
                          role: role,
                          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                          score: randomScore,
                          type: questions[0].type // Use the first question type for simplicity
                        }, track);
                      }
                      onEnd({});
                    }
                  }}
                 >
                   {currentQuestion === questions.length - 1 ? 'Finish Interview' : 'Next Question'} <ChevronRight size={20} />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;

