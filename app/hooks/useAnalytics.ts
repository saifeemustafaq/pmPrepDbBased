import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import * as gtag from '../lib/gtag';

export const useAnalytics = () => {
  const pathname = usePathname();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };

    handleRouteChange(pathname);
  }, [pathname]);

  const trackEvent = (action: string, category: string, label: string, value?: number) => {
    gtag.event({ action, category, label, value });
  };

  return { trackEvent };
}; 