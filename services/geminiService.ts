
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateEventIdeas = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Error: API key is not configured. Please set the API_KEY environment variable.";
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate 3 creative and brief event ideas for the following theme: "${prompt}". Focus on decorations, activities, and a unique food idea. Format the response as a simple list.`,
        config: {
            systemInstruction: "You are a creative event planner assistant. Provide concise and inspiring ideas.",
            temperature: 0.8,
            topK: 40,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating event ideas:", error);
    if (error instanceof Error) {
        return `An error occurred while generating ideas: ${error.message}`;
    }
    return "An unknown error occurred while generating ideas.";
  }
};
