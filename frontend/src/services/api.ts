// 生产环境API地址，所有请求均指向 https://api.ispinfo.io
const API_BASE_URL = 'https://api.ispinfo.io';

console.log('Environment Variables:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD
});

console.log('API Base URL:', API_BASE_URL);  // 调试日志

export interface IPInfo {
  [key: string]: any; // 允许所有字段，以匹配 ipregistry 的完整响应
}

// 获取IP信息
async function fetchIPInfo(ip: string = ''): Promise<IPInfo> {
  // 如果 ip 为空，请求 /ip 路径获取当前 IP 信息
  // 否则请求 /{ip} 路径查询指定 IP 信息
  const endpoint = ip ? `/${ip}` : '/ip';
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log('Fetching URL:', fullUrl);
  
  let response;
  try {
    response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache'
    });
  } catch (error: unknown) {
    console.error('Fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Network error: ${errorMessage}`);
  }
  
  console.log('Response status:', response.status);
  
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { error: await response.text() };
    }
    console.error('API Error:', response.status, errorData);
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  let data = await response.json();
  console.log('Response data:', data);
  
  return data; // 直接返回完整数据
}

// 查询指定IP的信息
export async function lookupIP(ip: string = ''): Promise<IPInfo> {
  return fetchIPInfo(ip);
}

// 获取客户端IP
export async function getClientIP(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/ip`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch client IP');
  }
  const data = await response.json();
  return data.ip;
}

// 获取当前IP的完整信息
export const getMyIP = async (): Promise<IPInfo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ip`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    });
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: await response.text() };
      }
      console.error('Error fetching client IP:', response.status, errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data; // 直接返回完整数据
  } catch (error) {
    console.error('Error fetching IP information:', error);
    // Return a basic response with just the error
    return {
      ip: 'unknown',
      error: 'Failed to fetch IP information',
      details: error instanceof Error ? error.message : String(error)
    };
  }
};
