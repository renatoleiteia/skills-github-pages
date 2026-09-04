/* ============================================================================
   ACELERO COMEX — legal.js

   Página de documento (Política de Privacidade / Termos de uso). Não carrega
   o main.js: aqui não há cursor customizado, preloader nem ScrollTrigger — só
   o que uma leitura longa precisa. Globo do topo, ano do rodapé, sumário que
   acompanha a leitura e âncora com a mesma inércia do site.
   ========================================================================== */

(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.prototype.slice.call(c.querySelectorAll(s));
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- globo da capa ---------- */
  if (window.ACELERO_GLOBO) {
    window.ACELERO_GLOBO.criar($('#docGlobo'), {
      scale: .38, speed: .000159, cx: .78, cy: .52, rotas: false
    });
  }

  /* ---------- ano ---------- */
  const ano = $('#ano');
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* ---------- sumário que acompanha a leitura --------------------------
     A seção corrente é a última cujo topo já passou do terço superior da
     janela. Isso evita o piscar de quando duas seções curtas dividem a
     tela ao mesmo tempo. */
  const links = $$('.doc__sumario a');
  const secoes = links
    .map(a => ({ a, el: a.hash && a.hash.length > 1 ? $(a.hash) : null }))
    .filter(x => x.el);

  function marcar() {
    const linha = window.scrollY + window.innerHeight / 3;
    let atual = secoes.length ? secoes[0] : null;
    secoes.forEach(x => {
      const topo = x.el.getBoundingClientRect().top + window.scrollY;
      if (topo <= linha) atual = x;
    });
    secoes.forEach(x => x.a.setAttribute('aria-current', String(x === atual)));
  }

  if (secoes.length) {
    let pendente = false;
    window.addEventListener('scroll', () => {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(() => { pendente = false; marcar(); });
    }, { passive: true });
    marcar();
  }

  /* ---------- âncoras com a mesma inércia do site -----------------------
     Mesma decisão do index: rolamos o documento de verdade a cada quadro,
     em vez de transformar um contêiner — position:sticky do topo e do
     sumário continuam funcionando. */
  const TOPO = 88;                                   // altura do cabeçalho fixo
  const facil = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function viajar(destino) {
    const limite = document.documentElement.scrollHeight - window.innerHeight;
    const fim = Math.max(0, Math.min(destino, limite));
    const ini = window.scrollY;
    const dist = fim - ini;
    if (Math.abs(dist) < 2) { window.scrollTo(0, fim); return; }
    const dur = Math.min(1100, 320 + Math.abs(dist) * .28);
    const t0 = performance.now();
    (function passo(agora) {
      const k = Math.min(1, (agora - t0) / dur);
      window.scrollTo({ top: ini + dist * facil(k), behavior: 'instant' });
      if (k < 1) requestAnimationFrame(passo);
    })(t0);
  }

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const alvo = $(id);
      if (!alvo) return;
      e.preventDefault();
      const y = alvo.getBoundingClientRect().top + window.scrollY - TOPO;
      if (reduzido) window.scrollTo(0, Math.max(0, y));
      else viajar(y);
      history.replaceState(null, '', id);
      alvo.setAttribute('tabindex', '-1');
      alvo.focus({ preventScroll: true });
    });
  });
})();
