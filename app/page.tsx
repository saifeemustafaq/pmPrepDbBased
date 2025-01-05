'use client';

import { useState, useEffect } from 'react';
import { Category, Question, ApiResponse } from './types';
import { Sidebar } from './components/Sidebar';
import { QuestionList } from './components/QuestionList';
import { getProgress, setQuestionProgress } from './lib/progress';

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      const result: ApiResponse<Question[]> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch questions');
      }

      const questions = result.data;
      const savedProgress = getProgress();
      
      // Process questions into categories
      const processedCategories = CATEGORIES.map(cat => {
        const categoryQuestions = questions.filter(q => q.category === cat.name);
        const subCategories = cat.subCategories.map(subCat => {
          const subCategoryQuestions = categoryQuestions.filter(q => q.subCategory === subCat);
          const completedCount = subCategoryQuestions.filter(q => savedProgress[q._id]).length;
          
          return {
            name: subCat,
            questions: subCategoryQuestions.map(q => ({
              ...q,
              isCompleted: savedProgress[q._id] || false
            })),
            totalQuestions: subCategoryQuestions.length,
            completedQuestions: completedCount
          };
        });

        const totalCompleted = subCategories.reduce((acc, sub) => acc + sub.completedQuestions, 0);

        return {
          name: cat.name,
          subCategories,
          totalQuestions: categoryQuestions.length,
          completedQuestions: totalCompleted
        };
      });

      setCategories(processedCategories);
      if (!selectedCategory && processedCategories.length > 0) {
        setSelectedCategory(processedCategories[0].name);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  const handleToggleQuestion = async (questionId: string) => {
    try {
      setCategories(prevCategories => {
        const newCategories = prevCategories.map(category => ({
          ...category,
          subCategories: category.subCategories.map(subCategory => {
            const updatedQuestions = subCategory.questions.map(question => {
              if (question._id === questionId) {
                const newIsCompleted = !question.isCompleted;
                // Update localStorage
                setQuestionProgress(questionId, newIsCompleted);
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

        // Update category completion counts
        return newCategories.map(category => ({
          ...category,
          completedQuestions: category.subCategories.reduce(
            (acc, sub) => acc + sub.completedQuestions, 0
          )
        }));
      });
    } catch (error) {
      console.error('Error toggling question:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const selectedCategoryData = categories.find(c => c.name === selectedCategory);

  return (
    <div className="flex h-screen">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      {selectedCategoryData && (
        <QuestionList
          subCategories={selectedCategoryData.subCategories}
          onToggleQuestion={handleToggleQuestion}
          categoryName={selectedCategoryData.name}
        />
      )}
    </div>
  );
}
