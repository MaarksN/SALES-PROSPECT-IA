
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from './useStore';

// Mock toast to avoid UI errors in tests
vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({
      credits: 50,
      user: { email: 'test@example.com', name: 'Test' },
      leads: []
    });
  });

  it('should initialize with default credits', () => {
    const { credits } = useStore.getState();
    expect(credits).toBe(50);
  });

  it('should decrement credits correctly', () => {
    useStore.getState().decrementCredits(10);
    expect(useStore.getState().credits).toBe(40);
  });

  it('should throw error if insufficient credits', () => {
    useStore.setState({ credits: 5 });
    expect(() => useStore.getState().decrementCredits(10)).toThrow('LOW_CREDITS');
  });

  it('should update user state', () => {
    useStore.setState({ user: { email: 'new@test.com', name: 'New' } });
    expect(useStore.getState().user?.email).toBe('new@test.com');
  });
});
