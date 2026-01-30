(() => {
  // Respect reduced motion
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduceMotion) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { alpha: true });

  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  canvas.style.opacity = "0.55"; // adjust intensity

  document.body.appendChild(canvas);

  let w = 0, h = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.floor(window.innerWidth * dpr);
    h = Math.floor(window.innerHeight * dpr);
    canvas.width = w;
    canvas.height = h;
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  const rand = (a, b) => a + Math.random() * (b - a);

  // Tune here
  const FLAKES = 110;        // number of flakes
  const SPEED_MIN = 18;      // px/sec (scaled by dpr)
  const SPEED_MAX = 70;
  const WIND_MIN = -12;      // horizontal drift
  const WIND_MAX = 12;

  const flakes = Array.from({ length: FLAKES }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(0.8, 2.6) * dpr,
    vy: rand(SPEED_MIN, SPEED_MAX) * dpr,
    vx: rand(WIND_MIN, WIND_MAX) * dpr,
    wobble: rand(0, Math.PI * 2),
    wobbleSpeed: rand(0.6, 1.6),
  }));

  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.033, (now - last) / 1000); // cap dt
    last = now;

    ctx.clearRect(0, 0, w, h);

    // Soft white snow
    ctx.fillStyle = "rgba(220,220,220,0.9)";

    for (const f of flakes) {
      f.wobble += f.wobbleSpeed * dt;
      f.x += (f.vx + Math.sin(f.wobble) * 10 * dpr) * dt;
      f.y += f.vy * dt;

      // Wrap
      if (f.y - f.r > h) {
        f.y = -f.r;
        f.x = rand(0, w);
      }
      if (f.x < -20 * dpr) f.x = w + 20 * dpr;
      if (f.x > w + 20 * dpr) f.x = -20 * dpr;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
