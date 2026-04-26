import type { InterviewConfig, QuestionAnalysis, ResumeData, SessionReport } from '../../domain/user';

const FILLER_WORDS = ['um', 'umm', 'uh', 'like', 'you know', 'actually', 'basically', 'literally'];

type GeneratedQuestion = {
  text: string;
  type: 'DSA' | 'System Design' | 'HR / Behavioral' | 'Case Study';
  limitSec: number;
};

function countFillerWords(answer: string): number {
  const lower = answer.toLowerCase();
  return FILLER_WORDS.reduce((sum, word) => sum + (lower.match(new RegExp(`\\b${word}\\b`, 'g'))?.length ?? 0), 0);
}

function estimateWpm(answer: string, elapsedSec: number): number {
  if (!elapsedSec) return 0;
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  return Math.round((words / elapsedSec) * 60);
}

function clampScore(n: number): number {
  return Math.max(20, Math.min(98, Math.round(n)));
}

export function extractSkillsFromJD(jobDescription: string): string[] {
  const matches = jobDescription.match(/[A-Za-z][A-Za-z0-9+#.\-]{2,}/g) ?? [];
  const stop = new Set(['with', 'this', 'that', 'will', 'have', 'from', 'your', 'years', 'experience', 'candidate', 'role']);
  const unique = new Set<string>();
  for (const token of matches) {
    const normalized = token.trim();
    if (stop.has(normalized.toLowerCase())) continue;
    if (/^\d+$/.test(normalized)) continue;
    unique.add(normalized);
  }
  return Array.from(unique).slice(0, 12);
}

export function buildQuestions(config: InterviewConfig, resumeData?: ResumeData): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const baseType = config.type === 'Mixed' ? 'DSA' : config.type;

  const limits = {
    'DSA': config.timePressure ? 1800 : 2400,
    'System Design': config.timePressure ? 300 : 480,
    'HR / Behavioral': config.timePressure ? 120 : 180,
    'Case Study': config.timePressure ? 300 : 420,
  } as const;

  const add = (text: string, type: GeneratedQuestion['type']) => {
    questions.push({ text, type, limitSec: limits[type] });
  };

  if (resumeData?.experiences?.length) {
    add(`You mentioned "${resumeData.experiences[0]}". Describe one conflict or trade-off you handled in that situation.`, 'HR / Behavioral');
  }

  if (config.jobDescription) {
    const jdSkills = extractSkillsFromJD(config.jobDescription);
    if (jdSkills.length) {
      add(`For this role, ${jdSkills.slice(0, 3).join(', ')} seem critical. Tell me how you have applied at least one in production.`, 'HR / Behavioral');
    }
  }

  if (baseType === 'DSA' || config.type === 'Mixed') {
    add('Given an array of integers, return the maximum subarray sum. Explain your approach and time complexity.', 'DSA');
  }
  if (baseType === 'System Design' || config.type === 'Mixed') {
    add('Design a rate-limited URL shortener that supports 10M daily users. Discuss storage, scaling, and trade-offs.', 'System Design');
  }
  if (baseType === 'HR / Behavioral' || config.type === 'Mixed') {
    add('Tell me about a time you disagreed with a teammate and how you resolved it using a structured approach.', 'HR / Behavioral');
  }
  if (baseType === 'Case Study' || config.type === 'Mixed') {
    add('A product activation metric dropped 20% after a release. How would you diagnose and recover?', 'Case Study');
  }

  return questions.slice(0, 5);
}

export function generateFollowUp(answer: string): string {
  const lower = answer.toLowerCase();
  if (lower.includes('redis')) return 'Why did you choose Redis over Memcached for this use case?';
  if (lower.includes('microservice')) return 'What failure mode did you plan for between services?';
  if (lower.includes('cache')) return 'How did you handle cache invalidation and stale reads?';
  if (lower.includes('team')) return 'What specific action did you take to influence the team outcome?';
  return 'What trade-off did you consider and what alternative did you reject?';
}

export function generateIdealAnswer(question: string): string {
  if (question.toLowerCase().includes('maximum subarray')) {
    return 'I would use Kadane\'s algorithm with O(n) time and O(1) space, track current and global maximum, then discuss edge cases like all-negative arrays.';
  }
  if (question.toLowerCase().includes('url shortener')) {
    return 'I would split read/write services, use key-generation with collision checks, add Redis for hot reads, and design for eventual consistency with clear rate-limit enforcement.';
  }
  return 'I would answer using a clear structure: context, action, measurable impact, and a brief trade-off discussion.';
}

export function scoreAnswer(question: string, answer: string, elapsedSec: number, bodyLanguageScore: number, finishedInTime: boolean): QuestionAnalysis {
  const fillerWords = countFillerWords(answer);
  const speakingPaceWpm = estimateWpm(answer, elapsedSec);
  const concisePenalty = Math.max(0, Math.floor(answer.length / 450) * 8);
  const fillerPenalty = fillerWords * 3;
  const pacePenalty = speakingPaceWpm > 190 || speakingPaceWpm < 95 ? 8 : 0;
  const timePenalty = finishedInTime ? 0 : 12;

  const base = 85 - concisePenalty - fillerPenalty - pacePenalty - timePenalty;
  const confidence = clampScore(base - fillerPenalty + Math.floor(bodyLanguageScore / 10));
  const communication = clampScore(base - 4 + (fillerWords < 3 ? 5 : 0));
  const conciseness = clampScore(92 - concisePenalty - Math.max(0, fillerWords - 2) * 2);
  const technical = clampScore(base + (answer.toLowerCase().includes('complexity') ? 6 : 0));

  return {
    question,
    userAnswer: answer,
    idealAnswer: generateIdealAnswer(question),
    followUp: generateFollowUp(answer),
    score: technical,
    communication,
    confidence,
    conciseness,
    fillerWords,
    speakingPaceWpm,
    bodyLanguageScore: clampScore(bodyLanguageScore),
    finishedInTime,
  };
}

export function buildSessionReport(config: InterviewConfig, analyses: QuestionAnalysis[]): SessionReport {
  const avg = (selector: (x: QuestionAnalysis) => number) =>
    analyses.length ? Math.round(analyses.reduce((sum, a) => sum + selector(a), 0) / analyses.length) : 0;

  const technicalKnowledge = avg((a) => a.score);
  const communication = avg((a) => a.communication);
  const confidence = avg((a) => a.confidence);
  const conciseness = avg((a) => a.conciseness);
  const bodyLanguage = avg((a) => a.bodyLanguageScore);
  const problemSolving = clampScore(Math.round((technicalKnowledge + conciseness) / 2));
  const overall = clampScore(Math.round((technicalKnowledge + communication + confidence + conciseness + bodyLanguage + problemSolving) / 6));

  const strengths: string[] = [];
  const improvements: string[] = [];
  if (technicalKnowledge >= 80) strengths.push('Strong technical depth with structured answers.');
  if (communication >= 78) strengths.push('Clear communication flow with good narrative control.');
  if (bodyLanguage >= 75) strengths.push('Confident on-camera presence and stable eye focus.');
  if (strengths.length === 0) strengths.push('Maintained consistency across different question types.');

  if (conciseness < 75) improvements.push('Reduce answer length and focus on concise impact statements.');
  if (confidence < 74) improvements.push('Reduce filler words and speak with stronger opening statements.');
  if (bodyLanguage < 72) improvements.push('Improve eye contact and upright posture for stronger presence.');
  if (improvements.length === 0) improvements.push('Push deeper on edge cases and trade-offs for senior-level polish.');

  return {
    id: `report_${Date.now()}`,
    date: new Date().toISOString(),
    config,
    overall,
    technicalKnowledge,
    communication,
    problemSolving,
    confidence,
    conciseness,
    bodyLanguage,
    questionAnalyses: analyses,
    strengths,
    improvements,
  };
}
