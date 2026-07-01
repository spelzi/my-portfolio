/**
 * Custom render helpers for the test suite.
 *
 * WHY NOT `export * from "@testing-library/react"`?
 * Vite 8 uses the Oxc parser, which correctly flags a duplicate named export
 * when `export *` re-exports `render` AND `export { customRender as render }`
 * also exports `render`. The fix is to explicitly list every utility we
 * re-export, so there is no ambiguity.
 */
import {
  render as rtlRender,
  screen,
  act,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ─── Re-export RTL utilities (render is overridden below) ───────────────────
export {
  screen,
  act,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
  cleanup,
};

// ─── Default providers ───────────────────────────────────────────────────────
// Add any global context providers here as the app grows
// (theme, i18n, Redux store, etc.)
const AllTheProviders = ({ children }) => children;

// ─── Custom render (overrides RTL's render) ──────────────────────────────────
export const render = (ui, options) =>
  rtlRender(ui, { wrapper: AllTheProviders, ...options });

// ─── Router-aware render ─────────────────────────────────────────────────────
// Convenience for components that use <Link>, useNavigate, useLocation, etc.
export const renderWithRouter = (ui, { route = "/", ...options } = {}) =>
  rtlRender(
    <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>,
    options,
  );
