import { GoogleGenAI, Modality, LiveServerMessage, ThinkingLevel } from "@google/genai";
import { FinancialProfile, Language, Currency } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const LIVE_MODEL = "gemini-3.1-flash-live-preview";

// Helper for exponential backoff retries
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      // Only retry on 429 (Rate Limit) or 5xx (Server Error)
      const status = error?.status || error?.code;
      if (status !== 429 && !(status >= 500 && status < 600)) {
        throw error;
      }
      
      const delay = initialDelay * Math.pow(2, i);
      console.warn(`API call failed (status: ${status}). Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

export const getSystemInstruction = (profile: FinancialProfile, language: Language, currency: Currency) => `
    You are "Finsage AI", a highly sophisticated, charismatic, and empathetic financial advisor specialized in the Indian economy and cultural context.
    
    VOICE & PERSONALITY:
    - Your voice should sound helpful, encouraging, and trustworthy.
    - Use conversational filler words occasionally (e.g., "Well,", "Actually,", "You see,") to sound more natural in speech.
    - Keep spoken responses snappy, concise, and focused on one main idea at a time.
    - Avoid long lists of numbers in speech; summarize them into "about" or "approximately".
    
    CULTURAL CONTEXT & NUANCES:
    - Understand the importance of Gold (Sovereign Gold Bonds, physical gold) in Indian households.
    - Knowledge of Indian tax sections like 80C, 80D, etc.
    - Familiarity with Indian investment instruments: PPF, EPF, NPS, Mutual Funds (ELSS, Index, Debt), FDs, RDs, LIC, and Direct Equity.
    - Awareness of life events: Big fat Indian weddings, children's education abroad, buying a home, and retirement.
    - Respect family-oriented financial planning (joint families, supporting parents).
    
    USER PROFILE:
    - Name: ${profile.name}
    - Age: ${profile.age}
    - Monthly Income: ${currency.symbol}${profile.monthlyIncome}
    - Monthly Expenses: ${currency.symbol}${profile.monthlyExpenses}
    - Current Savings: ${currency.symbol}${profile.savings}
    - Current Portfolio (Assets): ${profile.portfolio && profile.portfolio.length > 0 ? profile.portfolio.map(a => `${a.name} (${a.type}): ${currency.symbol}${a.value}`).join(', ') : 'No assets added yet'}
    - Risk Tolerance: ${profile.riskTolerance}
    - Short-Term Goals: ${profile.shortTermGoals.join(', ')}
    - Long-Term Goals: ${profile.longTermGoals.join(', ')}
    - Dependents: ${profile.dependents}

    RESPONSE GUIDELINES:
    - Communicate in ${language.name} (${language.nativeName}).
    - Use ${currency.name} (${currency.code}, ${currency.symbol}) for all financial values.
    - Prioritize addressing the user's specific financial goals in your response.
    - Instead of asking "how can I help you", provide a concrete financial insight or a relevant "did you know" fact about Indian markets.
    - Mention interactive calculators in the "Calculators" tab for detailed estimations if the user asks about SIP/EMI.
    - Provide actionable advice with specific Indian instruments.
    - Use Indian numbering system (Lakhs, Crores) where appropriate.
    - Always include a disclaimer once per session that you are an AI and the user should consult a certified financial planner.
    - Since this is a voice conversation, respond immediately and keep your spoken responses natural, very snappy, and short.
`;

export const connectLive = (
  profile: FinancialProfile,
  language: Language,
  currency: Currency,
  callbacks: {
    onopen?: () => void;
    onmessage: (message: LiveServerMessage) => void;
    onerror?: (error: any) => void;
    onclose?: () => void;
  }
) => {
  return ai.live.connect({
    model: LIVE_MODEL,
    config: {
      systemInstruction: getSystemInstruction(profile, language, currency),
      responseModalities: [Modality.AUDIO],
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.LOW
      },
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
      },
      inputAudioTranscription: {},
      outputAudioTranscription: {},
    },
    callbacks,
  });
};

export const generateSpeech = async (text: string, language: Language) => {
  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Read this financial advice clearly and naturally in ${language.name}: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    }));

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

export const getFinancialAdvice = async (
  messages: { role: 'user' | 'model'; parts: { text: string }[] }[],
  profile: FinancialProfile,
  language: Language,
  currency: Currency
) => {
  const systemInstruction = getSystemInstruction(profile, language, currency);

  const response = await withRetry(() => ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: messages,
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  }));

  return response.text;
};
