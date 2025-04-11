import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock window.matchMedia
const matchMediaMock = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
}); 