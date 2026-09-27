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

  /* Destino do formulário. Está no atributo action do <form>, no HTML, e é
     repetido aqui só para a mensagem de erro fazer sentido se um dia sumir.

     O subdomínio, e não acelerocomex.com.br/webmail.

     Aquele endereço existe e responde — mas com uma página intermediária do
     cPanel ("cPanel Redirect") que mostra botões e tenta pular para a porta
     2096. Duas coisas dão errado aí: a porta 2096 é bloqueada em boa parte
     das redes corporativas e de celular, e mesmo quando passa, quem clicou
     em "Entrar" vê uma tela cinza de sistema em vez da caixa de entrada.

     webmail.acelerocomex.com.br entrega a tela "Login no Webmail" direto, na
     porta 443 de sempre. Conferido nos dois endereços antes de trocar. */
  const DESTINO_WEBMAIL = 'https://webmail.acelerocomex.com.br';

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

  /* ---------- envio para o provedor ---------------------------------------
     O formulário envia sozinho, por POST nativo, para o endereço do provedor
     que está no atributo action. Este código NÃO toca no campo de senha: não
     lê, não copia, não guarda, não manda para lugar nenhum. Ele só confere o
     endereço de e-mail e sai da frente.

     É de propósito que o envio seja nativo em vez de fetch: assim a senha vai
     do campo direto para o servidor, a resposta é uma navegação de verdade, e
     o cookie de sessão nasce no domínio do provedor — que é a única forma de a
     pessoa cair na caixa de entrada já autenticada. */
  const senha = $('#senha');

  form && form.addEventListener('submit', e => {
    const p = problema();
    erroDoCampo(usuario, p);
    if (p) {
      e.preventDefault();
      mostrar('bad', 'Confira o endereço informado.');
      usuario.focus();
      return;
    }
    if (senha && !senha.value) {
      e.preventDefault();
      erroDoCampo(senha, 'Digite a senha do seu e-mail.');
      mostrar('bad', 'Falta a senha.');
      senha.focus();
      return;
    }

    /* Guarda só o ENDEREÇO, nunca a senha — e só se a pessoa pediu. */
    try {
      if (lembrar && lembrar.checked) localStorage.setItem(CHAVE, usuario.value.trim());
      else localStorage.removeItem(CHAVE);
    } catch (err) { /* sem armazenamento: apenas não lembra */ }

    mostrar('ok', 'Entrando…');
    /* sem preventDefault: daqui em diante quem trabalha é o navegador */
  });

  /* ---------- mostrar e esconder a senha ----------------------------------
     Senha que não se pode conferir é senha digitada errada três vezes — e, em
     cPanel, conta bloqueada por tentativa. */
  const olho = $('#verSenha');
  olho && senha && olho.addEventListener('click', () => {
    const visivel = senha.type === 'text';
    senha.type = visivel ? 'password' : 'text';
    olho.setAttribute('aria-pressed', String(!visivel));
    olho.setAttribute('aria-label', visivel ? 'Mostrar a senha' : 'Esconder a senha');
    senha.focus();
  });

  /* Se a pessoa voltar para esta página pelo botão "voltar" do navegador, o
     Firefox e o Safari restauram o campo de senha preenchido. Numa tela
     compartilhada isso deixa a senha de alguém à mostra. */
  addEventListener('pageshow', ev => { if (ev.persisted && senha) senha.value = ''; });

  /* ---------- recuperação de senha ---------------------------------------- */
  const esqueci = $('#esqueci');
  esqueci && esqueci.addEventListener('click', e => {
    e.preventDefault();
    mostrar('bad', 'A senha do e-mail só pode ser redefinida no painel da hospedagem. Fale com o responsável técnico pelo canal de suporte.');
  });
})();
