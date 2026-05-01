
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, SwarmResult, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const runGuardianAnalysis = async (
  profile: UserProfile,
  input: string | object,
  language: Language
): Promise<SwarmResult> => {
  const languageInstruction = language === Language.UR 
    ? "Respond entirely in Urdu (اردو). Use standard Urdu script." 
    : "Respond entirely in English.";

  const prompt = `
    Act as Zeenat-AI: The 360 Guardian. 
    You are a swarm of experts providing immediate help and analysis for a Pakistani woman.

    LANGUAGE REQUIREMENT: ${languageInstruction}

    USER PROFILE:
    - Age: ${profile.age}
    - District: ${profile.district}
    - Marital Status: ${profile.maritalStatus}
    - Children: ${profile.childrenCount}
    - Employment: ${profile.isEmployed ? 'Employed' : 'Unemployed'}

    CONTEXT/INPUT: ${typeof input === 'string' ? input : JSON.stringify(input)}

    CRITICAL SAFETY PROTOCOL:
    - ONLY set riskLevel to "High" if the input describes IMMEDIATE PHYSICAL VIOLENCE, SEVERE ABUSE, OR LIFE-THREATENING SITUATIONS.
    - If riskLevel is "High", safetyScore MUST be between 0-30.
    - If riskLevel is "Medium", safetyScore MUST be between 31-70.
    - If riskLevel is "Low", safetyScore MUST be between 71-100.
    - General harassment (non-physical), verbal disputes, or legal queries regarding documents/assets MUST NOT trigger "High" risk. Use "Medium" or "Low" for these.
    - Remember: riskLevel "High" TRIGGERS A REAL-WORLD EMERGENCY RESPONSE dispatch.

    SCORE DEFINITIONS:
    - Safety Score: Inverse of physical and legal danger. 100% means full protection and no risk.
    - Independence Score: Measures the user's agency, including the right to work, education, and the legal "Right to Divorce" (Column 18) being delegated to them without restrictions.
    - Otherwise, provide a full legal and social audit.

    SWARM ROLES:
    1. [Advocate]: Analyze Pakistani law (Muslim Family Laws Ordinance 1961, Child Marriage Restraint Act, Protection of Women against Violence Acts).
       - NIKKAH VALIDITY: Validate based on age (18 in Sindh, 16 elsewhere for girls), registration (Section 5 of MFLO), and free consent.
       - MOBILITY: Cite Article 15 of the Constitution (Freedom of Movement) which grants all citizens, including women, the right to move freely.
       - Identify specific laws or sections being breached (e.g., Section 498A PPC for inheritance, Section 498B for forced marriage).
    2. [Empowerment Auditor]: Focus on rights to education/work/financial independence.
    3. [Sharia Expert]: Religious rights and protections.
       - NIKKAH VALIDITY: Must have Ijab-o-Qubool (Offer/Acceptance), two witnesses, and Mehr. Consent (Raza) is paramount; a forced Nikkah is invalid in Sharia.
       - MAHRAM/MOBILITY: Provide nuanced guidance. While traditional views emphasize Mahram for travel, modern scholars (and the Maliki/Shafi'i schools in certain contexts) allow women to travel for needs (education, safety, work) in "safe company" or if the "way is secure."
       - INHERITANCE: Wives (1/8 or 1/4), Daughters (1/2 or 2/3). Cite Sharia sources.
    4. [NGO Bridge]: Specific organizations in Pakistan for this case.
    5. [Helpline Expert]: DETECT CRISIS. Provide empathetic validation, immediate safety steps, and specific numbers (1094 for SBBC, 0800-91010 for LAS, 15 for Police).
    6. [Case Preparer]: Create a summary/plan.

    RESPONSE FORMAT: 
    You MUST return a valid JSON object matching the requested schema. Ensure all Urdu text is properly encoded.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advocate: {
              type: Type.OBJECT,
              properties: {
                analysis: { type: Type.STRING },
                safetyScore: { type: Type.NUMBER },
                riskLevel: { type: Type.STRING },
                stats: { type: Type.STRING },
                legalRoadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
                breachedLaws: { type: Type.ARRAY, items: { type: Type.STRING } },
                validityAudit: {
                  type: Type.OBJECT,
                  properties: {
                    isValid: { type: Type.BOOLEAN },
                    reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
                    legalCitations: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["isValid", "reasons", "legalCitations"]
                }
              },
              required: ["analysis", "safetyScore", "riskLevel", "stats", "legalRoadmap", "breachedLaws", "validityAudit"]
            },
            empowermentAudit: {
              type: Type.OBJECT,
              properties: {
                educationRightStatus: { type: Type.STRING },
                workRightStatus: { type: Type.STRING },
                remedialAction: { type: Type.STRING },
                independenceScore: { type: Type.NUMBER },
                mobilityGuidance: { type: Type.STRING }
              },
              required: ["educationRightStatus", "workRightStatus", "remedialAction", "independenceScore", "mobilityGuidance"]
            },
            shariaExpert: {
              type: Type.OBJECT,
              properties: {
                context: { type: Type.STRING },
                principles: { type: Type.ARRAY, items: { type: Type.STRING } },
                guidance: { type: Type.STRING },
                inheritanceSpecifics: {
                  type: Type.OBJECT,
                  properties: {
                    wife: { type: Type.STRING },
                    daughter: { type: Type.STRING },
                    shariaSource: { type: Type.STRING }
                  },
                  required: ["wife", "daughter", "shariaSource"]
                }
              },
              required: ["context", "principles", "guidance", "inheritanceSpecifics"]
            },
            ngoBridge: {
              type: Type.OBJECT,
              properties: {
                recommendedNgo: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    contact: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  }
                }
              },
              required: ["recommendedNgo"]
            },
            helplineExpert: {
              type: Type.OBJECT,
              properties: {
                immediateAdvice: { type: Type.STRING },
                emergencyNumbers: { type: Type.ARRAY, items: { type: Type.STRING } },
                empathyResponse: { type: Type.STRING }
              },
              required: ["immediateAdvice", "emergencyNumbers", "empathyResponse"]
            },
            draftedDocument: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                type: { type: Type.STRING }
              },
              required: ["title", "content", "type"]
            }
          },
          required: ["advocate", "empowermentAudit", "shariaExpert", "ngoBridge", "helplineExpert", "draftedDocument"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI");
    }
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Gemini Frontend Error:", error);
    throw error;
  }
};
