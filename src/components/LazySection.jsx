import { Suspense, useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Defers mounting (and the code-split import) of a section until it is about to
 * scroll into view. The wrapper carries the section's anchor id so nav links
 * (shell/sectionScroll) can always find the target instantly — even before the
 * section mounts — which keeps navbar navigation snappy. A full-height placeholder
 * matches the real (min-h-screen) section height so positions don't shift as
 * sections mount, so smooth-scroll lands accurately.
 */
const LazySection = ({
  children,
  anchorId,
  minHeight = "100vh",
  rootMargin = "600px",
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  // A mounted section rarely matches its placeholder height, which moves
  // every pinned/scrubbed trigger below it. Re-measure once it settles.
  useEffect(() => {
    const el = ref.current;
    if (!el || !visible) return;
    let timer;
    const resize = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    resize.observe(el);
    return () => {
      clearTimeout(timer);
      resize.disconnect();
    };
  }, [visible]);

  return (
    <div
      ref={ref}
      name={anchorId}
      id={anchorId}
      style={visible ? undefined : { minHeight }}
    >
      {visible ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
};

export default LazySection;
