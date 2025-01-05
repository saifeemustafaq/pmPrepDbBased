'use client';

import { Category } from '../types';
import { Progress } from '../components/ui/Progress';
import Image from 'next/image';
import { useState } from 'react';
import { clearProgress } from '../lib/progress';
import { clearNotes } from '../lib/notes';
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Palette, 
  Target, 
  Rocket, 
  Calculator,
  MoreHorizontal,
  Trash2,
  Send,
  MessageCircle
} from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isCollapsed: boolean;
  onCollapsedChange: (isCollapsed: boolean) => void;
}

const CATEGORY_COLORS: { [key: string]: 'blue' | 'purple' | 'green' | 'orange' | 'pink' } = {
  'Behavioral': 'purple',
  'Product Design': 'blue',
  'Strategy': 'green',
  'Execution': 'orange',
  'Estimation': 'pink'
};

const CATEGORY_ICONS: { [key: string]: React.ReactNode } = {
  'Behavioral': <MessageSquare size={20} />,
  'Product Design': <Palette size={20} />,
  'Strategy': <Target size={20} />,
  'Execution': <Rocket size={20} />,
  'Estimation': <Calculator size={20} />
};

export function Sidebar({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  isCollapsed,
  onCollapsedChange 
}: SidebarProps) {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const totalQuestions = categories.reduce((acc, cat) => acc + cat.totalQuestions, 0);
  const totalCompleted = categories.reduce((acc, cat) => acc + cat.completedQuestions, 0);
  const overallProgress = totalQuestions > 0 ? (totalCompleted / totalQuestions) * 100 : 0;

  const handleClearProgress = () => {
    if (window.confirm('Are you sure you want to clear all progress and notes? This action cannot be undone.')) {
      const clearedProgress = clearProgress();
      const clearedNotes = clearNotes();
      
      if (clearedProgress && clearedNotes) {
        // Force a page refresh to update all components
        window.location.reload();
      } else {
        alert('Failed to clear data. Please try again.');
      }
    }
  };

  return (
    <div 
      className={`fixed top-0 left-0 h-screen bg-gray-50 border-r border-gray-200 overflow-visible
        ${isCollapsed ? 'w-20' : 'w-64'} 
        transition-all duration-300 ease-in-out z-10`}
    >
      <div 
        onClick={() => onCollapsedChange(!isCollapsed)}
        className="absolute -right-6 top-16 w-12 h-12 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors z-20"
        role="button"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </div>

      <div className={`h-full flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
        <div className="flex flex-col items-center p-4">
          <div className="relative w-12 h-12 mb-2">
            <Image
              src="/logo/LogoDark.svg"
              alt="PM Prep Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className={`text-center transition-all duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            <h1 className="text-xl font-bold whitespace-nowrap">PM Prep</h1>
            <p className="text-sm text-gray-600 whitespace-nowrap">Interview Questions</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="relative mb-4">
            <button
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="flex items-center justify-between w-full px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <MoreHorizontal size={20} className="text-gray-600" />
                {!isCollapsed && <span className="font-medium text-gray-700">More Options</span>}
              </div>
              {!isCollapsed && <ChevronRight size={16} className={`text-gray-400 transform transition-transform duration-200 ${showMoreOptions ? 'rotate-90' : ''}`} />}
            </button>
            
            {showMoreOptions && !isCollapsed && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 mt-2 z-50">
                <button
                  onClick={handleClearProgress}
                  className="flex items-center gap-2 px-4 py-3 w-full hover:bg-gray-50 transition-colors"
                >
                  <Trash2 size={16} className="text-red-500" />
                  <span className="text-gray-700">Clear Progress</span>
                </button>
                <a
                  href="https://forms.gle/PhLhrwWxjffaN7JM6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 w-full hover:bg-gray-50 transition-colors"
                >
                  <Send size={16} className="text-blue-500" />
                  <span className="text-gray-700">Submit a Question</span>
                </a>
                <a
                  href="https://forms.gle/Avnvb14BJ15HQwWZ7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 w-full hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle size={16} className="text-green-500" />
                  <span className="text-gray-700">Feedback</span>
                </a>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {categories.map((category) => {
              const progress = (category.completedQuestions / category.totalQuestions) * 100;
              const color = CATEGORY_COLORS[category.name];
              
              return (
                <div
                  key={category.name}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedCategory === category.name
                      ? `bg-${color}-50 border border-${color}-100 shadow-sm`
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => onSelectCategory(category.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`text-${color}-600`}>
                      {CATEGORY_ICONS[category.name]}
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className={`font-medium text-${color}-900 whitespace-nowrap`}>{category.name}</h3>
                          <span className={`text-sm font-medium text-${color}-600 whitespace-nowrap ml-2`}>
                            {category.completedQuestions}/{category.totalQuestions}
                          </span>
                        </div>
                        <Progress 
                          value={progress} 
                          size="sm"
                          color={color}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`p-4 border-t border-gray-200 bg-gray-50`}>
          <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            <h2 className="text-xl font-bold mb-2 whitespace-nowrap">Overall Progress</h2>
          </div>
          <div className={`bg-white p-4 rounded-lg border border-gray-100 shadow-sm ${isCollapsed ? 'p-2' : 'p-4'}`}>
            {!isCollapsed && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                  {totalCompleted} of {totalQuestions} completed
                </span>
              </div>
            )}
            <Progress value={overallProgress} size={isCollapsed ? "sm" : "lg"} showValue={!isCollapsed} color="blue" />
          </div>
        </div>
      </div>
    </div>
  );
} 