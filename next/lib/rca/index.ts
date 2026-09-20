import { RCAProvider } from './provider';
import { MockRCAProvider } from './mock-provider';

// Factory pattern allows swapping out providers based on configuration
export function getRCAProvider(): RCAProvider {
  // if (process.env.USE_BEDROCK === 'true') return new BedrockRCAProvider();
  return new MockRCAProvider();
}
