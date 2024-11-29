import React from 'react';
import { PromiseCategory } from '../types/promise';

const categoryColors: Record<PromiseCategory, { bg: string; text: string }> = {
  Security: { bg: 'bg-blue-900/30', text: 'text-blue-300' },
  Prosperity: { bg: 'bg-green-900/30', text: 'text-green-300' },
  'Cultural Issues': { bg: 'bg-purple-900/30', text: 'text-purple-300' },
  'National Unity': { bg: 'bg-orange-900/30', text: 'text-orange-300' },
};

interface CategoryPillProps {
  category: PromiseCategory;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({ category }) => {
  const colors = categoryColors[category];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border border-current/20`}>
      {category}
    </span>
  );
};