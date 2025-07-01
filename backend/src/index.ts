/// <reference types="@cloudflare/workers-types" />

declare const process: {
  env: {
    NODE_ENV?: 'development' | 'production';
  };
};

import { getAssetFromKV, NotFoundError } from '@cloudflare/kv-asset-handler';

// Helper function to convert IP to number
function ipToNumber(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;

  const nums = parts.map(Number);
  if (nums.some(n => isNaN(n) || n < 0 || n > 255)) return null;

  return (nums[0] << 24) | (nums[1] << 16) | (nums[2] << 8) | nums[3];
}

// Helper function to get ASN info
async function getASNInfo(ip: string, env: Env) {
  try {
    // Skip IPv6 for now as our database only supports IPv4
    if (ip.includes(':')) {
      console.log('Skipping ASN lookup for IPv6:', ip);
      return { 
        autonomous_system_number: undefined, 
        autonomous_system_organization: 'IPv6 not supported in this version' 
      };
    }

    // Check if database is available
    if (!env) {
      console.error('Environment not available');
      return {
        autonomous_system_number: undefined,
        autonomous_system_organization: 'Service configuration error: Environment not available'
      };
    }
    
    if (!env.DB) {
      console.error('Database not bound in environment. Available bindings:', Object.keys(env));
      return {
        autonomous_system_number: undefined,
        autonomous_system_organization: 'Service configuration error: Database not available'
      };
    }

    const ipNum = ipToNumber(ip);
    if (!ipNum) {
      console.log('Invalid IP format for ASN lookup:', ip);
      return null;
    }

    console.log('Looking up ASN for IP:', ip, 'Number:', ipNum);
    try {
      console.log('Preparing ASN query for IP number:', ipNum);
      const query = 'SELECT asn, as_organization FROM asn_blocks WHERE start_ip_num <= ? AND end_ip_num >= ? LIMIT 1';
      console.log('SQL Query:', query);
      
      const stmt = env.DB.prepare(query);
      const bound = stmt.bind(ipNum, ipNum);
      console.log('Bound parameters:', ipNum, ipNum);
      
      const result = await bound.first<ASNResult>();
      console.log('Raw ASN lookup result:', result);
      
      // Check if any rows were returned
      if (result) {
        console.log('ASN record found:', {
          asn: result.asn,
          as_organization: result.as_organization,
          typeOfASN: typeof result.asn,
          typeOfOrg: typeof result.as_organization
        });
        
        // Map the result to match the expected interface
        return {
          autonomous_system_number: result.asn,
          autonomous_system_organization: result.as_organization
        };
      } else {
        console.log('No ASN record found for IP number:', ipNum);
      }
      return null;
    } catch (error) {
      console.error('Error in ASN lookup:', error);
      return null;
    }
  } catch (error) {
    console.error('Error in getASNInfo:', error);
    return null;
  }
}

