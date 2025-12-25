
export enum AppView {
  RESUME_BUILDER = 'RESUME_BUILDER',
  COVER_LETTER = 'COVER_LETTER',
  RESIGNATION_LETTER = 'RESIGNATION_LETTER',
  DOCUMENTS = 'DOCUMENTS',
  FIND_JOB = 'FIND_JOB',
  SETTINGS = 'SETTINGS',
}

export type Theme = 'light' | 'dark';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  lastUpdated: number;
  messages: Message[];
  jobDescription?: string;
  resumeText?: string;
  finalResume?: string | null;
  type: 'resume' | 'cover-letter' | 'resignation-letter';
}

export interface ResumeData {
  contact: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  skills: string[];
}
