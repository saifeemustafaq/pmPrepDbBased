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
      const response = await fetch('/api/questions');
      const data: ApiResponse<Question[]> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch questions');
      }

      // Track API performance
      const endTime = performance.now();
      analytics.trackFeatureUsage('api', 'fetch_questions', endTime - startTime);

      const progress = getProgress();
      const processedCategories = CATEGORIES.map(category => {
        const categoryQuestions = data.questions.filter((q: Question) => q.category === category.name);
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

  const handleToggleQuestion = async (questionId: string) => {
    try {
      const startTime = performance.now();
      const response = await fetch(`/api/questions/${questionId}/toggle`, {
        method: 'POST'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle question');
      }

      // Track API performance
      const endTime = performance.now();
      analytics.trackFeatureUsage('api', 'toggle_question', endTime - startTime);

      setCategories(prevCategories => {
        const newCategories = prevCategories.map(category => ({
          ...category,
          subCategories: category.subCategories.map(subCategory => {
            const updatedQuestions = subCategory.questions.map(question => {
              if (question._id === questionId) {
                const newIsCompleted = !question.isCompleted;
                setQuestionProgress(questionId, newIsCompleted);
                trackEvent(
                  'question_completion',
                  'Question Progress',
                  `${question.category} - ${question.subCategory}`,
                  newIsCompleted ? 1 : 0
                );
                return { ...question, isCompleted: newIsCompleted };
              }
              return question;
            });

            return {
              ...subCategory,
              questions: updatedQuestions,
              completedQuestions: updatedQuestions.filter(q => q.isCompleted).length
            };
          }),
        }));

        return newCategories.map(category => ({
          ...category,
          completedQuestions: category.subCategories.reduce(
            (acc, sub) => acc + sub.completedQuestions, 0
          )
        }));
      });
    } catch (error) {
      console.error('Error toggling question:', error);
      analytics.trackError(
        'API Error',
        error instanceof Error ? error.message : 'Unknown error toggling question',
        'QuestionToggle'
      );
    }
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
