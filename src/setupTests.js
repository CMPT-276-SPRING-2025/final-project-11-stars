// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0] &&
    (args[0].includes("React Router Future Flag Warning") ||
     args[0].includes("Relative route resolution within Splat routes"))
  ) {
    return;
  }
  originalWarn(...args);
};