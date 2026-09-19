export const ONDC_STATES = {
  SEARCHED: 'SEARCHED',
  SELECTED: 'SELECTED',
  INITIALIZED: 'INITIALIZED',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
} as const;

export type OndcState = typeof ONDC_STATES[keyof typeof ONDC_STATES];

// Defines the allowed forward transitions in the ONDC lifecycle
const VALID_TRANSITIONS: Record<OndcState, OndcState[]> = {
  SEARCHED: ['SELECTED', 'CANCELLED'],
  SELECTED: ['INITIALIZED', 'CANCELLED'],
  INITIALIZED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['CANCELLED', 'COMPLETED'],
  CANCELLED: [], // Terminal state
  COMPLETED: []  // Terminal state
};

export class StateMachineService {
  /**
   * Validates if a transition from `currentState` to `nextState` is mathematically allowed.
   */
  isValidTransition(currentState: string, nextState: string): boolean {
    // If the state isn't actually changing (e.g. an on_status event that just provides an update), it's valid.
    if (currentState === nextState) return true;
    
    const allowedNextStates = VALID_TRANSITIONS[currentState as OndcState];
    
    // If the current state is not recognized, or has no outward transitions
    if (!allowedNextStates) return false;
    
    return allowedNextStates.includes(nextState as OndcState);
  }

  /**
   * Simplistic mapping of an ONDC action (e.g., 'on_confirm') to our internal canonical state.
   * In a fully mature system, this might deeply inspect the payload (e.g., checking fulfillment states for COMPLETED).
   */
  deriveStateFromAction(action: string, currentState?: string): string {
    switch (action) {
      case 'search':
      case 'on_search':
        return ONDC_STATES.SEARCHED;
      case 'select':
      case 'on_select':
        return ONDC_STATES.SELECTED;
      case 'init':
      case 'on_init':
        return ONDC_STATES.INITIALIZED;
      case 'confirm':
      case 'on_confirm':
        return ONDC_STATES.CONFIRMED;
      case 'cancel':
      case 'on_cancel':
        return ONDC_STATES.CANCELLED;
      // Operations like track, status, update generally maintain the current lifecycle state
      default:
        return currentState || ONDC_STATES.SEARCHED;
    }
  }
}

export const stateMachineService = new StateMachineService();
