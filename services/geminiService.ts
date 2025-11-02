import { GoogleGenAI } from "@google/genai";
import { ProductCategory } from '../types';

// FIX: Aligned with Gemini API guidelines to initialize the client directly with the environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDescription = async (productName: string, category: ProductCategory): Promise<string> => {
  // FIX: Removed the check for API_KEY and the simulation logic, as per guidelines.
  const prompt = `Gere uma descrição de venda curta e atraente, com no máximo 40 palavras, para o seguinte produto de uma loja de motos:
  - Nome do Produto: "${productName}"
  - Categoria: "${category}"

  A descrição deve ser em português do Brasil, focada nos benefícios para o cliente e com um tom entusiasmado e convidativo. Não use markdown.`;

  try {
    // FIX: Aligned with Gemini API guidelines.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
    });
    // FIX: Using response.text as per guidelines.
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Não foi possível gerar a descrição no momento.");
  }
};
