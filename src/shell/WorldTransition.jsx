import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { createDissolve } from "../components/effects/shaders/dissolve";
import { worldColors } from "./worldColors";
import { WorldTransitionContext } from "./worldTransitionContext";

const toCss = (rgb) => `rgb(${rgb.map((c) => Math.round(c * 255)).join(" ")})`;

/**
 * Moves between worlds behind a veil in the destination's colours: the veil
 * burns in along a noise edge, the route changes underneath, then it burns
 * away. Reduced motion (or no WebGL) gets a short crossfade instead.
 */
const WorldTransition = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const canvasRef = useRef(null);
  const veilRef = useRef(null);
  const fxRef = useRef(null);
  const busyRef = useRef(false);
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    fxRef.current = createDissolve(canvasRef.current);
    return () => {
      fxRef.current?.destroy();
      fxRef.current = null;
    };
  }, []);

  const go = useCallback(
    (to) => {
      if (busyRef.current || to === pathRef.current) return;
      busyRef.current = true;
      const colors = worldColors(to.split("/")[1] || "gate");
      const done = () => {
        busyRef.current = false;
      };

      // Two frames after navigating, the new world has rendered under the veil.
      const afterRender = (fn) =>
        requestAnimationFrame(() => requestAnimationFrame(fn));

      const fx = fxRef.current;
      if (!fx) {
        const veil = veilRef.current;
        veil.style.background = toCss(colors.bg);
        gsap.to(veil, {
          autoAlpha: 1,
          duration: 0.25,
          onComplete: () => {
            navigate(to);
            afterRender(() => gsap.to(veil, { autoAlpha: 0, duration: 0.35, onComplete: done }));
          },
        });
        return;
      }

      const canvas = canvasRef.current;
      const state = { p: 0 };
      const draw = () => fx.draw(state.p, colors);
      fx.reseed();
      canvas.style.visibility = "visible";
      gsap.to(state, {
        p: 1,
        duration: 0.8,
        ease: "power2.in",
        onUpdate: draw,
        onComplete: () => {
          navigate(to);
          afterRender(() =>
            gsap.to(state, {
              p: 0,
              duration: 0.95,
              ease: "power2.out",
              onUpdate: draw,
              onComplete: () => {
                canvas.style.visibility = "hidden";
                done();
              },
            })
          );
        },
      });
    },
    [navigate]
  );

  return (
    <WorldTransitionContext.Provider value={go}>
      {children}
      {/* Under the grain (z-80) so the veil gets the same film texture */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 w-full h-full z-[70] pointer-events-none"
        style={{ visibility: "hidden" }}
      />
      <div
        ref={veilRef}
        aria-hidden="true"
        className="fixed inset-0 z-[70] pointer-events-none"
        style={{ opacity: 0, visibility: "hidden" }}
      />
    </WorldTransitionContext.Provider>
  );
};

export default WorldTransition;
