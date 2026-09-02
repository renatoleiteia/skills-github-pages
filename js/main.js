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

  // Idioma corrente e as mensagens que o próprio JavaScript emite (validação
  // do formulário). O padrão em português é o argumento; o dicionário só
  // sobrescreve quando existe tradução.
  let idiomaAtual = 'pt';
  let reformatarNumeros = () => {};
  const msg = (chave, padrao) => {
    const x = (window.ACELERO_IDIOMAS_EXTRA || {})[idiomaAtual];
    return (x && x.msg && x.msg[chave]) || padrao;
  };

  /* ---------- 02. GLOBO DE ROTAS ---------------------------------------
     Esfera em arame desenhada por trigonometria — sem dados de mapa e sem
     imagem. Os pontos são portos reais; as rotas seguem o arco de círculo
     máximo entre eles, que é o caminho que um navio de fato percorre.
     ------------------------------------------------------------------- */
  const PORTOS = {
    // Brasil — origem e destino da operação
    santos:      [-23.96,  -46.33], itajai:    [-26.91,  -48.66],
    paranagua:   [-25.50,  -48.51], suape:     [ -8.39,  -34.97],
    // Demais da América do Sul
    montevideu:  [-34.90,  -56.19], buenosaires:[-34.60, -58.38],
    valparaiso:  [-33.05,  -71.62],
    // América do Norte
    novayork:    [ 40.68,  -74.02], miami:     [ 25.77,  -80.19],
    longbeach:   [ 33.75, -118.20], montreal:  [ 45.50,  -73.55],
    manzanillo:  [ 19.05, -104.32],
    // Europa
    lisboa:      [ 38.71,   -9.14], hamburgo:  [ 53.55,    9.99],
    lehavre:     [ 49.49,    0.11], roterda:   [ 51.92,    4.48],
    antuerpia:   [ 51.26,    4.40], valencia:  [ 39.45,   -0.33],
    istambul:    [ 41.01,   28.98],
    // África
    luanda:      [ -8.84,   13.23], durban:    [-29.87,   31.02],
    cidadedocabo:[-33.92,   18.42], tangermed: [ 35.89,   -5.50],
    // Ásia e Oriente Médio
    xangai:      [ 31.23,  121.47], shenzhen:  [ 22.54,  114.06],
    ningbo:      [ 29.87,  121.55], singapura: [  1.29,  103.85],
    busan:       [ 35.10,  129.04], toquio:    [ 35.44,  139.64],
    mumbai:      [ 18.95,   72.95], hochimin:  [ 10.82,  106.63],
    jebelali:    [ 25.01,   55.06],
    // Oceania
    sydney:      [-33.86,  151.21]
  };

  const ROTAS = [
    // Radiais a partir dos portos brasileiros
    ['santos','xangai'],     ['santos','roterda'],     ['santos','novayork'],
    ['santos','hamburgo'],   ['santos','lisboa'],      ['santos','longbeach'],
    ['santos','durban'],     ['santos','jebelali'],    ['santos','montevideu'],
    ['santos','buenosaires'],
    ['itajai','shenzhen'],   ['itajai','antuerpia'],   ['itajai','miami'],
    ['itajai','luanda'],     ['itajai','busan'],       ['itajai','valparaiso'],
    ['paranagua','ningbo'],  ['paranagua','lehavre'],  ['paranagua','montreal'],
    ['paranagua','cidadedocabo'],
    ['suape','tangermed'],   ['suape','valencia'],     ['suape','manzanillo'],
    // Travessias que dão a leitura de rede, não só de leque
    ['xangai','roterda'],    ['singapura','jebelali'], ['toquio','longbeach'],
    ['hochimin','hamburgo'], ['sydney','shenzhen'],    ['mumbai','istambul']
  ];

  const rad = d => d * Math.PI / 180;
  const toVec = ([la, lo]) => {
    const a = rad(la), b = rad(lo);
    return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)];
  };
  // Interpolação sobre o arco de círculo máximo (slerp) — o caminho que um
  // navio de fato percorre entre dois portos.
  const slerp = (u, v, t) => {
    let d = clamp(u[0]*v[0] + u[1]*v[1] + u[2]*v[2], -1, 1);
    const o = Math.acos(d);
    if (o < 1e-6) return u.slice();
    const s = Math.sin(o), a = Math.sin((1 - t) * o) / s, b = Math.sin(t * o) / s;
    return [u[0]*a + v[0]*b, u[1]*a + v[1]*b, u[2]*a + v[2]*b];
  };

  /* Geometria fixa, calculada UMA vez e compartilhada pelos três globos.
     A rotação acontece na projeção, então nada disto muda por quadro —
     recalcular 33 portos e 30 rotas a 60 fps seria desperdício puro. */
  const GEO = (() => {
    const paralelos = [], meridianos = [], rotas = [], nos = [];
    for (let la = -60; la <= 60; la += 30) {
      const l = [];
      for (let lo = 0; lo <= 360; lo += 5) l.push(toVec([la, lo]));
      paralelos.push(l);
    }
    for (let lo = 0; lo < 360; lo += 30) {
      const l = [];
      for (let la = -90; la <= 90; la += 5) l.push(toVec([la, lo]));
      meridianos.push(l);
    }
    ROTAS.forEach(([a, b]) => {
      const u = toVec(PORTOS[a]), v = toVec(PORTOS[b]), pts = [];
      const N = 44;
      for (let i = 0; i <= N; i++) {
        const m = slerp(u, v, i / N);
        const alt = 1 + 0.15 * Math.sin(Math.PI * (i / N));  // arco acima da superfície
        pts.push([m[0] * alt, m[1] * alt, m[2] * alt]);
      }
      rotas.push(pts);
    });
    Object.keys(PORTOS).forEach(k => nos.push(toVec(PORTOS[k])));
    return { paralelos, meridianos, rotas, nos };
  })();

  function createGlobe(canvas, opt) {
    if (!canvas) return null;
    const o = Object.assign({ scale: .42, speed: .0007, tilt: -.32, rotas: true, nos: true, cx: .5, cy: .5 }, opt);
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, R = 0, cx = 0, cy = 0;
    let ang = 0, raf = null;
    let ca = 1, sa = 0, ct = 1, st = 0;   // senos e cossenos do quadro atual

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W, H) * o.scale;
      cx = W * o.cx; cy = H * o.cy;
    }

    // Rotação em Y (longitude) seguida de inclinação fixa em X, projetada
    // em ortográfica. Os cossenos vêm prontos do quadro — ver frame().
    const px = v => cx + (v[0] * ca - v[2] * sa) * R;
    const pz = v => (v[1] * st + (v[0] * sa + v[2] * ca) * ct);
    const py = v => cy - (v[1] * ct - (v[0] * sa + v[2] * ca) * st) * R;

    function traco(linhas, cor) {
      ctx.strokeStyle = cor;
      linhas.forEach(pts => {
        ctx.beginPath();
        let caneta = false;
        for (let i = 0; i < pts.length; i++) {
          const v = pts[i];
          if (pz(v) <= 0) { caneta = false; continue; }
          const x = px(v), y = py(v);
          caneta ? ctx.lineTo(x, y) : (ctx.moveTo(x, y), caneta = true);
        }
        ctx.stroke();
      });
    }

    function desenharRotas(t) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(63,178,224,.50)';
      GEO.rotas.forEach(pts => {
        ctx.beginPath();
        let caneta = false;
        for (let i = 0; i < pts.length; i++) {
          const v = pts[i];
          if (pz(v) < -0.2) { caneta = false; continue; }
          const x = px(v), y = py(v);
          caneta ? ctx.lineTo(x, y) : (ctx.moveTo(x, y), caneta = true);
        }
        ctx.stroke();
      });
      // Pulsos: só em parte das rotas, senão a tela vira pisca-pisca.
      for (let i = 0; i < GEO.rotas.length; i += 2) {
        const pts = GEO.rotas[i];
        const k = (t * 0.00013 + i * 0.11) % 1;
        const v = pts[Math.floor(k * (pts.length - 1))];
        if (!v || pz(v) < -0.05) continue;
        const x = px(v), y = py(v);
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(63,178,224,.95)'; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(63,178,224,.18)'; ctx.fill();
      }
    }

    function desenharNos(t) {
      GEO.nos.forEach((v, i) => {
        if (pz(v) <= 0) return;
        const x = px(v), y = py(v);
        const pulso = .5 + .5 * Math.sin(t * .0012 + i * .7);
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(237,242,246,.9)'; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 3.4 + pulso * 4.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(63,178,224,' + (.26 - pulso * .19) + ')';
        ctx.lineWidth = 1; ctx.stroke();
      });
    }

    function frame(t) {
      ca = Math.cos(ang); sa = Math.sin(ang);
      ct = Math.cos(o.tilt); st = Math.sin(o.tilt);

      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      traco(GEO.paralelos,  'rgba(126,150,172,.46)');
      traco(GEO.meridianos, 'rgba(126,150,172,.32)');
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(63,178,224,.58)'; ctx.stroke();

      if (o.rotas) desenharRotas(t);
      if (o.nos) desenharNos(t);

      if (!reduced) ang += o.speed * 16;
      raf = requestAnimationFrame(frame);
    }

    resize();
    addEventListener('resize', resize, { passive: true });

    // Só anima enquanto estiver na viewport — três canvas rodando à toa
    // gastam bateria sem nenhum ganho visual.
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(frame);
      if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
    }), { threshold: 0 }).observe(canvas);

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

    // A bola azul nunca aparece vazia. Quando o elemento não traz um
    // data-cursor próprio, o rótulo é deduzido do que ele faz.
    const traduzir = r => {
      const x = (window.ACELERO_IDIOMAS_EXTRA || {})[idiomaAtual];
      return (x && x.cursor && x.cursor[r]) || r;
    };
    const deduzir = el => {
      const tag = el.tagName;
      if (tag === 'SUMMARY') return el.parentElement && el.parentElement.open ? 'Fechar' : 'Ler';
      if (tag === 'SELECT') return 'Escolha';
      if (tag === 'TEXTAREA') return 'Digite';
      if (tag === 'INPUT') return el.type === 'checkbox' ? 'Marcar' : 'Digite';
      if (tag === 'A') {
        const h = el.getAttribute('href') || '';
        if (h.indexOf('wa.me') !== -1) return 'WhatsApp';
        if (h.indexOf('mailto:') === 0) return 'E-mail';
        if (h.indexOf('tel:') === 0) return 'Ligar';
        if (h.charAt(0) === '#') return 'Ir';
        return 'Abrir';
      }
      return 'Clique';
    };

    // Globo em miniatura: mesma matemática do herói, sem rotas nem pontos de
    // porto, que a 34px virariam sujeira. Gira um pouco mais rápido porque
    // nesse tamanho o movimento do herói seria imperceptível.
    createGlobe($('#cursorGlobo'), { scale: .46, speed: .0011, tilt: -.30, rotas: false, nos: false });

    const sel = 'a, button, summary, input, select, textarea, [data-cursor]';
    document.addEventListener('mouseover', e => {
      const t = e.target.closest(sel);
      if (!t) return;
      c.classList.add('hov');
      lab.textContent = traduzir(t.getAttribute('data-cursor') || deduzir(t));
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
        if (code)  code.textContent  = cur.dataset['chapter' + (idiomaAtual === 'pt' ? '' : idiomaAtual.charAt(0).toUpperCase() + idiomaAtual.slice(1))] || cur.dataset.chapter;
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
      x -= .28;
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
      const local = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' }[idiomaAtual] || 'pt-BR';
      const fmt = v => pre + v.toLocaleString(local, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (reduced) { el.textContent = fmt(target); el.dataset.pronto = '1'; return; }
      const t0 = performance.now(), dur = 1700;
      (function step(now) {
        const p = clamp((now - t0) / dur, 0, 1);
        el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step); else el.dataset.pronto = '1';
      })(t0);
    };
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      run(e.target); io.unobserve(e.target);
    }), { threshold: .4 });
    ns.forEach(n => io.observe(n));
    // Um contador já animado guarda o formato do idioma antigo; ao trocar,
    // reescrevemos só os que terminaram.
    reformatarNumeros = () => $$('[data-count][data-pronto]').forEach(run);
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

  /* ---------- 13b. SLOTS DE IMAGEM OPCIONAIS -----------------------------
     Etapas 04 e 05 e as placas de fundo de Resultados e Garantias esperam
     fotos que ainda não foram entregues. Enquanto o arquivo não existir a
     figura é removida e a seção volta ao fundo chapado — nada de ícone de
     imagem quebrada. Basta soltar o arquivo na pasta para ele aparecer.
     ------------------------------------------------------------------- */
  function slotsOpcionais() {
    $$('[data-opcional]').forEach(fig => {
      const img = $('img', fig);
      if (!img) return;
      // Sondagem própria em vez de esperar o evento `error` da <img> da página:
      // com loading="lazy" esse evento só dispararia quando o leitor chegasse
      // perto, e até lá um slot vazio ficaria ocupando a grade. A sondagem
      // resolve na carga; quando o arquivo existe, ela apenas aquece o cache
      // e a carga preguiçosa sai de graça.
      const sonda = new Image();
      sonda.onerror = () => fig.remove();
      sonda.src = img.getAttribute('src');
    });
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
      [['#nome', msg('nome', 'Informe o seu nome.')],
       ['#empresa', msg('empresa', 'Informe o nome da empresa.')],
       ['#interesse', msg('interesse', 'Selecione o que você precisa.')]].forEach(([s, m]) => {
        const el = $(s);
        if (!el.value.trim()) { setErr(el, m); ok = false; } else setErr(el, '');
      });
      const em = $('#email');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim())) { setErr(em, msg('email', 'Informe um e-mail válido.')); ok = false; } else setErr(em, '');
      const tl = $('#telefone');
      if (tl.value.replace(/\D/g, '').length < 10) { setErr(tl, msg('telefone', 'Informe um WhatsApp com DDD.')); ok = false; } else setErr(tl, '');
      const cs = $('#consent'), ce = $('#consentError');
      if (!cs.checked) { ce.textContent = msg('consent', 'É preciso autorizar o contato para enviar.'); ok = false; } else ce.textContent = '';
      return ok;
    };

    f.addEventListener('submit', async e => {
      e.preventDefault();
      fb.textContent = ''; fb.className = 'form__fb';

      if (!valid()) {
        fb.textContent = msg('campos', 'Confira os campos destacados acima.');
        fb.classList.add('bad');
        const first = f.querySelector('.err input, .err select');
        if (first) first.focus();
        return;
      }

      const btn = f.querySelector('button[type="submit"]');
      const span = btn.querySelector('span');
      const label = span.textContent;
      btn.disabled = true; span.textContent = msg('enviando', 'Enviando…');

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
        fb.textContent = msg('ok', 'Recebido. Um especialista entra em contato em até 1 dia útil.');
        fb.classList.add('ok');
      } catch (err) {
        fb.textContent = msg('erro', 'Não conseguimos enviar agora. Chame no WhatsApp que resolvemos na hora.');
        fb.classList.add('bad');
      } finally {
        btn.disabled = false; span.textContent = label;
      }
    });
  }

  /* ---------- 15. IDIOMAS -------------------------------------------------
     O português é o texto que está no HTML; inglês e espanhol vêm de
     js/idiomas.js. Ao carregar, guardamos o original de cada elemento, então
     voltar para PT é restaurar — não há dicionário português a manter.
     ------------------------------------------------------------------- */
  function idiomas() {
    const raiz  = $('#lang');
    const botao = $('#langBtn');
    const lista = $('#langLista');
    const rotulo = $('#langAtual');
    const dic   = window.ACELERO_IDIOMAS || {};
    const extra = window.ACELERO_IDIOMAS_EXTRA || {};
    if (!raiz || !botao || !lista) return;

    // Guarda o português como está no HTML.
    const original = new Map();
    $$('[data-i18n]').forEach(el => original.set(el, alvo(el).innerHTML));
    const originalExtra = {
      placeholders: {}, opcoes: {},
      consentimento: $('.chk span') ? $('.chk span').innerHTML : ''
    };
    ['nome','empresa','email','telefone','mensagem'].forEach(id => {
      const el = $('#' + id);
      if (el) originalExtra.placeholders[id] = el.placeholder;
    });
    ['interesse','volume'].forEach(id => {
      const el = $('#' + id);
      if (el) originalExtra.opcoes[id] = $$('option', el).map(o => o.textContent);
    });

    // Numa linha de título já preparada para animar, o texto mora no <span>
    // interno — escrever nele preserva o alvo que o GSAP está animando.
    function alvo(el) {
      return el.classList.contains('ln') && el.firstElementChild
        ? el.firstElementChild
        : el;
    }

    function aplicar(idioma) {
      const t = dic[idioma];
      $$('[data-i18n]').forEach(el => {
        const chave = el.getAttribute('data-i18n');
        const txt = t ? t[chave] : null;
        alvo(el).innerHTML = txt != null ? txt : original.get(el);
      });

      const x = extra[idioma];
      Object.keys(originalExtra.placeholders).forEach(id => {
        const el = $('#' + id);
        if (el) el.placeholder = x && x.placeholders[id] ? x.placeholders[id] : originalExtra.placeholders[id];
      });
      Object.keys(originalExtra.opcoes).forEach(id => {
        const el = $('#' + id);
        if (!el) return;
        const textos = x && x.opcoes[id] ? x.opcoes[id] : originalExtra.opcoes[id];
        $$('option', el).forEach((o, i) => { if (textos[i]) o.textContent = textos[i]; });
      });
      const consent = $('.chk span');
      if (consent) consent.innerHTML = x && x.consentimento ? x.consentimento : originalExtra.consentimento;

      idiomaAtual = idioma;
      document.documentElement.lang = idioma === 'pt' ? 'pt-BR' : idioma;
      if (rotulo) rotulo.textContent = idioma.toUpperCase();
      reformatarNumeros();
      $$('button[data-idioma]', lista).forEach(b =>
        b.setAttribute('aria-selected', String(b.dataset.idioma === idioma)));
      try { localStorage.setItem('acelero.idioma', idioma); } catch (e) { /* sem armazenamento: segue */ }
      // O ScrollTrigger mede alturas; o texto traduzido muda o tamanho dos blocos.
      if (GSAP && window.ScrollTrigger) ScrollTrigger.refresh();
    }

    const abrir  = () => { lista.hidden = false; requestAnimationFrame(() => raiz.classList.add('aberto')); botao.setAttribute('aria-expanded', 'true'); };
    const fechar = () => { raiz.classList.remove('aberto'); botao.setAttribute('aria-expanded', 'false'); setTimeout(() => { if (!raiz.classList.contains('aberto')) lista.hidden = true; }, 300); };

    botao.addEventListener('click', e => {
      e.stopPropagation();
      raiz.classList.contains('aberto') ? fechar() : abrir();
    });
    $$('button[data-idioma]', lista).forEach(b =>
      b.addEventListener('click', () => { aplicar(b.dataset.idioma); fechar(); }));
    document.addEventListener('click', e => { if (!raiz.contains(e.target)) fechar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') fechar(); });

    // Escolha anterior; senão, o idioma do navegador; senão, português.
    let inicial = 'pt';
    try { inicial = localStorage.getItem('acelero.idioma') || ''; } catch (e) { inicial = ''; }
    if (!inicial) {
      const nav = (navigator.language || 'pt').slice(0, 2).toLowerCase();
      inicial = (nav === 'en' || nav === 'es') ? nav : 'pt';
    }
    if (inicial !== 'pt') aplicar(inicial);
    else { if (rotulo) rotulo.textContent = 'PT'; }
  }

  /* ---------- BOOT ---------- */
  function init() {
    prepSplit();
    createGlobe($('#globe'),         { scale: .40, speed: .000343, tilt: -.34, cx: .68, cy: .48 });
    createGlobe($('#purposeCanvas'), { scale: .44, speed: .000196, tilt: -.20, cx: .82, cy: .48 });
    createGlobe($('#contactCanvas'), { scale: .48, speed: .000245, tilt: -.42, cx: .30, cy: .45, rotas: false });
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
    slotsOpcionais();
    form();
    idiomas();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
