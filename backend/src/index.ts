/// <reference types="@cloudflare/workers-types" />

import { ApiError, ApiResponse, ClientError, IpInfo, IpregistryClient } from '@ipregistry/client';

// Interface for Turnstile verification response
interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

// Define the environment interface
interface Env {
  IPREGISTRY_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  ENVIRONMENT?: 'development' | 'production';
}

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://ispinfo.io',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
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

// Helper function to verify Turnstile token
async function verifyTurnstileToken(token: string, secretKey: string, ip: string): Promise<{ success: boolean; error?: string }> {
  console.log('Verifying Turnstile token...');
  console.log('Token exists:', !!token);
  
  if (!token) {
    console.log('No token provided');
    return { success: false, error: 'No token provided' };
  }
  
  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);
  formData.append('remoteip', ip);

  try {
    console.log('Sending verification request to Turnstile...');
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });
    
    const data: TurnstileResponse = await response.json();
    console.log('Turnstile response:', JSON.stringify(data));
    
    if (!data.success) {
      console.log('Turnstile verification failed with errors:', data['error-codes']);
      return { 
        success: false, 
        error: `Turnstile verification failed: ${data['error-codes']?.join(', ') || 'Unknown error'}`
      };
    }
    
    console.log('Turnstile verification successful');
    return { success: true };
  } catch (error: any) {
    console.error('Error verifying Turnstile token:', error);
    return { 
      success: false, 
      error: `Error during verification: ${error?.message || 'Unknown error'}` 
    };
  }
}

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

    // 验证 Origin 头
    const origin = request.headers.get('Origin');
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Not allowed', { status: 403 });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    let ipToLookup: string | null = null;

    // 获取客户端 IP 地址
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                    request.headers.get('X-Forwarded-For')?.split(',')[0] || 
                    '8.8.8.8'; // 默认使用 Google DNS 作为回退

    if (path === '/' || path === '/ip') {
      // 根路径或 /ip 路径返回客户端 IP 信息
      ipToLookup = clientIP;
    } else {
      // 处理 /{ip} 格式的路径
      const ipMatch = path.match(/^\/([a-fA-F0-9.:]+)$/); // 匹配 IPv4 和 IPv6
      if (ipMatch) {
        ipToLookup = ipMatch[1];
      }
    }

    if (!ipToLookup) {
      return createCorsResponse(
        JSON.stringify({ 
          error: 'No IP address provided or invalid format.',
          usage: {
            'Get your IP info': 'GET / or GET /ip',
            'Lookup specific IP': 'GET /8.8.8.8',
            'CORS enabled': 'Yes',
            'API documentation': 'https://ipregistry.co/docs/'
          }
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        },
        request
      );
    }

    // 在开发环境中跳过 Turnstile 验证
    const isDevelopment = env.ENVIRONMENT === 'development';
    
    if (!isDevelopment) {
      // 在生产环境中验证 Turnstile token
      const turnstileToken = request.headers.get('CF-Turnstile-Token');
      const clientIP = request.headers.get('CF-Connecting-IP') || '';
      
      // 只对特定的 IP 查询进行验证 (例如 /8.8.8.8)
      const isSpecificIpLookup = /^\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(path);
      
      if (isSpecificIpLookup) {
        if (!turnstileToken) {
          return createCorsResponse(
            JSON.stringify({ error: 'Turnstile token is required for IP lookups.' }),
            {
              status: 400, // Bad Request
              headers: { 'Content-Type': 'application/json' }
            },
            request
          );
        }
        
        const verification = await verifyTurnstileToken(turnstileToken, env.TURNSTILE_SECRET_KEY, clientIP);
              
        if (!verification.success) {
          console.log('Turnstile verification failed:', verification.error);
          return createCorsResponse(
            JSON.stringify({ 
              error: 'Access denied: Invalid Turnstile token.',
              details: verification.error
            }),
            {
              status: 403, // Forbidden
              headers: { 'Content-Type': 'application/json' }
            },
            request
          );
        }
      }
    } else {
      console.log('Running in development mode, skipping Turnstile verification');
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
