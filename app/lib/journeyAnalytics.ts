import * as gtag from './gtag';

// Category time tracking
export const trackCategoryTime = (category: string, timeSpent: number) => {
  gtag.event({
    action: 'category_time_spent',
    category: 'User Journey',
    label: category,
    value: Math.floor(timeSpent),
    view_duration_seconds: timeSpent,
    question_category: category,
    non_interaction: false
  });
};

// Learning path tracking
export const trackLearningPath = (
  questionId: string,
  category: string,
  timeSpent: number,
  completed: boolean
) => {
  gtag.event({
    action: 'learning_path_progress',
    category: 'User Journey',
    label: `${category}/${questionId}`,
    value: completed ? 1 : 0,
    view_duration_seconds: timeSpent,
    completion_status: completed,
    question_category: category,
    question_id: questionId,
    non_interaction: false
  });
};

// Study session tracking
export const trackStudySession = (
  sessionDuration: number,
  questionsAttempted: number,
  questionsCompleted: number,
  categories: string[]
) => {
  gtag.event({
    action: 'study_session',
    category: 'User Journey',
    label: `Completed: ${questionsCompleted}/${questionsAttempted}`,
    value: Math.floor(sessionDuration),
    session_duration: sessionDuration,
    interaction_count: questionsAttempted,
    completion_status: questionsCompleted > 0,
    question_category: categories.join(','),
    non_interaction: false
  });
};

// Question difficulty tracking
export const trackQuestionDifficulty = (
  questionId: string,
  timeSpent: number,
  attempts: number,
  completed: boolean
) => {
  gtag.event({
    action: 'question_difficulty',
    category: 'User Journey',
    label: `Q${questionId}/Attempts:${attempts}`,
    value: Math.floor(timeSpent),
    view_duration_seconds: timeSpent,
    interaction_count: attempts,
    completion_status: completed,
    question_id: questionId,
    non_interaction: false
  });
};

// Track completion rate
export const trackCompletionRate = (
  category: string,
  subCategory: string,
  completedCount: number,
  totalCount: number
) => {
  gtag.event({
    action: 'completion_rate',
    category: 'User Journey',
    label: `${category}/${subCategory}`,
    value: Math.floor((completedCount / totalCount) * 100),
    interaction_count: completedCount,
    question_category: category,
    completion_status: (completedCount / totalCount) > 0.5,
    non_interaction: true
  });
}; 