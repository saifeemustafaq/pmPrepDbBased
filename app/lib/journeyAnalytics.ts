import * as gtag from './gtag';

// Category time tracking
export const trackCategoryTime = (category: string, timeSpent: number) => {
  gtag.event({
    action: 'category_time_spent',
    category: 'User Journey',
    label: category,
    value: Math.floor(timeSpent),
    // Additional GA parameters for better analysis
    metric1: timeSpent,
    dimension1: category,
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
    // Additional GA parameters
    metric1: timeSpent,
    metric2: completed ? 1 : 0,
    dimension1: category,
    dimension2: questionId,
    dimension3: 'completion_status_' + (completed ? 'complete' : 'incomplete'),
    non_interaction: false
  });
};

// Study session patterns
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
    // Additional GA parameters
    metric1: sessionDuration,
    metric2: questionsAttempted,
    metric3: questionsCompleted,
    metric4: questionsCompleted / questionsAttempted, // completion rate
    dimension1: categories.join(','),
    dimension2: 'session_productivity_' + (questionsCompleted / questionsAttempted > 0.5 ? 'high' : 'low'),
    non_interaction: false
  });
};

// Question difficulty correlation
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
    // Additional GA parameters
    metric1: timeSpent,
    metric2: attempts,
    metric3: completed ? 1 : 0,
    dimension1: questionId,
    dimension2: 'difficulty_' + (timeSpent > 300 ? 'hard' : timeSpent > 120 ? 'medium' : 'easy'),
    dimension3: 'attempts_' + (attempts > 3 ? 'many' : attempts > 1 ? 'few' : 'single'),
    non_interaction: false
  });
};

// Track question completion rate
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
    // Additional GA parameters
    metric1: completedCount,
    metric2: totalCount,
    metric3: (completedCount / totalCount) * 100,
    dimension1: category,
    dimension2: subCategory,
    dimension3: 'progress_' + (completedCount / totalCount > 0.7 ? 'high' : completedCount / totalCount > 0.3 ? 'medium' : 'low'),
    non_interaction: true
  });
}; 