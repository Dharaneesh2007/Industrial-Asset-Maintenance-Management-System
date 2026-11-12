import '@testing-library/jest-dom';

const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('React Router Future Flag Warning') ||
       args[0].includes('SerializableStateInvariantMiddleware') ||
       args[0].includes('ImmutableStateInvariantMiddleware'))
    ) {
      return;
    }
    originalWarn(...args);
  };
});