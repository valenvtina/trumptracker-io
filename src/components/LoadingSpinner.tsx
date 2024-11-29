import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center rounded-lg backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-300 text-sm font-medium">Analysis in Progress...</p>
      </div>
    </div>
  );
};