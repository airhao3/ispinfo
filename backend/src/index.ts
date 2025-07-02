/// <reference types="@cloudflare/workers-types" />

import { ApiError, ApiResponse, ClientError, IpInfo, IpregistryClient } from '@ipregistry/client';

// Define the environment interface
interface Env {
  IPREGISTRY_API_KEY: string;
}

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://ispinfo.io'
];

// Helper function to set CORS headers
function setCorsHeaders(headers: Headers, request: Request): Headers {
  const origin = request.headers.get('Origin') || '';

  // Set allowed origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
  } else {
    headers.set('Access-Control-Allow-Origin', 'https://ispinfo.io');
  }

  // Set other CORS headers
  headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', request.headers.get('Access-Control-Request-Headers') || '*');
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Max-Age', '86400');
  return headers;
}

// Helper function to create a CORS response
function createCorsResponse(body: BodyInit | null, init: ResponseInit, request: Request): Response {
  const headers = new Headers(init.headers);
  setCorsHeaders(headers, request);
  return new Response(body, { ...init, headers });
}

// Declare a client variable in global scope to reuse the instance and its cache
let ipregistryClient: IpregistryClient | null = null;

// Helper function to get IP info from ipregistry
async function getIPInfo(ip: string, apiKey: string): Promise<IpInfo | { error: string; status: number }> {
  console.log('Received API Key:', apiKey);
  console.log('Attempting to lookup IP:', ip);
  if (!apiKey) {
    console.error('IPREGISTRY_API_KEY is not set.');
    return {
      error: 'Service configuration error: API Key missing.',
      status: 500
    };
  }

  // Initialize client if not already done
  if (!ipregistryClient) {
    ipregistryClient = new IpregistryClient(apiKey);
  }

  try {
    const response: ApiResponse<IpInfo> = await ipregistryClient.lookupIp(ip);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('ipregistry API error:', error.code, error.message);
      return {
        error: `ipregistry API error: ${error.message} (Code: ${error.code})`,
        status: 500
      };
    } else if (error instanceof ClientError) {
      console.error('ipregistry Client error:', error.message);
      return {
        error: `ipregistry client error: ${error.message}`,
        status: 500
      };
    } else {
      console.error('Unexpected error fetching from ipregistry:', error);
      return {
        error: 'An unexpected error occurred while fetching IP information.',
        status: 500
      };
    }
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      const headers = new Headers();
      setCorsHeaders(headers, request);
      return new Response(null, { status: 204, headers });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    let ipToLookup: string | null = null;

    if (path === '/ip') {
      ipToLookup = request.headers.get('CF-Connecting-IP') || '8.8.8.8'; // Default to a public IP for testing
    } else {
      const ipMatch = path.match(/^\/([a-fA-F0-9.:]+)$/); // Regex to match IPv4 and IPv6
      if (ipMatch) {
        ipToLookup = ipMatch[1];
      }
    }

    if (!ipToLookup) {
      return createCorsResponse(
        JSON.stringify({ error: 'No IP address provided or invalid format.' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        },
        request
      );
    }

    // Check Referer header to restrict direct API access
    const referer = request.headers.get('Referer');
    if (!referer || !referer.startsWith('https://ispinfo.io')) {
      return createCorsResponse(
        JSON.stringify({ error: 'Access denied: Invalid or missing Referer header.' }),
        {
          status: 403, // Forbidden
          headers: { 'Content-Type': 'application/json' }
        },
        request
      );
    }

    try {
      // Get data from ipregistry
      const ipInfoResult = await getIPInfo(ipToLookup, env.IPREGISTRY_API_KEY);

      // Check if the result has an error property
      if ('error' in ipInfoResult) {
        return createCorsResponse(
          JSON.stringify({ ip: ipToLookup, error: ipInfoResult.error }),
          { 
            status: 'status' in ipInfoResult ? ipInfoResult.status : 500,
            headers: { 'Content-Type': 'application/json' }
          },
          request
        );
      } else {
        // Return the successful response
        return createCorsResponse(
          JSON.stringify(ipInfoResult),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          },
          request
        );
      }
    } catch (error) {
      console.error('Error processing request:', error);
      return createCorsResponse(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        },
        request
      );
    }
  },
} satisfies ExportedHandler<Env>;
