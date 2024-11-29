import React from 'react';
import { X } from 'lucide-react';
import { AnalysisTableProps } from '../types/promise';
import { promisesData } from '../data/promiseData';

export const AnalysisTable: React.FC<AnalysisTableProps> = ({ results, onDismiss, userText }) => {
  const scrollToPromise = (promiseId: number) => {
    const element = document.getElementById(`promise-${promiseId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a brief highlight effect
      element.classList.add('ring-2', 'ring-blue-500');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-blue-500');
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[80vh] bg-gray-800 rounded-xl shadow-xl flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white">Analysis Results</h2>
            <p className="text-sm text-gray-400 mt-1 max-w-2xl break-words">
              Analyzing: "{userText}"
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-white transition-colors p-2"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-auto flex-1">
          <table className="w-full">
            <thead className="bg-gray-900/50 sticky top-0">
              <tr>
                <th className="text-left p-4 text-gray-300 font-semibold">Promise</th>
                <th className="text-left p-4 text-gray-300 font-semibold w-24">Impact</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Rationale</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => {
                const promise = promisesData.find(p => p.id === result.promiseId);
                const impactColor = {
                  positive: 'text-green-400',
                  negative: 'text-red-400',
                  neutral: 'text-yellow-400'
                }[result.impact];
                
                if (!promise) return null;
                
                return (
                  <tr key={result.promiseId} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="p-4">
                      <button
                        onClick={() => scrollToPromise(result.promiseId)}
                        className="text-white hover:text-blue-400 transition-colors text-left font-medium"
                      >
                        {promise.title}
                      </button>
                    </td>
                    <td className="p-4">
                      <span className={`capitalize font-medium ${impactColor}`}>
                        {result.impact}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{result.rationale}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};