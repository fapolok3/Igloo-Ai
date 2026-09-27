import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-gemini-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      // continue
    }
  }

  const rawKey = body?.apiKey || (req.headers['x-gemini-api-key'] as string) || '';
  const key = rawKey.trim().replace(/^["']|["']$/g, '');

  if (!key) {
    return res.status(400).json({ success: false, message: 'কোনো API Key পাওয়া যায়নি।' });
  }

  try {
    const testRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }] })
      }
    );

    if (testRes.ok) {
      return res.status(200).json({
        success: true,
        message: 'অভিনন্দন! গুগল এই API Key সফলভাবে গ্রহণ করেছে। জেমিনাই AI সম্পূর্ণ সক্রিয়!'
      });
    }

    const errData = await testRes.json().catch(() => null);
    const errMessage = errData?.error?.message || (await testRes.text().catch(() => ''));
    const reason = errData?.error?.details?.[0]?.reason || errData?.error?.status || '';

    let userFriendlyMsg = `গুগল এই Key প্রত্যাখ্যান করেছে (${testRes.status})`;
    if (reason === 'API_KEY_INVALID' || errMessage.includes('API key not valid')) {
      userFriendlyMsg = 'গুগল জানিয়েছে: API Key টি অবৈধ (API_KEY_INVALID)। এটি ঘটে যদি কি-টি Google Cloud Console থেকে নেওয়া হয় যেখানে Generative Language API সক্রিয় নেই, বা কী-টি অসম্পূর্ণ কপি হয়েছে। দয়া করে https://aistudio.google.com/apikey থেকে নতুন কি নিন।';
    } else if (reason === 'PERMISSION_DENIED' || errMessage.includes('has not been used')) {
      userFriendlyMsg = 'গুগল জানিয়েছে: Generative Language API চালু নেই বা অনুমতি নেই (PERMISSION_DENIED)। aistudio.google.com/apikey থেকে নতুন কি নিন।';
    } else if (errMessage) {
      userFriendlyMsg = `গুগল এরর: ${errMessage}`;
    }

    return res.status(200).json({
      success: false,
      rawError: errMessage,
      reason,
      status: testRes.status,
      message: userFriendlyMsg
    });
  } catch (err: any) {
    return res.status(200).json({
      success: false,
      message: `নেটওয়ার্ক সংযোগ সমস্যা: ${err?.message || err}`
    });
  }
}
