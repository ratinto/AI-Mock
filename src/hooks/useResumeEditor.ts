import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Resume, ResumeStructuredData } from '../domain/resume';

export interface ResumeFeedback {
  score: number;
  ats_compatibility: number;
  readability: number;
  impact_metrics: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export const INITIAL_RESUME_DATA: ResumeStructuredData = {
  title: '',
  target_role: '',
  general: { name: '', email: '', phone: '', summary: '' },
  socialLinks: { github: '', linkedin: '', portfolio: '' },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certificates: [],
  coCurricular: []
};

export function useResumeEditor() {
  const [view, setView] = useState<'library' | 'editor' | 'analysis-hub'>('library');
  const [editorMode, setEditorMode] = useState<'form' | 'latex'>('latex');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeResume, setActiveResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [compilingLatex, setCompilingLatex] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('general');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newResumeInfo, setNewResumeInfo] = useState({ title: '', role: '' });
  const [feedback, setFeedback] = useState<ResumeFeedback | null>(null);
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null);

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const data = await api.listResumes();
      setResumes(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSelectResume = async (id: string) => {
    setLoading(true);
    try {
      const data = await api.getResume(id);
      setActiveResume(data);
      if (data.latex_code) {
         setCompiledPdfUrl(`https://latexonline.cc/compile?text=${encodeURIComponent(data.latex_code)}&force=true`);
      } else {
         setCompiledPdfUrl(null);
      }
      setView('editor');
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDeleteResume = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteResume(id);
      setResumes(resumes.filter(r => r.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleOpenAnalysis = async (resume: Resume) => {
     setLoading(true);
     try {
        const data = await api.getResume(resume.id);
        setActiveResume(data);
        setView('analysis-hub');
        handleAnalyze(data);
     } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAnalyze = async (resumeToAnalyze?: Resume) => {
    const target = resumeToAnalyze || activeResume;
    if (!target) return;
    setAnalyzing(true);
    try {
      const result = await api.evaluateResume({ 
        id: target.id, 
        data: target.data, 
        target_role: target.target_role 
      });
      setFeedback(result.feedback || result);
    } catch (err) { console.error(err); } finally { setAnalyzing(false); }
  };

  const handleCreateResume = async () => {
    if (!newResumeInfo.title || !newResumeInfo.role) return;
    setLoading(true);
    try {
      const data = await api.createResume(newResumeInfo.title, newResumeInfo.role, INITIAL_RESUME_DATA);
      setResumes([data, ...resumes]);
      handleSelectResume(data.id);
      setShowNewModal(false);
      setNewResumeInfo({ title: '', role: '' });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleUpdateResume = async () => {
    if (!activeResume) return;
    setSaving(true);
    try {
      await api.updateResume(activeResume.id, activeResume.title, activeResume.target_role, activeResume.data, activeResume.latex_code);
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleRecompile = async () => {
    if (!activeResume?.latex_code) return;
    setCompilingLatex(true);
    try {
      if (editorMode === 'form') {
         const result = await api.parseLatex(activeResume.latex_code);
         if (result && result.data) {
            setActiveResume(prev => prev ? { ...prev, data: result.data } : null);
         }
      } else {
         const encodedLatex = encodeURIComponent(activeResume.latex_code);
         const pdfUrl = `https://latexonline.cc/compile?text=${encodedLatex}&force=true`;
         setCompiledPdfUrl(pdfUrl);
      }
    } catch (err) { 
      console.error(err); 
    } finally { setCompilingLatex(false); }
  };

  const updateSection = (section: keyof ResumeStructuredData, value: any) => {
    if (!activeResume) return;
    setActiveResume({ ...activeResume, data: { ...activeResume.data, [section]: value } });
  };

  return {
    view, setView,
    editorMode, setEditorMode,
    resumes,
    activeResume, setActiveResume,
    loading,
    saving,
    compilingLatex,
    analyzing,
    activeSectionId, setActiveSectionId,
    showNewModal, setShowNewModal,
    newResumeInfo, setNewResumeInfo,
    feedback,
    compiledPdfUrl, setCompiledPdfUrl,
    
    handleSelectResume,
    handleDeleteResume,
    handleOpenAnalysis,
    handleAnalyze,
    handleCreateResume,
    handleUpdateResume,
    handleRecompile,
    updateSection
  };
}
