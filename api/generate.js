// Vercel Serverless Function — POST /api/generate
// Proxies Anthropic Messages API so the API key stays server-side.
// Body: { shootType, brief, vibe, count }
// Returns: { shots: [{ description, lighting, lens, mood, notes }, ...] }

const MODEL = 'claude-sonnet-4-6';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error:
        'ANTHROPIC_API_KEY not set on the server. Add it to .env.local for local dev or to Vercel env vars in production.'
    });
    return;
  }

  // Body may already be parsed (Vercel) or be a Node IncomingMessage stream (local dev).
  let body = req.body;
  if (!body || typeof body === 'string') {
    body = await readJsonBody(req).catch(() => ({}));
  }

  const shootType = String(body?.shootType || 'Fashion Editorial');
  const brief = String(body?.brief || shootType);
  const vibe = String(body?.vibe || 'Editorial');
  const count = Math.max(1, Math.min(30, parseInt(body?.count, 10) || 8));

  const prompt =
    `Generate exactly ${count} professional shots for a ${shootType} shoot.\n` +
    `Brief: "${brief}"\n` +
    `Vibe: ${vibe}\n\n` +
    `Reply with ONLY this JSON, no other text:\n` +
    `{"shots":[{"description":"subject and framing","lighting":"Natural","lens":"50mm","mood":"Editorial","notes":"director note"}]}\n\n` +
    `Use only: Natural/Golden Hour/Blue Hour/Studio Strobe/Continuous/Practical/Mixed for lighting\n` +
    `Use only: 24mm/35mm/50mm/85mm/135mm/70-200mm/Macro for lens\n` +
    `Use only: Dark/Airy/Moody/Editorial/Commercial/Intimate/Dynamic/Graphic for mood`;

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 3000,
        system:
          'You are a professional creative director. Output ONLY raw valid JSON — no markdown, no backticks, no explanation.',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!upstream.ok) {
      const errBody = await upstream.json().catch(() => ({}));
      res
        .status(upstream.status)
        .json({ error: errBody?.error?.message || 'Anthropic error ' + upstream.status });
      return;
    }

    const data = await upstream.json();
    const raw = (data.content || []).map((b) => b.text || '').join('').trim();
    const a = raw.indexOf('{');
    const b = raw.lastIndexOf('}');
    if (a === -1 || b === -1) {
      res.status(502).json({ error: 'Unexpected response — try again' });
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(raw.slice(a, b + 1));
    } catch {
      res.status(502).json({ error: 'Could not parse model JSON' });
      return;
    }
    const shots = Array.isArray(parsed.shots) ? parsed.shots : [];
    if (!shots.length) {
      res.status(502).json({ error: 'No shots returned — try again' });
      return;
    }
    res.status(200).json({ shots });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Server error' });
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}
