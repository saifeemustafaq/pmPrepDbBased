import * as gtag from './gtag';

// Session tracking
let sessionStartTime: number;
let lastActivityTime: number;
const questionViewTimes: { [questionId: string]: number } = {};
const categoryViewTimes: { [category: string]: number } = {};

export const initSession = () => {
  sessionStartTime = Date.now();
  lastActivityTime = Date.now();
  trackSessionStart();
};

export const trackSessionStart = () => {
  gtag.event({
    action: 'session_start',
    category: 'Session',
    label: new Date().toISOString(),
    value: 0
  });
};

export const trackSessionEnd = () => {
  const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000); // in seconds
  gtag.event({
    action: 'session_end',
    category: 'Session',
    label: new Date().toISOString(),
    value: sessionDuration
  });
};

// Question interaction tracking
export const startQuestionView = (questionId: string) => {
  questionViewTimes[questionId] = Date.now();
};

export const endQuestionView = (questionId: string, questionTitle: string, category: string) => {
  if (questionViewTimes[questionId]) {
    const viewDuration = Math.floor((Date.now() - questionViewTimes[questionId]) / 1000); // in seconds
    gtag.event({
      action: 'question_view_duration',
      category: 'Question Interaction',
      label: `${category} - ${questionTitle}`,
      value: viewDuration
    });
    delete questionViewTimes[questionId];
  }
};

// Category tracking
export const startCategoryView = (category: string) => {
  categoryViewTimes[category] = Date.now();
};

export const endCategoryView = (category: string) => {
  if (categoryViewTimes[category]) {
    const viewDuration = Math.floor((Date.now() - categoryViewTimes[category]) / 1000); // in seconds
    gtag.event({
      action: 'category_view_duration',
      category: 'Navigation',
      label: category,
      value: viewDuration
    });
    delete categoryViewTimes[category];
  }
};

// Question revisit tracking
const questionVisits: { [questionId: string]: number } = {};

export const trackQuestionRevisit = (questionId: string, questionTitle: string, category: string) => {
  questionVisits[questionId] = (questionVisits[questionId] || 0) + 1;
  gtag.event({
    action: 'question_revisit',
    category: 'Question Interaction',
    label: `${category} - ${questionTitle}`,
    value: questionVisits[questionId]
  });
};

// Error tracking
export const trackError = (errorType: string, errorMessage: string, componentName?: string) => {
  gtag.event({
    action: 'error',
    category: 'Error',
    label: `${errorType}${componentName ? ` - ${componentName}` : ''}: ${errorMessage}`,
    value: 1
  });
};

// Performance tracking
export const trackPageLoad = (duration: number) => {
  gtag.event({
    action: 'page_load',
    category: 'Performance',
    label: window.location.pathname,
    value: Math.floor(duration)
  });
};

// Device and viewport tracking
export const trackDeviceInfo = () => {
  const deviceInfo = {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    platform: navigator.platform,
    userAgent: navigator.userAgent
  };

  gtag.event({
    action: 'device_info',
    category: 'User Environment',
    label: JSON.stringify(deviceInfo),
    value: window.screen.width * window.screen.height
  });
};

// Feature usage tracking
export const trackFeatureUsage = (feature: string, action: string, value?: number) => {
  gtag.event({
    action: 'feature_usage',
    category: 'Feature',
    label: `${feature} - ${action}`,
    value: value || 1
  });
};

// Notes behavior tracking
let noteEditStartTime: number | null = null;

export const startNoteEdit = () => {
  noteEditStartTime = Date.now();
};

export const endNoteEdit = (questionId: string | 'overall', contentLength: number) => {
  if (noteEditStartTime) {
    const editDuration = Math.floor((Date.now() - noteEditStartTime) / 1000); // in seconds
    gtag.event({
      action: 'note_edit_duration',
      category: 'Notes',
      label: questionId === 'overall' ? 'Overall Notes' : `Question ${questionId}`,
      value: editDuration
    });

    gtag.event({
      action: 'note_length',
      category: 'Notes',
      label: questionId === 'overall' ? 'Overall Notes' : `Question ${questionId}`,
      value: contentLength
    });

    noteEditStartTime = null;
  }
};

// UI interaction tracking
export const trackUIInteraction = (component: string, action: string, value?: number) => {
  gtag.event({
    action: 'ui_interaction',
    category: 'UI',
    label: `${component} - ${action}`,
    value: value || 1
  });
}; 