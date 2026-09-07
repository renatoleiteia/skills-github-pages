/* ============================================================================
   NAVEGAÇÃO — topo, menu, âncoras e seção corrente
   ============================================================================
   A rolagem continua sendo a do navegador. Só o clique numa âncora é suavizado
   por `scrollTo({behavior:'smooth'})`, nativo. Sequestrar a roda do mouse com
   um motor próprio é o que faz um site parecer travado — não fazemos isso.
   ========================================================================== */
window.ACELERO = window.ACELERO || {};

window.ACELERO.navegacao = function navegacao($, $$, parado) {
/* ---------- 01. SEMPRE COMEÇAR NO TOPO ---------------------------------
   O navegador restaura a rolagem ao recarregar e a página reabria no meio.
   Zerar uma vez não basta: o salto para a âncora acontece depois, já com o
   layout montado. Seguramos o topo por meio segundo e largamos ao primeiro
   gesto de quem está lendo.

   EXCEÇÃO: endereço com #secao. Quem manda "acelerocomex.com.br/#contato" num
   WhatsApp ou põe isso num anúncio quer que a pessoa caia no contato — e a
   versão anterior desta função apagava o # e jogava todo mundo para o começo.
   Segurar o topo é para quem chega pela porta da frente, não para quem foi
   convidado a entrar por uma janela específica. */
function comecarNoTopo() {
  const manual = () => { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; };
  if (location.hash && $(location.hash)) { manual(); return; }
  const zerar = () => {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    window.scrollTo(0, 0);
  };
  let agiu = false;
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(ev =>
    addEventListener(ev, () => { agiu = true; }, { once: true, passive: true }));
  manual(); zerar();
  addEventListener('load', () => {
    manual();
    const t0 = performance.now();
    (function insistir() {
      if (agiu) return;
      zerar();
      if (performance.now() - t0 < 600) requestAnimationFrame(insistir);
    })();
  }, { once: true });
  addEventListener('beforeunload', () => window.scrollTo(0, 0));
}

/* ---------- 02. MENU ---------------------------------------------------- */
function menu() {
  const b = $('#hamb'), nav = $('#nav');
  if (!b || !nav) return;
  const fechar = () => {
    nav.classList.remove('aberto');
    document.body.classList.remove('menu-on');
    b.setAttribute('aria-expanded', 'false');
  };
  b.addEventListener('click', () => {
    const abrindo = !nav.classList.contains('aberto');
    nav.classList.toggle('aberto', abrindo);
    document.body.classList.toggle('menu-on', abrindo);
    b.setAttribute('aria-expanded', String(abrindo));
  });
  $$('a', nav).forEach(a => a.addEventListener('click', fechar));
  addEventListener('keydown', e => { if (e.key === 'Escape') fechar(); });
}

/* ---------- 04. ÂNCORAS -------------------------------------------------
   Rolagem suave só no clique do menu — a roda e as setas continuam sendo do
   navegador. Sequestrar a rolagem é o que faz um site parecer travado. */
function ancoras() {
  const alturaTopo = () => { const h = $('.topo'); return h ? h.offsetHeight + 10 : 78; };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id.length < 2) return;
    const alvo = $(id);
    if (!alvo) return;
    e.preventDefault();
    const y = alvo.getBoundingClientRect().top + window.scrollY - alturaTopo();
    window.scrollTo({ top: Math.max(0, y), behavior: parado ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
  });
}

/* ---------- 05. SEÇÃO CORRENTE NO MENU ---------------------------------- */
function menuAtivo() {
  const secoes = $$('main section[id]');
  const links = {};
  $$('.nav a[href^="#"]').forEach(a => { links[a.getAttribute('href').slice(1)] = a; });
  if (!secoes.length) return;
  let pendente = false;
  const marcar = () => {
    const linha = window.scrollY + window.innerHeight * .35;
    let atual = null;
    secoes.forEach(s => { if (s.offsetTop <= linha) atual = s.id; });
    Object.keys(links).forEach(k => links[k].setAttribute('aria-current', String(k === atual)));
  };
  addEventListener('scroll', () => {
    if (pendente) return;
    pendente = true;
    requestAnimationFrame(() => { pendente = false; marcar(); });
  }, { passive: true });
  marcar();
}

/* ---------- 06. SLOTS DE FOTO OPCIONAIS ---------------------------------
   O slot aponta para a foto definitiva. Se o arquivo não estiver no servidor,
   cai para o que houver em data-alternativa; sem alternativa, a figura sai do
   DOM — em nenhum caso sobra ícone de imagem quebrada.

   A versão anterior descobria isso com `new Image()` apontando para o atributo
   src, que é sempre o .jpg. Como o navegador já tinha escolhido o .webp do
   <picture>, cada slot baixava as DUAS versões: 666 KB de JPEG jogados fora em
   toda visita, e justamente os arquivos mais pesados da página. Ouvir o evento
   `error` do próprio <img> responde a mesma pergunta sem pedir nada de novo —
   e responde sobre o arquivo que o navegador de fato escolheu. */
function slotsOpcionais() {
  $$('[data-opcional]').forEach(fig => {
    const img = $('img', fig);
    if (!img) return;
    const cair = () => {
      const alternativa = fig.getAttribute('data-alternativa');
      if (alternativa && img.getAttribute('src') !== alternativa) {
        /* <source> do <picture> vence o src do <img>: some com ele antes de
           trocar, senão o navegador insiste no arquivo que não existe. */
        $$('source', fig).forEach(f => f.remove());
        img.setAttribute('src', alternativa);
        fig.setAttribute('data-provisoria', '');
      } else {
        fig.remove();
      }
    };
    img.addEventListener('error', cair, { once: true });
    /* Imagem que já falhou antes do script rodar não dispara mais o evento. */
    if (img.complete && !img.naturalWidth) cair();
  });
}

  comecarNoTopo();
  menu();
  ancoras();
  menuAtivo();
  slotsOpcionais();
};
