export interface RCAEvidence {
  summary: string;
  contributingFactors: string[];
  recommendation: string;
  confidence: number;
}

export interface RCAProvider {
  name: string;
  generateRCA(incidentId: string, context: any): Promise<RCAEvidence>;
}
