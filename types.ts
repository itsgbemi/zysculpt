export interface Experience {
id: string;
company: string;
role: string;
dates: string;
location: string;
description: string[];
}

export interface Education {
id: string;
school: string;
degree: string;
dates: string;
location: string;
minor?: string;
concentration?: string;
}

export interface ResumeData {
name: string;
email: string;
phone: string;
linkedin: string;
website: string;
summary: string;
experiences: Experience[];
educations: Education[];
skills: { category: string; items: string[] }[];
certifications: string[];
}

export interface CoverLetterData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  date: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  subject: string;
  salutation: string;
  body: string[];
  closing: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
  source: string;
  description: string;
  tags: string[];
}

export interface SavedApplication extends Job {
  status: 'Saved' | 'Applied' | 'Interviewing' | 'Rejected' | 'Offer';
  dateAdded: string;
}