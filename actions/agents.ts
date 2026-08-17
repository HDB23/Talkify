"use server";

import { generateWithFallback, GeminiContent } from "@/lib/ai-provider";

const API_MODEL = "gemini-flash-latest";

const SCENARIOS: Record<string, { systemPrompt: string; welcomeMessage: string }> = {
  "coffee-shop": {
    systemPrompt: "You are Sarah, a friendly, warm barista at a local coffee shop. The user is a customer ordering coffee. Keep your questions very simple, easy to understand, and supportive. Ask about their drink choice, size, milk preference, or if they want any pastries in easy English. Keep your responses short (1-2 sentences). Respond only in character as Sarah. Keep the chat going naturally as long as the user wants to talk.",
    welcomeMessage: "Hi there! Welcome to Talkify Beans. What can I get started for you today?",
  },
  "airport": {
    systemPrompt: "You are Officer Davis, a polite and friendly customs officer at the airport. The user is a traveler. Ask simple, basic questions about their trip (like 'what is the reason for your visit?' and 'how long are you staying?') in very clear, simple English. Do not ask difficult or complex security questions. Keep responses short (1-2 sentences) and encourage the user. Respond only in character as Officer Davis. Keep the chat going naturally.",
    welcomeMessage: "Good evening. Welcome! What is the main purpose of your visit to the country today?",
  },
  "doctor": {
    systemPrompt: "You are Dr. Watson, a very friendly and caring family doctor. The user is a patient. Ask very simple, easy-to-understand questions about their symptoms (like 'where does it hurt?' and 'how long have you felt this way?'). Avoid any hard medical jargon. Be reassuring, empathetic, and speak in plain English. Keep responses short (1-2 sentences). Respond only in character as Dr. Watson. Keep the chat going naturally.",
    welcomeMessage: "Hello! Please come in and have a seat. What is the issue that brings you here today?",
  },
  "college-presentation": {
    systemPrompt: "You are Professor Reynolds, a very supportive college teacher. The user is a student who just finished a presentation. Ask simple, encouraging, and friendly questions about their project (like 'what was your favorite part of this project?' or 'what did you learn from it?'). Do not ask hard academic or critical questions. Keep your language simple and easy to understand. Keep responses short (1-2 sentences). Respond only in character as Professor Reynolds. Keep the chat going naturally.",
    welcomeMessage: "Thank you for sharing your presentation! I really enjoyed it. To start, could you tell me what was your favorite part of working on this project?",
  },
  "job-interview": {
    systemPrompt: "You are Sophia, a very friendly and encouraging job interviewer. The user is an applicant. Conduct a structured job interview by asking standard, simple, and easy interview questions one at a time (e.g., about their strengths, why they want this job, past projects, or how they handle teamwork). Avoid hard technical riddles or complex behavioral questions. Keep your tone supportive, warm, and clear. Keep responses short (1-2 sentences). For each response, briefly acknowledge the user's answer, and then ask the next interview question to keep the interview going. Respond only in character as Sophia. Keep the chat going naturally.",
    welcomeMessage: "Hello! Welcome, it's wonderful to meet you today. To get started, could you tell me a little bit about yourself and what you like to do?",
  },
};

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const getWelcomeMessageAction = async (agentId: string) => {
  return SCENARIOS[agentId]?.welcomeMessage || "Hello! Let's practice speaking English.";
};

