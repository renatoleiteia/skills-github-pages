/* ============================================================================
   ACELERO COMEX — main.js
   Sem dependências obrigatórias: se o GSAP não carregar (offline, CDN
   bloqueada), tudo cai para um fallback em IntersectionObserver e o site
   continua funcionando. Nada aqui quebra a navegação sem JavaScript.

   Módulos:
   01. Utilitários
   02. Preloader
   03. Cursor customizado
   04. Header + menu fullscreen
   05. Animações (split, reveal, parallax) — GSAP ou fallback
   06. Marquee infinito
   07. Contadores de resultados
   08. Slider de depoimentos
   09. FAQ (accordion exclusivo)
   10. Scroll: progresso, link ativo, botões flutuantes
   11. Formulário: máscara, validação e envio
   12. Placeholders de mídia ausente
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- 01. UTILITÁRIOS ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';

  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (!hasGSAP) document.body.classList.add('no-gsap');

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  /* ---------- 02. PRELOADER ---------- */
  function initPreloader() {
    const el    = $('#preloader');
    const count = $('#preloaderCount');
    const bar   = $('#preloaderBar');
    if (!el) return finish();

    let progress = 0;
    let done = false;

    // Progresso "orgânico": sobe rápido no início e desacelera perto do fim.
    const tick = setInterval(() => {
      const step = progress < 70 ? Math.random() * 12 : Math.random() * 4;
      progress = Math.min(progress + step, done ? 100 : 96);
      render();
      if (progress >= 100) { clearInterval(tick); close(); }
    }, 110);

    function render() {
      const v = Math.floor(progress);
      if (count) count.textContent = v;
      if (bar) bar.style.width = v + '%';
    }

    function close() {
      el.classList.add('is-done');
      setTimeout(finish, 480);
    }

    window.addEventListener('load', () => { done = true; });
    // Rede lenta não pode segurar a página para sempre.
    setTimeout(() => { done = true; }, 3200);

    function finish() {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-ready');
      playIntro();
    }
  }

  /* ---------- 03. CURSOR CUSTOMIZADO ---------- */
  function initCursor() {
    const cursor = $('#cursor');
    if (!cursor || isTouch || prefersReduced) { if (cursor) cursor.remove(); return; }

    const dot   = $('.cursor__dot', cursor);
    const ring  = $('.cursor__ring', cursor);
    const label = $('.cursor__label', cursor);

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener('mousemove', (e) => {
      cursor.classList.add('is-active');
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }, { passive: true });

    (function raf() {
      rx = lerp(rx, mx, 0.16);
      ry = lerp(ry, my, 0.16);
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(raf);
    })();

    // Estado "hover" em qualquer elemento interativo
    const hoverables = 'a, button, summary, input, select, textarea, [data-cursor]';
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest(hoverables);
      if (!t) return;
      cursor.classList.add('is-hover');
      label.textContent = t.getAttribute('data-cursor') || '';
    });
    document.addEventListener('mouseout', (e) => {
      if (!e.target.closest(hoverables)) return;
      cursor.classList.remove('is-hover');
      label.textContent = '';
    });
  }

  /* ---------- 04. HEADER + MENU ---------- */
  function initHeader() {
    const header = $('#header');
    const burger = $('#burger');
    const menu   = $('#menu');
    if (!header) return;

    let lastY = window.scrollY;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 40);
      // Esconde ao descer, revela ao subir — não esconde com o menu aberto.
      const hide = y > lastY && y > 320 && !document.body.classList.contains('menu-open');
      header.classList.toggle('is-hidden', hide);
      lastY = y;
    }, { passive: true });

    if (!burger || !menu) return;

    const openMenu = () => {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Fechar menu');
      document.body.classList.add('menu-open');
    };

    const closeMenu = () => {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menu');
      document.body.classList.remove('menu-open');
      setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 700);
    };

    burger.addEventListener('click', () => {
      menu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    $$('.menu__link, .menu__contact', menu).forEach(a => a.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
    });
  }

  /* ---------- 05. ANIMAÇÕES ---------- */

  // Envolve o texto de cada .line em um <span> para o efeito de "cortina".
  function prepareSplit() {
    $$('[data-split] .line').forEach(line => {
      if (line.querySelector('span')) return;
      const inner = document.createElement('span');
      while (line.firstChild) inner.appendChild(line.firstChild);
      line.appendChild(inner);
      if (!prefersReduced) {
        inner.style.transform = 'translateY(105%)';
        inner.style.opacity = '0';
      }
    });
  }

  // Anima os títulos do herói assim que o preloader sai.
  function playIntro() {
    const heroLines = $$('.hero [data-split] .line > span');
    const heroReveal = $$('.hero [data-reveal]');

    if (prefersReduced) {
      heroLines.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
      heroReveal.forEach(s => { s.style.opacity = '1'; s.style.transform = 'none'; });
      return;
    }

    if (hasGSAP) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(heroLines, { y: '0%', opacity: 1, duration: 1.1, stagger: 0.09 })
        .to(heroReveal, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 }, '-=0.7')
        .from('.header__inner > *', { y: -18, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.15);
    } else {
      heroLines.forEach((s, i) => {
        s.style.transition = 'transform .9s cubic-bezier(.22,1,.36,1) ' + (i * 0.09) + 's, opacity .9s ease ' + (i * 0.09) + 's';
        s.style.transform = 'translateY(0)';
        s.style.opacity = '1';
      });
      heroReveal.forEach(el => el.classList.add('is-in'));
    }
  }

  function initScrollAnimations() {
    // Títulos com split fora do herói
    const splitBlocks = $$('[data-split]').filter(el => !el.closest('.hero'));
    // Blocos com fade/slide
    const reveals = $$('[data-reveal]').filter(el => !el.closest('.hero'));

    if (prefersReduced) {
      $$('[data-split] .line > span').forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
      reveals.forEach(el => el.classList.add('is-in'));
      return;
    }

    if (hasGSAP && window.ScrollTrigger) {
      splitBlocks.forEach(block => {
        gsap.to(block.querySelectorAll('.line > span'), {
          y: '0%', opacity: 1, duration: 1.05, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: block, start: 'top 85%', once: true }
        });
      });

      reveals.forEach(el => {
        gsap.to(el, {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          delay: parseFloat(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      });

      // Parallax leve
      $$('[data-parallax]').forEach(el => {
        const amount = parseFloat(el.dataset.parallax) || 0.1;
        gsap.fromTo(el,
          { yPercent: -amount * 50 },
          {
            yPercent: amount * 50, ease: 'none',
            scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true }
          });
      });

      // Cada serviço "respira" ao entrar na viewport
      $$('[data-service]').forEach(item => {
        gsap.from(item.querySelector('.service__body'), {
          opacity: 0, y: 40, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 82%', once: true }
        });
      });

      ScrollTrigger.refresh();
      return;
    }

    // ----- Fallback sem GSAP -----
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);

        if (el.hasAttribute('data-split')) {
          $$('.line > span', el).forEach((s, i) => {
            s.style.transition = 'transform .9s cubic-bezier(.22,1,.36,1) ' + (i * 0.08) + 's, opacity .9s ease ' + (i * 0.08) + 's';
            s.style.transform = 'translateY(0)';
            s.style.opacity = '1';
          });
        } else {
          el.style.transitionDelay = delay + 's';
          el.classList.add('is-in');
        }
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    splitBlocks.forEach(el => io.observe(el));
    reveals.forEach(el => io.observe(el));

    // Parallax simples no scroll
    const parallaxEls = $$('[data-parallax]');
    if (parallaxEls.length) {
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const vh = window.innerHeight;
          parallaxEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.bottom < -200 || rect.top > vh + 200) return;
            const amount = parseFloat(el.dataset.parallax) || 0.1;
            const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
            el.style.transform = 'translate3d(0,' + (progress * amount * 100).toFixed(2) + 'px,0)';
          });
          ticking = false;
        });
      }, { passive: true });
    }
  }

  /* ---------- 06. MARQUEE ---------- */
  function initMarquee() {
    $$('[data-marquee]').forEach(wrap => {
      const track = $('.marquee__track', wrap);
      if (!track) return;

      // Duplica o conteúdo até preencher o dobro da largura da tela: o loop
      // fica contínuo em qualquer resolução.
      const original = track.innerHTML;
      let guard = 0;
      while (track.scrollWidth < window.innerWidth * 2 && guard < 8) {
        track.innerHTML += original;
        guard++;
      }

      if (prefersReduced) return;

      const half = track.scrollWidth / 2;
      let x = 0;
      const speed = 0.45;

      (function run() {
        x -= speed;
        if (Math.abs(x) >= half) x = 0;
        track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
        requestAnimationFrame(run);
      })();
    });
  }

  /* ---------- 07. CONTADORES ---------- */
  function initCounters() {
    const nodes = $$('[data-count]');
    if (!nodes.length) return;

    const animate = (el) => {
      const target   = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const prefix   = el.dataset.prefix || '';
      const suffix   = el.dataset.suffix || '';
      const duration = 1600;

      if (prefersReduced) {
        el.textContent = prefix + target.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
        return;
      }

      const start = performance.now();
      (function step(now) {
        const p = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        const value = target * eased;
        el.textContent = prefix + value.toLocaleString('pt-BR', {
          minimumFractionDigits: decimals, maximumFractionDigits: decimals
        }) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        animate(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });

    nodes.forEach(n => io.observe(n));
  }

  /* ---------- 08. DEPOIMENTOS ---------- */
  function initTestimonials() {
    const root = $('[data-testimonials]');
    if (!root) return;

    const track  = $('[data-t-track]', root);
    const slides = $$('[data-t-slide]', root);
    const dotsEl = $('[data-t-dots]', root);
    const prev   = $('[data-t-prev]', root);
    const next   = $('[data-t-next]', root);
    if (!track || !slides.length) return;

    let index = 0;

    // Pontos de navegação
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Ir para o depoimento ' + (i + 1));
      b.addEventListener('click', () => go(i));
      dotsEl.appendChild(b);
    });

    function maxIndex() {
      // Não deixa passar do último card visível.
      const visible = Math.max(1, Math.round(track.parentElement.offsetWidth / slides[0].offsetWidth));
      return Math.max(0, slides.length - visible);
    }

    function go(i) {
      index = clamp(i, 0, maxIndex());
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0) || 0;
      const offset = (slides[0].offsetWidth + gap) * index;
      track.style.transform = 'translate3d(-' + offset + 'px,0,0)';
      $$('button', dotsEl).forEach((d, di) => d.classList.toggle('is-active', di === index));
    }

    prev && prev.addEventListener('click', () => go(index - 1));
    next && next.addEventListener('click', () => go(index + 1));

    // Arrastar com o dedo / mouse
    let startX = 0, dragging = false;
    track.addEventListener('pointerdown', (e) => { dragging = true; startX = e.clientX; });
    window.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      const delta = e.clientX - startX;
      if (Math.abs(delta) > 60) go(index + (delta < 0 ? 1 : -1));
    });

    window.addEventListener('resize', () => go(index));
    go(0);
  }

  /* ---------- 09. FAQ ---------- */
  function initFaq() {
    const items = $$('[data-faq] .faq__item');
    items.forEach(item => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        items.forEach(other => { if (other !== item) other.open = false; });
      });
    });
  }

  /* ---------- 10. SCROLL: PROGRESSO, LINK ATIVO, FLUTUANTES ---------- */
  function initScrollUI() {
    const progress = $('#scrollProgress');
    const toTop    = $('#toTop');
    const wa       = $('.wa-float');
    const links    = $$('.nav__link');
    const sections = links
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    const onScroll = () => {
      const y   = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = ((y / (max || 1)) * 100).toFixed(2) + '%';

      if (toTop) toTop.classList.toggle('is-visible', y > window.innerHeight * 0.9);
      if (wa)    wa.classList.toggle('is-visible', y > window.innerHeight * 0.5);

      // Link ativo
      let currentId = '';
      sections.forEach(sec => {
        if (sec.getBoundingClientRect().top <= window.innerHeight * 0.35) currentId = sec.id;
      });
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + currentId));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toTop && toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });

    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- 11. FORMULÁRIO ---------- */
  function initForm() {
    const form = $('#contactForm');
    if (!form) return;

    const feedback = $('#formFeedback');
    const phone    = $('#telefone');

    // Máscara de telefone brasileira
    phone && phone.addEventListener('input', () => {
      let v = phone.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      } else if (v.length > 0) {
        v = v.replace(/^(\d{0,2})/, '($1');
      }
      phone.value = v;
    });

    const setError = (field, message) => {
      const wrap = field.closest('.field') || field.parentElement;
      const slot = wrap ? wrap.querySelector('[data-error]') : null;
      if (wrap) wrap.classList.toggle('has-error', Boolean(message));
      if (slot) slot.textContent = message || '';
    };

    const validate = () => {
      let ok = true;

      const required = [
        ['#nome',      'Informe o seu nome.'],
        ['#empresa',   'Informe o nome da empresa.'],
        ['#interesse', 'Selecione o que você precisa.']
      ];

      required.forEach(([sel, msg]) => {
        const f = $(sel);
        if (!f.value.trim()) { setError(f, msg); ok = false; } else setError(f, '');
      });

      const email = $('#email');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        setError(email, 'Informe um e-mail válido.'); ok = false;
      } else setError(email, '');

      const tel = $('#telefone');
      if (tel.value.replace(/\D/g, '').length < 10) {
        setError(tel, 'Informe um WhatsApp com DDD.'); ok = false;
      } else setError(tel, '');

      const consent = $('#consent');
      const consentError = $('#consentError');
      if (!consent.checked) {
        consentError.textContent = 'É preciso autorizar o contato para enviar.'; ok = false;
      } else consentError.textContent = '';

      return ok;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      feedback.textContent = '';
      feedback.className = 'form__feedback';

      if (!validate()) {
        feedback.textContent = 'Confira os campos destacados acima.';
        feedback.classList.add('is-err');
        form.querySelector('.has-error input, .has-error select')?.focus();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.querySelector('span').textContent;
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Enviando…';

      const data = Object.fromEntries(new FormData(form).entries());

      try {
        /* ------------------------------------------------------------------
           ENVIO REAL — descomente e troque a URL pelo seu endpoint.
           Funciona com Formspree, Basin, Getform, n8n, Make, Zapier ou uma
           rota própria no seu backend/CRM.

           const res = await fetch('https://SEU-ENDPOINT-AQUI', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(data)
           });
           if (!res.ok) throw new Error('Falha no envio');
        ------------------------------------------------------------------ */

        // Simulação enquanto o endpoint não está conectado:
        console.info('[ACELERO COMEX] Lead capturado:', data);
        await new Promise(r => setTimeout(r, 900));

        form.reset();
        feedback.textContent = 'Recebido! Um especialista entra em contato em até 1 dia útil.';
        feedback.classList.add('is-ok');

        // Ponto de integração com analytics / pixel:
        // window.dataLayer && window.dataLayer.push({ event: 'lead_form_submit' });
      } catch (err) {
        feedback.textContent = 'Não conseguimos enviar agora. Chame no WhatsApp que resolvemos na hora.';
        feedback.classList.add('is-err');
      } finally {
        btn.disabled = false;
        btn.querySelector('span').textContent = original;
      }
    });
  }

  /* ---------- 12. PLACEHOLDERS DE MÍDIA ---------- */
  // Enquanto as fotos e vídeos reais não estiverem em /assets, mostramos um
  // placeholder com o nome do arquivo esperado — em vez de um ícone quebrado.
  function initMediaFallback() {
    const mark = (img) => {
      const wrap = img.closest('.media') || img.parentElement;
      if (!wrap) return;
      const file = (img.getAttribute('src') || '').split('/').pop();
      wrap.classList.add('is-missing');
      wrap.setAttribute('data-placeholder', 'Imagem sugerida: ' + file);
    };

    $$('img').forEach(img => {
      img.addEventListener('error', () => mark(img));
      if (img.complete && img.naturalWidth === 0) mark(img);
    });

    // Vídeo ausente: escondemos o elemento e deixamos o gradiente animado do CSS.
    $$('video').forEach(video => {
      video.addEventListener('error', () => { video.style.display = 'none'; }, true);
      const sources = $$('source', video);
      let failed = 0;
      sources.forEach(s => s.addEventListener('error', () => {
        if (++failed >= sources.length) video.style.display = 'none';
      }));
    });
  }

  /* ---------- BOOT ---------- */
  function init() {
    prepareSplit();
    initPreloader();
    initCursor();
    initHeader();
    initScrollAnimations();
    initMarquee();
    initCounters();
    initTestimonials();
    initFaq();
    initScrollUI();
    initForm();
    initMediaFallback();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
