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
    createGlobe($('#cursorGlobo'), { scale: .46, speed: .000715, inclinacao: INCLINACAO_TERRA, rotas: false, nos: false });

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

    // O clique fica com navegacaoFluida(), que usa a mesma curva das âncoras.
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
    const fb = $('#formFeedback');
    const tel = $('#telefone'), selPais = $('#pais');
    const conf = $('#waConf'), waOk = $('#waOk'), waNumero = $('#waNumero'), waTeste = $('#waTeste');
    const PAISES = window.ACELERO_PAISES || [];
    const DDD_BR = window.ACELERO_DDD_BR || [];
    const PESSOAL = window.ACELERO_EMAIL_PESSOAL || [];

    /* ---- seletor de país ------------------------------------------------
       O código de discagem vem primeiro de propósito: fechado, o controle é
       estreito e o nome do país é o que se perde na reticência. O código,
       que é o que muda a validação, fica sempre visível. */
    function ordenar(idioma) {
      const nome = pa => pa[idioma] || pa.pt;
      return PAISES.slice().sort((a, b) => {
        if (a.iso === 'BR') return -1;
        if (b.iso === 'BR') return 1;
        return nome(a).localeCompare(nome(b), idioma === 'en' ? 'en' : 'pt');
      });
    }

    function preencherPaises() {
      if (!selPais || !PAISES.length) return;
      const escolhido = selPais.value || 'BR';
      selPais.innerHTML = '';
      ordenar(idiomaAtual).forEach(pa => {
        const o = document.createElement('option');
        const nome = pa[idiomaAtual] || pa.pt;
        o.value = pa.iso;
        o.textContent = '+' + pa.ddi + ' ' + nome;
        o.title = nome + ' (+' + pa.ddi + ')';
        selPais.appendChild(o);
      });
      selPais.value = escolhido;
      if (!selPais.value) selPais.value = 'BR';
    }

    const pais = () => PAISES.find(pa => pa.iso === (selPais ? selPais.value : 'BR')) ||
                       PAISES.find(pa => pa.iso === 'BR') ||
                       { iso: 'BR', ddi: '55', dig: [10, 11] };

    const digitos = v => (v || '').replace(/\D/g, '');

    /* ---- máscara --------------------------------------------------------
       Só mascaramos onde o formato é conhecido de verdade (Brasil e o plano
       norte-americano). Para o resto, agrupar em blocos inventados atrapalha
       mais do que ajuda: fica só o limite de dígitos do país. */
    function mascarar(v, pa) {
      const max = pa.dig[1];
      let d = digitos(v).slice(0, max);
      if (pa.iso === 'BR') {
        if (d.length > 6)      return d.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, '($1) $2-$3');
        if (d.length > 2)      return d.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        if (d.length > 0)      return d.replace(/^(\d{0,2})/, '($1');
        return d;
      }
      if (pa.ddi === '1') {
        if (d.length > 6) return d.replace(/^(\d{3})(\d{3})(\d{0,4}).*/, '($1) $2-$3');
        if (d.length > 3) return d.replace(/^(\d{3})(\d{0,3})/, '($1) $2');
        return d;
      }
      return d.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
    }

    const modelo = pa => pa.iso === 'BR' ? '(00) 00000-0000'
                       : pa.ddi === '1'  ? '(000) 000-0000'
                       : '0'.repeat(pa.dig[1]).replace(/(\d{3})(?=\d)/g, '$1 ');

    /* ---- é um número plausível? -----------------------------------------
       Não existe validação de verdade sem mandar mensagem — isso é backend.
       O que dá para fazer aqui é recusar o que claramente não é telefone:
       comprimento fora da faixa do país, DDD que não existe, celular
       brasileiro sem o 9, dígito repetido e sequência crescente. */
    function problemaNoNumero() {
      const pa = pais();
      const d = digitos(tel.value);
      if (!d) return msg('telefone', 'Informe o seu WhatsApp com DDD.');
      if (d.length < pa.dig[0] || d.length > pa.dig[1])
        return msg('telDig', 'Número incompleto para o país escolhido.');
      if (/^(\d)\1+$/.test(d)) return msg('telFalso', 'Este número não parece real. Confira e digite de novo.');
      if ('01234567890123456789'.indexOf(d) !== -1 || '98765432109876543210'.indexOf(d) !== -1)
        return msg('telFalso', 'Este número não parece real. Confira e digite de novo.');
      if (pa.iso === 'BR') {
        if (DDD_BR.indexOf(parseInt(d.slice(0, 2), 10)) === -1)
          return msg('telDDD', 'DDD inexistente. Confira os dois primeiros dígitos.');
        if (!(d.length === 11 && d.charAt(2) === '9'))
          return msg('telCel', 'WhatsApp no Brasil é celular: 11 dígitos, com o 9 depois do DDD.');
      }
      return '';
    }

    const e164 = () => '+' + pais().ddi + digitos(tel.value);

    function exibirE164() {
      const pa = pais(), d = digitos(tel.value);
      if (pa.iso === 'BR' && d.length === 11)
        return '+' + pa.ddi + ' ' + d.slice(0, 2) + ' ' + d.slice(2, 7) + '-' + d.slice(7);
      return '+' + pa.ddi + ' ' + d.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
    }

    /* ---- bloco de confirmação -------------------------------------------
       Aparece só quando o número já passa nas checagens acima: pedir
       confirmação de um campo pela metade seria ruído. Mudar o número
       derruba a confirmação — é o ponto do controle. */
    function atualizarConfirmacao() {
      if (!conf) return;
      const bom = !problemaNoNumero();
      if (!bom) {
        if (!conf.hidden) { conf.hidden = true; if (waOk) waOk.checked = false; }
        return;
      }
      const num = exibirE164();
      if (waNumero && waNumero.textContent !== num) {
        waNumero.textContent = num;
        if (waOk) waOk.checked = false;   // número novo, confirmação zerada
      }
      if (waTeste) waTeste.href = 'https://wa.me/' + digitos(e164()) +
        '?text=' + encodeURIComponent('Ola, sou eu — confirmando meu WhatsApp para a ACELERO COMEX.');
      conf.hidden = false;
    }

    if (selPais) {
      preencherPaises();
      selPais.addEventListener('change', () => {
        tel.value = mascarar(tel.value, pais());
        tel.placeholder = modelo(pais());
        setErr(tel, '');
        atualizarConfirmacao();
      });
      document.addEventListener('acelero:idioma', () => {
        preencherPaises();
        tel.placeholder = modelo(pais());
      });
      tel.placeholder = modelo(pais());
    }

    tel && tel.addEventListener('input', () => {
      tel.value = mascarar(tel.value, pais());
      atualizarConfirmacao();
    });

    const setErr = (el, texto) => {
      const w = el.closest('.fd') || el.parentElement;
      const slot = w && w.querySelector('[data-error]');
      if (w) w.classList.toggle('err', !!texto);
      if (slot) slot.textContent = texto || '';
    };

    /* ---- e-mail corporativo ---------------------------------------------
       A regra é do negócio, não da técnica: a lista de provedores pessoais
       está em js/paises.js justamente para ser afrouxada sem mexer aqui. */
    function problemaNoEmail() {
      const v = $('#email').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
        return msg('email', 'Informe um e-mail válido.');
      const dom = v.split('@').pop().toLowerCase();
      if (PESSOAL.indexOf(dom) !== -1)
        return msg('emailCorp', 'Use o e-mail da empresa. Não atendemos por e-mail pessoal.');
      if (dom.split('.').length < 2) return msg('email', 'Informe um e-mail válido.');
      return '';
    }

    const valid = () => {
      let ok = true;
      [['#nome', msg('nome', 'Informe o seu nome.')],
       ['#empresa', msg('empresa', 'Informe o nome da empresa.')],
       ['#interesse', msg('interesse', 'Selecione o que você precisa.')]].forEach(([sel, m]) => {
        const el = $(sel);
        if (!el.value.trim()) { setErr(el, m); ok = false; } else setErr(el, '');
      });

      const em = $('#email'), pe = problemaNoEmail();
      if (pe) { setErr(em, pe); ok = false; } else setErr(em, '');

      const pt = problemaNoNumero();
      if (pt) { setErr(tel, pt); ok = false; } else setErr(tel, '');

      const we = $('#waErro');
      if (!pt && waOk && !waOk.checked) {
        if (we) we.textContent = msg('waConf', 'Marque a confirmação do WhatsApp para enviarmos.');
        ok = false;
      } else if (we) we.textContent = '';

      const cs = $('#consent'), ce = $('#consentError');
      if (!cs.checked) { ce.textContent = msg('consent', 'É preciso autorizar o contato para enviar.'); ok = false; }
      else ce.textContent = '';
      return ok;
    };

    waOk && waOk.addEventListener('change', () => {
      const we = $('#waErro');
      if (we && waOk.checked) we.textContent = '';
    });

    f.addEventListener('submit', async e => {
      e.preventDefault();
      fb.textContent = ''; fb.className = 'form__fb';

      if (!valid()) {
        fb.textContent = msg('campos', 'Confira os campos destacados acima.');
        fb.classList.add('bad');
        const primeiro = f.querySelector('.err input, .err select') ||
                         (waOk && !waOk.checked ? waOk : null);
        if (primeiro) primeiro.focus();
        return;
      }

      const btn = f.querySelector('button[type="submit"]');
      const span = btn.querySelector('span');
      const label = span.textContent;
      btn.disabled = true; span.textContent = msg('enviando', 'Enviando…');

      const data = Object.fromEntries(new FormData(f).entries());
      data.telefone_e164 = e164();
      data.pais_ddi = '+' + pais().ddi;
      data.whatsapp_confirmado = waOk && waOk.checked ? 'sim' : 'nao';

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

           CONFIRMAÇÃO POR CÓDIGO (OTP): o passo acima é declaratório — a
           pessoa afirma que o número é dela. Confirmar de fato exige enviar
           um código e conferir a resposta, o que só um servidor faz (API do
           WhatsApp Business, Twilio Verify ou equivalente). Quando esse
           serviço existir, o lugar de chamá-lo é aqui, antes do POST.
        ------------------------------------------------------------ */
        console.info('[ACELERO COMEX] lead:', data);
        await new Promise(r => setTimeout(r, 850));

        f.reset();
        if (selPais) { selPais.value = 'BR'; tel.placeholder = modelo(pais()); }
        if (conf) conf.hidden = true;
        if (waNumero) waNumero.textContent = '+55';
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

    // O rótulo do consentimento é o <span> do label que embrulha #consent.
    function rotuloConsentimento() {
      const cx = $('#consent');
      const lb = cx && cx.closest('.chk');
      return lb ? lb.querySelector('span') : null;
    }

    // Guarda o português como está no HTML.
    const original = new Map();
    $$('[data-i18n]').forEach(el => original.set(el, alvo(el).innerHTML));
    const originalExtra = {
      placeholders: {}, opcoes: {},
      consentimento: rotuloConsentimento() ? rotuloConsentimento().innerHTML : ''
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
      const consent = rotuloConsentimento();
      if (consent) consent.innerHTML = x && x.consentimento ? x.consentimento : originalExtra.consentimento;

      idiomaAtual = idioma;
      document.documentElement.lang = idioma === 'pt' ? 'pt-BR' : idioma;
      if (rotulo) rotulo.textContent = idioma.toUpperCase();
      reformatarNumeros();
      document.dispatchEvent(new CustomEvent('acelero:idioma'));
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

  /* ---------- 16. NAVEGAÇÃO FLUIDA --------------------------------------
     Roda, setas, PageUp/Down, espaço, Home/End e os cliques do menu passam
     todos pelo mesmo motor, para que nada na página role de um jeito e o
     resto de outro.

     Decisão importante: a rolagem continua sendo a do documento — cada
     quadro chama scrollTo() de verdade. A alternativa comum (transformar um
     wrapper e fingir a rolagem) quebraria position:sticky, o parallax do
     ScrollTrigger e o cálculo de offset das âncoras, tudo de uma vez.

     Toque e barra de rolagem seguem nativos. Quem pede menos movimento não
     recebe nada disto.
     ------------------------------------------------------------------- */
  function navegacaoFluida() {
    if (reduced) return;

    const ATRITO = 0.12;          // menor = mais deslize; maior = mais seco
    let alvo = scrollY, animando = false, raf = null, modo = null;

    const limite = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const irInstantaneo = y => scrollTo({ top: y, behavior: 'instant' });
    const parar = () => { if (raf) cancelAnimationFrame(raf); raf = null; animando = false; modo = null; };

    function inercia() {
      const resto = alvo - scrollY;
      if (Math.abs(resto) < 1) { irInstantaneo(alvo); parar(); return; }
      // Passo mínimo de 1px. Sem isto, na reta final o passo vira fração de
      // pixel, o navegador arredonda de volta para a mesma posição, o laço
      // nunca alcança o alvo e fica preso — travando qualquer outra rolagem
      // da página, inclusive a do teclado e a do botão de voltar ao topo.
      irInstantaneo(scrollY + Math.sign(resto) * Math.max(1, Math.abs(resto) * ATRITO));
      raf = requestAnimationFrame(inercia);
    }

    // Empurra o destino e deixa a página persegui-lo. Se uma viagem estiver
    // em curso, o gesto do leitor tem precedência e assume o comando.
    function empurrar(delta) {
      if (modo === 'viagem') { parar(); alvo = scrollY; }
      alvo = clamp(alvo + delta, 0, limite());
      if (!animando) { animando = true; modo = 'inercia'; raf = requestAnimationFrame(inercia); }
    }

    // Viagem entre seções: distância maior, tempo um pouco maior, com teto.
    function viajar(destino) {
      const inicio = scrollY;
      const fim = clamp(destino, 0, limite());
      const dist = fim - inicio;
      if (Math.abs(dist) < 2) return;
      const dur = clamp(500 + Math.sqrt(Math.abs(dist)) * 24, 800, 1700);
      const t0 = performance.now();
      parar();
      animando = true; modo = 'viagem';
      (function passo(agora) {
        const p = clamp((agora - t0) / dur, 0, 1);
        // easeInOutCubic: velocidade quase constante no miolo. A curva expo
        // que estava aqui antes disparava no meio do trajeto e o percurso
        // virava um borrão — o oposto de fluido.
        const e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        irInstantaneo(inicio + dist * e);
        if (p < 1) raf = requestAnimationFrame(passo);
        else { alvo = fim; parar(); }
      })(t0);
    }

    // Roda do mouse.
    if (!touch) {
      addEventListener('wheel', e => {
        if (e.ctrlKey) return;                                    // zoom do navegador
        if (document.body.classList.contains('menu-on')) return;   // menu trava a página
        if (e.target.closest('textarea')) return;                  // rolagem interna do campo
        e.preventDefault();
        const unidade = e.deltaMode === 1 ? 18 : e.deltaMode === 2 ? innerHeight : 1;
        empurrar(e.deltaY * unidade);
      }, { passive: false });
    }

    // Teclado. Sem isto as setas dariam saltos seccos no meio de uma página
    // que desliza — o contraste é justamente o que denuncia a emenda.
    const digitando = el => {
      if (!el) return false;
      const t = el.tagName;
      return t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || el.isContentEditable;
    };
    addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (document.body.classList.contains('menu-on')) return;
      if (digitando(e.target)) return;                            // está escrevendo, não rolando

      const seta = 120;
      const pagina = innerHeight * 0.85;
      let delta = null, destino = null;

      switch (e.key) {
        case 'ArrowDown': delta = seta; break;
        case 'ArrowUp':   delta = -seta; break;
        case 'PageDown':  delta = pagina; break;
        case 'PageUp':    delta = -pagina; break;
        case ' ':
          // Espaço num botão ou link focado aciona o elemento; não é rolagem.
          if (e.target && e.target.closest && e.target.closest('a, button, summary')) return;
          delta = e.shiftKey ? -pagina : pagina; break;
        case 'Home': destino = 0; break;
        case 'End':  destino = limite(); break;
        default: return;
      }
      e.preventDefault();
      if (destino !== null) viajar(destino);
      else empurrar(delta);
    });

    // Qualquer rolagem que não seja nossa (barra, busca na página, foco por
    // Tab) ressincroniza o destino, senão o próximo gesto daria um salto.
    addEventListener('scroll', () => { if (!animando) alvo = scrollY; }, { passive: true });
    addEventListener('resize', () => { if (!animando) alvo = scrollY; }, { passive: true });

    const topoDe = el => {
      const cab = $('#head');
      const folga = cab ? cab.offsetHeight : 78;
      return el.getBoundingClientRect().top + scrollY - folga;
    };

    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const destino = document.querySelector(id);
      if (!destino) return;
      e.preventDefault();
      // Com o menu aberto, deixa a cortina subir antes de viajar — senão a
      // página desliza por baixo de um overlay que ainda está fechando.
      const espera = document.body.classList.contains('menu-on') ? 380 : 0;
      setTimeout(() => viajar(topoDe(destino)), espera);
      if (history.replaceState) history.replaceState(null, '', id);
    });

    // O botão de voltar ao topo usa a mesma curva das âncoras. Ele não é
    // substituído: o trilho guarda uma referência a este mesmo nó para
    // mostrá-lo e escondê-lo conforme a rolagem.
    const topo = $('#toTop');
    if (topo) topo.addEventListener('click', () => viajar(0));
  }

  /* ---------- BOOT ---------- */
  // O globo vem de js/globo.js, compartilhado com a página do webmail.
  const GLOBO = window.ACELERO_GLOBO || null;
  const createGlobe = (c, o) => GLOBO && GLOBO.criar(c, o);
  const INCLINACAO_TERRA = GLOBO ? GLOBO.INCLINACAO_TERRA : 23.5 * Math.PI / 180;

  function init() {
    prepSplit();
    createGlobe($('#globe'),         { scale: .40, speed: .000223, inclinacao: INCLINACAO_TERRA, cx: .68, cy: .48 });
    createGlobe($('#purposeCanvas'), { scale: .44, speed: .000127, inclinacao: INCLINACAO_TERRA, cx: .82, cy: .48 });
    createGlobe($('#contactCanvas'), { scale: .48, speed: .000159, inclinacao: INCLINACAO_TERRA, cx: .30, cy: .45, rotas: false });
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
    navegacaoFluida();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
