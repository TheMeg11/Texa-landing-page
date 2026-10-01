import React, { useEffect, useRef } from "react";
import emblemImg from "../assets/texa-emblem.png";

/** Eagle eye position inside the emblem image (normalized 0..1) */
const EYE_X = 0.527;
const EYE_Y = 0.336;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  phase: number;
  speed: number;
}

export const DynamicBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const emblemBoxRef = useRef<HTMLDivElement | null>(null);
  const pupilRef = useRef<HTMLDivElement | null>(null);
  const glintRef = useRef<HTMLDivElement | null>(null);

  const mouse = useRef({ x: -1, y: -1, has: false });
  const eye = useRef({ x: 0, y: 0 }); // current pupil offset (px)

  /* ---------- Soft golden dust (very light) ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = w < 768 ? 22 : 40;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(Math.random() * 0.14 + 0.04),
        r: Math.random() * 1.4 + 0.6,
        a: Math.random() * 0.35 + 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.012 + 0.004,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 1;
      for (const p of particles) {
        if (!reduceMotion) {
          p.x += p.vx + Math.sin(t * 0.004 + p.phase) * 0.08;
          p.y += p.vy;
          p.phase += p.speed;
          if (p.y < -8) { p.y = h + 8; p.x = Math.random() * w; }
          if (p.x < -8) p.x = w + 8;
          if (p.x > w + 8) p.x = -8;
        }
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(222, 186, 120, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    setup();
    draw();
    window.addEventListener("resize", setup);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setup);
    };
  }, []);

  /* ---------- Eagle eye follows the cursor ---------- */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, has: true };
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, has: true };
    };
    const onLeave = () => { mouse.current.has = false; };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const tick = () => {
      const box = emblemBoxRef.current;
      const pupil = pupilRef.current;
      const glint = glintRef.current;
      if (box && pupil) {
        const rect = box.getBoundingClientRect();
        const cx = rect.left + rect.width * EYE_X;
        const cy = rect.top + rect.height * EYE_Y;
        const maxOff = rect.width * 0.0055; // tiny, realistic pupil travel

        let tx = 0;
        let ty = 0;
        if (mouse.current.has) {
          const dx = mouse.current.x - cx;
          const dy = mouse.current.y - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const k = Math.min(dist / 260, 1) * maxOff;
          tx = (dx / dist) * k;
          ty = (dy / dist) * k;
        }
        // smooth easing
        eye.current.x += (tx - eye.current.x) * 0.1;
        eye.current.y += (ty - eye.current.y) * 0.1;
        pupil.style.transform = `translate(calc(-50% + ${eye.current.x.toFixed(2)}px), calc(-50% + ${eye.current.y.toFixed(2)}px))`;
        if (glint) {
          glint.style.transform = `translate(calc(-50% + ${(eye.current.x * 0.4).toFixed(2)}px), calc(-50% + ${(eye.current.y * 0.4).toFixed(2)}px))`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#060608]">
      {/* Light golden dust */}
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />

      <div className="pointer-events-none absolute inset-0 z-[1] select-none overflow-hidden">
        <div className="halo" />

        {/* Emblem + eye share the same box so the eye stays aligned */}
        <div ref={emblemBoxRef} className="emblem-box">
          <div className="emblem-bg" style={{ backgroundImage: `url(${emblemImg})` }} />

          {/* Eagle eye */}
          <div
            className="eye"
            style={{ left: `${EYE_X * 100}%`, top: `${EYE_Y * 100}%` }}
          >
            <div className="eye-lid">
              <div className="eye-iris" />
              <div ref={pupilRef} className="eye-pupil" />
              <div ref={glintRef} className="eye-glint" />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#060608_86%)]" />
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(205,164,94,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(205,164,94,0.035)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </div>
  );
};
