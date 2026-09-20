import { RCAProvider, RCAEvidence } from './provider';

export class MockRCAProvider implements RCAProvider {
  name = 'mock';

  async generateRCA(incidentId: string, context: any): Promise<RCAEvidence> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      summary: `Deterministic mock RCA for incident ${incidentId}: The expected event exceeded the configured SLA bounds.`,
      contributingFactors: [
        `Timeout occurred on participant ${context?.order?.sellerId || context?.order?.buyerId || 'unknown'}`,
        `Downstream system failed to return callback within SLA threshold`
      ],
      recommendation: `Verify network connectivity and queue health for participant. Consider automated reroute if failure persists.`,
      confidence: 99.9,
    };
  }
}
