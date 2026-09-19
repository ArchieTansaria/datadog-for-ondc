import { describe, it, expect } from 'vitest';
import { stateMachineService, ONDC_STATES } from './state-machine.service.js';

describe('StateMachineService', () => {
  describe('isValidTransition()', () => {
    it('should allow valid linear forward transitions', () => {
      expect(stateMachineService.isValidTransition(ONDC_STATES.SEARCHED, ONDC_STATES.SELECTED)).toBe(true);
      expect(stateMachineService.isValidTransition(ONDC_STATES.SELECTED, ONDC_STATES.INITIALIZED)).toBe(true);
      expect(stateMachineService.isValidTransition(ONDC_STATES.INITIALIZED, ONDC_STATES.CONFIRMED)).toBe(true);
      expect(stateMachineService.isValidTransition(ONDC_STATES.CONFIRMED, ONDC_STATES.COMPLETED)).toBe(true);
    });

    it('should allow cancellation from any pre-terminal state', () => {
      expect(stateMachineService.isValidTransition(ONDC_STATES.SEARCHED, ONDC_STATES.CANCELLED)).toBe(true);
      expect(stateMachineService.isValidTransition(ONDC_STATES.SELECTED, ONDC_STATES.CANCELLED)).toBe(true);
      expect(stateMachineService.isValidTransition(ONDC_STATES.INITIALIZED, ONDC_STATES.CANCELLED)).toBe(true);
      expect(stateMachineService.isValidTransition(ONDC_STATES.CONFIRMED, ONDC_STATES.CANCELLED)).toBe(true);
    });

    it('should allow self-transitions (status updates)', () => {
      expect(stateMachineService.isValidTransition(ONDC_STATES.CONFIRMED, ONDC_STATES.CONFIRMED)).toBe(true);
    });

    it('should reject backward transitions', () => {
      expect(stateMachineService.isValidTransition(ONDC_STATES.CONFIRMED, ONDC_STATES.INITIALIZED)).toBe(false);
      expect(stateMachineService.isValidTransition(ONDC_STATES.SELECTED, ONDC_STATES.SEARCHED)).toBe(false);
    });

    it('should reject transitions from terminal states', () => {
      expect(stateMachineService.isValidTransition(ONDC_STATES.CANCELLED, ONDC_STATES.CONFIRMED)).toBe(false);
      expect(stateMachineService.isValidTransition(ONDC_STATES.COMPLETED, ONDC_STATES.CANCELLED)).toBe(false);
    });
    
    it('should reject invalid state skips', () => {
      expect(stateMachineService.isValidTransition(ONDC_STATES.SEARCHED, ONDC_STATES.CONFIRMED)).toBe(false);
    });
  });

  describe('deriveStateFromAction()', () => {
    it('should derive state from primary ONDC actions', () => {
      expect(stateMachineService.deriveStateFromAction('on_search')).toBe(ONDC_STATES.SEARCHED);
      expect(stateMachineService.deriveStateFromAction('select')).toBe(ONDC_STATES.SELECTED);
      expect(stateMachineService.deriveStateFromAction('on_init')).toBe(ONDC_STATES.INITIALIZED);
      expect(stateMachineService.deriveStateFromAction('confirm')).toBe(ONDC_STATES.CONFIRMED);
      expect(stateMachineService.deriveStateFromAction('on_cancel')).toBe(ONDC_STATES.CANCELLED);
    });

    it('should default to current state for non-mutating actions like status', () => {
      expect(stateMachineService.deriveStateFromAction('on_status', ONDC_STATES.CONFIRMED)).toBe(ONDC_STATES.CONFIRMED);
      expect(stateMachineService.deriveStateFromAction('track', ONDC_STATES.INITIALIZED)).toBe(ONDC_STATES.INITIALIZED);
    });

    it('should default to SEARCHED if no current state is provided for unknown action', () => {
      expect(stateMachineService.deriveStateFromAction('unknown_action')).toBe(ONDC_STATES.SEARCHED);
    });
  });
});
