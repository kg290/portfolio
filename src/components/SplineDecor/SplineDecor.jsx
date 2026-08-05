import { Suspense, lazy, useEffect, useRef, useState } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

const SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export default function SplineDecor() {
  const wrapperRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  // Only download the ~4MB runtime + scene once the sidebar region is
  // actually near the viewport, instead of competing with the intro.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldRender(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Forward window mouse moves to the Spline canvas, throttled to one
  // dispatch per animation frame.
  useEffect(() => {
    if (!shouldRender) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let rafId = 0;
    let pending = null;

    const forwardMouse = (e) => {
      pending = { clientX: e.clientX, clientY: e.clientY };
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const canvas = wrapper.querySelector("canvas");
        if (!canvas || !pending) return;

        canvas.dispatchEvent(
          new MouseEvent("mousemove", {
            clientX: pending.clientX,
            clientY: pending.clientY,
            bubbles: true,
            cancelable: true,
          })
        );
      });
    };

    window.addEventListener("mousemove", forwardMouse, { passive: true });
    return () => {
      window.removeEventListener("mousemove", forwardMouse);
      cancelAnimationFrame(rafId);
    };
  }, [shouldRender]);

  return (
    <div ref={wrapperRef} className="spline-decor-wrapper">
      {shouldRender ? (
        <Suspense
          fallback={
            <div className="spline-decor-loader">
              <span className="spline-decor-spinner" />
            </div>
          }
        >
          <Spline
            scene={SCENE_URL}
            className="spline-decor-canvas"
            style={{ background: "transparent" }}
          />
        </Suspense>
      ) : (
        <div className="spline-decor-loader">
          <span className="spline-decor-spinner" />
        </div>
      )}
    </div>
  );
}
