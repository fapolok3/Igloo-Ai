import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { IGLOO_PRODUCTS, IGLOO_FAQS, SPECIAL_ITEMS, DHAKA_METRO_AREAS } from '../src/data/knowledgeBase';
import { generateLocalReply } from '../src/services/localEngine';

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
}

function stripAsterisks(text: string | undefined | null): string {
  if (!text) return '';
  return text.replace(/\*{1,3}/g, '').trim();
}

const KNOWLEDGE_BASE_CONTEXT = `
=== IGLOO ICE CREAM APPROVED OFFICIAL KNOWLEDGE BASE ===
Helpline: 16556 / 096 101 16556 (Hours: 9:00 AM - 6:00 PM)
Website & Online Ordering: https://igloobd.com/
Free Home Delivery: Dhaka Metropolitan City area only.
`;

const SYSTEM_INSTRUCTION = `
You are the official Senior Customer Support AI Specialist for Igloo Ice Cream.
DO NOT USE ANY ASTERISKS (**) OR MARKDOWN BOLD STARS (* or **) IN ANY OF YOUR REPLIES.
Return ONLY a valid JSON object matching this exact schema:
{
  "banglaReply": "সম্পূর্ণ প্রফেশনাল ও নির্ভুল বাংলা রিপ্লাই (কোনো স্টার বা ** ছাড়া)",
  "englishReply": "Complete professional and accurate English reply (without any asterisks)",
  "shortVersion": "Very short 1-2 sentence quick response without asterisks",
  "warmVersion": "Extra friendly & delightful tone version without asterisks",
  "matchedEntity": "Main topic or area/product addressed"
}
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    if (ai && apiKey) {
      const modelCandidates = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
      for (const modelName of modelCandidates) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${KNOWLEDGE_BASE_CONTEXT}\n\n=== CUSTOMER MESSAGE ===\n"${message}"\n\nGenerate structured JSON reply (NO asterisks **).`
                  }
                ]
              }
            ],
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              responseMimeType: 'application/json',
              temperature: 0.2
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
              query: message,
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
          console.warn(`Model ${modelName} error:`, mErr);
        }
      }
    }

    // High performance local fallback
    const localResult = generateLocalReply(message);
    return res.json({
      ...localResult,
      approvedScript: stripAsterisks(localResult.approvedScript),
      shortVersion: stripAsterisks(localResult.shortVersion),
      warmVersion: stripAsterisks(localResult.warmVersion),
      englishVersion: stripAsterisks(localResult.englishVersion),
      banglaVersion: stripAsterisks(localResult.banglaVersion)
    });
  } catch (err: any) {
    const localResult = generateLocalReply(message);
    return res.json(localResult);
  }
}
