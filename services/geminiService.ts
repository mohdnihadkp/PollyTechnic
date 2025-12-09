import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || 'AIzaSyC9UAo8AMrF-f6lHIbL4gRSJWOY8TsKLFY';
const ai = new GoogleGenAI({ apiKey });

// Initialize the chat model configuration
const getChatModel = () => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are an expert academic tutor for a Polytechnic student. 
      Your goal is to explain complex concepts simply, suggest study strategies, and provide summaries.
      Be encouraging, concise, and structured. 
      If asked about resources, suggest general topics to search for or use your knowledge base to explain.
      Format your responses with clear headings and bullet points using Markdown.`,
      tools: [{ googleSearch: {} }] // Enable search grounding for up-to-date info
    },
  });
};

export const startChatSession = (): Chat => {
  return getChatModel();
};

export const sendMessageToGemini = async (chat: Chat, message: string) => {
  try {
    const result = await chat.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};