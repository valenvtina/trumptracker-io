import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { analyzeTextWithAI } from '../utils/openai';
import { AnalysisResult } from '../types/promise';
import { LoadingSpinner } from './LoadingSpinner';

interface TextAnalyzerProps {
  onAnalysis: (text: string, results: AnalysisResult[], classification: string) => void;
}

export const TextAnalyzer: React.FC<TextAnalyzerProps> = ({ onAnalysis }) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const { results, classification } = await analyzeTextWithAI(text);
      if (!results || !Array.isArray(results) || results.length === 0) {
        throw new Error('Invalid analysis results');
      }
      onAnalysis(text, results, classification);
      setText('');
      toast.success('Analysis complete!');
    } catch (error: any) {
      console.error('Analysis failed:', error);
      toast.error(error.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="relative bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg">
        <label htmlFor="analysis-input" className="block text-lg font-semibold text-white mb-2">
          Analyze Text
        </label>
        <p className="text-gray-400 text-sm mb-4">
          Enter any text or news article to see how it impacts Trump's promises...
        </p>
        <div className="relative">
          <textarea
            id="analysis-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32 transition-all duration-200"
            disabled={isAnalyzing}
          />
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || isAnalyzing}
            className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            <Send size={20} />
          </button>
          {isAnalyzing && <LoadingSpinner />}
        </div>
      </div>
    </div>
  );
};