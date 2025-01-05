'use client';

import { SubCategory } from '../types';
import { Progress } from './ui/Progress';
import { useState, useEffect, useCallback } from 'react';
import { QuestionView } from '../components/QuestionView';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import * as analytics from '../lib/analytics';
import * as journeyAnalytics from '../lib/journeyAnalytics';

interface QuestionListProps {
  subCategories: SubCategory[];
  onToggleQuestion: (questionId: string) => void;
  categoryName: string;
  isSidebarCollapsed: boolean;
  isRightSidebarExpanded?: boolean;
}

const CATEGORY_COLORS: { [key: string]: 'blue' | 'purple' | 'green' | 'orange' | 'pink' } = {
  'Behavioral': 'purple',
  'Product Design': 'blue',
  'Strategy': 'green',
  'Execution': 'orange',
  'Estimation': 'pink'
};

export function QuestionList({ subCategories, onToggleQuestion, categoryName, isSidebarCollapsed, isRightSidebarExpanded = false }: QuestionListProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [questionAttempts, setQuestionAttempts] = useState<Record<string, number>>({});
  const color = CATEGORY_COLORS[categoryName];
  const { trackEvent } = useAnalytics();

  // Track category view duration with enhanced analytics
  useEffect(() => {
    const startTime = Date.now();
    analytics.startCategoryView(categoryName);
    
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      analytics.endCategoryView(categoryName);
      journeyAnalytics.trackCategoryTime(categoryName, timeSpent);
    };
  }, [categoryName]);

  const handleQuestionExpand = (question: { _id: string, question: string }) => {
    const newSelectedId = selectedQuestion === question._id ? null : question._id;
    const currentTime = Date.now();
    
    // Track previous question metrics if exists
    if (selectedQuestion && questionStartTime) {
      const timeSpent = Math.floor((currentTime - questionStartTime) / 1000);
      const prevQuestion = subCategories
        .flatMap(sub => sub.questions)
        .find(q => q._id === selectedQuestion);
      
      if (prevQuestion) {
        analytics.endQuestionView(prevQuestion._id, prevQuestion.question, categoryName);
        
        // Track learning path and difficulty
        const attempts = questionAttempts[prevQuestion._id] || 0;
        journeyAnalytics.trackLearningPath(
          prevQuestion._id,
          categoryName,
          timeSpent,
          prevQuestion.isCompleted || false
        );
        journeyAnalytics.trackQuestionDifficulty(
          prevQuestion._id,
          timeSpent,
          attempts,
          prevQuestion.isCompleted || false
        );
      }
    }

    setSelectedQuestion(newSelectedId);
    setQuestionStartTime(newSelectedId ? currentTime : null);
    
    if (newSelectedId) {
      // Update attempts counter
      setQuestionAttempts(prev => ({
        ...prev,
        [question._id]: (prev[question._id] || 0) + 1
      }));
      
      analytics.startQuestionView(question._id);
      analytics.trackQuestionRevisit(question._id, question.question, categoryName);
      trackEvent(
        'view',
        'question',
        `${categoryName} - ${question.question.substring(0, 50)}...`,
        1
      );
    }
  };

  // Track study session on component mount/unmount
  useEffect(() => {
    const sessionStart = Date.now();
    const questionsAttempted = new Set<string>();
    const questionsCompleted = new Set<string>();
    
    // Initialize with current progress
    subCategories.forEach(sub => {
      sub.questions.forEach(q => {
        if (q.isCompleted) {
          questionsCompleted.add(q._id);
        }
      });
    });

    return () => {
      const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);
      journeyAnalytics.trackStudySession(
        sessionDuration,
        questionsAttempted.size,
        questionsCompleted.size,
        [categoryName]
      );
    };
  }, [subCategories, categoryName]);

  // Track question completion
  const handleToggleQuestion = useCallback((questionId: string) => {
    const question = subCategories
      .flatMap(sub => sub.questions)
      .find(q => q._id === questionId);
    
    if (question) {
      const timeSpent = questionStartTime ? Math.floor((Date.now() - questionStartTime) / 1000) : 0;
      const attempts = questionAttempts[questionId] || 1;
      
      journeyAnalytics.trackLearningPath(
        questionId,
        categoryName,
        timeSpent,
        !question.isCompleted // Toggle state
      );
      
      journeyAnalytics.trackQuestionDifficulty(
        questionId,
        timeSpent,
        attempts,
        !question.isCompleted // Toggle state
      );
    }
    
    onToggleQuestion(questionId);
  }, [onToggleQuestion, categoryName, questionStartTime, questionAttempts, subCategories]);

  // Track UI interactions
  const handleSidebarCollapseChange = useCallback(() => {
    analytics.trackUIInteraction('sidebar', isSidebarCollapsed ? 'expand' : 'collapse');
  }, [isSidebarCollapsed]);

  useEffect(() => {
    handleSidebarCollapseChange();
  }, [handleSidebarCollapseChange]);

  return (
    <div className={`flex-1 p-8 overflow-y-auto transition-all duration-300 
      ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}
      ${isRightSidebarExpanded ? 'mr-80' : 'mr-10'}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {subCategories.map((subCategory) => {
          const progress = (subCategory.completedQuestions / subCategory.totalQuestions) * 100;
          
          return (
            <div key={subCategory.name} className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">{subCategory.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium px-3 py-1 bg-${color}-50 text-${color}-700 rounded-full`}>
                      {subCategory.completedQuestions}/{subCategory.totalQuestions}
                    </span>
                    <span className={`text-sm font-medium text-${color}-600`}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={progress}
                  size="md"
                  color={color}
                />
              </div>
              
              <div className="space-y-4 mt-6">
                {subCategory.questions.map((question, index) => (
                  <div 
                    key={question._id} 
                    className={`group rounded-lg border transition-all duration-200 ${
                      question.isCompleted 
                        ? `border-${color}-200 bg-${color}-50/30` 
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex gap-3 p-4">
                      <div className="flex gap-3 items-start">
                        <input
                          type="checkbox"
                          checked={question.isCompleted || false}
                          onChange={() => handleToggleQuestion(question._id)}
                          className={`h-4 w-4 rounded border-gray-300 focus:ring-${color}-500 mt-1 transition-colors ${
                            question.isCompleted 
                              ? `text-${color}-600 focus:ring-${color}-500` 
                              : `text-${color}-600 focus:ring-${color}-500`
                          }`}
                        />
                        <span className="flex-shrink-0 text-sm font-medium text-gray-500 mt-1">
                          {index + 1}.
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => handleQuestionExpand(question)}
                          className="flex justify-between w-full group text-left"
                        >
                          <div className="flex min-w-0">
                            <div className={`prose prose-sm max-w-none transition-colors prose-p:font-poppins prose-headings:font-poppins ${
                              question.isCompleted 
                                ? `text-${color}-800` 
                                : `group-hover:text-${color}-600`
                            }`}>
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {question.question}
                              </ReactMarkdown>
                            </div>
                          </div>
                          <ChevronDown 
                            className={`flex-shrink-0 w-5 h-5 mt-1 ml-4 text-gray-500 transition-transform duration-200 ${
                              selectedQuestion === question._id ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            selectedQuestion === question._id ? 'opacity-100 mt-4' : 'opacity-0 h-0'
                          }`}
                        >
                          {selectedQuestion === question._id && (
                            <QuestionView
                              howToAnswer={question.howToAnswer}
                              exampleAnswer={question.exampleAnswer}
                              questionId={question._id}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 