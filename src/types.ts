export type CrimeCategory = 'property' | 'persons' | 'authority';

export interface StateCrimeData {
  state: string;
  zone: string;
  capital: string;
  totalCases: number;
  propertyCases: number;
  personsCases: number;
  authorityCases: number;
  lat: number;
  lng: number;
  riskScore: number; // 0-100
  clusterId: number; // 1, 2, 3
  trend: string;
}

export interface GeopoliticalZone {
  name: string;
  total: number;
  states: string[];
  keyStates: string;
  primaryOffence: string;
  averageRisk: number;
}

export interface PredictionInput {
  state: string;
  category: CrimeCategory;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  urbanDensity: 'High' | 'Medium' | 'Low';
  populationBand: string;
}

export interface PredictionResult {
  riskScore: number; // 0 - 100
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  confidence: number; // 0 - 1
  kMeansCluster: number;
  decisionTreePath: string[];
  rfVoteDistribution: {
    low: number;
    moderate: number;
    high: number;
  };
  recommendations: string[];
}

export type ActiveTab = 
  | 'overview' 
  | 'dashboard'
  | 'crime-data'
  | 'datasets'
  | 'analytics'
  | 'hotspots'
  | 'prediction'
  | 'models'
  | 'reports'
  | 'foundation' 
  | 'components' 
  | 'data-visualizations' 
  | 'machine-learning-and-prediction' 
  | 'patterns'
  | 'auth';