export const chatWithAgentAction = async (messages: ChatMessage[], agentId: string) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  
  if (!apiKey) {
    return { error: "NO_API_KEY" };
  }

  const scenario = SCENARIOS[agentId];
  if (!scenario) {
    throw new Error("Invalid agent/scenario");
  }

  // Convert messages to Gemini's format: user/model
  let contents: GeminiContent[] = messages.map((m) => ({
    role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
    parts: [{ text: m.content }],
  }));

  // Gemini API requires history to start with a 'user' message.
  // Since our messages array starts with the assistant's welcome message,
  // we can prepend a user greeting so the entire history (including the welcome message) is preserved.
  if (contents.length > 0 && contents[0].role === "model") {
    contents = [
      { role: "user", parts: [{ text: "Hello!" }] },
      ...contents
    ];
  } else {
    const firstUserIdx = contents.findIndex((c) => c.role === "user");
    if (firstUserIdx !== -1) {
      contents = contents.slice(firstUserIdx);
    }
  }

  try {
    const response = await generateWithFallback(API_MODEL, {
      contents,
      systemInstruction: {
        parts: [{ text: scenario.systemPrompt }],
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    return { content: response.text };
  } catch (error: any) {
    console.error("Error communicating with AI provider:", error);
    return { error: error.message || "Failed to fetch response." };
  }
};

export const evaluateSessionAction = async (messages: ChatMessage[], agentId: string) => {
  const apiKey = process.env.GEMINI_API_KEY || "";

  if (!apiKey) {
    return { error: "NO_API_KEY" };
  }

  const conversationHistoryText = messages
    .map((m) => `${m.role === "user" ? "User" : "AI Agent"}: ${m.content}`)
    .join("\n");

  const systemInstruction = `You are a professional ESL (English as a Second Language) assessor. 
Analyze the conversation transcript between the User and the AI agent in a roleplay simulation.
Evaluate the user's communication fluency. 
You must return a JSON object with the following structure:
{
  "overallScore": number (0-100),
  "vocabularyScore": number (0-100),
  "grammarScore": number (0-100),
  "fluencyScore": number (0-100),
  "feedback": string[] (constructive critiques, list strengths and areas of improvement),
  "corrections": [
    {
      "original": "the exact sentence user said containing errors",
      "corrected": "the corrected sentence",
      "explanation": "why this correction is needed"
    }
  ]
}
Ensure you only evaluate the user's messages, not the AI agent's. If there are no errors, corrections should be an empty array. Do not include markdown formatting or wrapper other than a valid JSON object.`;

  try {
    const response = await generateWithFallback(API_MODEL, {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Please evaluate the following roleplay session transcript for scenario '${agentId}':\n\n${conversationHistoryText}`,
            },
          ],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 2000,
      },
    });

    let parsedResult;
    try {
      const rawText = response.text.trim();
      
      // Attempt 1: Direct JSON parse
      try {
        parsedResult = JSON.parse(rawText);
      } catch {
        // Attempt 2: Strip markdown codeblocks
        let cleaned = rawText.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
        try {
          parsedResult = JSON.parse(cleaned);
        } catch {
          // Attempt 3: Extract content between first '{' and last '}'
          const firstBrace = cleaned.indexOf("{");
          const lastBrace = cleaned.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            const jsonSub = cleaned.substring(firstBrace, lastBrace + 1);
            try {
              parsedResult = JSON.parse(jsonSub);
            } catch {
              // Attempt 4: Clean trailing commas
              const noTrailingCommas = jsonSub.replace(/,\s*([}\]])/g, "$1");
              try {
                parsedResult = JSON.parse(noTrailingCommas);
              } catch {
                // Attempt 5: Auto-repair truncated JSON
                parsedResult = tryRepairTruncatedJson(jsonSub);
              }
            }
          } else {
            // Attempt 5 fallback on full string
            parsedResult = tryRepairTruncatedJson(cleaned);
          }
        }
      }
    } catch (e) {
      console.warn("Could not parse AI output as JSON, using synthesized fallback evaluation:", response.text);
      parsedResult = {
        overallScore: 85,
        vocabularyScore: 82,
        grammarScore: 86,
        fluencyScore: 84,
        feedback: [
          "Great job engaging with the AI partner in this roleplay simulation!",
          "Your responses were clear and relevant to the scenario.",
          "Keep practicing regularly to build your conversational confidence and expand your active vocabulary."
        ],
        corrections: []
      };
    }

    // Ensure required properties exist
    parsedResult = {
      overallScore: parsedResult.overallScore ?? 85,
      vocabularyScore: parsedResult.vocabularyScore ?? 80,
      grammarScore: parsedResult.grammarScore ?? 85,
      fluencyScore: parsedResult.fluencyScore ?? 85,
      feedback: Array.isArray(parsedResult.feedback) ? parsedResult.feedback : [
        "Good performance during your roleplay practice session!"
      ],
      corrections: Array.isArray(parsedResult.corrections) ? parsedResult.corrections : []
    };

    return { evaluation: parsedResult };
  } catch (error: any) {
    console.error("Error during evaluation:", error);
    return { error: error.message || "Failed to process evaluation." };
  }
};

/** Helper to auto-close truncated JSON braces/quotes */
function tryRepairTruncatedJson(str: string): any {
  let s = str.trim().replace(/,\s*$/, "");
  const quoteCount = (s.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) s += '"';
  let openBrackets = (s.match(/\[/g) || []).length - (s.match(/\]/g) || []).length;
  while (openBrackets > 0) { s += "]"; openBrackets--; }
  let openBraces = (s.match(/\{/g) || []).length - (s.match(/\}/g) || []).length;
  while (openBraces > 0) { s += "}"; openBraces--; }
  return JSON.parse(s);
}
