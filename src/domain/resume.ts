export interface ResumeStructuredData {
  title: string;
  target_role: string;
  general: {
    name: string;
    email: string;
    phone: string;
    summary: string;
  };
  socialLinks: {
    github: string;
    linkedin: string;
    portfolio: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date: string;
    grade: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    location: string;
    start_date: string;
    end_date: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    link: string;
    description: string;
    technologies: string[];
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  certificates: Array<{
    name: string;
    issuer: string;
    date: string;
    link: string;
  }>;
  coCurricular: Array<{
    activity: string;
    role: string;
    description: string;
  }>;
}

export interface SectionFeedback {
  issues: string[];
  suggestions: string[];
}

export interface ResumeFeedback {
  overall_score: number;
  executive_summary?: string;
  section_feedback: {
    general: SectionFeedback;
    socialLinks: SectionFeedback;
    education: SectionFeedback;
    experience: SectionFeedback;
    projects: SectionFeedback;
    skills: SectionFeedback;
    certificates: SectionFeedback;
    coCurricular: SectionFeedback;
  };
  missing_sections: string[];
  overall_suggestions: string[];
  roadmap?: Array<{
    step: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
  }>;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  target_role: string;
  data: ResumeStructuredData;
  latex_code?: string;
  created_at: string;
  last_feedback?: ResumeFeedback;
  last_evaluated_at?: string;
}
