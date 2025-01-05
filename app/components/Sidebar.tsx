'use client';

import { Category } from '../types';
import { Progress } from '../components/ui/Progress';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORY_COLORS: { [key: string]: 'blue' | 'purple' | 'green' | 'orange' | 'pink' } = {
  'Behavioral': 'purple',
  'Product Design': 'blue',
  'Strategy': 'green',
  'Execution': 'orange',
  'Estimation': 'pink'
};

export function Sidebar({ categories, selectedCategory, onSelectCategory }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const totalQuestions = categories.reduce((acc, cat) => acc + cat.totalQuestions, 0);
  const totalCompleted = categories.reduce((acc, cat) => acc + cat.completedQuestions, 0);
  const overallProgress = totalQuestions > 0 ? (totalCompleted / totalQuestions) * 100 : 0;

  return (
    <div 
      className={`fixed top-0 left-0 h-screen bg-gray-50 border-r border-gray-200 overflow-visible
        ${isCollapsed ? 'w-20' : 'w-64'} 
        transition-all duration-300 ease-in-out z-10`}
    >
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-6 top-16 w-12 h-12 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors z-20"
        role="button"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </div>

      <div className={`h-full p-4 ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
        <div className="flex flex-col items-center">
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

        <div className={`mt-6 mb-6 transition-all duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          <h2 className="text-xl font-bold mb-2 whitespace-nowrap">Overall Progress</h2>
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                {totalCompleted} of {totalQuestions} completed
              </span>
            </div>
            <Progress value={overallProgress} size="lg" showValue color="blue" />
          </div>
        </div>

        <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          <h2 className="text-xl font-bold mb-4 whitespace-nowrap">Categories</h2>
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-24rem)]">
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 