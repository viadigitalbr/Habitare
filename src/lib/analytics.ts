type AnalyticsWindow = Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[]; habitareAnalyticsAllowed?: boolean };
export function trackBook(event: string, parameters: Record<string, string | number> = {}) {
  const analytics = window as AnalyticsWindow;
  if (!analytics.habitareAnalyticsAllowed || typeof analytics.gtag !== 'function') return;
  analytics.gtag('event', event, { ...parameters, page_location: location.origin + location.pathname });
}
