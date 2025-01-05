'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, LightbulbIcon } from 'lucide-react';
import { Notes } from './Notes';

interface QuestionViewProps {
  howToAnswer: string;
  exampleAnswer: string;
  questionId: string;
}

export function QuestionView({ howToAnswer, exampleAnswer, questionId }: QuestionViewProps) {
  return (
    <div className="space-y-6 font-poppins">
      <div className="bg-blue-50/70 p-6 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-blue-700" />
          <h4 className="font-semibold text-blue-900 text-sm uppercase tracking-wide">How to Answer</h4>
        </div>
        <div className="prose prose-sm max-w-none prose-headings:text-blue-900 prose-a:text-blue-600 prose-strong:text-blue-800 prose-p:font-poppins prose-headings:font-poppins prose-p:leading-relaxed prose-p:text-left">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {howToAnswer}
          </ReactMarkdown>
        </div>
      </div>
      
      <div className="bg-emerald-50/70 p-6 rounded-lg border border-emerald-100">
        <div className="flex items-center gap-2 mb-4">
          <LightbulbIcon className="w-4 h-4 text-emerald-700" />
          <h4 className="font-semibold text-emerald-900 text-sm uppercase tracking-wide">Example Answer</h4>
        </div>
        <div className="prose prose-sm max-w-none prose-headings:text-emerald-900 prose-a:text-emerald-600 prose-strong:text-emerald-800 prose-p:font-poppins prose-headings:font-poppins prose-p:leading-relaxed prose-p:text-left">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {exampleAnswer}
          </ReactMarkdown>
        </div>
      </div>

      <Notes questionId={questionId} />
    </div>
  );
} 