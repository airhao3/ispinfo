import { getAssetFromKV, NotFoundError } from '@cloudflare/kv-asset-handler';

// This file is required for Cloudflare Pages to work with SPA routing
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const request = event.request;
  const url = new URL(request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    // Forward API requests to the backend
    const backendUrl = new URL('https://ispinfo-backend-production.airhao3.workers.dev' + url.pathname.replace(/^\/api/, ''));
    backendUrl.search = url.search;
    
    const newRequest = new Request(backendUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    });
    
    return fetch(newRequest);
  }
  
  // For all other requests, serve the static files
  try {
    return await getAssetFromKV(event);
  } catch (e) {
    if (e instanceof NotFoundError) {
      // If the asset is not found, try to serve index.html for SPA routing
      return await getAssetFromKV(event, { mapRequestToAsset: (req) => new Request(new URL('/', req.url), req) });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}

