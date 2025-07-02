/// <reference types="@cloudflare/workers-types" />

import { ApiError, ApiResponse, ClientError, IpInfo, IpregistryClient } from '@ipregistry/client';

// Define the environment interface
interface Env {
  IPREGISTRY_API_KEY: string;
}

// Declare a client variable in global scope to reuse the instance and its cache
let ipregistryClient: IpregistryClient | null = null;

// Helper function to get IP info from ipregistry
async function getIPInfo(ip: string, apiKey: string) {
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

    // Map the response to our desired format
    // This mapping should be consistent with what the gateway worker expects
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
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': 'https://ispinfo.io',
          'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
          'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || '',
          'Access-Control-Max-Age': '86400',
        },
      });
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

    let response: Response;

    if (!ipToLookup) {
      response = new Response(JSON.stringify({ error: 'No IP address provided or invalid format.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Get data from ipregistry
      const ipInfoResult = await getIPInfo(ipToLookup, env.IPREGISTRY_API_KEY);

      // Handle errors from the API call
      if ('error' in ipInfoResult) {
        response = new Response(JSON.stringify({ ip: ipToLookup, error: ipInfoResult.error }), {
          status: ipInfoResult.status || 500,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        // Send the successful response
        response = new Response(JSON.stringify(ipInfoResult, null, 2), {
          headers: {
            'Content-Type': 'application/json',
          }
        });
      }
    }

    // Add CORS headers to all responses
    response.headers.set('Access-Control-Allow-Origin', 'https://ispinfo.io');
    response.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
    response.headers.set('Access-Control-Max-Age', '86400');

    return response;
  },
} satisfies ExportedHandler<Env>;
