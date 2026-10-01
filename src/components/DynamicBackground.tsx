import React, { useEffect, useRef } from "react";

const emblemImg = "https://raw.githubusercontent.com/TheMeg11/Texa-landing-page/main/src/assets/texa-emblem.png";

/** Eagle eye position inside the emblem image (normalized 0..1) */
const EYE_X = 0.526;
const EYE_Y = 0.337;

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
  const pupilRef = useRef<SVGGElement | null>(null);

  const mouse = useRef({ x: -1, y: -1, has: false });
  const eye = useRef({ x: 0, y: 0 }); // current pupil offset (in SVG units)

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
      if (box && pupil) {
        const rect = box.getBoundingClientRect();
        const cx = rect.left + rect.width * EYE_X;
        const cy = rect.top + rect.height * EYE_Y;

        let tx = 0;
        let ty = 0;
        if (mouse.current.has) {
          const dx = mouse.current.x - cx;
          const dy = mouse.current.y - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const k = Math.min(dist / 320, 1);
          // Realistic predatory pupil shift within eagle eye socket (SVG coordinate units)
          tx = (dx / dist) * k * 6.5;
          ty = (dy / dist) * k * 4.2;
        }
        // Smooth easing towards cursor
        eye.current.x += (tx - eye.current.x) * 0.1;
        eye.current.y += (ty - eye.current.y) * 0.1;

        pupil.setAttribute(
          "transform",
          `translate(${eye.current.x.toFixed(2)}, ${eye.current.y.toFixed(2)})`
        );
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
        {/* Emblem + eye share the same box so the eye stays perfectly aligned */}
        <div ref={emblemBoxRef} className="emblem-box">
          <div className="halo" />
          <div className="emblem-bg" style={{ backgroundImage: `url(${emblemImg})` }} />

          {/* Majestic Eagle Eye (Sharp, Predatory, Raptor-form) */}
          <div
            className="eye"
            style={{ left: `${EYE_X * 100}%`, top: `${EYE_Y * 100}%` }}
          >
            <div className="eye-lid">
              <svg
                viewBox="0 0 100 52"
                className="eagle-eye-svg"
                aria-hidden="true"
              >
                <defs>
                  {/* Raptor almond eye socket with sharp canthus pointing toward beak */}
                  <clipPath id="eagleEyeClip">
                    <path d="M 8,24 C 18,12 40,7 65,11 C 78,13 88,20 95,28 C 86,39 65,46 44,44 C 26,42 14,34 8,24 Z" />
                  </clipPath>

                  {/* Golden-amber piercing iris radial gradient */}
                  <radialGradient id="eagleIrisGrad" cx="48%" cy="50%" r="52%">
                    <stop offset="0%" stopColor="#fff3b0" />
                    <stop offset="25%" stopColor="#f7c844" />
                    <stop offset="60%" stopColor="#c98a1a" />
                    <stop offset="85%" stopColor="#87530c" />
                    <stop offset="100%" stopColor="#3d2204" />
                  </radialGradient>

                  {/* Deep obsidian pupil gradient */}
                  <radialGradient id="eaglePupilGrad" cx="45%" cy="45%" r="55%">
                    <stop offset="0%" stopColor="#1a140d" />
                    <stop offset="70%" stopColor="#080604" />
                    <stop offset="100%" stopColor="#000000" />
                  </radialGradient>

                  {/* Supraorbital brow shadow cast down over upper eye */}
                  <linearGradient id="eagleBrowShadow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(24, 15, 4, 0.9)" />
                    <stop offset="50%" stopColor="rgba(35, 22, 6, 0.45)" />
                    <stop offset="100%" stopColor="rgba(35, 22, 6, 0)" />
                  </linearGradient>
                </defs>

                {/* Sclera / eye background border */}
                <path
                  d="M 8,24 C 18,12 40,7 65,11 C 78,13 88,20 95,28 C 86,39 65,46 44,44 C 26,42 14,34 8,24 Z"
                  fill="#2b1a06"
                  stroke="rgba(205, 164, 94, 0.35)"
                  strokeWidth="1.2"
                />

                {/* Clipped eyeball content: iris, tracking pupil, highlights & brow shadow */}
                <g clipPath="url(#eagleEyeClip)">
                  {/* Base dark sclera */}
                  <rect x="0" y="0" width="100" height="52" fill="#3a2408" />

                  {/* Piercing golden-amber raptor iris */}
                  <ellipse cx="50" cy="27" rx="28" ry="22" fill="url(#eagleIrisGrad)" />

                  {/* Iris striated rings for raptor detail */}
                  <circle cx="50" cy="27" r="20" stroke="rgba(255, 235, 160, 0.28)" strokeWidth="0.8" strokeDasharray="1.5 2" fill="none" />
                  <circle cx="50" cy="27" r="14" stroke="rgba(120, 75, 10, 0.35)" strokeWidth="0.8" strokeDasharray="1 1.5" fill="none" />

                  {/* Tracking pupil + specular reflection (shifted by cursor) */}
                  <g ref={pupilRef} className="eagle-pupil-group">
                    {/* Deep black raptor pupil */}
                    <ellipse cx="50" cy="27" rx="10.5" ry="11.5" fill="url(#eaglePupilGrad)" />
                    {/* Subtle golden pupil border */}
                    <ellipse cx="50" cy="27" rx="10.5" ry="11.5" stroke="rgba(205, 164, 94, 0.3)" strokeWidth="0.6" fill="none" />

                    {/* Specular glistening glints */}
                    <circle cx="46.5" cy="22.5" r="2.2" fill="#ffffff" opacity="0.95" />
                    <circle cx="53.5" cy="30" r="1.1" fill="#ffe9a0" opacity="0.65" />
                  </g>

                  {/* Supraorbital fierce shadow cast by upper brow */}
                  <rect x="0" y="0" width="100" height="26" fill="url(#eagleBrowShadow)" />
                </g>

                {/* Fierce supraorbital brow ridge line */}
                <path
                  d="M 5,23 C 16,9 40,4 66,8 C 80,11 90,18 97,27"
                  fill="none"
                  stroke="rgba(243, 220, 163, 0.85)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                {/* Lower lid rim */}
                <path
                  d="M 12,27 C 22,37 42,44 65,43 C 78,41 88,34 94,29"
                  fill="none"
                  stroke="rgba(140, 95, 25, 0.6)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_32%,transparent_28%,#060608_78%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-[#060608] via-[#060608]/85 to-transparent" />
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(205,164,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(205,164,94,0.03)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_50%_30%,black,transparent_70%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </div>
  );
};
