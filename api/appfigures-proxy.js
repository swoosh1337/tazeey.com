export default async function handler(req, res) { ... }const APPFIGURES_API_BASE = 'https://api.appfigures.com/v2';
// Vercel accesses env vars directly with process.env
const PAT = process.env.APPFIGURES_PAT;

export default async function handler(req, res) {
  // Extract path and query from the request URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const apiPath = url.pathname.replace(/^\/api\/appfigures-proxy/, '');
  const queryString = url.search;
  const targetUrl = `${APPFIGURES_API_BASE}${apiPath}${queryString}`;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (!PAT) {
    console.error('Appfigures PAT missing');
    return res.status(500).json({ error: 'Appfigures PAT environment variable not set.' });
  }

  try {
    let body = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // Collect body as string
      body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => resolve(data));
        req.on('error', err => reject(err));
      });
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${PAT}`,
        'Content-Type': req.headers['content-type'] || 'application/json',
      },
      body,
    });

    // Read response body as text
    const responseBodyText = await response.text();

    // Handle error responses
    if (!response.ok) {
      console.error(`Appfigures API Error (${response.status}):`, responseBodyText);

      // Try to parse JSON error
      try {
        const errorBody = JSON.parse(responseBodyText);
        return res.status(response.status).json(errorBody);
      } catch (e) {
        return res.status(response.status)
          .setHeader('Content-Type', 'text/plain')
          .send(responseBodyText);
      }
    }
    
    // Parse successful response
    try {
      const jsonData = JSON.parse(responseBodyText);
      return res.status(200).json(jsonData);
    } catch (jsonError) {
      console.error('Appfigures API Success Response was not valid JSON:', responseBodyText);
      return res.status(500).json({ 
        error: 'Received invalid JSON response from Appfigures API.' 
      });
    }
  } catch (error) {
    console.error('Proxy Fetch/Network Error:', error);
    return res.status(502).json({ 
      error: 'Proxy failed to fetch data from Appfigures API.', 
      details: error.message 
    });
  }
}