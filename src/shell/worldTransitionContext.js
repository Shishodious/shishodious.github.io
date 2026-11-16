import { createContext, useContext } from "react";

export const WorldTransitionContext = createContext(null);

/** Returns `go(to)`: navigate to a path behind the world dissolve. */
export const useWorldNavigate = () => useContext(WorldTransitionContext);
