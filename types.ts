
export interface QuarterPerformance {
  period: string;
  guidance: string;
  delivery: string;
  variance: number;
}

export interface MoatMetrics {
  brand: number;
  pricing: number;
  rd: number;
  network: number;
  switching: number;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface PeerValuation {
  name: string;
  pe: number;
  peg: number;
  ps: number;
}

export interface InstitutionalFlow {
  label: string;
  percentage: number;
}

export interface ResearchData {
  ticker: string;
  price: number;
  change: number;
  marketCap: string;
  sector: string;
  beatRate: number;
  avgVariance: number;
  lastUpdated: string;
  // 11 Pillars Mapping
  p1_moat: MoatMetrics;
  p2_trends: PricePoint[];
  p3_variance: QuarterPerformance[];
  p4_valuation: PeerValuation[];
  p5_management: string;
  p6_flow: InstitutionalFlow[];
  p7_macro: string;
  p8_benchmarking: string;
  p9_liquidity: string;
  p10_esg: string;
  p11_verdict: {
    label: string;
    confidence: number;
    score: number; // 0 to 100
    sentimentScore: number; // 0 to 100
    sentimentDrivers: string[];
    analystConsensus: string;
  };
  summary: string;
  recentNews: {
    headline: string;
    source: string;
    time: string;
  }[];
}

export enum NavigationTab {
  DASHBOARD = 'DASHBOARD',
  RESEARCH = 'RESEARCH',
  FLOW = 'FLOW',
  PORTFOLIO = 'PORTFOLIO',
  SETTINGS = 'SETTINGS'
}
