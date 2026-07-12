import { useCallback, useRef } from "react";
import { liquidGlass } from "./liquidGlassEngine";

/**
 * Attach the liquid-glass refraction effect to an element.
 *
 * Returns a *callback ref* — pass it as `ref` on the element you want to turn
 * into glass. Unlike React 19, a React 18 callback ref ignores any returned
 * cleanup, so teardown is handled explicitly: the engine handle is stashed in a
 * ref, destroyed when React calls the ref back with `null` on detach (and
 * before re-attaching a new node).
 *
 * The element still needs its own glass "dressing" — a translucent background,
 * a rounded corner, and the inset highlights — and it needs *something behind
 * it* to refract (imagery, a gradient, page content). See liquid-glass.css.
 */
export function useLiquidGlass(options) {
  // Serialize so the ref re-attaches (rebuilding the filter) only when the
  // option *values* change — not on every same-valued object literal.
  const key = JSON.stringify(options ?? {});
  const handleRef = useRef(null);

  return useCallback(
    (el) => {
      if (handleRef.current) {
        handleRef.current.destroy();
        handleRef.current = null;
      }
      if (!el) return;
      handleRef.current = liquidGlass(el, options);
    },
    // `key` captures the meaningful contents of `options`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
}
