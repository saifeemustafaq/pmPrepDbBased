'use client';

import { Category } from '../types';
import { Progress } from '../components/ui/Progress';

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
  const totalQuestions = categories.reduce((acc, cat) => acc + cat.totalQuestions, 0);
  const totalCompleted = categories.reduce((acc, cat) => acc + cat.completedQuestions, 0);
  const overallProgress = totalQuestions > 0 ? (totalCompleted / totalQuestions) * 100 : 0;

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Overall Progress</h2>
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              {totalCompleted} of {totalQuestions} completed
            </span>
          </div>
          <Progress value={overallProgress} size="lg" showValue color="blue" />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <div className="space-y-3 flex-1 overflow-auto">
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
                <h3 className={`font-medium text-${color}-900`}>{category.name}</h3>
                <span className={`text-sm font-medium text-${color}-600`}>
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
  );
} 