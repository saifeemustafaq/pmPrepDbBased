'use client';

import { useState, useEffect, useCallback } from 'react';
import { Category, Question, ApiResponse } from './types';
import { Sidebar } from './components/Sidebar';
import { QuestionList } from './components/QuestionList';
import { getProgress, setQuestionProgress } from './lib/progress';
import { useAnalytics } from './hooks/useAnalytics';
import { useOverallNotes } from './hooks/useOverallNotes';
import OverallNotes from './components/OverallNotes';
import { ErrorBoundary } from './components/ErrorBoundary';
import * as analytics from './lib/analytics';

const CATEGORIES = [
  {
    name: "Behavioral",
    subCategories: [
      "Achievement & Success",
      "Challenges & Problem-Solving",
      "Interpersonal & Collaboration"
    ]
  },
  {
    name: "Product Design",
    subCategories: [
      "Product Analysis",
      "New Product Design",
      "Product Improvement"
    ]
  },
  {
    name: "Strategy",
    subCategories: [
      "Market Entry & Expansion",
      "Future Planning & Growth"
    ]
  },
  {
    name: "Execution",
    subCategories: [
      "Metrics & Analysis",
      "Root Cause Analysis"
    ]
  },
  {
    name: "Estimation",
    subCategories: [
      "Market Size & Scale"
    ]
  }
];

export default function Home() {
  const { trackEvent } = useAnalytics();
  const { isExpanded, toggleExpanded } = useOverallNotes();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const fetchQuestions = useCallback(async () => {
    try {
      const startTime = performance.now();
      console.log('Fetching questions...');
      const response = await fetch('/api/questions');
      const data: ApiResponse<Question[]> = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch questions');
      }

      // Track API performance
      const endTime = performance.now();
      analytics.trackFeatureUsage('api', 'fetch_questions', endTime - startTime);

      const progress = getProgress();
      // Use either data.questions or data.data, falling back to an empty array
      const questions = data.questions || data.data || [];
      console.log('Processed questions:', questions);

      const processedCategories = CATEGORIES.map(category => {
        const categoryQuestions = questions.filter((q: Question) => q.category === category.name);
        console.log(`Questions for category ${category.name}:`, categoryQuestions);
        const subCategories = category.subCategories.map(subName => {
          const questions = categoryQuestions
            .filter((q: Question) => q.subCategory === subName)
            .map((q: Question) => ({
              ...q,
              isCompleted: progress[q._id] || false
            }));

          return {
            name: subName,
            questions,
            completedQuestions: questions.filter((q: Question) => q.isCompleted).length,
            totalQuestions: questions.length
          };
        });

        return {
          name: category.name,
          subCategories,
          completedQuestions: subCategories.reduce((acc, sub) => acc + sub.completedQuestions, 0),
          totalQuestions: subCategories.reduce((acc, sub) => acc + sub.totalQuestions, 0)
        };
      });

      setCategories(processedCategories);
      if (!selectedCategory && processedCategories.length > 0) {
        setSelectedCategory(processedCategories[0].name);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      analytics.trackError(
        'API Error',
        error instanceof Error ? error.message : 'Unknown error fetching questions',
        'QuestionsFetch'
      );
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleToggleQuestion = (questionId: string) => {
    // Find current question state
    const currentQuestion = categories
      .flatMap(cat => cat.subCategories)
      .flatMap(sub => sub.questions)
      .find(q => q._id === questionId);

    if (!currentQuestion) return;

    // Update the completion state
    const newIsCompleted = !currentQuestion.isCompleted;
    
    // Update local storage
    setQuestionProgress(questionId, newIsCompleted);
    
    // Update the UI state
    const updatedCategories = categories.map(category => {
      let categoryCompletedCount = 0;
      const updatedSubCategories = category.subCategories.map(subCategory => {
        const updatedQuestions = subCategory.questions.map(question => 
          question._id === questionId 
            ? { ...question, isCompleted: newIsCompleted }
            : question
        );
        
        const subCategoryCompletedCount = updatedQuestions.filter(q => q.isCompleted).length;
        categoryCompletedCount += subCategoryCompletedCount;
        
        return {
          ...subCategory,
          questions: updatedQuestions,
          completedQuestions: subCategoryCompletedCount,
          totalQuestions: subCategory.questions.length
        };
      });

      return {
        ...category,
        subCategories: updatedSubCategories,
        completedQuestions: categoryCompletedCount,
        totalQuestions: updatedSubCategories.reduce((acc, sub) => acc + sub.totalQuestions, 0)
      };
    });

    setCategories(updatedCategories);
    
    // Track analytics
    trackEvent(
      'question_completion',
      'Question Progress',
      `${currentQuestion.category} - ${currentQuestion.subCategory}`,
      newIsCompleted ? 1 : 0
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ErrorBoundary componentName="Sidebar">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          isCollapsed={isSidebarCollapsed}
          onCollapsedChange={setIsSidebarCollapsed}
        />
      </ErrorBoundary>

      <ErrorBoundary componentName="QuestionList">
        <QuestionList
          subCategories={categories.find(c => c.name === selectedCategory)?.subCategories || []}
          onToggleQuestion={handleToggleQuestion}
          categoryName={selectedCategory}
          isSidebarCollapsed={isSidebarCollapsed}
          isRightSidebarExpanded={isExpanded}
        />
      </ErrorBoundary>

      <ErrorBoundary componentName="OverallNotes">
        <OverallNotes
          isExpanded={isExpanded}
          onToggle={toggleExpanded}
        />
      </ErrorBoundary>
    </div>
  );
}
