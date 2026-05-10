// Vercel Serverless Function — GET /api/unsplash?q=...&per_page=8
// Proxies Unsplash search so the access key stays server-side.

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    res.status(500).json({
      error:
        'UNSPLASH_ACCESS_KEY not set on the server. Add it to .env.local for local dev or to Vercel env vars in production.'
    });
    return;
  }

  // Query parsing must work for both Vercel (req.query) and Node IncomingMessage (req.url).
  let q = '';
  let perPage = '8';
  if (req.query && typeof req.query === 'object') {
    q = String(req.query.q || '');
    perPage = String(req.query.per_page || '8');
  } else {
    const url = new URL(req.url, 'http://x');
    q = url.searchParams.get('q') || '';
    perPage = url.searchParams.get('per_page') || '8';
  }

  if (!q.trim()) {
    res.status(400).json({ error: 'Missing q parameter' });
    return;
  }

  const upstreamUrl =
    'https://api.unsplash.com/search/photos?query=' +
    encodeURIComponent(q) +
    '&per_page=' +
    encodeURIComponent(perPage) +
    '&orientation=landscape';

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        Authorization: 'Client-ID ' + accessKey,
        'Accept-Version': 'v1'
      }
    });

    if (!upstream.ok) {
      const errBody = await upstream.json().catch(() => ({}));
      res
        .status(upstream.status)
        .json({ error: errBody?.errors?.[0] || 'Unsplash error ' + upstream.status });
      return;
    }

    const data = await upstream.json();
    const results = (data.results || []).map((p) => ({
      id: p.id,
      urls: { small: p.urls?.small, regular: p.urls?.regular },
      user: { name: p.user?.name }
    }));
    res.status(200).json({ results });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Server error' });
  }
}
