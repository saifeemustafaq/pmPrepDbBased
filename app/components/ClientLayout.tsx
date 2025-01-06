'use client';

import { Poppins } from "next/font/google";
import Script from 'next/script';
import { GA_TRACKING_ID } from '../lib/gtag';
import { useEffect } from 'react';
import * as analytics from '../lib/analytics';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Initialize session tracking
    analytics.initSession();
    analytics.trackReturnVisit();

    const handleBeforeUnload = () => {
      analytics.trackSessionEnd();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      analytics.trackSessionEnd();
    };
  }, []);

  return (
    <html lang="en" className={`${poppins.variable} font-poppins antialiased`}>
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
} 