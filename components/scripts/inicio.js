/* ============================================================================
   INÍCIO — orquestrador
   ============================================================================
   Cada módulo é uma função em window.ACELERO. Este arquivo entrega a eles os
   utilitários compartilhados e define a ordem: primeiro o que posiciona a
   página, depois o que anima, por último o que depende do dicionário.

   Sem framework e sem empacotador. Os arquivos de components/ são a fonte; o
   scripts.js publicado é a junção deles, feita por tools/montar.py.
   ========================================================================== */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.prototype.slice.call(c.querySelectorAll(s));
  const parado = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const A = window.ACELERO || {};
  let idiomaAtual = 'pt';

  // Mensagens que o próprio JavaScript emite (validação). O padrão em
  // português é o segundo argumento; o dicionário só sobrescreve quando há
  // tradução para o idioma corrente.
  const msg = (chave, padrao) => {
    const x = (window.ACELERO_IDIOMAS_EXTRA || {})[idiomaAtual];
    return (x && x.msg && x.msg[chave]) || padrao;
  };
  const idioma = () => idiomaAtual;

  function iniciar() {
    A.navegacao  && A.navegacao($, $$, parado);
    A.revelar    && A.revelar();
    A.carrosseis && A.carrosseis();
    A.formulario && A.formulario($, $$, msg, idioma);
    A.idiomas    && A.idiomas($, $$, novo => {
      idiomaAtual = novo;
      // O formulário refaz a lista de países no idioma escolhido.
      document.dispatchEvent(new CustomEvent('acelero:idioma'));
    });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', iniciar)
    : iniciar();
})();
