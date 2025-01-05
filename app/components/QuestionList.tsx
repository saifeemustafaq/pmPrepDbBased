'use client';

import { SubCategory } from '../types';
import { Progress } from './ui/Progress';
import { useState } from 'react';
import { QuestionView } from '../components/QuestionView';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown } from 'lucide-react';

interface QuestionListProps {
  subCategories: SubCategory[];
  onToggleQuestion: (questionId: string) => void;
  categoryName: string;
  isSidebarCollapsed: boolean;
}

const CATEGORY_COLORS: { [key: string]: 'blue' | 'purple' | 'green' | 'orange' | 'pink' } = {
  'Behavioral': 'purple',
  'Product Design': 'blue',
  'Strategy': 'green',
  'Execution': 'orange',
  'Estimation': 'pink'
};

export function QuestionList({ subCategories, onToggleQuestion, categoryName, isSidebarCollapsed }: QuestionListProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const color = CATEGORY_COLORS[categoryName];

  return (
    <div className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
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
                          onChange={() => onToggleQuestion(question._id)}
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
                          onClick={() => setSelectedQuestion(
                            selectedQuestion === question._id ? null : question._id
                          )}
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
                          className={`overflow-hidden transition-all duration-200 ease-in-out ${
                            selectedQuestion === question._id ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
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