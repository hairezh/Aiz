(() => {
  const start = () => {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: true });

    Object.assign(canvas.style, {
      position: "fixed",
      left: "0",
      top: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "9999",
      opacity: "0.65"
    });

    (document.body || document.documentElement).appendChild(canvas);

    let w = 0, h = 0, dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.floor(window.innerWidth * dpr);
      h = Math.floor(window.innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
    };

    window.addEventListener("resize", resize, { passive: true });
    resize();

    const rand = (a, b) => a + Math.random() * (b - a);

    const FLAKES = 120;
    const flakes = Array.from({ length: FLAKES }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(0.8, 2.8) * dpr,
      vy: rand(25, 85) * dpr,
      vx: rand(-12, 12) * dpr,
      wobble: rand(0, Math.PI * 2),
      wobbleSpeed: rand(0.6, 1.6),
    }));

    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(230,230,230,0.9)";

      for (const f of flakes) {
        f.wobble += f.wobbleSpeed * dt;
        f.x += (f.vx + Math.sin(f.wobble) * 10 * dpr) * dt;
        f.y += f.vy * dt;

        if (f.y - f.r > h) { f.y = -f.r; f.x = rand(0, w); }
        if (f.x < -30 * dpr) f.x = w + 30 * dpr;
        if (f.x > w + 30 * dpr) f.x = -30 * dpr;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
