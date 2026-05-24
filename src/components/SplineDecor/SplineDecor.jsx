import { Suspense, lazy, useEffect, useRef } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

const SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export default function SplineDecor() {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const forwardMouse = (e) => {
      const canvas = wrapper.querySelector("canvas");
      if (!canvas) return;

      canvas.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: e.clientX,
          clientY: e.clientY,
          bubbles: true,
          cancelable: true,
        })
      );
    };

    window.addEventListener("mousemove", forwardMouse, { passive: true });
    return () => window.removeEventListener("mousemove", forwardMouse);
  }, []);

  return (
    <div ref={wrapperRef} className="spline-decor-wrapper">
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
    </div>
  );
}
