// 使用环境变量配置API基础URL，如果未设置则使用默认值
const API_BASE_URL = 'https://ispinfo-backend-production.airhao3.workers.dev';

console.log('Environment Variables:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD
});

console.log('API Base URL:', API_BASE_URL);  // 调试日志

export interface IPInfo {
  ip: string;
  hostname?: string;
  city?: string;
  region?: string;
  region_name?: string;
  country?: string;
  country_name?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  autonomous_system_number?: number;
  autonomous_system_organization?: string;
  note?: string;
  [key: string]: any; // 允许其他字段
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
    let errorText;
    try {
      const errorData = await response.json();
      errorText = errorData.error || errorData.message || response.statusText;
      // If we have a 404 but got some basic IP info, return that instead of error
      if (response.status === 404 && errorData.ip) {
        return errorData as IPInfo;
      }
    } catch (e) {
      errorText = await response.text();
    }
    console.error('API Error:', response.status, errorText);
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }
  
  let data;
  try {
    data = await response.json();
    console.log('Response data:', data);
    
    // 检查是否有错误信息
    if (data.error) {
      throw new Error(data.error);
    }
    
    // 确保返回的数据包含必需的 ip 字段
    if (!data.ip) {
      throw new Error('Invalid response: missing IP address');
    }
    
    // 构建标准的 IPInfo 对象
    const ipInfo: IPInfo = {
      ip: data.ip || '',
      city: data.city,
      region: data.region_name || data.region,
      country: data.country_name || data.country,
      loc: data.loc || (data.latitude && data.longitude ? `${data.latitude},${data.longitude}` : undefined),
      org: data.org || data.autonomous_system_organization,
      postal: data.postal,
      timezone: data.timezone,
      latitude: data.latitude,
      longitude: data.longitude,
      autonomous_system_number: data.autonomous_system_number,
      autonomous_system_organization: data.autonomous_system_organization,
      hostname: data.hostname,
      // 添加其他可能需要的字段
      ...data // 保留其他字段
    };
    
    return ipInfo;
  } catch (e) {
    // 如果不是JSON，返回纯文本IP
    return { ip: data.trim() };
  }
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
      let errorMessage = `Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse the error as JSON, use the status text
      }
      console.error('Error fetching client IP:', errorMessage);
      return {
        ip: 'Unknown',
        error: errorMessage,
        note: 'This may be because the IP is IPv6 or not in our database'
      };
    }
    
    const data = await response.json();
    
    // If we only have an IP and no other info, that's fine - return what we have
    if (data.ip && Object.keys(data).length === 1) {
      return {
        ip: data.ip,
        message: 'No additional information available for this IP address',
        note: 'This may be because the IP is IPv6 or not in our database'
      };
    }
    return data;
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
