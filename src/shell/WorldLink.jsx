import { Link } from "react-router-dom";
import { useWorldNavigate } from "./worldTransitionContext";

/**
 * A router link that crosses into another world behind the dissolve.
 * Modified clicks (new tab, etc.) keep the browser's default behaviour.
 */
const WorldLink = ({ to, onClick, ...props }) => {
  const go = useWorldNavigate();
  return (
    <Link
      to={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        go(to);
      }}
      {...props}
    />
  );
};

export default WorldLink;
