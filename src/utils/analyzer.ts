import { AnalysisResult } from '../types/promise';
import { promisesData } from '../data/promiseData';

export const analyzeTextForPromises = (text: string): AnalysisResult[] => {
  // Always return analysis for all promises
  return promisesData.map(promise => {
    const keywords = text.toLowerCase().split(' ');
    
    // Keywords for sentiment analysis
    const positiveKeywords = ['good', 'great', 'better', 'success', 'improve', 'positive', 'support', 'benefit', 'progress'];
    const negativeKeywords = ['bad', 'worse', 'poor', 'fail', 'negative', 'against', 'harm', 'worsen', 'decline'];
    
    // Count sentiment matches
    const positiveMatches = positiveKeywords.filter(word => 
      keywords.includes(word) || text.toLowerCase().includes(word)
    ).length;
    
    const negativeMatches = negativeKeywords.filter(word => 
      keywords.includes(word) || text.toLowerCase().includes(word)
    ).length;
    
    // Check for promise-specific keywords
    const promiseKeywords = [...promise.title.toLowerCase().split(' '), 
                            ...promise.description.toLowerCase().split(' ')];
    
    const relevanceScore = promiseKeywords.filter(word => 
      keywords.includes(word)
    ).length;
    
    let impact: 'positive' | 'negative' | 'neutral' = 'neutral';
    
    if (positiveMatches > negativeMatches) impact = 'positive';
    if (negativeMatches > positiveMatches) impact = 'negative';
    
    return {
      promiseId: promise.id,
      impact,
      rationale: `Found ${positiveMatches} positive and ${negativeMatches} negative indicators. Relevance score: ${relevanceScore}`,
      timestamp: new Date()
    };
  });
};