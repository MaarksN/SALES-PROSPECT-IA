import "@testing-library/jest-dom";
import { vi, afterEach } from "vitest";

// Mock para ResizeObserver (usado por Recharts)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Mock para scrollIntoView (usado em listas)
window.HTMLElement.prototype.scrollIntoView = function() {};

// Limpa mocks após cada teste
afterEach(() => {
  vi.clearAllMocks();
});