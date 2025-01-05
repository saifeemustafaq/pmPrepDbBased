export interface QuestionProgress {
  [questionId: string]: boolean;
}

const STORAGE_KEY = 'pm-prep-progress';

export function getProgress(): QuestionProgress {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading progress from localStorage:', error);
    return {};
  }
}

export function setQuestionProgress(questionId: string, isCompleted: boolean) {
  if (typeof window === 'undefined') return;
  
  try {
    const currentProgress = getProgress();
    const newProgress = {
      ...currentProgress,
      [questionId]: isCompleted
    };
    
    // Remove question from progress if not completed
    if (!isCompleted) {
      delete newProgress[questionId];
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    return newProgress;
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
    return null;
  }
}

export function calculateProgress(questionIds: string[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  const progress = getProgress();
  const completed = questionIds.filter(id => progress[id]).length;
  const total = questionIds.length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  return {
    completed,
    total,
    percentage: Math.max(0, Math.min(100, percentage))
  };
} 