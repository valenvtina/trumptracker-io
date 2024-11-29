import React, { useRef, useState } from 'react';
import { Share2, Scale, Download } from 'lucide-react';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';
import { PromiseCardProps } from '../types/promise';
import { SemiCircleGauge } from './SemiCircleGauge';
import { CategoryPill } from './CategoryPill';
import { HistoryModal } from './HistoryModal';
import { getAnalyses } from '../utils/db';

export const PromiseCard: React.FC<PromiseCardProps> = ({ data, onShare, highlight }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState<'positive' | 'negative' | 'neutral' | null>(null);
  const [analyses, setAnalyses] = useState([]);

  // Calculate total including neutrals
  const total = data.positive + data.negative + data.neutral;
  // Calculate percentages based on total including neutrals
  const positivePercent = total === 0 ? 0 : (data.positive / total) * 100;
  const negativePercent = total === 0 ? 0 : (data.negative / total) * 100;
  const neutralPercent = total === 0 ? 0 : (data.neutral / total) * 100;
  
  // Calculate score based on all impacts
  const score = total === 0 ? 0 : ((data.positive - data.negative) / total) * 100;

  const handleHistoryClick = async (type: 'positive' | 'negative' | 'neutral') => {
    try {
      const allAnalyses = await getAnalyses();
      setAnalyses(allAnalyses);
      setShowHistory(type);
    } catch (error) {
      console.error('Failed to load analyses:', error);
      toast.error('Failed to load history');
    }
  };

  const handleDownloadSnapshot = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `trump-promise-${data.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download image');
    }
  };

  return (
    <>
      <div 
        id={`promise-${data.id}`}
        ref={cardRef} 
        className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col border border-gray-700 h-full transition-all duration-300"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{data.title}</h3>
            <CategoryPill category={data.category} />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleDownloadSnapshot}
              className="text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="Download snapshot"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={onShare}
              className="text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="Share"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <p className="text-gray-300 my-4">{data.description}</p>

        <div className="mb-6">
          <SemiCircleGauge score={score} highlight={highlight} />
        </div>

        <div className="grid grid-cols-3 gap-3 text-center mb-6">
          <button
            onClick={() => handleHistoryClick('negative')}
            className="bg-red-900/20 p-3 rounded-lg border border-red-800/30 hover:bg-red-900/30 transition-colors"
          >
            <p className="text-red-400 font-bold">
              {negativePercent.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400">Negative</p>
          </button>
          <button
            onClick={() => handleHistoryClick('neutral')}
            className="bg-yellow-900/20 p-3 rounded-lg border border-yellow-800/30 hover:bg-yellow-900/30 transition-colors"
          >
            <p className="text-yellow-400 font-bold">
              {neutralPercent.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400">Neutral</p>
          </button>
          <button
            onClick={() => handleHistoryClick('positive')}
            className="bg-green-900/20 p-3 rounded-lg border border-green-800/30 hover:bg-green-900/30 transition-colors"
          >
            <p className="text-green-400 font-bold">
              {positivePercent.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400">Positive</p>
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Scale size={16} />
            <span>Analysis Breakdown:</span>
          </div>
          <div className="flex gap-4">
            <span>Facts: <strong>{data.facts}</strong></span>
            <span>Opinions: <strong>{data.opinions}</strong></span>
          </div>
        </div>
        
        {data.lastUpdated && (
          <div className="mt-2 text-xs text-gray-500 text-right">
            Last updated: {format(new Date(data.lastUpdated), 'MMM d, HH:mm')}
          </div>
        )}
      </div>

      {showHistory && (
        <HistoryModal
          promiseId={data.id}
          promiseTitle={data.title}
          impactType={showHistory}
          analyses={analyses}
          onClose={() => setShowHistory(null)}
        />
      )}
    </>
  );
};