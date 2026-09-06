/* ============================================================================
   ACELERO COMEX — webmail.js

   Entrada do e-mail corporativo.

   COMO LIGAR NO PROVEDOR
   ----------------------
   Preencha DESTINO_WEBMAIL abaixo com o endereço de login do provedor de
   e-mail da empresa. Exemplos conforme o serviço contratado:

     cPanel / Roundcube   'https://mail.acelerocomex.com.br:2096/login/'
     Zimbra               'https://mail.acelerocomex.com.br/service/preauth'
     Google Workspace     'https://accounts.google.com/AccountChooser?hd=acelerocomex.com.br'
     Microsoft 365        'https://outlook.office.com/mail/'

   Enquanto estiver vazio, a página avisa que falta configurar em vez de
   fingir que autenticou.

   POR QUE O FORMULÁRIO É NATIVO
   -----------------------------
   Quando o destino está definido, apenas apontamos o action e deixamos o
   navegador enviar. A senha vai direto do campo para o provedor: ela não é
   lida, guardada, registrada em log nem trafega por nenhuma linha deste
   arquivo. Uma página estática não tem como autenticar ninguém — quem
   autentica é o provedor, e é lá que a senha deve chegar.
   ========================================================================== */

(function () {
  'use strict';

  const DESTINO_WEBMAIL = '';   // <- preencha aqui

  const $ = s => document.querySelector(s);

  /* ---------- mostrar / esconder a senha ---------- */
  const senha = $('#senha');
  const olho = $('#verSenha');
  if (olho && senha) {
    olho.addEventListener('click', () => {
      const revelada = senha.type === 'text';
      senha.type = revelada ? 'password' : 'text';
      olho.setAttribute('aria-pressed', String(!revelada));
      olho.setAttribute('aria-label', revelada ? 'Mostrar senha' : 'Esconder senha');
      senha.focus();
    });
  }

  /* ---------- aviso de conexão insegura ---------- */
  const aviso = $('#aviso');
  const local = ['localhost', '127.0.0.1', ''].indexOf(location.hostname) !== -1;
  if (location.protocol === 'http:' && !local) {
    mostrar('bad', 'Esta página não está numa conexão segura. Não informe a sua senha até que o endereço comece com https.');
  }

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

  /* ---------- o aviso some quando o campo fica certo ---------------------
     Um erro já mostrado tem de sumir assim que a pessoa conserta, senão a
     mensagem vermelha fica na tela contradizendo o que está escrito ali.
     Só reavaliamos campo que já recebeu aviso: quem ainda está digitando pela
     primeira vez não é interrompido a cada tecla. */
  function vigiar(campo, problema) {
    if (!campo) return;
    const avisado = () => {
      const c = campo.closest('.fd');
      return !!(c && c.classList.contains('err'));
    };
    ['input', 'blur'].forEach(ev =>
      campo.addEventListener(ev, () => { if (avisado()) erroDoCampo(campo, problema()); }));
  }

  /* ---------- envio ---------- */
  const form = $('#entrar');
  const usuario = $('#usuario');

  const problemaEmail = () =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(usuario.value.trim()) ? '' : 'Informe o seu endereço de e-mail completo.';
  const problemaSenha = () => senha.value.length ? '' : 'Informe a sua senha.';

  vigiar(usuario, problemaEmail);
  vigiar(senha, problemaSenha);

  form && form.addEventListener('submit', e => {
    let ok = true;

    const pe = problemaEmail();
    erroDoCampo(usuario, pe);
    if (pe) ok = false;

    // Só o comprimento: o conteúdo do campo não é lido em lugar nenhum.
    const ps = problemaSenha();
    erroDoCampo(senha, ps);
    if (ps) ok = false;

    if (!ok) {
      e.preventDefault();
      mostrar('bad', 'Confira os campos destacados.');
      const primeiro = form.querySelector('.err input');
      if (primeiro) primeiro.focus();
      return;
    }

    if (!DESTINO_WEBMAIL) {
      e.preventDefault();
      mostrar('bad', 'Acesso ainda não conectado ao provedor de e-mail. Avise o responsável técnico — falta preencher o destino em components/scripts/webmail.js.');
      return;
    }

    // Destino configurado: o navegador envia nativamente e a senha vai do
    // campo direto para o provedor, sem passar por aqui.
    form.action = DESTINO_WEBMAIL;
    mostrar('ok', 'Entrando…');
  });

  /* ---------- recuperação de senha ---------- */
  const esqueci = $('#esqueci');
  esqueci && esqueci.addEventListener('click', e => {
    e.preventDefault();
    mostrar('bad', 'A redefinição de senha é feita pelo provedor de e-mail. Fale com o responsável técnico ou use o canal de suporte.');
  });

})();
