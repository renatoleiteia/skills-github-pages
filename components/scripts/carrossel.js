/* ============================================================================
   CARROSSEL — sobre rolagem nativa
   ============================================================================
   O JS aqui é fino de propósito: quem rola é o navegador. Este módulo só
   (a) manda rolar quando a seta é clicada, (b) descobre qual slide está à
   vista para marcar o ponto e desligar a seta que não leva a lugar nenhum, e
   (c) mantém os rótulos de acessibilidade em dia.

   Nada gira sozinho. Carrossel automático rouba a leitura de quem parou para
   ler e é a razão de a maioria deles irritar.
   ========================================================================== */
window.ACELERO = window.ACELERO || {};

window.ACELERO.carrosseis = function carrosseis() {
  document.querySelectorAll('[data-carrossel]').forEach(montar);

  function montar(raiz) {
    const vp = raiz.querySelector('[data-vp]');
    const slides = vp ? Array.prototype.slice.call(vp.children) : [];
    const anterior = raiz.querySelector('[data-ant]');
    const proximo = raiz.querySelector('[data-prox]');
    const pontos = raiz.querySelector('[data-pts]');
    if (!vp || slides.length < 2) { if (raiz.querySelector('.carrossel__nav')) raiz.querySelector('.carrossel__nav').hidden = true; return; }

    // Semântica: o trilho é uma lista rolável, cada slide um item nomeado.
    vp.setAttribute('role', 'group');
    vp.setAttribute('aria-roledescription', 'carrossel');
    vp.tabIndex = 0;
    slides.forEach((s, i) => {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', 'slide');
      s.setAttribute('aria-label', (i + 1) + ' de ' + slides.length);
    });

    // Marcadores, um por posição possível de parada.
    let botoes = [];
    if (pontos) {
      pontos.innerHTML = '';
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Ir para o item ' + (i + 1));
        b.addEventListener('click', () => irPara(i));
        pontos.appendChild(b);
        botoes.push(b);
      });
    }

    /* Navegação por PÁGINA, não por índice de slide.

       Tentar parar sempre no começo de um slide parece certo e não é: quando
       os últimos slides não cabem antes do fim do trilho, eles nunca alcançam
       a borda esquerda — a seta fica acesa e nada anda. Rolar uma largura de
       janela por vez sempre chega ao fim, e o encaixe por proximidade alinha
       o resultado no slide mais próximo. */
    const limite = () => Math.max(0, vp.scrollWidth - vp.clientWidth);
    const pagina = () => Math.max(1, vp.clientWidth);
    const paginas = () => Math.max(1, Math.ceil(limite() / pagina()) + 1);
    function atual() {
      // Encostou no fim: é a última página, mesmo que o arredondamento
      // simples ainda aponte para a anterior (a última costuma ser curta).
      if (vp.scrollLeft >= limite() - 2) return paginas() - 1;
      return Math.min(paginas() - 1, Math.round(vp.scrollLeft / pagina()));
    }

    function irPara(i) {
      const alvo = Math.max(0, Math.min(i, paginas() - 1));
      vp.scrollTo({ left: Math.min(alvo * pagina(), limite()), behavior: 'smooth' });
    }

    function sincronizar() {
      const max = limite();
      // Tudo coube na tela: não há o que rolar, e controle morto confunde.
      const rolavel = max > 2;
      const nav = raiz.querySelector('.carrossel__nav');
      if (nav) nav.hidden = !rolavel;
      if (pontos) pontos.hidden = !rolavel;
      vp.tabIndex = rolavel ? 0 : -1;
      if (!rolavel) return;

      const i = atual(), total = paginas();
      if (anterior) anterior.disabled = vp.scrollLeft <= 2;
      if (proximo) proximo.disabled = vp.scrollLeft >= max - 2;
      botoes.forEach((b, k) => {
        const ativo = k === i;
        b.classList.toggle('ativo', ativo);
        b.setAttribute('aria-current', String(ativo));
        b.hidden = k >= total;      // ponto sem página correspondente some
      });
    }

    anterior && anterior.addEventListener('click', () => irPara(atual() - 1));
    proximo && proximo.addEventListener('click', () => irPara(atual() + 1));

    // Setas do teclado quando o trilho tem o foco.
    vp.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); irPara(atual() + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); irPara(atual() - 1); }
    });

    // A rolagem dispara muito; um quadro basta para atualizar o estado.
    let pendente = false;
    vp.addEventListener('scroll', () => {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(() => { pendente = false; sincronizar(); });
    }, { passive: true });

    // Girar o aparelho muda quantos slides cabem — e o último ponto de parada.
    let t;
    addEventListener('resize', () => { clearTimeout(t); t = setTimeout(sincronizar, 150); });

    sincronizar();
  }
};
