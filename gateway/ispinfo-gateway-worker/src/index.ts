/**
 * ISPInfo Gateway Worker
 * Handles CORS and proxies requests to the backend API
 */

// Backend API URL
const BACKEND_URL = 'https://api.ispinfo.io';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://ispinfo.io',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

// Handle CORS preflight requests
const handleOptions = (request: Request): Response => {
  const origin = request.headers.get('Origin') || '';
  const headers = new Headers();
  
  // Set allowed origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
  } else {
    // If origin is not in the allowed list, use the first allowed origin
    headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  }
  
  // Set allowed methods and headers
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Max-Age', '86400');
  
  return new Response(null, {
    headers,
    status: 204
  });
};

// Add CORS headers to response
const addCorsHeaders = (response: Response, request: Request): Response => {
  const origin = request.headers.get('Origin') || '';
  const headers = new Headers(response.headers);
  
  // Set allowed origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
  } else {
    headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  }
  
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  headers.set('Access-Control-Allow-Credentials', 'true');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

// Proxy request to backend
const proxyRequest = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  // Remove the leading slash from pathname to avoid double slashes
  const path = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
  const backendUrl = new URL(path, BACKEND_URL);
  
  // Forward the request to the backend
  try {
    const response = await fetch(backendUrl.toString(), {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: request.body,
      redirect: 'follow'
    });
    
    // If the response is not OK, return a proper error
    if (!response.ok) {
      return new Response(JSON.stringify({
        error: 'Backend request failed',
        status: response.status,
        statusText: response.statusText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return response;
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to connect to the backend' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }
    
    // Handle API requests
    const url = new URL(request.url);
    if (url.pathname.startsWith('/ip') || url.pathname.match(/^\/\d+\.\d+\.\d+\.\d+$/)) {
      const response = await proxyRequest(request);
      return addCorsHeaders(response, request);
    }
    
    // Return 404 for other paths
    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
