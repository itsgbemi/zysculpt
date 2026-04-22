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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not defined");
  
  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-3-flash-preview"; 

  const unifiedPrompt = `System Directive: You are ZYSCULPT, an elite executive career strategist.
    Current Resume: ${JSON.stringify(currentResume)}
    Current Cover Letter: ${JSON.stringify(currentCL)}
    USER COMMAND: "${prompt}"

    TASK:
    1. Analyze the user command and any provided files.
    2. Provide a supportive, brief conversational explanation of your actions as "explanation".
    3. Update the "resume" and "cl" objects only if the user command or files necessitate changes. If no changes are needed for a specific document, return the current version of that document in the JSON.
    4. Return EVERYTHING in a single valid JSON object.`;
  
  const response = await ai.models.generateContent({
    model: modelId,
    contents: [{ role: 'user', parts: [{ text: unifiedPrompt }, ...parts] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING },
          resume: RESUME_SCHEMA,
          cl: CL_SCHEMA
        },
        required: ["explanation", "resume", "cl"]
      }
    }
  });

  const data = JSON.parse(response.text || "{}");
  return data;
};
