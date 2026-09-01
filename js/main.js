/* ============================================================================
   ACELERO COMEX — main.js

   Sem dependência obrigatória: se o GSAP não carregar, tudo cai para
   IntersectionObserver e o site continua inteiro.

   Módulos
   01. Utilitários
   02. Globo de rotas (canvas, procedural)
   03. Loader
   04. Cursor
   05. Header + menu
   06. Trilho lateral (capítulo, coordenada, progresso)
   07. Animações de entrada, split e parallax
   08. Ticker
   09. Ícones de serviço (traço animado)
   10. Contadores
   11. Depoimentos
   12. FAQ
   13. Vídeo do hero (entra sozinho quando o arquivo existir)
   14. Formulário
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- 01. UTILITÁRIOS ---------- */
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const lerp  = (a, b, t) => a + (b - a) * t;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch   = matchMedia('(hover: none), (pointer: coarse)').matches;
  const GSAP    = typeof window.gsap !== 'undefined';

  if (GSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  else document.body.classList.add('no-gsap');

  /* ---------- 02. GLOBO DE ROTAS ---------------------------------------
     Esfera em arame desenhada por trigonometria — sem dados de mapa e sem
     imagem. Os pontos são portos reais; as rotas seguem o arco de círculo
     máximo entre eles, que é o caminho que um navio de fato percorre.
     ------------------------------------------------------------------- */
  const PORTS = {
    santos:   [-23.96, -46.33], itajai:  [-26.91, -48.66],
    xangai:   [ 31.23, 121.47], shenzhen:[ 22.54, 114.06],
    roterda:  [ 51.92,   4.48], miami:   [ 25.77, -80.19],
    mexico:   [ 19.43, -99.13], istambul:[ 41.01,  28.98],
    mumbai:   [ 19.08,  72.88], hochimin:[ 10.82, 106.63]
  };
  const LANES = [
    ['santos','xangai'], ['santos','roterda'], ['santos','miami'],
    ['santos','shenzhen'], ['itajai','istambul'], ['itajai','mumbai'],
    ['santos','mexico'], ['itajai','hochimin']
  ];

  const rad = d => d * Math.PI / 180;
  const toVec = ([la, lo]) => {
    const a = rad(la), b = rad(lo);
    return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)];
  };
  // Interpolação sobre o arco de círculo máximo (slerp)
  const slerp = (u, v, t) => {
    let d = u[0]*v[0] + u[1]*v[1] + u[2]*v[2];
    d = clamp(d, -1, 1);
    const o = Math.acos(d);
    if (o < 1e-6) return u.slice();
    const s = Math.sin(o), a = Math.sin((1 - t) * o) / s, b = Math.sin(t * o) / s;
    return [u[0]*a + v[0]*b, u[1]*a + v[1]*b, u[2]*a + v[2]*b];
  };

  function createGlobe(canvas, opt) {
    if (!canvas) return null;
    const o = Object.assign({ scale: 0.42, speed: 0.0009, tilt: -0.32, lanes: true, cx: 0.5, cy: 0.5 }, opt);
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, R = 0, cx = 0, cy = 0, dpr = 1;
    let angle = 0, raf = null, visible = false;

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W, H) * o.scale;
      cx = W * o.cx; cy = H * o.cy;
    }

    // rotação em Y (longitude) + inclinação fixa em X
    function project(v) {
      const ca = Math.cos(angle), sa = Math.sin(angle);
      let x = v[0] * ca - v[2] * sa;
      let z = v[0] * sa + v[2] * ca;
      let y = v[1];
      const ct = Math.cos(o.tilt), st = Math.sin(o.tilt);
      const y2 = y * ct - z * st;
      const z2 = y * st + z * ct;
      return { x: cx + x * R, y: cy - y2 * R, z: z2, front: z2 > 0 };
    }

    function wire() {
      ctx.lineWidth = 1;
      // paralelos
      for (let la = -60; la <= 60; la += 30) {
        ctx.beginPath();
        let pen = false;
        for (let lo = 0; lo <= 360; lo += 4) {
          const p = project(toVec([la, lo]));
          if (!p.front) { pen = false; continue; }
          pen ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), pen = true);
        }
        ctx.strokeStyle = 'rgba(126,150,172,.46)';
        ctx.stroke();
      }
      // meridianos
      for (let lo = 0; lo < 360; lo += 30) {
        ctx.beginPath();
        let pen = false;
        for (let la = -90; la <= 90; la += 4) {
          const p = project(toVec([la, lo]));
          if (!p.front) { pen = false; continue; }
          pen ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), pen = true);
        }
        ctx.strokeStyle = 'rgba(126,150,172,.32)';
        ctx.stroke();
      }
      // limbo
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(63,178,224,.58)';
      ctx.stroke();
    }

    function lanes(t) {
      LANES.forEach((lane, i) => {
        const u = toVec(PORTS[lane[0]]), v = toVec(PORTS[lane[1]]);
        const pts = [];
        for (let s = 0; s <= 1.0001; s += 1 / 48) {
          const m = slerp(u, v, s);
          const lift = 1 + 0.16 * Math.sin(Math.PI * s);   // arco acima da superfície
          pts.push(project([m[0] * lift, m[1] * lift, m[2] * lift]));
        }
        // traço da rota
        ctx.beginPath();
        let pen = false;
        pts.forEach(p => {
          if (p.z < -0.25) { pen = false; return; }
          pen ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), pen = true);
        });
        ctx.strokeStyle = 'rgba(63,178,224,.62)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // pulso viajando pela rota
        const k = (t * 0.00016 + i * 0.13) % 1;
        const idx = Math.floor(k * (pts.length - 1));
        const p = pts[idx];
        if (p && p.z > -0.1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.1, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(63,178,224,.95)';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(63,178,224,.20)';
          ctx.fill();
        }
      });
    }

    function nodes(t) {
      Object.keys(PORTS).forEach((k, i) => {
        const p = project(toVec(PORTS[k]));
        if (!p.front) return;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.0014 + i);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(237,242,246,.9)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 + pulse * 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(63,178,224,' + (0.30 - pulse * 0.22) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      wire();
      if (o.lanes) lanes(t);
      nodes(t);
      if (!reduced) angle += o.speed * 16;
      raf = requestAnimationFrame(frame);
    }

    resize();
    addEventListener('resize', resize, { passive: true });

    // Só anima enquanto estiver na viewport — três canvas rodando à toa
    // custam bateria sem nenhum ganho visual.
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        visible = e.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(frame);
        if (!visible && raf) { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0 });
    io.observe(canvas);

    if (reduced) { frame(0); cancelAnimationFrame(raf); raf = null; }
    return { resize };
  }

  /* ---------- 03. LOADER ---------- */
  function loader() {
    const el = $('#loader'), pct = $('#loaderPct'), bar = $('#loaderBar');
    if (!el) return done();

    let p = 0, ready = false;
    requestAnimationFrame(() => el.classList.add('go'));

    const tick = setInterval(() => {
      p = Math.min(p + (p < 68 ? Math.random() * 13 : Math.random() * 4.5), ready ? 100 : 95);
      if (pct) pct.textContent = String(Math.floor(p)).padStart(3, '0');
      if (bar) bar.style.width = p + '%';
      if (p >= 100) { clearInterval(tick); el.classList.add('done'); setTimeout(done, 560); }
    }, 105);

    addEventListener('load', () => { ready = true; });
    setTimeout(() => { ready = true; }, 3000);

    function done() {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-ready');
      intro();
    }
  }

  /* ---------- 04. CURSOR ---------- */
  function cursor() {
    const c = $('#cursor');
    if (!c || touch || reduced) { if (c) c.remove(); return; }
    const dot = $('.cursor__dot', c), ring = $('.cursor__ring', c), lab = $('#cursorLabel');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

    addEventListener('mousemove', e => {
      c.classList.add('on');
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }, { passive: true });

    (function loop() {
      rx = lerp(rx, mx, .15); ry = lerp(ry, my, .15);
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    const sel = 'a, button, summary, input, select, textarea, [data-cursor]';
    document.addEventListener('mouseover', e => {
      const t = e.target.closest(sel);
      if (!t) return;
      c.classList.add('hov');
      lab.textContent = t.getAttribute('data-cursor') || '';
    });
    document.addEventListener('mouseout', e => {
      if (!e.target.closest(sel)) return;
      c.classList.remove('hov');
      lab.textContent = '';
    });
  }

  /* ---------- 05. HEADER + MENU ---------- */
  function header() {
    const h = $('#head'), b = $('#burger'), m = $('#menu');
    if (!h) return;
    let last = scrollY;

    addEventListener('scroll', () => {
      const y = scrollY;
      h.classList.toggle('stuck', y > 40);
      h.classList.toggle('hide', y > last && y > 340 && !document.body.classList.contains('menu-on'));
      last = y;
    }, { passive: true });

    if (!b || !m) return;
    const open = () => {
      m.hidden = false;
      requestAnimationFrame(() => m.classList.add('on'));
      b.setAttribute('aria-expanded', 'true');
      b.setAttribute('aria-label', 'Fechar menu');
      document.body.classList.add('menu-on');
    };
    const close = () => {
      m.classList.remove('on');
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-label', 'Abrir menu');
      document.body.classList.remove('menu-on');
      setTimeout(() => { if (!m.classList.contains('on')) m.hidden = true; }, 750);
    };
    b.addEventListener('click', () => m.classList.contains('on') ? close() : open());
    $$('a', m).forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('on')) close(); });
  }

  /* ---------- 06. TRILHO LATERAL ---------- */
  function rail() {
    const code = $('#railCode'), coord = $('#railCoord'), fill = $('#railFill');
    const secs = $$('[data-chapter]');
    const navs = $$('.nav a');
    const top  = $('#toTop'), wa = $('.wa');

    const onScroll = () => {
      const y = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (fill) fill.style.height = ((y / (max || 1)) * 100).toFixed(1) + '%';
      if (top) top.classList.toggle('on', y > innerHeight * 0.9);
      if (wa)  wa.classList.toggle('on',  y > innerHeight * 0.5);

      let cur = secs[0];
      secs.forEach(s => { if (s.getBoundingClientRect().top <= innerHeight * 0.4) cur = s; });
      if (cur) {
        if (code)  code.textContent  = cur.dataset.chapter;
        if (coord) coord.textContent = cur.dataset.coord;
        navs.forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + cur.id));
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    top && top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
    const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- 07. ANIMAÇÕES ---------- */
  function prepSplit() {
    $$('[data-split] .ln').forEach(l => {
      if (l.querySelector('span')) return;
      const inner = document.createElement('span');
      while (l.firstChild) inner.appendChild(l.firstChild);
      l.appendChild(inner);
      if (!reduced) { inner.style.transform = 'translateY(106%)'; inner.style.opacity = '0'; }
    });
  }

  function intro() {
    const lines = $$('.hero [data-split] .ln > span');
    const rv    = $$('.hero [data-rv]');
    if (reduced) {
      lines.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
      rv.forEach(s => { s.style.opacity = '1'; s.style.transform = 'none'; });
      return;
    }
    if (GSAP) {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .to(lines, { y: '0%', opacity: 1, duration: 1.25, stagger: .1 })
        .to(rv, { y: 0, opacity: 1, duration: 1, stagger: .09 }, '-=.85')
        .from('.head__in > *', { y: -16, opacity: 0, duration: .8, stagger: .07 }, .1)
        .from('.rail', { opacity: 0, duration: 1 }, .3);
    } else {
      lines.forEach((s, i) => {
        s.style.transition = `transform 1s cubic-bezier(.19,1,.22,1) ${i * .1}s, opacity 1s ease ${i * .1}s`;
        s.style.transform = 'translateY(0)'; s.style.opacity = '1';
      });
      rv.forEach(el => el.classList.add('in'));
    }
  }

  function scrollAnims() {
    const splits = $$('[data-split]').filter(e => !e.closest('.hero'));
    const rvs    = $$('[data-rv]').filter(e => !e.closest('.hero'));

    if (reduced) {
      $$('[data-split] .ln > span').forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
      rvs.forEach(e => e.classList.add('in'));
      return;
    }

    if (GSAP && window.ScrollTrigger) {
      splits.forEach(b => gsap.to(b.querySelectorAll('.ln > span'), {
        y: '0%', opacity: 1, duration: 1.15, ease: 'expo.out', stagger: .08,
        scrollTrigger: { trigger: b, start: 'top 86%', once: true }
      }));
      rvs.forEach(e => gsap.to(e, {
        y: 0, opacity: 1, duration: 1, ease: 'expo.out',
        delay: parseFloat(e.dataset.d || 0),
        scrollTrigger: { trigger: e, start: 'top 90%', once: true }
      }));
      $$('[data-parallax]').forEach(e => {
        const amt = parseFloat(e.dataset.parallax) || .1;
        gsap.fromTo(e, { yPercent: -amt * 42 }, {
          yPercent: amt * 42, ease: 'none',
          scrollTrigger: { trigger: e.parentElement || e, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
      ScrollTrigger.refresh();
      return;
    }

    const io = new IntersectionObserver(es => {
      es.forEach(en => {
        if (!en.isIntersecting) return;
        const e = en.target;
        if (e.hasAttribute('data-split')) {
          $$('.ln > span', e).forEach((s, i) => {
            s.style.transition = `transform 1s cubic-bezier(.19,1,.22,1) ${i * .08}s, opacity 1s ease ${i * .08}s`;
            s.style.transform = 'translateY(0)'; s.style.opacity = '1';
          });
        } else {
          e.style.transitionDelay = (parseFloat(e.dataset.d || 0)) + 's';
          e.classList.add('in');
        }
        io.unobserve(e);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: .1 });

    splits.forEach(e => io.observe(e));
    rvs.forEach(e => io.observe(e));
  }

  /* ---------- 08. TICKER ---------- */
  function ticker() {
    const track = $('[data-ticker]');
    if (!track) return;
    const html = track.innerHTML;
    let guard = 0;
    while (track.scrollWidth < innerWidth * 2 && guard++ < 8) track.innerHTML += html;
    if (reduced) return;
    const half = track.scrollWidth / 2;
    let x = 0;
    (function run() {
      x -= .4;
      if (Math.abs(x) >= half) x = 0;
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      requestAnimationFrame(run);
    })();
  }

  /* ---------- 09. ÍCONES DE SERVIÇO ---------- */
  // Mede cada traço para que o redesenho no hover cubra o caminho exato.
  function icons() {
    $$('.card__ico .dr').forEach(p => {
      try {
        const len = Math.ceil(p.getTotalLength()) + 2;
        p.style.setProperty('--len', len);
      } catch (e) { /* navegador sem getTotalLength em <path>: ignora */ }
    });
  }

  /* ---------- 10. CONTADORES ---------- */
  function counters() {
    const ns = $$('[data-count]');
    if (!ns.length) return;
    const run = el => {
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.dec || '0', 10);
      const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      const fmt = v => pre + v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (reduced) { el.textContent = fmt(target); return; }
      const t0 = performance.now(), dur = 1700;
      (function step(now) {
        const p = clamp((now - t0) / dur, 0, 1);
        el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    };
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      run(e.target); io.unobserve(e.target);
    }), { threshold: .4 });
    ns.forEach(n => io.observe(n));
  }

  /* ---------- 11. DEPOIMENTOS ---------- */
  function quotes() {
    const root = $('[data-quotes]');
    if (!root) return;
    const track = $('[data-q-track]', root);
    const slides = $$('[data-q-slide]', root);
    const dots = $('[data-q-dots]', root);
    if (!track || !slides.length) return;
    let i = 0;

    slides.forEach((_, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Ir para o depoimento ' + (k + 1));
      b.addEventListener('click', () => go(k));
      dots.appendChild(b);
    });

    const maxI = () => {
      const vis = Math.max(1, Math.round(track.parentElement.offsetWidth / slides[0].offsetWidth));
      return Math.max(0, slides.length - vis);
    };
    function go(k) {
      i = clamp(k, 0, maxI());
      const cs = getComputedStyle(track);
      const gap = parseFloat(cs.columnGap || cs.gap || 0) || 0;
      track.style.transform = `translate3d(-${(slides[0].offsetWidth + gap) * i}px,0,0)`;
      $$('button', dots).forEach((d, di) => d.classList.toggle('act', di === i));
    }
    $('[data-q-prev]', root).addEventListener('click', () => go(i - 1));
    $('[data-q-next]', root).addEventListener('click', () => go(i + 1));

    let sx = 0, drag = false;
    track.addEventListener('pointerdown', e => { drag = true; sx = e.clientX; });
    addEventListener('pointerup', e => {
      if (!drag) return; drag = false;
      const d = e.clientX - sx;
      if (Math.abs(d) > 60) go(i + (d < 0 ? 1 : -1));
    });
    addEventListener('resize', () => go(i));
    go(0);
  }

  /* ---------- 12. FAQ ---------- */
  function faq() {
    const items = $$('[data-faq] details');
    items.forEach(d => d.addEventListener('toggle', () => {
      if (d.open) items.forEach(o => { if (o !== d) o.open = false; });
    }));
  }

  /* ---------- 13. VÍDEO DO HERO -----------------------------------------
     O hero funciona com o globo. Se o arquivo de vídeo licenciado for
     colocado em /assets/video/, ele passa a valer automaticamente — sem
     nenhuma alteração de código.
     ------------------------------------------------------------------- */
  function heroVideo() {
    const v = $('#heroVideo');
    if (!v || reduced) return;
    v.addEventListener('canplay', () => {
      v.classList.add('ready');
      v.play().catch(() => {});
    }, { once: true });
    v.load();
  }

  /* ---------- 14. FORMULÁRIO ---------- */
  function form() {
    const f = $('#contactForm');
    if (!f) return;
    const fb = $('#formFeedback'), tel = $('#telefone');

    tel && tel.addEventListener('input', () => {
      let v = tel.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6)      v = v.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, '($1) $2-$3');
      else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      else if (v.length > 0) v = v.replace(/^(\d{0,2})/, '($1');
      tel.value = v;
    });

    const setErr = (el, msg) => {
      const w = el.closest('.fd') || el.parentElement;
      const slot = w && w.querySelector('[data-error]');
      if (w) w.classList.toggle('err', !!msg);
      if (slot) slot.textContent = msg || '';
    };

    const valid = () => {
      let ok = true;
      [['#nome', 'Informe o seu nome.'],
       ['#empresa', 'Informe o nome da empresa.'],
       ['#interesse', 'Selecione o que você precisa.']].forEach(([s, m]) => {
        const el = $(s);
        if (!el.value.trim()) { setErr(el, m); ok = false; } else setErr(el, '');
      });
      const em = $('#email');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim())) { setErr(em, 'Informe um e-mail válido.'); ok = false; } else setErr(em, '');
      const tl = $('#telefone');
      if (tl.value.replace(/\D/g, '').length < 10) { setErr(tl, 'Informe um WhatsApp com DDD.'); ok = false; } else setErr(tl, '');
      const cs = $('#consent'), ce = $('#consentError');
      if (!cs.checked) { ce.textContent = 'É preciso autorizar o contato para enviar.'; ok = false; } else ce.textContent = '';
      return ok;
    };

    f.addEventListener('submit', async e => {
      e.preventDefault();
      fb.textContent = ''; fb.className = 'form__fb';

      if (!valid()) {
        fb.textContent = 'Confira os campos destacados acima.';
        fb.classList.add('bad');
        const first = f.querySelector('.err input, .err select');
        if (first) first.focus();
        return;
      }

      const btn = f.querySelector('button[type="submit"]');
      const span = btn.querySelector('span');
      const label = span.textContent;
      btn.disabled = true; span.textContent = 'Enviando…';

      const data = Object.fromEntries(new FormData(f).entries());

      try {
        /* ------------------------------------------------------------
           ENVIO REAL — descomente e troque pela sua URL. Funciona com
           Formspree, Basin, Getform, n8n, Make, Zapier ou rota própria.

           const r = await fetch('https://SEU-ENDPOINT-AQUI', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(data)
           });
           if (!r.ok) throw new Error('falha no envio');
        ------------------------------------------------------------ */
        console.info('[ACELERO COMEX] lead:', data);
        await new Promise(r => setTimeout(r, 850));

        f.reset();
        fb.textContent = 'Recebido. Um especialista entra em contato em até 1 dia útil.';
        fb.classList.add('ok');
      } catch (err) {
        fb.textContent = 'Não conseguimos enviar agora. Chame no WhatsApp que resolvemos na hora.';
        fb.classList.add('bad');
      } finally {
        btn.disabled = false; span.textContent = label;
      }
    });
  }

  /* ---------- BOOT ---------- */
  function init() {
    prepSplit();
    createGlobe($('#globe'),         { scale: .40, speed: .0007, tilt: -.34, cx: .68, cy: .48 });
    createGlobe($('#purposeCanvas'), { scale: .44, speed: .0004, tilt: -.20, cx: .82, cy: .48 });
    createGlobe($('#contactCanvas'), { scale: .48, speed: .0005, tilt: -.42, cx: .30, cy: .45, lanes: false });
    loader();
    cursor();
    header();
    rail();
    scrollAnims();
    ticker();
    icons();
    counters();
    quotes();
    faq();
    heroVideo();
    form();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
