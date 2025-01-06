import * as gtag from './gtag';

// Session tracking
let sessionStartTime: number;
const questionViewTimes: { [questionId: string]: number } = {};
const categoryViewTimes: { [category: string]: number } = {};

export const initSession = () => {
  sessionStartTime = Date.now();
  trackSessionStart();
};

export const trackSessionStart = () => {
  gtag.event({
    action: 'session_start',
    category: 'Session',
    label: new Date().toISOString(),
    value: 0,
    user_type: 'new_session'
  });
};

export const trackSessionEnd = () => {
  const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000); // in seconds
  gtag.event({
    action: 'session_end',
    category: 'Session',
    label: new Date().toISOString(),
    value: sessionDuration,
    session_duration: sessionDuration
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
      value: viewDuration,
      question_id: questionId,
      question_category: category,
      view_duration_seconds: viewDuration
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
      value: viewDuration,
      navigation_section: category,
      view_duration_seconds: viewDuration
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
    value: questionVisits[questionId],
    question_id: questionId,
    question_category: category,
    interaction_count: questionVisits[questionId]
  });
};

// Error tracking
export const trackError = (errorType: string, errorMessage: string, componentName?: string) => {
  gtag.event({
    action: 'error',
    category: 'Error',
    label: `${errorType}${componentName ? ` - ${componentName}` : ''}: ${errorMessage}`,
    value: 1,
    error_type: errorType
  });
};

// Performance tracking
export const trackPageLoad = (duration: number) => {
  gtag.event({
    action: 'page_load',
    category: 'Performance',
    label: window.location.pathname,
    value: Math.floor(duration),
    view_duration_seconds: Math.floor(duration)
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
    value: window.screen.width * window.screen.height,
    device_info: JSON.stringify(deviceInfo)
  });
};

// Feature usage tracking
export const trackFeatureUsage = (feature: string, action: string, value?: number) => {
  gtag.event({
    action: 'feature_usage',
    category: 'Feature',
    label: `${feature} - ${action}`,
    value: value || 1,
    feature_name: feature
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
      value: editDuration,
      notes_type: questionId === 'overall' ? 'overall' : 'question',
      question_id: questionId === 'overall' ? undefined : questionId,
      view_duration_seconds: editDuration,
      content_length: contentLength
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
    value: value || 1,
    navigation_section: component,
    interaction_count: value || 1
  });
};

// Question expansion tracking
export const trackQuestionExpansion = (questionId: string, questionTitle: string, category: string) => {
  gtag.event({
    action: 'question_expansion',
    category: 'Question Interaction',
    label: `${category} - ${questionTitle}`,
    value: 1,
    question_id: questionId,
    question_category: category,
    interaction_count: 1
  });
};

// Sidebar section tracking
export const trackSidebarSectionClick = (section: string) => {
  gtag.event({
    action: 'sidebar_section_click',
    category: 'Navigation',
    label: section,
    value: 1,
    navigation_section: section,
    interaction_count: 1
  });
};

// Notes usage tracking
export const trackNotesUsage = (type: 'overall' | 'question', questionId?: string) => {
  gtag.event({
    action: 'notes_usage',
    category: 'Notes',
    label: type === 'overall' ? 'Overall Notes' : `Question ${questionId} Notes`,
    value: 1,
    notes_type: type,
    question_id: questionId,
    interaction_count: 1
  });
};

// Return visit tracking
export const trackReturnVisit = () => {
  const lastVisit = localStorage.getItem('lastVisit');
  const currentTime = new Date().toISOString();
  
  if (lastVisit) {
    gtag.event({
      action: 'return_visit',
      category: 'User Retention',
      label: `Last visit: ${lastVisit}`,
      value: 1,
      user_type: 'returning',
      interaction_count: 1
    });
  }
  
  localStorage.setItem('lastVisit', currentTime);
};

// Question completion tracking
export const trackQuestionCompletion = (
  questionId: string,
  questionTitle: string,
  category: string,
  isCompleted: boolean
) => {
  gtag.event({
    action: 'question_completion',
    category: 'Question Interaction',
    label: `${category} - ${questionTitle} (${isCompleted ? 'completed' : 'uncompleted'})`,
    value: isCompleted ? 1 : 0,
    question_id: questionId,
    question_category: category,
    completion_status: isCompleted
  });
}; 