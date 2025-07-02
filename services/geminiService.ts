
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AttendanceRecord } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = "gemini-2.5-flash-preview-04-17";

export const getAiSummary = async (query: string, data: AttendanceRecord[]): Promise<string> => {
    if (!API_KEY) {
        return "Error: API key is not configured. Please set the API_KEY environment variable.";
    }

    if (data.length === 0) {
        return "There is no attendance data available to analyze. Please add some records first.";
    }
    
    const attendanceDataString = JSON.stringify(data, null, 2);

    const systemInstruction = `You are a helpful AI assistant for a study library. Your task is to analyze attendance data and answer user questions.
    - Today's date is ${new Date().toLocaleDateString()}.
    - The data provided is an array of JSON objects, where each object represents a single attendance record with a member's name and the date of attendance.
    - Answer concisely and directly based *only* on the provided data.
    - Do not make up information. If the data doesn't support an answer, say so.
    - When asked for summaries, present them in a clear, easy-to-read format. For example, use lists or bullet points.
    - Here is the attendance data:
    ${attendanceDataString}`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: query,
            config: {
                systemInstruction: systemInstruction,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "An error occurred while communicating with the AI. Please check the console for details.";
    }
};
