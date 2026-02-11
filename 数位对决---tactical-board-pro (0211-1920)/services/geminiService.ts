
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GameRecord } from "../types";

// Always initialize GoogleGenAI with an object containing the apiKey
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIHint = async (history: GameRecord[], secretLength: number): Promise<string> => {
  if (history.length === 0) return "尝试输入一个没有重复数字的随机数，例如 1234。";

  const historyText = history
    .map(h => `Guess: ${h.guess}, Correct Digits at Correct Positions: ${h.correctCount}`)
    .join('\n');

  const prompt = `
    This is a logic game like "Bulls and Cows" or "Mastermind".
    The player is trying to find a ${secretLength}-digit secret number.
    Here is the history of guesses and how many digits were in the correct position:
    ${historyText}

    Based on this data, provide the single most logical next guess. 
    Explain your reasoning briefly in Chinese.
  `;

  try {
    // Use gemini-3-pro-preview for complex reasoning tasks like solving logic puzzles
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedGuess: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["suggestedGuess", "reasoning"]
        }
      }
    });

    // Access text as a property, not a method, as per SDK guidelines
    const data = JSON.parse(response.text || '{}');
    return `${data.suggestedGuess} - ${data.reasoning}`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 思考失败，请检查网络或稍后再试。";
  }
};
