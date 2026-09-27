import type { VercelRequest, VercelResponse } from '@vercel/node';

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

function findApiKey(): string {
  const candidateKeys = [
    'GEMINI_API_KEY',
    'GOOGLE_GENAI_API_KEY',
    'VITE_GEMINI_API_KEY',
    'API_KEY',
    'GOOGLE_API_KEY',
    'GEMINI_KEY'
  ];

  for (const k of candidateKeys) {
    const val = process.env[k];
    if (val && typeof val === 'string' && val.trim()) {
      return val.trim().replace(/^["']|["']$/g, '');
    }
  }

  // Check if any process.env key or value starts with AIzaSy (common copy-paste in Vercel UI)
  for (const [k, v] of Object.entries(process.env)) {
    if (k.trim().startsWith('AIzaSy')) {
      return k.trim().replace(/^["']|["']$/g, '');
    }
    if (typeof v === 'string' && v.trim().startsWith('AIzaSy')) {
      return v.trim().replace(/^["']|["']$/g, '');
    }
  }

  // Pre-configured backup key provided by user
  return 'AIzaSyBG_0Visc4NSTQ03AsgaPW94WYkF-ni3fU';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-gemini-api-key');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Safely parse request body if present
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // continue
      }
    }

    const headerKey = (req.headers['x-gemini-api-key'] as string) || '';
    const bodyKey = (body?.apiKey as string) || '';
    const apiKey = (headerKey || bodyKey || findApiKey()).trim().replace(/^["']|["']$/g, '');

    // GET Request: Diagnostic Endpoint for easy browser verification with Live Google ping
    if (req.method === 'GET') {
      let googleTestStatus = 'NOT_RUN';
      let googleTestSuccess = false;
      if (apiKey) {
        try {
          const testRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }] })
          });
          if (testRes.ok) {
            googleTestStatus = 'SUCCESS (Google accepted the API Key and replied!)';
            googleTestSuccess = true;
          } else {
            const errData = await testRes.text();
            googleTestStatus = `REJECTED by Google (${testRes.status}): ${errData.slice(0, 160)}`;
          }
        } catch (e: any) {
          googleTestStatus = `Network error: ${e?.message || e}`;
        }
      }

      return res.status(200).json({
        status: 'active',
        service: 'Igloo AI Customer Support (Vercel Serverless)',
        geminiConfigured: !!apiKey,
        keyDetails: apiKey
          ? `${apiKey.slice(0, 8)}... (${apiKey.length} characters loaded)`
          : 'NOT_FOUND: Please set GEMINI_API_KEY in Vercel Settings > Environment Variables',
        googleKeyLiveTest: googleTestStatus,
        isGeminiWorking: googleTestSuccess,
        instruction: googleTestSuccess
          ? 'Gemini is 100% active and generating responses!'
          : 'Please visit https://aistudio.google.com/apikey to get a free Gemini API key, then save it in Vercel Environment Variables.',
        timestamp: new Date().toISOString()
      });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const prompt = (body?.prompt || body?.message || '').toString().trim();
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt or message is required' });
    }

    let lastError = '';

    // If API Key is present, call Google Gemini REST API directly (100% standalone, zero-dependency)
    if (apiKey) {
      const models = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-2.0-flash-lite'
      ];

      for (const model of models) {
        try {
          const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          
          const payload = {
            system_instruction: {
              parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${KNOWLEDGE_BASE_CONTEXT}\n\n=== CUSTOMER MESSAGE / TOPIC REQUEST ===\n"${prompt}"\n\nGenerate structured JSON reply strictly according to the format (NO asterisks **).`
                  }
                ]
              }
            ],
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: 0.35
            }
          };

          const geminiRes = await fetch(geminiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (geminiRes.ok) {
            const data: any = await geminiRes.json();
            const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textResponse) {
              let cleanedText = textResponse.trim();
              if (cleanedText.startsWith('```')) {
                cleanedText = cleanedText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
              }

              const parsed = JSON.parse(cleanedText);
              const banglaClean = stripAsterisks(parsed.banglaReply);
              const englishClean = stripAsterisks(parsed.englishReply);

              return res.status(200).json({
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
                modelName: model
              });
            }
          } else {
            const errBody = await geminiRes.text();
            lastError = `Gemini API returned ${geminiRes.status}: ${errBody}`;
            console.warn(`[Gemini REST Error ${model}]`, lastError);
          }
        } catch (mErr: any) {
          lastError = mErr?.message || String(mErr);
          console.warn(`[Gemini Attempt Error ${model}]`, lastError);
        }
      }
    } else {
      lastError = 'GEMINI_API_KEY environment variable is not defined on Vercel';
    }

    // High reliability fallback response if Gemini is unavailable
    const fallbackBangla = `ধন্যবাদ ইগলু আইসক্রিম-এর সাথে যোগাযোগ করার জন্য। আপনার অনুসন্ধান ("${prompt}") আমরা গ্রহণ করেছি। ডেলিভারি, প্রোডাক্টের দাম বা অন্য যেকোনো তথ্যের জন্য আমাদের হটলাইন ১৬৫৫৬ (সকাল ৯টা - সন্ধ্যা ৬টা) অথবা ভিজিট করুন: https://igloobd.com/। ঢাকা মেট্রো এলাকায় রয়েছে ফ্রি হোম ডেলিভারি সুবিধা।`;
    const fallbackEnglish = `Thank you for reaching out to Igloo Ice Cream. We have received your query ("${prompt}"). For delivery details, product availability, or any queries, please call our helpline 16556 (9:00 AM - 6:00 PM) or visit: https://igloobd.com/. Free home delivery is available across Dhaka Metro.`;

    return res.status(200).json({
      id: `fallback-${Date.now()}`,
      source: 'local_rule_engine',
      matchedType: 'general',
      confidence: 0.85,
      matchedEntityName: 'Igloo Customer Care',
      query: prompt,
      approvedScript: fallbackBangla,
      shortVersion: 'যেকোনো তথ্যের জন্য কল করুন ১৬৫৫৬ অথবা ভিজিট করুন igloobd.com (ঢাকা মেট্রোতে ফ্রি ডেলিভারি)।',
      warmVersion: `ইগলুর পক্ষ থেকে শুভেচ্ছা! আপনার প্রশ্নের উত্তর জানতে আমাদের হেল্পলাইন ১৬৫৫৬-এ যোগাযোগ করতে পারেন। আমরা সবসময় আপনার সেবায় প্রস্তুত।`,
      englishVersion: fallbackEnglish,
      banglaVersion: fallbackBangla,
      languageDetected: 'auto',
      debug: {
        geminiAttempted: !!apiKey,
        geminiError: lastError || null
      }
    });
  } catch (fatalError: any) {
    console.error('[Vercel Handler Fatal Catch]', fatalError);
    return res.status(200).json({
      id: `safe-${Date.now()}`,
      source: 'local_rule_engine',
      matchedType: 'general',
      confidence: 0.8,
      matchedEntityName: 'Igloo Customer Support',
      query: 'Query',
      approvedScript: 'ইগলু আইসক্রিমে যোগাযোগ করার জন্য ধন্যবাদ। বিস্তারিত জানতে কল করুন ১৬৫৫৬ অথবা ভিজিট করুন igloobd.com।',
      shortVersion: 'কল করুন ১৬৫৫৬ অথবা ভিজিট করুন igloobd.com',
      warmVersion: 'ইগলু বেছে নেওয়ার জন্য ধন্যবাদ! যেকোনো তথ্যে আমরা আপনার পাশে আছি।',
      englishVersion: 'Thank you for contacting Igloo Ice Cream. For details, please call 16556 or visit igloobd.com.',
      banglaVersion: 'ইগলু আইসক্রিমে যোগাযোগ করার জন্য ধন্যবাদ। বিস্তারিত জানতে কল করুন ১৬৫৫৬ অথবা ভিজিট করুন igloobd.com।',
      languageDetected: 'auto',
      debug: {
        fatal: fatalError?.message || String(fatalError)
      }
    });
  }
}
