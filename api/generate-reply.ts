import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { generateLocalReply } from '../src/services/localEngine';

function stripAsterisks(text: string | undefined | null): string {
  if (!text) return '';
  return text.replace(/\*{1,3}/g, '').trim();
}

const KNOWLEDGE_BASE_CONTEXT = `
=== IGLOO ICE CREAM APPROVED OFFICIAL KNOWLEDGE BASE ===
Official Brand: Igloo Ice Cream (Abdul Monem Ltd., Bangladesh)
Helpline: 16556 / 096 101 16556 (Hours: 9:00 AM - 6:00 PM)
Official Website & Online Order: https://igloobd.com/
Free Home Delivery: Dhaka Metropolitan City area only (no minimum delivery fee for standard home delivery orders on website).
Outside Dhaka Policy: Home delivery is currently available inside Dhaka Metro only. However, all Igloo Ice Cream products are available across Bangladesh at nearby confectioneries, grocery stores, super shops (Shwapno, Meena Bazar, Agora), and local retail outlets.
Corporate Office: Monem Business District, 111 Bir Uttam C.R. Dutta Road, Dhaka-1205.
`;

const SYSTEM_INSTRUCTION = `
You are the official Senior Customer Support AI Specialist for Igloo Ice Cream (Abdul Monem Ltd.), Bangladesh.

FORMATTING RULE (CRITICAL):
- DO NOT USE ANY ASTERISKS (**) OR MARKDOWN BOLD STARS (* or **) IN ANY OF YOUR REPLIES.
- Facebook Messenger, WhatsApp, and live chat users see raw asterisks as text clutter. Always use clean, plain text formatting with clean bullet points (•) and line breaks.

CORE OPERATIONAL PRINCIPLES:
1. FIRST PRIORITY - KNOWLEDGE BASE GROUNDING:
   - When the customer's query directly asks about specific Igloo Ice Cream products, prices, combos, discounts, delivery areas, or frequent FAQs, check the provided Knowledge Base first and use exact official facts, verified prices, and Dhaka Metro free home delivery rules.
   - For Dhaka Metro areas: confirm free home delivery is available via https://igloobd.com/ or 16556.
   - For Outside Dhaka: state that home delivery is limited to Dhaka Metro, but products are widely available at local confectioneries and retail shops across the country.

2. BEYOND KB & CUSTOM TOPIC CAPABILITY (VERY IMPORTANT):
   - If the user provides ANY topic, query, instruction, or prompt that is NOT directly found in the Knowledge Base (e.g. "ata reply likha daw", asking how to handle a customer scenario, special requests, feedback, compliments, complaints, event ice cream catering, wedding/birthday queries, corporate partnerships, wholesale/dealership, flavor suggestions, ice cream storage tips, ingredient questions, or ANY creative or open-ended topic):
   - GO BEYOND THE KB! USE YOUR FULL GEMINI INTELLIGENCE to thoughtfully, articulately, and expertly write a complete, natural customer reply on that topic, just like Gemini writes rich and intelligent answers.
   - Never say "I don't know" or give a dry refusal. Instead, answer the question thoroughly with helpful, courteous, and accurate reasoning while representing Igloo's warm, premium, and hospitable brand voice.
   - Gracefully integrate Igloo's official contact points: Helpline 16556 (9 AM - 6 PM) and website https://igloobd.com/ for further support.

OUTPUT REQUIREMENT:
Return ONLY a valid JSON object matching this exact schema (NO asterisks **):
{
  "banglaReply": "সম্পূর্ণ প্রফেশনাল, বিস্তারিত ও নির্ভুল বাংলা রিপ্লাই (কোনো স্টার বা ** ছাড়া)",
  "englishReply": "Complete professional, articulate, and accurate English reply (without any asterisks or markdown stars)",
  "shortVersion": "Very crisp 1-2 sentence quick response without asterisks",
  "warmVersion": "Extra friendly, warm, empathetic & delightful tone version without asterisks",
  "matchedEntity": "Main topic, product, or scenario addressed (e.g., 'Corporate Event Catering' or 'Chocbar Price' or 'Delivery Inquiry')"
}
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for API calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt = (req.body?.prompt || req.body?.message || '').toString().trim();
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt or message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

  if (apiKey) {
    let ai: GoogleGenAI | null = null;
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (e) {
      console.error('Failed to init GoogleGenAI in serverless function:', e);
    }

    if (ai) {
      const modelCandidates = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      for (const modelName of modelCandidates) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${KNOWLEDGE_BASE_CONTEXT}\n\n=== CUSTOMER MESSAGE / TOPIC REQUEST ===\n"${prompt}"\n\nGenerate the structured JSON reply according to instructions (DO NOT use any asterisks **). If this is a general topic or outside the KB, write a rich, complete, empathetic customer support reply as an intelligent Gemini AI.`
                  }
                ]
              }
            ],
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              responseMimeType: 'application/json',
              temperature: 0.35
            }
          });

          if (response && response.text) {
            const parsed = JSON.parse(response.text);
            const banglaClean = stripAsterisks(parsed.banglaReply);
            const englishClean = stripAsterisks(parsed.englishReply);
            return res.json({
              id: `reply-${Date.now()}`,
              source: 'gemini',
              matchedType: 'ai_custom_grounded',
              confidence: 0.99,
              matchedEntityName: stripAsterisks(parsed.matchedEntity || 'Igloo Customer Support'),
              query: prompt,
              approvedScript: banglaClean,
              shortVersion: stripAsterisks(parsed.shortVersion || parsed.banglaReply),
              warmVersion: stripAsterisks(parsed.warmVersion || parsed.banglaReply),
              englishVersion: englishClean,
              banglaVersion: banglaClean,
              languageDetected: 'auto',
              modelName
            });
          }
        } catch (mErr) {
          console.warn(`Vercel function model ${modelName} error:`, mErr);
        }
      }
    }
  } else {
    console.warn('GEMINI_API_KEY is not defined in environment variables on live deployment.');
  }

  // Fallback to high-performance local engine if Gemini API Key not set on live host
  const localResult = generateLocalReply(prompt);
  return res.json({
    ...localResult,
    approvedScript: stripAsterisks(localResult.approvedScript),
    shortVersion: stripAsterisks(localResult.shortVersion),
    warmVersion: stripAsterisks(localResult.warmVersion),
    englishVersion: stripAsterisks(localResult.englishVersion),
    banglaVersion: stripAsterisks(localResult.banglaVersion)
  });
}

