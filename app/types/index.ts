import { Question, ApiResponse } from './question';

export interface SubCategory {
  name: string;
  questions: Question[];
  totalQuestions: number;
  completedQuestions: number;
}

export interface Category {
  name: string;
  subCategories: SubCategory[];
  totalQuestions: number;
  completedQuestions: number;
}

export type { Question, ApiResponse }; 