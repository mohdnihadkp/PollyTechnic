import { GoogleGenAI, Chat, Type } from "@google/genai";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  // Gracefully handle missing key, though environment should provide it.
  console.warn("API_KEY is not defined in the environment.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Initialize the chat model configuration with dynamic context
const getChatModel = (department: string, semester: string, subject?: string, useThinking: boolean = false) => {
  const subjectContext = subject ? `The student is currently asking about the subject: "${subject}".` : "";
  
  // Use gemini-3-pro-preview for thinking mode, otherwise default to flash
  const model = useThinking ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
  
  // Configure thinking budget if enabled
  const thinkingConfig = useThinking ? { thinkingConfig: { thinkingBudget: 32768 } } : {};

  return ai.chats.create({
    model: model,
    config: {
      systemInstruction: `You are an expert academic tutor for a Polytechnic student enrolled in the ${department} department, ${semester}. ${subjectContext}
      
      Your goal is to explain complex concepts simply, suggest study strategies, and provide summaries tailored to this specific curriculum.
      Be encouraging, concise, and structured. 
      If asked about resources, suggest general topics to search for or use your knowledge base to explain.
      Format your responses with clear headings and bullet points using Markdown.`,
      ...thinkingConfig,
      tools: [{ googleSearch: {} }] // Enable search grounding for up-to-date info
    },
  });
};

export const startChatSession = (department: string, semester: string, subject?: string, useThinking: boolean = false): Chat => {
  return getChatModel(department, semester, subject, useThinking);
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

export const generateQuiz = async (subjectName: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a multiple-choice quiz about ${subjectName}. Difficulty: ${difficulty}. 
            Create 5 questions.
            Provide the output in strict JSON format.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: { 
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    },
                                    correctAnswer: { 
                                        type: Type.INTEGER, 
                                        description: "Index of the correct option (0-3)" 
                                    },
                                    explanation: { type: Type.STRING }
                                },
                                required: ["question", "options", "correctAnswer"]
                            }
                        }
                    },
                    required: ["title", "questions"]
                }
            }
        });
        
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw error;
    }
}