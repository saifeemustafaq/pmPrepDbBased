export const GA_TRACKING_ID = 'G-SG0P7EWJTS';

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value?: number;
  // Additional GA parameters
  metric1?: number;
  metric2?: number;
  metric3?: number;
  metric4?: number;
  dimension1?: string;
  dimension2?: string;
  dimension3?: string;
  non_interaction?: boolean;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value, ...customParams }: GTagEvent) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    ...customParams
  });
}; 