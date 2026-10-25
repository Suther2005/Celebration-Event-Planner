/**
 * Vercel Serverless Function Proxy for Google Gemini API
 * Provides secure server-side forwarding when deployed on Vercel.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const serverKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!serverKey) {
    return res.status(404).json({ error: 'No server-side Gemini API key configured on Vercel' });
  }

  const parsed = req.body || {};
  const event = (parsed && typeof parsed.event === 'object' && parsed.event !== null) ? parsed.event : {};
  const customPrompt = typeof parsed.customPrompt === 'string' ? parsed.customPrompt.slice(0, 500) : '';
  const eventType = typeof event.type === 'string' ? event.type.slice(0, 50) : 'Celebration';
  const eventTitle = typeof event.title === 'string' ? event.title.slice(0, 100) : 'Celebration';
  const eventGuestCount = Number(event.guestCount) > 0 ? Number(event.guestCount) : 'Not specified';
  const eventLocation = typeof event.location === 'string' ? event.location.slice(0, 150) : 'Local venue';
  const eventBudget = Number(event.budget) >= 0 ? Number(event.budget) : 5000;
  const eventDescription = typeof event.description === 'string' ? event.description.slice(0, 500) : '';

  const model = 'gemini-3.5-flash';
  const promptText = `
You are an elite celebration and luxury event designer.
Generate 3 distinct, creative, and actionable event theme ideas for:
- Event Type: ${eventType}
- Event Title: ${eventTitle}
- Guest Count: ${eventGuestCount}
- Location: ${eventLocation}
- Total Budget: $${eventBudget}
- Additional User Notes/Vibe: ${customPrompt || eventDescription || 'Modern, memorable, and elegant'}

Please respond strictly in valid JSON matching this schema:
{
  "summary": "Brief executive vision of these concepts (1-2 sentences)",
  "themes": [
    {
      "id": "unique-slug",
      "name": "Theme Name",
      "tagline": "Catchy evocative 1-sentence tagline",
      "palette": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
      "paletteNames": ["Color 1", "Color 2", "Color 3", "Color 4"],
      "decorHighlights": [
        "Specific decor highlight 1",
        "Specific decor highlight 2",
        "Specific decor highlight 3",
        "Specific decor highlight 4"
      ],
      "recommendedMusic": "Atmosphere and music direction",
      "cateringIdeas": "Signature dishes, drinks, or serving style",
      "budgetTip": "Actionable budget optimization advice for this theme"
    }
  ]
}
Do not wrap in markdown quotes if possible, output raw JSON.
`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const googleRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': serverKey
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json'
        }
      })
    });

    clearTimeout(timeoutId);

    if (!googleRes.ok) {
      const errData = await googleRes.json().catch(() => ({}));
      const rawMsg = errData?.error?.message || `Upstream HTTP ${googleRes.status}`;
      const safeMsg = rawMsg.replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED]');
      return res.status(googleRes.status).json({ error: safeMsg, status: googleRes.status });
    }

    const data = await googleRes.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return res.status(502).json({ error: 'Gemini service returned empty content' });
    }

    let resultJson;
    try {
      let clean = candidateText.trim();
      if (clean.startsWith('```')) {
        clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      }
      resultJson = JSON.parse(clean);
    } catch {
      const match = candidateText.match(/\{[\s\S]*\}/);
      resultJson = match ? JSON.parse(match[0]) : { themes: [] };
    }

    resultJson._modelUsed = model;
    return res.status(200).json(resultJson);
  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError';
    return res.status(isTimeout ? 504 : 500).json({
      error: isTimeout ? 'Gateway Timeout: upstream Gemini API took too long to respond' : 'Internal Proxy Processing Error'
    });
  }
}
