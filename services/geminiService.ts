
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, Landmark, WeatherType, Language } from "../types";
import { LANDMARKS } from "../constants";

export async function generateNarrative(state: GameState, landmark: Landmark, actionDesc: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const lang = state.language === 'zh' ? '中文' : 'English';
  const prompt = `
    Role: Survival system for "Cyber Hiking: Aotai Line".
    Location: ${landmark.name.zh} (${landmark.elevation}m).
    Weather: ${state.weather}.
    Condition: ${state.status.conditions.join(', ') || 'Healthy'}.
    Merit: ${state.merit} (Cyber Merit).
    Action: ${actionDesc}.
    Language: ${lang}.
    
    Instruction: Generate a brief (max 40 words) immersive narrative. 
    Aesthetics: Gritty, sensory, high-stakes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.8 },
    });
    return response.text.trim();
  } catch (error) {
    return state.language === 'zh' ? `空气稀薄，每一步都在与重力搏斗。` : `Thin air, fighting gravity.`;
  }
}

export async function getSurvivalAdvice(state: GameState) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const lang = state.language === 'zh' ? '中文' : 'English';
  const prompt = `
    Role: Quantum Survival Guide.
    Current Stats: Health ${state.status.health}%, Stamina ${state.status.stamina}%, Temp ${state.status.bodyTemp}°C.
    Conditions: ${state.status.conditions.join(', ') || 'None'}.
    Weather: ${state.weather}.
    Location Elevation: ${LANDMARKS[state.currentLandmarkIndex].elevation}m.
    Language: ${lang}.

    Briefly advise the player on the next best move (Rest, Use item, Camp, or Proceed). Max 30 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.5 },
    });
    return response.text.trim();
  } catch (error) {
    return state.language === 'zh' ? "量子链路不稳定，请依靠直觉。" : "Link unstable, use your instinct.";
  }
}
