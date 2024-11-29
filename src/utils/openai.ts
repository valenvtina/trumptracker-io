import OpenAI from 'openai';
import { AnalysisResult } from '../types/promise';
import { promisesData } from '../data/promiseData';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const analyzeTextWithAI = async (text: string) => {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const prompt = `Analyze this text: "${text}"

First, classify this text as either FACT or OPINION.

Then, analyze how this text impacts each of these 20 Trump campaign promises:

${promisesData.map(p => `${p.id}. ${p.title}: ${p.description}`).join('\n')}

For each promise, determine if the text has a positive, negative, or neutral impact, and provide a brief rationale.

Respond in this exact JSON format:
{
  "classification": "FACT or OPINION",
  "results": [
    {
      "promiseId": number,
      "impact": "positive" | "negative" | "neutral",
      "rationale": "brief explanation"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an objective analyst evaluating how information impacts Trump's campaign promises. Provide clear, concise analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(content);
    
    // Validate the response format
    if (!parsedResponse.classification || !Array.isArray(parsedResponse.results)) {
      throw new Error('Invalid response format from OpenAI');
    }

    return {
      classification: parsedResponse.classification,
      results: parsedResponse.results.map(result => ({
        ...result,
        timestamp: new Date()
      }))
    };
  } catch (error) {
    console.error('OpenAI analysis failed:', error);
    throw new Error('Failed to analyze text. Please try again.');
  }
};