// Helper function to get location info
async function getLocationInfo(ip: string, env: Env): Promise<LocationInfo | null> {
  try {
    // Skip IPv6 for now as our database only supports IPv4
    if (ip.includes(':')) {
      console.log('Skipping location lookup for IPv6:', ip);
      return {
        city: 'IPv6 not supported',
        region: 'IPv6 not supported',
        country: 'IPv6 not supported in this version'
      };
    }

    // Check if database is available
    if (!env) {
      console.error('Environment not available');
      return {
        city: 'Service error',
        region: 'Service error',
        country: 'Service configuration error: Environment not available'
      };
    }
    
    if (!env.DB) {
      console.error('Database not bound in environment. Available bindings:', Object.keys(env));
      return {
        city: 'Service error',
        region: 'Service error',
        country: 'Service configuration error: Database not available',
        city_name: 'Service error',
        region_name: 'Service error',
        country_name: 'Service configuration error: Database not available',
        continent_name: 'Service error'
      };
    }

    const ipNum = ipToNumber(ip);
    if (!ipNum) {
      console.log('Invalid IP format for location lookup:', ip);
      return null;
    }

    console.log('Looking up location for IP:', ip, 'Number:', ipNum);
    
    try {
      // First get the city block info
      const blockStmt = env.DB.prepare(
        'SELECT geoname_id, latitude, longitude, postal_code as postal FROM city_blocks WHERE start_ip_num <= ? AND end_ip_num >= ? LIMIT 1'
      );
      const block = await blockStmt.bind(ipNum, ipNum).first<CityBlockResult>();
      console.log('Location block result:', block);

      if (!block?.geoname_id) {
        console.log('No location block found for IP:', ip);
        return null;
      }

      // Then get the location details
      const locStmt = env.DB.prepare(
        'SELECT city_name, country_name, region_name, continent_name FROM city_locations WHERE geoname_id = ? LIMIT 1'
      );
      const location = await locStmt.bind(block.geoname_id).first<LocationDetailsResult>();
      console.log('Location details result:', location);

      if (!location) {
        console.log('No location details found for geoname_id:', block.geoname_id);
        return {
          city: 'Unknown',
          region: 'Unknown',
          country: 'Unknown',
          latitude: block.latitude,
          longitude: block.longitude,
          postal: block.postal
        };
      }

      // Combine the results with proper field names
      const locationData: LocationInfo = {
        city: location.city_name || 'Unknown',
        region: location.region_name || 'Unknown',
        country: location.country_name || 'Unknown',
        city_name: location.city_name,
        region_name: location.region_name,
        country_name: location.country_name,
        continent_name: location.continent_name,
        latitude: block.latitude,
        longitude: block.longitude,
        postal: block.postal,
        geoname_id: block.geoname_id
      };
      
      return locationData;
    } catch (error) {
      console.error('Error in location lookup:', error);
      return null;
    }
  } catch (error) {
    console.error('Error in getLocationInfo:', error);
    return null;
  }
}

// Define the Env interface
interface ASNResult {
  asn?: number;
  as_organization?: string;
}

interface CityBlockResult {
  geoname_id?: number;
  latitude?: number;
  longitude?: number;
  postal?: string;
}

interface LocationDetailsResult {
  city_name?: string;
  country_name?: string;
  region_name?: string;
  continent_name?: string;
}

interface LocationInfo {
  city: string;
  city_name?: string;
  region: string;
  region_name?: string;
  country: string;
  country_name?: string;
  continent_name?: string;
  latitude?: number;
  longitude?: number;
  postal?: string;
  geoname_id?: number;
}

interface Env {
  DB: D1Database;
  ASSETS: {
    get(key: string): Promise<string | null>;
  };
  __STATIC_CONTENT: KVNamespace;
  __STATIC_CONTENT_MANIFEST: string;
}

