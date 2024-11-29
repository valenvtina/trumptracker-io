export type PromiseCategory = 'Security' | 'Prosperity' | 'Cultural Issues' | 'National Unity';
export type ImpactLevel = 'positive' | 'negative' | 'neutral';

export interface PromiseData {
  id: number;
  title: string;
  description: string;
  category: PromiseCategory;
  positive: number;
  negative: number;
  neutral: number;
  facts: number;
  opinions: number;
  lastUpdated?: Date;
}

export interface GaugeProps {
  score: number;
  highlight?: ImpactLevel;
}

export interface PromiseCardProps {
  data: PromiseData;
  onShare: () => void;
  highlight?: ImpactLevel;
}

export interface AnalysisResult {
  promiseId: number;
  impact: ImpactLevel;
  rationale: string;
  timestamp: Date;
}

export interface AnalysisTableProps {
  results: AnalysisResult[];
  onDismiss: () => void;
  userText: string;
}

export interface AnalysisEntry {
  id?: number;
  text: string;
  timestamp: Date;
  results: AnalysisResult[];
}