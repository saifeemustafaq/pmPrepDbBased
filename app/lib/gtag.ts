export const GA_TRACKING_ID = 'G-SG0P7EWJTS';

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value?: number;
  // Custom parameters for better analytics tracking
  question_category?: string;
  question_id?: string;
  view_duration_seconds?: number;
  interaction_count?: number;
  notes_type?: string;
  completion_status?: boolean;
  user_type?: string;
  session_duration?: number;
  feature_name?: string;
  navigation_section?: string;
  device_info?: string;
  error_type?: string;
  content_length?: number;
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