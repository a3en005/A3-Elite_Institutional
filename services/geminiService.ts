
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ResearchData } from "../types";

export const getEquityResearch = async (ticker: string): Promise<ResearchData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const systemInstruction = `Act as the A3-Trade Institutional Engine. Your purpose is to provide 360° equity research grounded in real-time data.

OPERATIONAL CONSTRAINTS:
1. DATA RIGOR: Use Google Search to find TODAY'S current price, latest news (last 24-48h), and most recent analyst reports.
2. PILLAR 11 SENTIMENT: Analyze news headlines and analyst reports to generate a sentiment score (0-100) and identify the primary "Sentiment Drivers" (bullish or bearish catalysts).
3. NO DEFINITIONS: Provide cold, institutional analysis only.
4. PILLAR MAPPING: Ensure all 11 pillars are addressed. If news is missing, mark [DATA GAP].
5. TICKER VERIFICATION: If the ticker is invalid or unsearchable, return an error object.

Structure the Pillar 11 Verdict to include:
- Score: Quantitative institutional conviction.
- Sentiment Score: Public/News mood analysis.
- Sentiment Drivers: List 3 key news/report drivers.
- Analyst Consensus: Current buy/sell/hold aggregate.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the ticker "${ticker}" using the A3-Trade 11-pillar methodology with latest real-time news and pricing.`,
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ticker: { type: Type.STRING },
          price: { type: Type.NUMBER },
          change: { type: Type.NUMBER },
          marketCap: { type: Type.STRING },
          sector: { type: Type.STRING },
          beatRate: { type: Type.NUMBER },
          avgVariance: { type: Type.NUMBER },
          lastUpdated: { type: Type.STRING },
          p1_moat: {
            type: Type.OBJECT,
            properties: {
              brand: { type: Type.NUMBER },
              pricing: { type: Type.NUMBER },
              rd: { type: Type.NUMBER },
              network: { type: Type.NUMBER },
              switching: { type: Type.NUMBER }
            },
            required: ["brand", "pricing", "rd", "network", "switching"]
          },
          p2_trends: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                price: { type: Type.NUMBER }
              },
              required: ["date", "price"]
            }
          },
          p3_variance: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                period: { type: Type.STRING },
                guidance: { type: Type.STRING },
                delivery: { type: Type.STRING },
                variance: { type: Type.NUMBER }
              },
              required: ["period", "guidance", "delivery", "variance"]
            }
          },
          p4_valuation: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                pe: { type: Type.NUMBER },
                peg: { type: Type.NUMBER },
                ps: { type: Type.NUMBER }
              },
              required: ["name", "pe", "peg", "ps"]
            }
          },
          p5_management: { type: Type.STRING },
          p6_flow: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                percentage: { type: Type.NUMBER }
              },
              required: ["label", "percentage"]
            }
          },
          p7_macro: { type: Type.STRING },
          p8_benchmarking: { type: Type.STRING },
          p9_liquidity: { type: Type.STRING },
          p10_esg: { type: Type.STRING },
          p11_verdict: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              score: { type: Type.NUMBER },
              sentimentScore: { type: Type.NUMBER },
              sentimentDrivers: { type: Type.ARRAY, items: { type: Type.STRING } },
              analystConsensus: { type: Type.STRING }
            },
            required: ["label", "confidence", "score", "sentimentScore", "sentimentDrivers", "analystConsensus"]
          },
          summary: { type: Type.STRING },
          recentNews: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                source: { type: Type.STRING },
                time: { type: Type.STRING }
              }
            }
          }
        },
        required: [
          "ticker", "price", "change", "marketCap", "sector", "beatRate", 
          "avgVariance", "lastUpdated", "p1_moat", "p2_trends", "p3_variance", "p4_valuation",
          "p5_management", "p6_flow", "p7_macro", "p8_benchmarking", "p9_liquidity",
          "p10_esg", "p11_verdict", "summary", "recentNews"
        ]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Terminal_Link_Failure");
    return JSON.parse(text) as ResearchData;
  } catch (error) {
    console.error("Critical Research Node Failure:", error);
    throw error;
  }
};

export const startA3Chat = (isDeepAnalysis: boolean) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const model = isDeepAnalysis ? 'gemini-3-pro-preview' : 'gemini-flash-lite-latest';
  
  return ai.chats.create({
    model,
    config: {
      systemInstruction: `You are the A3-Trade Institutional Chatbot. 
      You provide precise, cold, and professional equity research insights. 
      NEVER use casual language. NEVER provide generic financial definitions.
      If asked about a specific stock, use your search tools if needed (only if using Pro).
      Your responses should be formatted in clean Markdown.
      Current model mode: ${isDeepAnalysis ? 'Deep Institutional Analysis (Pro)' : 'Fast Market Pulse (Flash Lite)'}.`,
      tools: isDeepAnalysis ? [{ googleSearch: {} }] : undefined,
    },
  });
};