// Helper function to add CORS headers to response
function addCorsHeaders(response: Response, request: Request): Response {
  // Clone the response so we can modify the headers
  const newResponse = new Response(response.body, response);

  // Add CORS headers
  const origin = request.headers.get('Origin') || '*';
  newResponse.headers.set('Access-Control-Allow-Origin', origin);
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 
    request.headers.get('Access-Control-Request-Headers') || 'Content-Type');
  newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
  newResponse.headers.set('Vary', 'Origin');

  // Ensure we have content type
  if (!newResponse.headers.has('Content-Type')) {
    newResponse.headers.set('Content-Type', 'application/json');
  }

  return newResponse;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      const origin = request.headers.get('Origin') || '*';
      const corsHeaders = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
      };
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    let response: Response;

    try {
      // Handle root path and /ip path (client's own IP)
      if (path === '/' || path === '/ip') {
        const clientIP = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
        console.log('Processing request for IP:', clientIP);
        // Log headers manually to avoid TypeScript errors
        const headers: Record<string, string> = {};
        request.headers.forEach((value, key) => {
          headers[key] = value;
        });
        console.log('Request headers:', headers);
        
        try {
          const [asnInfo, locationInfo] = await Promise.all([
            getASNInfo(clientIP, env),
            getLocationInfo(clientIP, env)
          ]);
          
          console.log('ASN Info:', asnInfo);
          console.log('Location Info:', locationInfo);
          
          const responseData: any = { ip: clientIP };
          
          if (asnInfo) {
            responseData.asn = asnInfo.autonomous_system_number;
            responseData.organization = asnInfo.autonomous_system_organization;
          }
          
          if (locationInfo) {
            responseData.city = locationInfo.city_name;
            responseData.region = locationInfo.region_name;
            responseData.country = locationInfo.country_name;
            responseData.latitude = locationInfo.latitude;
            responseData.longitude = locationInfo.longitude;
          }
          
          // If we have at least some data, return 200
          if (asnInfo || locationInfo) {
            response = new Response(JSON.stringify(responseData), {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
                'Access-Control-Allow-Credentials': 'true',
                'Vary': 'Origin',
              }
            });
          } else {
            // If no data found, return 200 with limited info
            response = new Response(JSON.stringify({
              ip: clientIP,
              message: 'No detailed information available for this IP',
              note: 'This IP may be using IPv6 or not be in our database'
            }), {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
                'Access-Control-Allow-Credentials': 'true',
                'Vary': 'Origin',
              }
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Error processing IP info:', errorMessage);
          response = new Response(JSON.stringify({
            ip: clientIP,
            error: 'Error processing request',
            details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
          }), { 
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
              'Access-Control-Allow-Credentials': 'true',
              'Vary': 'Origin',
            }
          });
        }
      }
      // Handle /{ip} path (IP lookup)
      else {
        const ip_regex = /^\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/;
        const match = path.match(ip_regex);

        if (match) {
          const ip = match[1];
          const ip_num = ipToNumber(ip);

          if (!ip || !ip_num) {
            const responseData = {
              ip,
              error: 'Invalid IP address format',
            };
            response = new Response(JSON.stringify(responseData), { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            try {
              const [asnInfo, locationInfo] = await Promise.all([
                getASNInfo(ip, env),
                getLocationInfo(ip, env)
              ]);

              const responseData = {
                ip,
                asn: asnInfo?.autonomous_system_number,
                organization: asnInfo?.autonomous_system_organization,
                city: locationInfo?.city_name || '',
                region: locationInfo?.region_name || '',
                country: locationInfo?.country_name || '',
                latitude: locationInfo?.latitude || 0,
                longitude: locationInfo?.longitude || 0,
                postal: locationInfo?.postal || ''
              };
              
              console.log('Sending response:', responseData);
              
              // Return a single response
              return new Response(JSON.stringify(responseData, null, 2), {
                headers: { 
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET, OPTIONS',
                  'Access-Control-Allow-Headers': 'Content-Type',
                  'Cache-Control': 'no-cache'
                },
              });
            } catch (error) {
              const dbError = error as Error;
              console.error('Database error:', dbError);
              const errorMessage = process.env.NODE_ENV === 'development' 
                ? dbError.message 
                : 'Error querying database';
                
              response = new Response(
                JSON.stringify({ 
                  ip,
                  error: 'Database Error',
                  message: errorMessage
                }), 
                { 
                  status: 500,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            }
          }
        } else {
          // For non-IP paths, return a 404 with JSON response
          response = new Response(
            JSON.stringify({ 
              error: 'Not Found',
              message: 'The requested resource was not found',
              path: path
            }), 
            { 
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      }

      // Add CORS headers to all responses
      return addCorsHeaders(response, request);

    } catch (error) {
      const err = error as Error;
      console.error('Error handling request:', err);
      const errorMessage = process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'An unexpected error occurred';
        
      const errorResponse = new Response(
        JSON.stringify({ 
          error: 'Internal Server Error',
          message: errorMessage
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return addCorsHeaders(errorResponse, request);
    }
  },
} satisfies ExportedHandler<Env>;
