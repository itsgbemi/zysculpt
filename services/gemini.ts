
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Message } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateChatResponse(
    history: Message[], 
    currentMessage: string, 
    context?: { jobDescription?: string, resumeText?: string, type?: 'resume' | 'cover-letter' }
  ) {
    const isResume = (context?.type || 'resume') === 'resume';
    
    const systemInstruction = `You are Zysculpt AI, a world-class ${isResume ? 'ATS resume architect' : 'professional cover letter writer'}.
    Your goal is to help the user build a high-impact, job-specific ${isResume ? 'resume' : 'cover letter'}.
    
    CRITICAL INSTRUCTIONS:
    1. Context - Job Description: ${context?.jobDescription || 'Not yet provided.'}
    2. Context - User Background: ${context?.resumeText || 'Not yet provided.'}
    3. ${isResume ? 'Analyze the JD for keywords and required skills.' : 'Focus on narrative, tone, and connecting user experience to the company values.'}
    4. Ask clear, focused questions one or two at a time.
    5. Maintain a professional, expert, and encouraging tone.
    6. When ready, offer to "sculpt" the final document.
    7. For ${isResume ? 'resumes' : 'cover letters'}, focus on ${isResume ? 'quantifiable achievements' : 'passion and specific value-add'}.
    `;

    const chat = this.ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    
    try {
      const response = await chat.sendMessageStream({ message: currentMessage });
      return response;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async sculptResume(jobDescription: string, userData: string): Promise<string> {
    const prompt = `
      As an ATS expert, take the following Job Description and User Experience data and "sculpt" a perfect resume in Markdown format.
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      USER DATA/EXPERIENCE:
      ${userData}
      
      INSTRUCTIONS:
      - Use clear headings: Professional Summary, Work Experience, Skills, Education.
      - Optimize for specific keywords from the Job Description.
      - Output ONLY the resume in Markdown.
    `;

    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Failed to generate resume.";
  }

  async sculptCoverLetter(jobDescription: string, userData: string): Promise<string> {
    const prompt = `
      As a professional recruiter, write a compelling, tailored cover letter based on the Job Description and User Background.
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      USER BACKGROUND:
      ${userData}
      
      INSTRUCTIONS:
      - Use a professional business letter format.
      - Make it sound natural and enthusiastic, not robotic.
      - Explicitly link user's top achievements to the specific needs of the job.
      - Output ONLY the cover letter in Markdown.
    `;

    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Failed to generate cover letter.";
  }
}

export const geminiService = new GeminiService();
