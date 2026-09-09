/* ============================================================================
   REVELAR — entrada dos blocos por rolagem
   ============================================================================
   IntersectionObserver e não evento de scroll: o observador é avaliado pelo
   navegador fora da thread principal e não dispara centenas de vezes por
   segundo. Um listener de scroll com getBoundingClientRect() em 60 elementos
   causaria recálculo de layout a cada quadro.

   Ele também não tem noção de direção — subir a página vale tanto quanto
   descer, que era um defeito da versão anterior.
   ========================================================================== */
window.ACELERO = window.ACELERO || {};

window.ACELERO.revelar = function revelar() {
  const parado = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const blocos = document.querySelectorAll('[data-ap], [data-ap-fila]');

  // Sem suporte, ou com movimento desligado: tudo já nasce visível.
  if (parado || !('IntersectionObserver' in window)) {
    blocos.forEach(b => b.classList.add('vis'));
    return;
  }

  // O atraso de cada filho vira variável CSS. Teto de 6 itens: numa lista
  // longa, o último entraria tarde demais e pareceria travamento.
  document.querySelectorAll('[data-ap-fila]').forEach(fila => {
    Array.prototype.forEach.call(fila.children, (filho, i) => {
      filho.style.setProperty('--atraso', Math.min(i, 6) * 70 + 'ms');
    });
  });
  document.querySelectorAll('.sobe').forEach((linha, i) => {
    linha.style.setProperty('--atraso', (i % 4) * 80 + 'ms');
  });

  const olho = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('vis');
      olho.unobserve(e.target);        // uma vez só: repetir vira pisca-pisca
    });
  }, {
    // Começa um pouco antes de encostar na dobra: o bloco chega já formado.
    rootMargin: '0px 0px -8% 0px',
    threshold: .06
  });

  blocos.forEach(b => olho.observe(b));
};
