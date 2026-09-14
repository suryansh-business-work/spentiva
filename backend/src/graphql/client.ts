/** Who is calling: the app sends X-App-* headers, nginx sets X-Real-IP / X-Forwarded-For */
export interface ClientInfo {
  ip: string | null;
  userAgent: string | null;
  appVersion: string | null;
  platform: string | null;
}

const clip = (v: string | null) => (v ? v.slice(0, 300) : null);

export function readClient(headers: Headers): ClientInfo {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return {
    ip: clip(headers.get('x-real-ip') ?? forwarded ?? null),
    userAgent: clip(headers.get('user-agent')),
    appVersion: clip(headers.get('x-app-version')),
    platform: clip(headers.get('x-app-platform')),
  };
}
