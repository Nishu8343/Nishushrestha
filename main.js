/* ═══════════════════════════════════════════════════════════
   NISHU SHRESTHA — PORTFOLIO SCRIPTS
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Custom Cursor ─────────────────────────────────────── */
  const curEl = document.getElementById('cursor');
  const dotEl = document.getElementById('cursor-dot');
  let mx = -200, my = -200;
  let dx = -200, dy = -200;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function moveCursor() {
    dx += (mx - dx) * 0.14;
    dy += (my - dy) * 0.14;
    if (curEl) { curEl.style.left = mx + 'px'; curEl.style.top = my + 'px'; }
    if (dotEl) { dotEl.style.left = dx + 'px'; dotEl.style.top = dy + 'px'; }
    requestAnimationFrame(moveCursor);
  })();

  document.querySelectorAll('a, button, [role="button"], .tl-head, .proj, .skill-badge')
    .forEach(el => {
      el.addEventListener('mouseenter', () => curEl && curEl.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => curEl && curEl.classList.remove('cursor-hover'));
    });

  /* ─── Scroll Progress ───────────────────────────────────── */
  const prog = document.getElementById('progress');
  window.addEventListener('scroll', () => {
    if (!prog) return;
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    prog.style.height = Math.min(pct, 100) + '%';
  }, { passive: true });

  /* ─── Particle Canvas ───────────────────────────────────── */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    let pmx = -9999, pmy = -9999;

    function resizeCanvas() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('mousemove', e => { pmx = e.clientX; pmy = e.clientY; }, { passive: true });

    const COUNT = Math.min(65, Math.floor(window.innerWidth * 0.045));
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .38,
      vy: (Math.random() - .5) * .38,
      r: Math.random() * 1.4 + .4,
      c: Math.random() > .5 ? '139,92,246' : '6,182,212',
    }));

    (function drawFrame() {
      ctx.clearRect(0, 0, W, H);

      pts.forEach(p => {
        const ddx = p.x - pmx, ddy = p.y - pmy;
        const dd = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dd < 130) {
          const f = ((130 - dd) / 130) * .75;
          p.vx += (ddx / dd) * f * .06;
          p.vy += (ddy / dd) * f * .06;
        }
        p.vx *= .988; p.vy *= .988;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},.75)`;
        ctx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const ex = pts[i].x - pts[j].x, ey = pts[i].y - pts[j].y;
          const ed = ex * ex + ey * ey;
          if (ed < 15000) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${(1 - ed / 15000) * .28})`;
            ctx.lineWidth = .55;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawFrame);
    })();
  }

  /* ─── Typewriter ────────────────────────────────────────── */
  const roles = ['Developer', 'Founder', 'AI Enthusiast', 'Problem Solver', 'Full-Stack Engineer'];
  const twEl = document.getElementById('tw');
  if (twEl) {
    let ri = 0, ci = 0, del = false;
    function tick() {
      const w = roles[ri];
      if (!del) {
        twEl.textContent = w.slice(0, ++ci);
        if (ci === w.length) { del = true; setTimeout(tick, 1900); return; }
        setTimeout(tick, 95);
      } else {
        twEl.textContent = w.slice(0, --ci);
        if (ci === 0) { del = false; ri = (ri + 1) % roles.length; setTimeout(tick, 380); return; }
        setTimeout(tick, 52);
      }
    }
    tick();
  }

  /* ─── Intersection Observer (reveals) ──────────────────── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); } });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Also fire immediately for anything already in view on load
  document.querySelectorAll('.reveal').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
  });

  /* ─── Active Nav ────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-a');
  const navIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => navIO.observe(s));

  /* ─── Clipboard + Toast ─────────────────────────────────── */
  window.copyEmail = function () {
    navigator.clipboard.writeText('cresthaneeshu@gmail.com')
      .then(showToast)
      .catch(() => { window.location.href = 'mailto:cresthaneeshu@gmail.com'; });
  };

  function showToast() {
    const t = document.getElementById('toast');
    if (!t) return;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ─── Skill Constellation Canvas ───────────────────────── */
  const sc = document.getElementById('skill-canvas');
  if (sc) {
    const sctx = sc.getContext('2d');
    let scW, scH, hovered = -1, t = 0;

    const NODES = [
      { n: 'Python', x: .50, y: .48, c: '#8B5CF6', r: 27 },
      { n: 'React', x: .21, y: .22, c: '#06B6D4', r: 21 },
      { n: 'TypeScript', x: .78, y: .22, c: '#06B6D4', r: 21 },
      { n: 'FastAPI', x: .76, y: .55, c: '#8B5CF6', r: 19 },
      { n: 'Next.js', x: .24, y: .60, c: '#8B5CF6', r: 19 },
      { n: 'Docker', x: .50, y: .84, c: '#22D3EE', r: 17 },
      { n: 'PyTorch', x: .16, y: .78, c: '#A78BFA', r: 17 },
      { n: 'Azure', x: .84, y: .78, c: '#22D3EE', r: 17 },
      { n: 'PostgreSQL', x: .84, y: .42, c: '#8B5CF6', r: 15 },
      { n: 'Java', x: .16, y: .40, c: '#A78BFA', r: 15 },
      { n: 'Node.js', x: .50, y: .14, c: '#10B981', r: 17 },
      { n: 'Figma', x: .62, y: .82, c: '#F472B6', r: 14 },
      { n: 'Git', x: .38, y: .82, c: '#FB923C', r: 14 },
    ];
    const EDGES = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 10],
      [1, 4], [1, 6], [2, 3], [2, 8], [3, 8], [4, 9],
      [5, 6], [5, 7], [5, 12], [6, 9], [7, 8],
      [10, 1], [10, 2], [11, 3], [12, 5],
    ];
    const pos = [];

    const dpr = window.devicePixelRatio || 1;
    function resizeSC() {
      const r = sc.getBoundingClientRect();
      sc.width = r.width * dpr;
      sc.height = r.height * dpr;
      scW = r.width; scH = r.height;
    }
    resizeSC();
    new ResizeObserver(resizeSC).observe(sc);

    sc.addEventListener('mousemove', e => {
      const r = sc.getBoundingClientRect();
      const mx2 = e.clientX - r.left, my2 = e.clientY - r.top;
      hovered = -1;
      pos.forEach((p, i) => {
        if (Math.hypot(p.x - mx2, p.y - my2) < NODES[i].r + 10) hovered = i;
      });
    });
    sc.addEventListener('mouseleave', () => { hovered = -1; });

    (function draw() {
      sctx.save();
      sctx.scale(dpr, dpr);
      sctx.clearRect(0, 0, scW, scH);
      t += .009;

      // compute positions
      pos.length = 0;
      NODES.forEach((nd, i) => {
        const ox = i === 0 ? 0 : Math.sin(t + i * 1.4) * 5;
        const oy = i === 0 ? 0 : Math.cos(t * .8 + i * 1.2) * 5;
        pos.push({ x: nd.x * scW + ox, y: nd.y * scH + oy });
      });

      // edges
      EDGES.forEach(([a, b]) => {
        const pa = pos[a], pb = pos[b];
        const isH = hovered === a || hovered === b;
        const d = Math.hypot(pa.x - pb.x, pa.y - pb.y);
        const alpha = Math.max(0, (210 - d) / 210) * (isH ? .55 : .2);
        if (alpha <= 0) return;
        sctx.beginPath(); sctx.moveTo(pa.x, pa.y); sctx.lineTo(pb.x, pb.y);
        sctx.strokeStyle = `rgba(139,92,246,${alpha})`;
        sctx.lineWidth = isH ? 1.5 : .8;
        sctx.stroke();
      });

      // nodes
      NODES.forEach((nd, i) => {
        const p = pos[i], isH = hovered === i;
        const r = nd.r + (isH ? 5 : 0);

        // glow
        const g = sctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.8);
        g.addColorStop(0, nd.c + '25');
        g.addColorStop(1, 'transparent');
        sctx.beginPath(); sctx.arc(p.x, p.y, r * 2.8, 0, Math.PI * 2);
        sctx.fillStyle = g; sctx.fill();

        // circle fill
        sctx.beginPath(); sctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        sctx.fillStyle = nd.c + (isH ? '28' : '18');
        sctx.strokeStyle = nd.c + (isH ? 'ee' : '66');
        sctx.lineWidth = isH ? 2 : 1.5;
        sctx.fill(); sctx.stroke();

        // label
        const fs = i === 0 ? 13 : (r >= 18 ? 11 : 10);
        sctx.font = `${isH ? 600 : 500} ${fs}px Inter, sans-serif`;
        sctx.fillStyle = isH ? '#F1F5F9' : '#94A3B8';
        sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
        if (r >= 17 || isH) {
          sctx.fillText(nd.n, p.x, p.y);
        } else {
          sctx.fillText(nd.n, p.x, p.y + r + 11);
        }
      });

      sctx.restore();
      requestAnimationFrame(draw);
    })();
  }

})();
