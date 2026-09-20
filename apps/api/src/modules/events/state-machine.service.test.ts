import { describe, it, expect } from 'vitest';
import { stateMachineService } from './state-machine.service';

const domain = 'nic2004:52110';

describe('StateMachineService', () => {
  it('1. Complete valid happy path: search -> delivered', () => {
    let state = stateMachineService.evaluate({ domain, action: 'search' });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('SEARCHED');

    state = stateMachineService.evaluate({ domain, action: 'on_search', currentState: state.nextState });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('SEARCHED');

    state = stateMachineService.evaluate({ domain, action: 'select', currentState: state.nextState });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('SELECTED');

    state = stateMachineService.evaluate({ domain, action: 'on_select', currentState: state.nextState });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('SELECTED');

    state = stateMachineService.evaluate({ domain, action: 'init', currentState: state.nextState });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('INITIALIZED');

    state = stateMachineService.evaluate({ domain, action: 'on_init', currentState: state.nextState });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('INITIALIZED');

    state = stateMachineService.evaluate({ domain, action: 'confirm', currentState: state.nextState });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('CONFIRMED');

    state = stateMachineService.evaluate({ domain, action: 'on_confirm', currentState: state.nextState });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('CONFIRMED');

    state = stateMachineService.evaluate({ domain, action: 'on_status', currentState: state.nextState, incomingFulfillmentState: 'Pending' });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('IN_PROGRESS');
    expect(state.nextFulfillmentState).toBe('Pending');

    state = stateMachineService.evaluate({ domain, action: 'on_status', currentState: state.nextState, currentFulfillmentState: state.nextFulfillmentState, incomingFulfillmentState: 'Packed' });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('IN_PROGRESS');
    expect(state.nextFulfillmentState).toBe('Packed');

    state = stateMachineService.evaluate({ domain, action: 'on_status', currentState: state.nextState, currentFulfillmentState: state.nextFulfillmentState, incomingFulfillmentState: 'Agent-assigned' });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('IN_PROGRESS');
    
    state = stateMachineService.evaluate({ domain, action: 'on_status', currentState: state.nextState, currentFulfillmentState: state.nextFulfillmentState, incomingFulfillmentState: 'Picked' });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('IN_PROGRESS');

    state = stateMachineService.evaluate({ domain, action: 'on_status', currentState: state.nextState, currentFulfillmentState: state.nextFulfillmentState, incomingFulfillmentState: 'Out-for-delivery' });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('IN_PROGRESS');

    state = stateMachineService.evaluate({ domain, action: 'on_status', currentState: state.nextState, currentFulfillmentState: state.nextFulfillmentState, incomingFulfillmentState: 'Delivered' });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('COMPLETED');
    expect(state.nextFulfillmentState).toBe('Delivered');
  });

  it('2. Invalid transition: on_confirm before init/on_init', () => {
    // Current state SELECTED
    const state = stateMachineService.evaluate({ domain, action: 'on_confirm', currentState: 'SELECTED' });
    expect(state.status).toBe('INVALID_TRANSITION');
  });

  it('3. Invalid transition: delivered before required fulfillment progression', () => {
    // Going backwards in fulfillment state is invalid
    const state = stateMachineService.evaluate({ domain, action: 'on_status', currentState: 'IN_PROGRESS', currentFulfillmentState: 'Picked', incomingFulfillmentState: 'Packed' });
    expect(state.status).toBe('INVALID_TRANSITION');
  });

  it('4. Valid cancellation branch', () => {
    const state = stateMachineService.evaluate({ domain, action: 'on_cancel', currentState: 'INITIALIZED' });
    expect(state.status).toBe('VALID');
    expect(state.nextState).toBe('CANCELLED');
  });

  it('5. Event after COMPLETED is rejected/handled correctly', () => {
    const state = stateMachineService.evaluate({ domain, action: 'on_status', currentState: 'COMPLETED' });
    expect(state.status).toBe('INVALID_TRANSITION');
  });

  it('6. Event after CANCELLED is rejected/handled correctly', () => {
    const state = stateMachineService.evaluate({ domain, action: 'on_status', currentState: 'CANCELLED' });
    expect(state.status).toBe('INVALID_TRANSITION');
  });

  it('7. Unsupported flow is identified explicitly', () => {
    const state = stateMachineService.evaluate({ domain: 'mobility:ride', action: 'on_search' });
    expect(state.status).toBe('UNSUPPORTED_FLOW');
  });
});
