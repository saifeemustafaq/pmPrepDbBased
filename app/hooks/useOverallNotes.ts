import { useState, useEffect } from 'react';

export const useOverallNotes = () => {
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('overallNotesExpanded');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('overallNotesExpanded', JSON.stringify(isExpanded));
    }
  }, [isExpanded]);

  const toggleExpanded = () => {
    setIsExpanded((prev: boolean) => !prev);
  };

  return {
    isExpanded,
    toggleExpanded
  };
}; 