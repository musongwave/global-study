import '@testing-library/jest-dom'

// jsdom не реализует matchMedia — базовый мок (matches: false).
// Тесты, которым нужно matches: true, переопределяют через vi.spyOn.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
