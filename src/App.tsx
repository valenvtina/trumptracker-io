import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { PromiseCard } from './components/PromiseCard';
import { TextAnalyzer } from './components/TextAnalyzer';
import { AnalysisTable } from './components/AnalysisTable';
import { promisesData } from './data/promiseData';
import { AnalysisResult, PromiseData, ImpactLevel } from './types/promise';
import { saveAnalysis, loadPromiseStats } from './utils/db';

function App() {
  const [promises, setPromises] = useState<PromiseData[]>(promisesData);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[] | null>(null);
  const [lastAnalyzedText, setLastAnalyzedText] = useState<string>('');
  const [highlightedPromises, setHighlightedPromises] = useState<Record<number, ImpactLevel>>({});

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await loadPromiseStats();
        if (stats) {
          const updatedPromises = promises.map(promise => ({
            ...promise,
            positive: stats[promise.id]?.positive || 0,
            negative: stats[promise.id]?.negative || 0,
            neutral: stats[promise.id]?.neutral || 0,
            facts: stats[promise.id]?.facts || 0,
            opinions: stats[promise.id]?.opinions || 0,
            lastUpdated: stats[promise.id]?.lastUpdated
          }));
          setPromises(updatedPromises);
        }
      } catch (error) {
        console.error('Failed to load promise stats:', error);
      }
    };

    loadStats();
  }, []);

  const handleAnalysis = async (text: string, results: AnalysisResult[], classification: string) => {
    try {
      const timestamp = new Date();
      const newHighlights: Record<number, ImpactLevel> = {};
      const updatedPromises = [...promises];
      
      results.forEach(result => {
        newHighlights[result.promiseId] = result.impact;
        const promise = updatedPromises.find(p => p.id === result.promiseId);
        if (promise) {
          if (result.impact === 'positive') promise.positive++;
          else if (result.impact === 'negative') promise.negative++;
          else promise.neutral++;
          
          if (classification === 'FACT') promise.facts++;
          else promise.opinions++;
          
          promise.lastUpdated = timestamp;
        }
      });

      // Save to Firebase
      await saveAnalysis({
        text,
        timestamp,
        classification,
        results
      });
      
      setPromises(updatedPromises);
      setHighlightedPromises(newHighlights);
      setAnalysisResults(results);
      setLastAnalyzedText(text);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to save analysis');
    }
  };

  const handleShare = (id: number) => {
    const url = `${window.location.origin}/promise/${id}`;
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Trump Tracker: Promises Analysis
        </h1>
        <h2 className="text-xl text-gray-400 text-center mb-6">
          Hold the Trump Administration Accountable
        </h2>
        
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <p className="text-gray-300 text-center">
            Easily analyze any online information and see how it aligns with Trump's Agenda 47 promises. 
            Simply enter the text you want to evaluate, and our AI-powered tool will show you its impact on each of Trump's 20 campaign promises. 
            You can explore the full list of promises{' '}
            <a 
              href="https://www.donaldjtrump.com/platform" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:text-blue-300 underline"
            >
              here
            </a>.
          </p>
        </div>
        
        <TextAnalyzer onAnalysis={handleAnalysis} />
        
        {analysisResults && (
          <AnalysisTable 
            results={analysisResults} 
            onDismiss={() => setAnalysisResults(null)}
            userText={lastAnalyzedText}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promises.map((promise) => (
            <PromiseCard
              key={promise.id}
              data={promise}
              onShare={() => handleShare(promise.id)}
              highlight={highlightedPromises[promise.id]}
            />
          ))}
        </div>
      </div>
      
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#374151',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;