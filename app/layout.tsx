'use client';

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import { GA_TRACKING_ID } from './lib/gtag';
import { useEffect } from 'react';
import * as analytics from './lib/analytics';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "PM Interview Prep",
  description: "Practice platform for PM interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Initialize session tracking
    analytics.initSession();
    
    // Track device info
    analytics.trackDeviceInfo();

    // Track page load performance
    const pageLoadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    analytics.trackPageLoad(pageLoadTime);

    // Handle session end
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
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable} font-poppins antialiased`}>
        {children}
      </body>
    </html>
  );
}
