export interface Question {
  _id: string;
  category: string;
  subCategory: string;
  question: string;
  howToAnswer: string;
  exampleAnswer: string;
  isCompleted?: boolean;
}

export interface Category {
  name: string;
  subCategories: SubCategory[];
  completedQuestions: number;
  totalQuestions: number;
}

export interface SubCategory {
  name: string;
  questions: Question[];
  completedQuestions: number;
  totalQuestions: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  questions?: T extends Question[] ? Question[] : never;
  error?: string;
} 