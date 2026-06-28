import { useState } from "react";

/* Reusable button with a built-in loading spinner.
   Two modes:
   1. Self-managed — pass `onClick` (sync or async). The button shows its own
      spinner for at least `minDuration` ms after click, then re-enables.
      Used for buttons that don't already track their own loading state
      (Admin Save/Delete, Sign In, "View Project" links, etc).
   2. Externally-controlled — pass `loading` explicitly (e.g. Contact's form,
      which already tracks its own `loading` state while the fetch is in
      flight). The component just renders the spinner based on that prop
      and leaves the click handler alone.

    */
const LoadingButton = ({
  as: Component = "button",
  onClick,
  loading: controlledLoading,
  minDuration = 450,
  className = "",
  children,
  disabled,
  ...rest
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const isControlled = controlledLoading !== undefined;
  const isLoading = isControlled ? controlledLoading : internalLoading;

  const handleClick = (e) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }
    if (isControlled) {
      onClick?.(e);
      return;
    }
    if (!onClick) return; // plain navigation link with no handler — nothing to spin for
    setInternalLoading(true);
    const start = Date.now();
    Promise.resolve(onClick(e)).finally(() => {
      const remaining = Math.max(0, minDuration - (Date.now() - start));
      setTimeout(() => setInternalLoading(false), remaining);
    });
  };

  return (
    <Component
      className={`btn-loading${isLoading ? " is-loading" : ""}${className ? ` ${className}` : ""}`}
      onClick={handleClick}
      disabled={Component === "button" ? isLoading || disabled : undefined}
      aria-busy={isLoading}
      {...rest}
    >
      <span className="btn-loading-label">{children}</span>
      <span className="btn-spinner" aria-hidden="true" />
    </Component>
  );
};

export default LoadingButton;
