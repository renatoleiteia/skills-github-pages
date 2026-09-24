/* ============================================================================
   IDIOMAS — português, inglês e espanhol
   ============================================================================
   O português é o texto que está no HTML: bom para busca e para quem abre com
   JavaScript desligado. Ao carregar guardamos o original de cada elemento, e
   voltar para PT é restaurar — não existe dicionário português a manter.
   ========================================================================== */
window.ACELERO = window.ACELERO || {};

window.ACELERO.idiomas = function idiomas($, $$, aoTrocar) {
/* ---------- 08. IDIOMAS -------------------------------------------------
   O português é o texto que está no HTML; inglês e espanhol vêm de
   js/idiomas.js. Ao carregar guardamos o original de cada elemento, então
   voltar para PT é restaurar — não há dicionário português a manter. */
function idiomas() {
  const raiz = $('#idioma'), botao = $('#idiomaB'), lista = $('#idiomaL'), rotulo = $('#idiomaAtual');
  const dic = window.ACELERO_IDIOMAS || {};
  const extra = window.ACELERO_IDIOMAS_EXTRA || {};
  if (!raiz || !botao || !lista) return;

  // O rótulo do consentimento é alcançado pelo próprio checkbox: existe mais
  // de um .chk na página, e um seletor genérico pegaria o bloco errado.
  function rotuloConsentimento() {
    const cx = $('#consent');
    const lb = cx && cx.closest('.chk');
    return lb ? lb.querySelector('span') : null;
  }

  const original = new Map();
  $$('[data-i18n]').forEach(el => original.set(el, el.innerHTML));
  const originalExtra = {
    placeholders: {}, opcoes: {},
    consentimento: rotuloConsentimento() ? rotuloConsentimento().innerHTML : ''
  };
  ['nome', 'empresa', 'email', 'telefone', 'mensagem'].forEach(id => {
    const el = $('#' + id);
    if (el) originalExtra.placeholders[id] = el.placeholder;
  });
  ['interesse', 'volume'].forEach(id => {
    const el = $('#' + id);
    if (el) originalExtra.opcoes[id] = $$('option', el).map(o => o.textContent);
  });

  function aplicar(idioma) {
    const t = dic[idioma];
    $$('[data-i18n]').forEach(el => {
      const chave = el.getAttribute('data-i18n');
      const txt = t ? t[chave] : null;
      el.innerHTML = txt != null ? txt : original.get(el);
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

    // Quem guarda o idioma corrente é o orquestrador; ele também avisa
    // os módulos que dependem dele (o formulário refaz a lista de países).
    aoTrocar(idioma);
    document.documentElement.lang = idioma === 'pt' ? 'pt-BR' : idioma;
    if (rotulo) rotulo.textContent = idioma.toUpperCase();
    $$('button[data-idioma]', lista).forEach(b =>
      b.setAttribute('aria-selected', String(b.dataset.idioma === idioma)));
    try { localStorage.setItem('acelero.idioma', idioma); } catch (e) { /* sem armazenamento: segue */ }
  }

  const abrir = () => { lista.hidden = false; botao.setAttribute('aria-expanded', 'true'); };
  const fechar = () => { lista.hidden = true; botao.setAttribute('aria-expanded', 'false'); };
  botao.addEventListener('click', e => { e.stopPropagation(); lista.hidden ? abrir() : fechar(); });
  $$('button[data-idioma]', lista).forEach(b =>
    b.addEventListener('click', () => { aplicar(b.dataset.idioma); fechar(); }));
  document.addEventListener('click', e => { if (!raiz.contains(e.target)) fechar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fechar(); });

  let inicial = '';
  try { inicial = localStorage.getItem('acelero.idioma') || ''; } catch (e) { inicial = ''; }
  if (!inicial) {
    const nav = (navigator.language || 'pt').slice(0, 2).toLowerCase();
    inicial = (nav === 'en' || nav === 'es') ? nav : 'pt';
  }
  if (inicial !== 'pt') aplicar(inicial);
  else if (rotulo) rotulo.textContent = 'PT';
}

  idiomas();
};
