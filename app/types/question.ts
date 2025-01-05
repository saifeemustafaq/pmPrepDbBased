export interface Question {
  _id: string;
  category: string;
  subCategory: string;
  question: string;
  howToAnswer: string;
  exampleAnswer: string;
  createdAt: Date;
  updatedAt: Date;
  isCompleted?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 