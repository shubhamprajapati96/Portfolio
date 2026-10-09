export interface ClientInfo {
  ipAddress: string;
  country: string;
  city: string;
  region: string;
  timezone: string;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  platform: string;
}

export function extractClientInfo(req: any, bodyOverride?: Partial<ClientInfo>): ClientInfo {
  const headers = req?.headers || {};

  // Extract IP
  const rawIp =
    (headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    (headers['x-real-ip'] as string) ||
    (headers['cf-connecting-ip'] as string) ||
    req?.ip ||
    req?.socket?.remoteAddress ||
    '127.0.0.1';

  // Normalize IPv6 localhost
  const ipAddress = rawIp === '::1' || rawIp === '::ffff:127.0.0.1' ? '127.0.0.1' : rawIp;

  // Extract Geolocation (Vercel / Cloudflare provide automated geo headers)
  const country =
    bodyOverride?.country ||
    (headers['x-vercel-ip-country'] as string) ||
    (headers['cf-ipcountry'] as string) ||
    'Unknown Country';

  const city =
    bodyOverride?.city ||
    (headers['x-vercel-ip-city'] as string) ||
    'Unknown City';

  const region =
    bodyOverride?.region ||
    (headers['x-vercel-ip-country-region'] as string) ||
    'Unknown Region';

  const timezone =
    bodyOverride?.timezone ||
    (headers['x-vercel-ip-timezone'] as string) ||
    'UTC';

  // Extract User-Agent
  const userAgent = (headers['user-agent'] as string) || bodyOverride?.userAgent || 'Unknown';

  // Parse Browser & OS
  const { browser, os, deviceType, platform } = parseUserAgent(userAgent);

  return {
    ipAddress,
    country,
    city,
    region,
    timezone,
    userAgent,
    browser: bodyOverride?.browser || browser,
    os: bodyOverride?.os || os,
    deviceType: bodyOverride?.deviceType || deviceType,
    platform: bodyOverride?.platform || platform
  };
}

function parseUserAgent(ua: string): {
  browser: string;
  os: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  platform: string;
} {
  const lower = ua.toLowerCase();

  // OS
  let os = 'Unknown OS';
  let platform = 'Unknown';
  if (lower.includes('android')) {
    os = 'Android';
    platform = 'Android';
  } else if (lower.includes('iphone') || lower.includes('ipad') || lower.includes('ipod')) {
    os = 'iOS';
    platform = 'iOS';
  } else if (lower.includes('macintosh') || lower.includes('mac os')) {
    os = 'macOS';
    platform = 'Mac';
  } else if (lower.includes('windows')) {
    os = 'Windows';
    platform = 'PC';
  } else if (lower.includes('linux')) {
    os = 'Linux';
    platform = 'Linux';
  }

  // Device Type
  let deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown' = 'desktop';
  if (lower.includes('tablet') || lower.includes('ipad')) {
    deviceType = 'tablet';
  } else if (
    lower.includes('mobile') ||
    lower.includes('android') ||
    lower.includes('iphone') ||
    lower.includes('ipod')
  ) {
    deviceType = 'mobile';
  }

  // Browser
  let browser = 'Unknown Browser';
  if (lower.includes('chrome') && !lower.includes('edg') && !lower.includes('opr')) {
    browser = 'Chrome';
  } else if (lower.includes('safari') && !lower.includes('chrome')) {
    browser = 'Safari';
  } else if (lower.includes('firefox')) {
    browser = 'Firefox';
  } else if (lower.includes('edg')) {
    browser = 'Edge';
  } else if (lower.includes('opr') || lower.includes('opera')) {
    browser = 'Opera';
  } else if (lower.includes('capacitor') || lower.includes('webview')) {
    browser = 'Capacitor Android Webview';
  }

  return { browser, os, deviceType, platform };
}
