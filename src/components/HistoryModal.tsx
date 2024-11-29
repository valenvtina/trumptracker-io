import React from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { AnalysisEntry, ImpactLevel } from '../types/promise';

interface HistoryModalProps {
  promiseId: number;
  promiseTitle: string;
  impactType: ImpactLevel;
  analyses: AnalysisEntry[];
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  promiseId,
  promiseTitle,
  impactType,
  analyses,
  onClose,
}) => {
  const filteredAnalyses = analyses.filter(analysis => 
    analysis.results.some(result => 
      result.promiseId === promiseId && 
      result.impact === impactType
    )
  );

  const impactColor = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-yellow-400'
  }[impactType];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">{promiseTitle}</h2>
            <p className="text-sm text-gray-400">
              Historical <span className={`capitalize ${impactColor}`}>{impactType}</span> Analyses
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-auto flex-1 p-4">
          {filteredAnalyses.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No {impactType} analyses found for this promise.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredAnalyses.map((analysis, index) => {
                const result = analysis.results.find(r => 
                  r.promiseId === promiseId && r.impact === impactType
                );
                
                if (!result) return null;
                
                return (
                  <div 
                    key={index}
                    className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-gray-300">{analysis.text}</p>
                      <span className="text-sm text-gray-500 ml-4">
                        {format(new Date(analysis.timestamp), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Rationale: {result.rationale}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};