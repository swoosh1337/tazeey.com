const APPFIGURES_API_BASE = 'https://api.appfigures.com/v2';
// Check for both naming conventions for the environment variable
const PAT = process.env.APPFIGURES_PAT || process.env.VITE_APPFIGURES_PAT;

export const handler = async (event, context) => {
  // Determine the target Appfigures API path from the incoming request path
  // Example: /.netlify/functions/appfigures-proxy/products/mine -> /products/mine
  const apiPath = event.path.replace('/.netlify/functions/appfigures-proxy', '');

  // Get query parameters from the request URL
  const queryString = new URLSearchParams(event.queryStringParameters || {}).toString();
  const targetUrl = `${APPFIGURES_API_BASE}${apiPath}${queryString ? `?${queryString}` : ''}`;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Allow requests from any origin (adjust in production if needed)
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle OPTIONS preflight request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  if (!PAT) {
    console.error('Appfigures PAT missing. Environment variables:', {
      APPFIGURES_PAT: !!process.env.APPFIGURES_PAT,
      VITE_APPFIGURES_PAT: !!process.env.VITE_APPFIGURES_PAT
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Appfigures PAT environment variable not set.' }),
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    };
  }

  console.log(`Proxying [${event.httpMethod}] request to: ${targetUrl}`);

  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: {
        'Authorization': `Bearer ${PAT}`,
      },
      body: event.body ? event.body : undefined,
    });

    // Read body as text first to avoid JSON parse errors on non-JSON bodies
    const responseBodyText = await response.text();

    // Check for errors from Appfigures API
    if (!response.ok) {
      console.error(`Appfigures API Error (${response.status}):`, responseBodyText);
      // Try to parse as JSON error, otherwise return text
      let errorBody = responseBodyText;
      try {
        errorBody = JSON.stringify(JSON.parse(responseBodyText));
      } catch (e) { /* Ignore parsing error, return as text */ }

      return {
          statusCode: response.status,
          body: errorBody,
          headers: { ...corsHeaders, 'Content-Type': response.headers.get('content-type') || 'text/plain' }
      };
    }

    // Attempt to parse successful response as JSON
    try {
        const jsonData = JSON.parse(responseBodyText);
        return {
            statusCode: 200,
            body: JSON.stringify(jsonData),
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        };
    } catch (jsonError) {
        // If successful response wasn't JSON (shouldn't happen with Appfigures API but handle defensively)
        console.error('Appfigures API Success Response was not valid JSON:', responseBodyText);
        return {
            statusCode: 500, // Internal Server Error from proxy perspective
            body: JSON.stringify({ error: 'Received invalid JSON response from Appfigures API.' }),
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        };
    }

  } catch (error) {
    console.error('Proxy Fetch/Network Error:', error);
    return {
      statusCode: 502, // Bad Gateway, indicates proxy couldn't reach upstream
      body: JSON.stringify({ error: 'Proxy failed to fetch data from Appfigures API.', details: error.message }),
       headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    };
  }
}; 