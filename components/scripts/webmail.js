/* ============================================================================
   ACELERO COMEX — webmail.js

   Página de acesso ao e-mail corporativo (cPanel / Roundcube).

   POR QUE ESTA PÁGINA NÃO PEDE A SENHA
   ------------------------------------
   A versão anterior tinha campo de senha e enviava o formulário para o
   provedor. Com cPanel isso não funciona e não deveria funcionar:

   1. O cPanel protege o próprio login contra envio vindo de outra origem
      (token de segurança / CSRF). Um POST partindo daqui é recusado — a
      pessoa veria uma tela de erro do servidor, não a caixa de entrada.

   2. Mesmo onde funcionasse, seria treinar a equipe a digitar a senha do
      e-mail numa página que NÃO é a do provedor. É exatamente o hábito que
      o phishing explora: quem se acostuma a isso digita a senha em qualquer
      página parecida. O lugar da senha é a página do provedor, com o cadeado
      e o domínio certos na barra do navegador.

   Então esta página faz o que uma porta de entrada deve fazer: leva ao
   provedor. O endereço é lembrado no navegador de quem marca a opção — é
   comodidade que não custa segurança nenhuma.

   DESTINO
   -------
   https://acelerocomex.com.br/webmail — atalho que o cPanel serve e que
   redireciona para o Roundcube na porta 2096. Se um dia a hospedagem mudar,
   as alternativas equivalentes são https://acelerocomex.com.br:2096/ e
   https://webmail.acelerocomex.com.br/.

   QUEM PODE ENTRAR
   ----------------
   Só endereços @acelerocomex.com.br: a conferência está em problema(), e um
   e-mail de outro domínio é recusado antes de sair daqui.
   ========================================================================== */

(function () {
  'use strict';

  const DESTINO_WEBMAIL = 'https://acelerocomex.com.br/webmail';

  const DOMINIO = 'acelerocomex.com.br';
  const CHAVE = 'acelero.webmail.usuario';

  const $ = s => document.querySelector(s);

  const form = $('#entrar');
  const usuario = $('#usuario');
  const lembrar = $('#lembrar');
  const aviso = $('#aviso');

  function mostrar(tipo, texto) {
    if (!aviso) return;
    aviso.className = 'form__fb ' + tipo;
    aviso.textContent = texto;
  }

  function erroDoCampo(campo, texto) {
    const caixa = campo.closest('.fd');
    const slot = caixa && caixa.querySelector('[data-error]');
    if (caixa) caixa.classList.toggle('err', !!texto);
    if (slot) slot.textContent = texto || '';
  }

  /* ---------- endereço lembrado ------------------------------------------
     Só o endereço, nunca senha. Fica no navegador de quem marcou e não sai
     dali — nem para o servidor, nem para lugar nenhum. */
  try {
    const guardado = localStorage.getItem(CHAVE);
    if (guardado && usuario) { usuario.value = guardado; if (lembrar) lembrar.checked = true; }
  } catch (e) { /* navegador sem armazenamento: segue sem lembrar */ }

  /* ---------- validação --------------------------------------------------
     Um aviso já mostrado tem de sumir quando a pessoa conserta o campo,
     senão a mensagem vermelha fica contradizendo o que está escrito ali. */
  function problema() {
    const v = usuario.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Informe o seu endereço de e-mail completo.';
    if (v.split('@').pop().toLowerCase() !== DOMINIO)
      return 'Este acesso é para endereços @' + DOMINIO + '.';
    return '';
  }

  const avisado = () => {
    const c = usuario.closest('.fd');
    return !!(c && c.classList.contains('err'));
  };
  ['input', 'blur'].forEach(ev =>
    usuario.addEventListener(ev, () => { if (avisado()) erroDoCampo(usuario, problema()); }));

  /* ---------- ida para o provedor ---------------------------------------- */
  form && form.addEventListener('submit', e => {
    e.preventDefault();   // esta página nunca envia nada: ela encaminha

    const p = problema();
    erroDoCampo(usuario, p);
    if (p) {
      mostrar('bad', 'Confira o endereço informado.');
      usuario.focus();
      return;
    }

    try {
      if (lembrar && lembrar.checked) localStorage.setItem(CHAVE, usuario.value.trim());
      else localStorage.removeItem(CHAVE);
    } catch (err) { /* sem armazenamento: apenas não lembra */ }

    if (!DESTINO_WEBMAIL) {
      mostrar('bad', 'Endereço do webmail ainda não configurado. Avise o responsável técnico — falta preencher DESTINO_WEBMAIL em components/scripts/webmail.js.');
      return;
    }

    mostrar('ok', 'Abrindo o webmail. A senha é pedida na página do provedor.');
    location.href = DESTINO_WEBMAIL;
  });

  /* ---------- recuperação de senha ---------------------------------------- */
  const esqueci = $('#esqueci');
  esqueci && esqueci.addEventListener('click', e => {
    e.preventDefault();
    mostrar('bad', 'A redefinição de senha é feita pelo provedor de e-mail. Fale com o responsável técnico ou use o canal de suporte.');
  });
})();
