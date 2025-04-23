const APPFIGURES_API_BASE = 'https://api.appfigures.com/v2';
// Vercel accesses env vars directly with process.env
const PAT = process.env.APPFIGURES_PAT;

export default async function handler(req, res) {
  // Extract path from the request URL
  const apiPath = req.url.replace(/^\/api\/appfigures-proxy/, '');
  
  // Get query parameters
  const queryString = new URLSearchParams(req.query || {}).toString();
  const targetUrl = `${APPFIGURES_API_BASE}${apiPath}${queryString ? `?${queryString}` : ''}`;
  
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
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${PAT}`,
      },
      body: req.body ? JSON.stringify(req.body) : undefined,
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