import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, CoverLetterData } from "../types";

const RESUME_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    email: { type: Type.STRING },
    phone: { type: Type.STRING },
    linkedin: { type: Type.STRING },
    website: { type: Type.STRING },
    summary: { type: Type.STRING },
    experiences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          dates: { type: Type.STRING },
          location: { type: Type.STRING },
          description: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["id", "company", "role", "dates", "location", "description"]
      }
    },
    educations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          school: { type: Type.STRING },
          degree: { type: Type.STRING },
          dates: { type: Type.STRING },
          location: { type: Type.STRING },
          concentration: { type: Type.STRING }
        },
        required: ["id", "school", "degree", "dates", "location"]
      }
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["category", "items"]
      }
    }
  },
  required: ["name", "summary", "experiences", "educations", "skills"]
};

const CL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    email: { type: Type.STRING },
    phone: { type: Type.STRING },
    linkedin: { type: Type.STRING },
    date: { type: Type.STRING },
    recipientName: { type: Type.STRING },
    recipientTitle: { type: Type.STRING },
    companyName: { type: Type.STRING },
    companyAddress: { type: Type.STRING },
    subject: { type: Type.STRING },
    salutation: { type: Type.STRING },
    body: { type: Type.ARRAY, items: { type: Type.STRING } },
    closing: { type: Type.STRING }
  },
  required: ["name", "salutation", "body", "closing"]
};

export const generateTailoredContent = async (
  prompt: string, 
  parts: any[],
  currentResume: ResumeData, 
  currentCL: CoverLetterData
): Promise<{ resume?: ResumeData; cl?: CoverLetterData; explanation: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const userPrompt = `System Directive: You are an interactive executive career agent named Zysculpt.
    
    TONE & STYLE PROTOCOL:
    - Use layman-friendly, supportive, and professional language. Avoid overly complex jargon.
    - Be encouraging and clear in your explanations.
    - Always refer to yourself as Zysculpt.

    RELEVANCE & INTELLIGENCE PROTOCOL:
    - If the user provides a greeting (e.g. "hi", "hello"), social banter, or files clearly unrelated to career documents (e.g. shipping labels, recipes, receipts, snapshots), respond ONLY via the "explanation" field.
    - OMIT the "resume" and "cl" keys from your JSON response entirely if the input is not professional/career-related or if no meaningful career data can be derived.
    - DO NOT force data into resume fields if the source document is irrelevant. Explicitly mention the document type in your explanation and politely ask for a valid resume or career-related information.
    - Only return the "resume" or "cl" objects when you identify valid professional data or have been specifically asked to generate/refine them.

    CRITICAL MULTI-MODAL PROTOCOL: 
    - You MUST scan and analyze the entirety of provided document parts (PDF, DOCX, Images) using your vision and document-understanding capabilities. 
    - DO NOT ask the user for raw text if you have these file parts; you can process them directly.
    - EXTRACT AND POPULATE: Full Name, Email, Phone, LinkedIn, Website, Professional Summary, Work Experience, Education, and Skills/Certifications from the binary/image content provided.
    - NO HALLUCINATIONS: If information is truly missing after thorough file analysis, leave fields as empty string ("") or empty array [].
    
    Current Document State:
    - Resume: ${JSON.stringify(currentResume)}
    - Cover Letter: ${JSON.stringify(currentCL)}
    
    User Command:
    "${prompt}"
    
    Task:
    1. Tailor professional content STRICTLY based on the COMMAND and ATTACHED FILES.
    2. Return valid JSON containing "resume" (optional), "cl" (optional), and "explanation" (required).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: { 
      parts: [
        { text: userPrompt },
        ...parts
      ] 
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          resume: RESUME_SCHEMA,
          cl: CL_SCHEMA,
          explanation: { type: Type.STRING, description: "A formatted summary of refinements. Use **bold** for key terms." }
        },
        required: ["explanation"]
      }
    }
  });

  try {
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (err) {
    console.error("AI parse error:", err);
    throw new Error("Invalid format from AI engine");
  }
};