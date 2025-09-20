export interface ReviewAnalysis {
  sentiment_summary: {
    positive: number;
    negative: number;
    neutral: number;
  };
  positive_points: string[];
  negative_points: string[];
  suggestions: string[];
  overall_summary: string;
  score?: number;
}

export interface ReviewAnalysisResponse {
  success: boolean;
  analysis?: ReviewAnalysis;
  message?: string;
}
