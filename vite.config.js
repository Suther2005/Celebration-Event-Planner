import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

/**
 * Optional Development/Preview Server-Side Proxy Plugin for Gemini API.
 * 
 * ARCHITECTURE & DEPLOYMENT NOTICE:
 * - This proxy runs in Vite's development and preview HTTP servers (`npm run dev` / `npm run preview`).
 * - In static hosting environments (e.g. GitHub Pages), this proxy is not present; the application
 *   automatically falls back to direct client-side requests or the offline recommendation engine.
 * - In enterprise production deployments, this proxy logic should be deployed to a dedicated backend
 *   or serverless function (e.g., Cloud Functions, AWS Lambda, Next.js /api route).
 * 
 * SECURITY SAFEGUARDS:
 * - Never returns or leaks GEMINI_API_KEY to the browser client.
 * - Enforces strict POST method check and request size limits (max 50KB).
 * - Enforces 45-second upstream timeout via AbortController.
 * - Sanitizes upstream error responses to prevent secret or system leakage.
 */
function geminiServerProxyPlugin() {
  const handler = async (req, res) => {
    // 1. Method validation
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      return;
    }

    // 2. Read server-side key safely (never exposed in client bundle unless prefixed with VITE_)
    const env = loadEnv('', process.cwd(), '');
    const serverKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!serverKey) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'No server-side Gemini API key configured on proxy' }));
      return;
    }

    // 3. Payload size limiting (max 50KB to prevent memory exhaustion DoS)
    const MAX_PAYLOAD_BYTES = 50 * 1024;
    let body = '';
    let totalBytes = 0;
    let isTerminated = false;

    req.on('data', chunk => {
      if (isTerminated) return;
      totalBytes += chunk.length;
      if (totalBytes > MAX_PAYLOAD_BYTES) {
        isTerminated = true;
        res.statusCode = 413;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Payload Too Large: maximum allowed body is 50KB' }));
        req.destroy();
        return;
      }
      body += chunk;
    });

    req.on('end', async () => {
      if (isTerminated) return;

      // 4. Payload validation & parsing
      let parsed;
      try {
        parsed = JSON.parse(body || '{}');
      } catch {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        return;
      }

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

      // 5. Upstream fetch with 45s AbortController timeout & header auth
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
          // Sanitize error message to prevent accidental key leakage
          const safeMsg = rawMsg.replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED]');
          
          res.statusCode = googleRes.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: safeMsg, status: googleRes.status }));
          return;
        }

        const data = await googleRes.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Gemini service returned empty content' }));
          return;
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
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(resultJson));
      } catch (err) {
        clearTimeout(timeoutId);
        const isTimeout = err.name === 'AbortError';
        res.statusCode = isTimeout ? 504 : 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          error: isTimeout ? 'Gateway Timeout: upstream Gemini API took too long to respond' : 'Internal Proxy Processing Error'
        }));
      }
    });
  };

  return {
    name: 'gemini-server-proxy',
    configureServer(server) {
      server.middlewares.use('/api/gemini/generateContent', handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/gemini/generateContent', handler);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), geminiServerProxyPlugin()],
})
