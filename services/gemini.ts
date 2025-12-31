import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Message, UserProfile } from "../types";

// Using Gemini 3 Pro for complex reasoning/sculpting tasks as per guidelines
const PRO_MODEL = 'gemini-3-pro-preview';
const FLASH_MODEL = 'gemini-3-flash-preview';

/**
 * Zysculpt Gemini Service
 */
export class GeminiService {
  private getClient() {
    // Attempt to get key from shimmed process.env OR direct Vite meta.env
    const key = (process.env as any).API_KEY || (import.meta as any).env?.VITE_API_KEY;
    
    if (!key) {
      throw new Error("API_KEY_MISSING: Gemini API Key not found in process.env or import.meta.env");
    }

    // Strictly following initialization rule: new GoogleGenAI({ apiKey: process.env.API_KEY })
    return new GoogleGenAI({ apiKey: key });
  }

  async generateChatResponse(
    history: Message[], 
    currentMessage: string, 
    context?: { 
      jobDescription?: string, 
      resumeText?: string, 
      type?: 'resume' | 'cover-letter' | 'resignation-letter' | 'career-copilot',
      userProfile?: UserProfile,
      audioPart?: { inlineData: { data: string, mimeType: string } }
    }
  ) {
    const ai = this.getClient();
    
    const type = context?.type || 'resume';
    let roleDescription = 'professional career assistant';
    
    if (type === 'resume') roleDescription = 'ATS resume architect';
    if (type === 'cover-letter') roleDescription = 'persuasive cover letter writer';
    if (type === 'resignation-letter') roleDescription = 'professional resignation consultant';
    if (type === 'career-copilot') roleDescription = 'strategic career coach and growth mentor';
    
    const profile = context?.userProfile;
    const profileContext = profile ? `User Profile: ${profile.fullName}, ${profile.title}. Contact: ${profile.email}, ${profile.phone}. LinkedIn: ${profile.linkedIn}.` : '';

    const systemInstruction = `You are Zysculpt AI, a world-class ${roleDescription}.
    Your goal is to help the user build a high-impact, professional ${type.replace('-', ' ')}.
    
    ${profileContext}

    CRITICAL INSTRUCTIONS:
    1. Context - Target Info: ${context?.jobDescription || 'Not yet provided.'}
    2. Context - User Background: ${context?.resumeText || profile?.baseResumeText || 'Not yet provided.'}
    3. Ask clear, focused questions one or two at a time.
    4. Maintain a professional, expert, and encouraging tone.
    5. When ready, offer to "generate" the final document.
    `;

    const contents = history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const currentParts: any[] = [];
    if (context?.audioPart) {
      currentParts.push(context.audioPart);
    }
    if (currentMessage.trim() || !context?.audioPart) {
      currentParts.push({ text: currentMessage || "I've sent a voice message." });
    }

    contents.push({ role: 'user', parts: currentParts });

    return await ai.models.generateContentStream({
      model: FLASH_MODEL,
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
  }

  async generateCareerPlan(goal: string, availability: number): Promise<any[]> {
    const ai = this.getClient();
    const prompt = `Create a 30-day career plan for the following goal: "${goal}". 
    The user has ${availability} hours per day available.
    Return the plan as a JSON array of objects with keys: "day" (1-30) and "task" (string).`;

    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  }

  async generateQuiz(topic: string): Promise<any[]> {
    const ai = this.getClient();
    const prompt = `Generate 5 challenging quiz questions about "${topic}". 
    Return as a JSON array of objects with: "question", "options" (array of 4 strings), and "correctIndex" (0-3).`;

    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  }

  async sculptResume(jobDescription: string, userData: string): Promise<string> {
    const ai = this.getClient();
    const prompt = `
      As an ATS expert, take the following Job Description and User Experience data and generate a perfect resume in Markdown format.
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      USER DATA/EXPERIENCE:
      ${userData}
    `;

    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: prompt,
    });
    return response.text || "Failed to generate resume.";
  }

  async sculptCoverLetter(jobDescription: string, userData: string): Promise<string> {
    const ai = this.getClient();
    const prompt = `
      As a professional recruiter, write a compelling, tailored cover letter based on the Job Description and User Background.
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      USER BACKGROUND:
      ${userData}
    `;

    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: prompt,
    });
    return response.text || "Failed to generate cover letter.";
  }

  async sculptResignationLetter(exitDetails: string, userData: string): Promise<string> {
    const ai = this.getClient();
    const prompt = `
      As a professional consultant, write a polite and firm resignation letter based on the provided details.
      
      EXIT DETAILS:
      ${exitDetails}
      
      USER BACKGROUND:
      ${userData}
    `;

    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: prompt,
    });
    return response.text || "Failed to generate resignation letter.";
  }
}

export const geminiService = new GeminiService();
