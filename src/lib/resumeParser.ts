import type { ResumeData } from '../domain/user';

// Known tech skills to detect in resume text
const SKILL_KEYWORDS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'Swift', 'Kotlin',
  'React', 'React.js', 'Angular', 'Vue.js', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Cassandra',
  'GraphQL', 'REST', 'gRPC', 'Microservices', 'Distributed Systems',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP',
  'CI/CD', 'Jenkins', 'GitHub Actions', 'Git',
  'Linux', 'Shell Scripting', 'Bash',
  'Agile', 'Scrum', 'Kanban',
  'HTML', 'CSS', 'Tailwind', 'SASS',
  'SQL', 'NoSQL', 'Data Structures', 'Algorithms',
  'System Design', 'API Design', 'Object-Oriented Programming', 'OOP', 'Functional Programming',
  'Figma', 'Sketch', 'Adobe XD',
  'Webpack', 'Vite', 'Babel',
  'Firebase', 'Supabase',
  'RabbitMQ', 'Kafka', 'Apache Spark',
  'Pandas', 'NumPy', 'Scikit-learn',
  'Unity', 'Unreal Engine',
  'iOS', 'Android', 'React Native', 'Flutter',
  'Blockchain', 'Solidity', 'Web3',
];

// Action verbs that typically start experience bullet points
const ACTION_VERBS = [
  'led', 'built', 'designed', 'developed', 'implemented', 'created', 'managed', 'architected',
  'optimized', 'improved', 'reduced', 'increased', 'delivered', 'launched', 'migrated',
  'automated', 'deployed', 'scaled', 'mentored', 'collaborated', 'integrated', 'refactored',
  'engineered', 'established', 'spearheaded', 'streamlined', 'orchestrated', 'configured',
  'maintained', 'analyzed', 'researched', 'contributed', 'resolved', 'troubleshot',
];

// Focus area categories
const FOCUS_MAP: Record<string, string[]> = {
  'Frontend Development': ['React', 'React.js', 'Angular', 'Vue.js', 'Vue', 'Next.js', 'HTML', 'CSS', 'Tailwind', 'JavaScript', 'TypeScript'],
  'Backend Engineering': ['Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Go', 'Rust', 'Java', 'Python'],
  'System Design': ['Microservices', 'Distributed Systems', 'System Design', 'API Design', 'gRPC', 'GraphQL'],
  'Cloud & DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Jenkins'],
  'Data Engineering': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Kafka', 'Apache Spark', 'Elasticsearch'],
  'Machine Learning': ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Pandas', 'NumPy'],
  'Mobile Development': ['iOS', 'Android', 'React Native', 'Flutter', 'Swift', 'Kotlin'],
};

function extractSkills(text: string): string[] {
  const found = new Set<string>();
  const lowerText = text.toLowerCase();

  for (const skill of SKILL_KEYWORDS) {
    // Use word boundary matching
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
    if (regex.test(text) || lowerText.includes(skill.toLowerCase())) {
      found.add(skill);
    }
  }

  return Array.from(found);
}

function extractExperiences(text: string): string[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const experiences: string[] = [];

  for (const line of lines) {
    const firstWord = line.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
    if (ACTION_VERBS.includes(firstWord) && line.length > 20 && line.length < 300) {
      experiences.push(line);
    }
  }

  // If heuristic found too few, look for lines with metrics (%, numbers with context)
  if (experiences.length < 2) {
    for (const line of lines) {
      if (/\d+%|\d+x|\$\d+|reduced|increased|improved/i.test(line) && line.length > 20 && line.length < 300) {
        if (!experiences.includes(line)) {
          experiences.push(line);
        }
      }
    }
  }

  return experiences.slice(0, 6); // Cap at 6 experiences
}

function deriveFocusAreas(skills: string[]): string[] {
  const areaCounts: Record<string, number> = {};

  for (const skill of skills) {
    for (const [area, keywords] of Object.entries(FOCUS_MAP)) {
      if (keywords.some(k => k.toLowerCase() === skill.toLowerCase())) {
        areaCounts[area] = (areaCounts[area] || 0) + 1;
      }
    }
  }

  // Sort by count descending, take top 3
  return Object.entries(areaCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([area]) => area);
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');

  // Set the worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
}

export function parseResumeText(text: string, fileName: string): ResumeData {
  const skills = extractSkills(text);
  const experiences = extractExperiences(text);
  const focusAreas = deriveFocusAreas(skills);

  return {
    fileName,
    extractedText: text,
    skills,
    experiences,
    focusAreas,
    parsedAt: new Date().toISOString(),
  };
}
