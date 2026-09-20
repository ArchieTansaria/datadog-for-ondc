export type ValidationStatus = 'VALID' | 'INVALID_TRANSITION' | 'UNEXPECTED_EVENT' | 'UNSUPPORTED_FLOW';

export interface StateEvaluationRequest {
  domain: string;
  action: string;
  currentState?: string;
  currentFulfillmentState?: string;
  incomingFulfillmentState?: string;
}

export interface StateEvaluationResult {
  status: ValidationStatus;
  nextState?: string;
  nextFulfillmentState?: string;
}

const SUPPORTED_DOMAINS = ['nic2004:52110', 'ONDC:RET10', 'ONDC:RET11', 'ONDC:RET12'];

const FULFILLMENT_PROGRESSION: string[] = [
  'Pending',
  'Packed',
  'Agent-assigned',
  'Picked',
  'Out-for-delivery',
  'Delivered'
];

export class StateMachineService {
  evaluate(req: StateEvaluationRequest): StateEvaluationResult {
    if (!SUPPORTED_DOMAINS.includes(req.domain)) {
      return { status: 'UNSUPPORTED_FLOW' };
    }

    const currentState = req.currentState || 'CREATED';
    const action = req.action;
    
    if (currentState === 'COMPLETED' || currentState === 'CANCELLED') {
      return { status: 'INVALID_TRANSITION' };
    }

    if (action === 'cancel' || action === 'on_cancel') {
      return { status: 'VALID', nextState: 'CANCELLED', nextFulfillmentState: req.currentFulfillmentState };
    }

    if (action === 'status' || action === 'on_status') {
      if (currentState !== 'CONFIRMED' && currentState !== 'IN_PROGRESS') {
        return { status: 'INVALID_TRANSITION' };
      }
      
      const newFulfill = req.incomingFulfillmentState;
      if (!newFulfill) {
         return { status: 'VALID', nextState: currentState, nextFulfillmentState: req.currentFulfillmentState };
      }

      if (!FULFILLMENT_PROGRESSION.includes(newFulfill)) {
         return { status: 'UNEXPECTED_EVENT' };
      }

      const currIdx = req.currentFulfillmentState ? FULFILLMENT_PROGRESSION.indexOf(req.currentFulfillmentState) : -1;
      const nextIdx = FULFILLMENT_PROGRESSION.indexOf(newFulfill);

      if (nextIdx <= currIdx) {
        return { status: 'INVALID_TRANSITION' };
      }
      
      if (newFulfill === 'Delivered') {
        return { status: 'VALID', nextState: 'COMPLETED', nextFulfillmentState: 'Delivered' };
      }

      return { status: 'VALID', nextState: 'IN_PROGRESS', nextFulfillmentState: newFulfill };
    }

    let valid = false;
    let nextState = currentState;
       
    switch (action) {
      case 'search':
        valid = currentState === 'CREATED';
        nextState = 'SEARCHED';
        break;
      case 'on_search':
        valid = currentState === 'SEARCHED' || currentState === 'CREATED';
        nextState = 'SEARCHED';
        break;
      case 'select':
        valid = currentState === 'SEARCHED';
        nextState = 'SELECTED';
        break;
      case 'on_select':
        valid = currentState === 'SELECTED';
        nextState = 'SELECTED';
        break;
      case 'init':
        valid = currentState === 'SELECTED';
        nextState = 'INITIALIZED';
        break;
      case 'on_init':
        valid = currentState === 'INITIALIZED';
        nextState = 'INITIALIZED';
        break;
      case 'confirm':
        valid = currentState === 'INITIALIZED';
        nextState = 'CONFIRMED';
        break;
      case 'on_confirm':
        valid = currentState === 'CONFIRMED';
        nextState = 'CONFIRMED';
        break;
      default:
        return { status: 'UNEXPECTED_EVENT' };
    }

    if (!valid) {
      return { status: 'INVALID_TRANSITION' };
    }

    return { status: 'VALID', nextState, nextFulfillmentState: req.currentFulfillmentState };
  }
}

export const stateMachineService = new StateMachineService();
