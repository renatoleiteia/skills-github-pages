/* ============================================================================
   ACELERO COMEX — main.js  ·  v2

   A v1 tinha 16 módulos: preloader, cursor de bolinha, globo em canvas, trilho
   de capítulo, ticker, parallax, carrossel e um motor que sequestrava a roda do
   mouse. Era isso que fazia o site parecer template e atrapalhar a leitura.

   A v2 tem cinco: menu, idiomas, entrada dos blocos, âncoras e o formulário.
   Nada anima por espetáculo — só o que ajuda a ler ou a preencher.

   Sem framework, sem build, sem CDN: abre por duplo clique e roda offline.
   ========================================================================== */

(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.prototype.slice.call(c.querySelectorAll(s));
  const parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let idiomaAtual = 'pt';
  const msg = (chave, padrao) => {
    const x = (window.ACELERO_IDIOMAS_EXTRA || {})[idiomaAtual];
    return (x && x.msg && x.msg[chave]) || padrao;
  };

  /* ---------- 01. SEMPRE COMEÇAR NO TOPO ---------------------------------
     O navegador restaura a rolagem ao recarregar e a página reabria no meio.
     Zerar uma vez não basta: o salto para a âncora acontece depois, já com o
     layout montado. Seguramos o topo por meio segundo e largamos ao primeiro
     gesto de quem está lendo. */
  function comecarNoTopo() {
    const manual = () => { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; };
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

  /* ---------- 03. ENTRADA DOS BLOCOS -------------------------------------
     Um fade de 420 ms na primeira vez que o bloco aparece. O observador não
     tem noção de direção, então subir a página vale tanto quanto descer —
     era exatamente isso que faltava na v1. */
  function entrada() {
    const alvos = $$('[data-ap]');
    if (parado || !('IntersectionObserver' in window)) {
      alvos.forEach(e => e.classList.add('vis'));
      return;
    }
    const io = new IntersectionObserver(itens => {
      itens.forEach(i => {
        if (!i.isIntersecting) return;
        i.target.classList.add('vis');
        io.unobserve(i.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
    alvos.forEach(e => io.observe(e));
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

  /* ---------- 06. SLOTS DE FOTO OPCIONAIS --------------------------------- */
  function slotsOpcionais() {
    $$('[data-opcional]').forEach(fig => {
      const img = $('img', fig);
      if (!img) return;
      const sonda = new Image();
      sonda.onerror = () => fig.remove();
      sonda.src = img.getAttribute('src');
    });
  }

  /* ---------- 07. FORMULÁRIO --------------------------------------------
     Vem da v1 sem alteração: país e código de discagem, e-mail corporativo,
     confirmação do WhatsApp por mensagem real e entrega em contato@.
     ------------------------------------------------------------------- */
  function form() {
    const f = $('#contactForm');
    if (!f) return;
    const fb = $('#formFeedback');
    const tel = $('#telefone'), selPais = $('#pais');
    const conf = $('#waConf'), waOk = $('#waOk'), waNumero = $('#waNumero');
    const waEnviar = $('#waEnviar'), waCodigo = $('#waCodigo');
    const WHATS_ACELERO = '5527992744587';

    /* ---------- para onde vai o formulário --------------------------------
       O site é estático: não existe servidor nosso para receber o POST. Para
       o e-mail chegar em contato@acelerocomex.com.br o lead passa por um
       serviço de entrega.

       Hoje: FormSubmit (formsubmit.co), que não pede conta nem chave. Na
       PRIMEIRA vez que alguém enviar, ele manda um e-mail de ativação para a
       caixa abaixo — é preciso clicar no link uma única vez, e só a partir
       daí os envios seguintes chegam.

       Para trocar de serviço (n8n, Make, Zapier, rota própria), basta mudar
       ENVIO_URL: o corpo vai como JSON simples, com as chaves em português.

       E se o envio falhar, o lead não se perde: a mensagem de erro passa a
       oferecer o mesmo conteúdo por e-mail direto.
       ------------------------------------------------------------------- */
    const EMAIL_DESTINO = 'contato@acelerocomex.com.br';
    const ENVIO_URL = 'https://formsubmit.co/ajax/' + EMAIL_DESTINO;

    /* Código curto que viaja na mensagem e no lead: é o que permite à ACELERO
       casar a mensagem recebida com este formulário. Sem servidor a página não
       consegue ler a resposta — quem confere é a pessoa do outro lado. */
    const codigo = 'AC-' + Math.random().toString(36).slice(2, 6).toUpperCase();
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
    function mascarar(v, pa, cortar) {
      const max = pa.dig[1];
      let d = digitos(v);
      if (cortar !== false) d = d.slice(0, max);
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
      if (d.length < pa.dig[0]) return msg('telDig', 'Número incompleto para o país escolhido.');
      if (d.length > pa.dig[1]) return msg('telLongo', 'Número com dígitos demais para o país escolhido.');
      // Dígito repetido e sequência valem para o número inteiro e também para
      // os últimos 8 dígitos: "31 99999-9999" tem DDD válido e mesmo assim
      // não é telefone de ninguém. Sequência só no número inteiro — no
      // trecho final ela recusaria assinantes reais.
      const fim = d.slice(-8);
      if (/^(\d)\1+$/.test(d) || (fim.length === 8 && /^(\d)\1+$/.test(fim)))
        return msg('telFalso', 'Este número não parece real. Confira e digite de novo.');
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

    /* A marcação só abre depois que a mensagem sai: marcar antes seria a
       mesma declaração vazia de antes. Trocar o número zera os dois passos. */
    let enviado = false;

    function zerarConfirmacao() {
      enviado = false;
      if (!waOk) return;
      waOk.checked = false;
      waOk.disabled = true;
      const lb = waOk.closest('.chk');
      if (lb) lb.classList.add('chk--travada');
    }

    function liberarConfirmacao() {
      enviado = true;
      if (!waOk) return;
      waOk.disabled = false;
      const lb = waOk.closest('.chk');
      if (lb) lb.classList.remove('chk--travada');
    }

    waEnviar && waEnviar.addEventListener('click', () => {
      // O clique abre o WhatsApp com a mensagem pronta; enviar é com a pessoa.
      // A página não tem como saber se ela apertou enviar — daí a marcação.
      liberarConfirmacao();
      const we = $('#waErro');
      if (we) we.textContent = '';
    });

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
        zerarConfirmacao();               // número novo, confirmação zerada
      }
      if (waEnviar) {
        // A mensagem sai do WhatsApp da própria pessoa para o número da
        // ACELERO. É isso que prova a posse do número: quem recebe vê o
        // remetente. O código casa a mensagem com este formulário.
        const txt = 'Confirmacao ACELERO COMEX — codigo ' + codigo +
                    '. Este e o meu WhatsApp: ' + num + '.';
        waEnviar.href = 'https://wa.me/' + WHATS_ACELERO + '?text=' + encodeURIComponent(txt);
      }
      if (waCodigo) waCodigo.textContent = codigo;
      conf.hidden = false;
    }

    zerarConfirmacao();

    if (selPais) {
      preencherPaises();
      selPais.addEventListener('change', () => {
        // Sem cortar: um número de 11 dígitos trocado para um país de 9 não
        // pode virar outro número silenciosamente — e muito menos ser dado
        // como confirmado. Fica inteiro, e o aviso diz que não serve ali.
        tel.value = mascarar(tel.value, pais(), false);
        tel.placeholder = modelo(pais());
        setErr(tel, problemaNoNumero());
        atualizarConfirmacao();
      });
      document.addEventListener('acelero:idioma', () => {
        preencherPaises();
        tel.placeholder = modelo(pais());
      });
      tel.placeholder = modelo(pais());
    }

    /* ---- máscara que não briga com quem apaga ---------------------------
       Reescrever o campo joga o cursor para o fim, então digitar ou apagar no
       meio do número era impossível. Guardamos quantos dígitos existiam antes
       do cursor e devolvemos o cursor à mesma posição lógica depois de
       reformatar.

       E apagar em cima de um separador — o ")" ou o "-" — tem de apagar o
       dígito ao lado: senão a máscara devolve o traço na hora e a tecla não
       faz nada, que é exatamente o que travava a limpeza do campo. */
    let apagando = null, valorAntes = '', cursorAntes = 0;

    function posDoDigito(txt, n) {
      if (n <= 0) return 0;
      let vistos = 0;
      for (let i = 0; i < txt.length; i++) {
        if (txt.charCodeAt(i) >= 48 && txt.charCodeAt(i) <= 57 && ++vistos === n) return i + 1;
      }
      return txt.length;
    }

    if (tel) {
      tel.addEventListener('keydown', e => {
        apagando = e.key === 'Backspace' ? 'tras' : e.key === 'Delete' ? 'frente' : null;
        valorAntes = tel.value;
        cursorAntes = tel.selectionStart;
      });

      tel.addEventListener('input', () => {
        const pa = pais();
        const cursor = tel.selectionStart;
        let d = digitos(tel.value);
        let nd = digitos(tel.value.slice(0, cursor)).length;

        // Saiu só um separador: quem tem de sair é o dígito vizinho.
        if (apagando && valorAntes !== tel.value && d === digitos(valorAntes)) {
          const i = digitos(valorAntes.slice(0, cursorAntes)).length;
          const alvo = apagando === 'tras' ? i - 1 : i;
          if (alvo >= 0 && alvo < d.length) { d = d.slice(0, alvo) + d.slice(alvo + 1); nd = alvo; }
        }
        apagando = null;

        tel.value = mascarar(d, pa);
        const pos = posDoDigito(tel.value, Math.min(nd, digitos(tel.value).length));
        try { tel.setSelectionRange(pos, pos); } catch (e) { /* campo sem seleção: segue */ }
        atualizarConfirmacao();
      });
    }

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
      if (!pt && !enviado) {
        if (we) we.textContent = msg('waEnvio', 'Envie a mensagem de confirmação pelo WhatsApp — é assim que sabemos que o número é seu.');
        ok = false;
      } else if (!pt && waOk && !waOk.checked) {
        if (we) we.textContent = msg('waConf', 'Marque a confirmação do WhatsApp para enviarmos.');
        ok = false;
      } else if (we) we.textContent = '';

      const cs = $('#consent'), ce = $('#consentError');
      if (!cs.checked) { ce.textContent = msg('consent', 'É preciso autorizar o contato para enviar.'); ok = false; }
      else ce.textContent = '';
      return ok;
    };

    /* ---- o aviso some quando a pessoa conserta ---------------------------
       Um erro já mostrado tem de sumir assim que o campo fica certo. Sem isto
       a mensagem vermelha permanece contradizendo o que está escrito ali —
       foi o que aconteceu com o WhatsApp: o número já era válido, o bloco de
       confirmação já tinha aparecido, e o aviso antigo continuava na tela.

       Só reavaliamos campo que já recebeu aviso. Quem ainda está digitando
       pela primeira vez não é interrompido a cada tecla. */
    function mostrando(el) {
      const w = el.closest('.fd');
      return !!(w && w.classList.contains('err'));
    }

    function vigiar(el, problema) {
      if (!el) return;
      const evento = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(evento, () => { if (mostrando(el)) setErr(el, problema()); });
      el.addEventListener('blur', () => { if (mostrando(el)) setErr(el, problema()); });
    }

    const vazio = (el, m) => () => el.value.trim() ? '' : m();
    vigiar($('#nome'),      vazio($('#nome'),      () => msg('nome', 'Informe o seu nome.')));
    vigiar($('#empresa'),   vazio($('#empresa'),   () => msg('empresa', 'Informe o nome da empresa.')));
    vigiar($('#interesse'), vazio($('#interesse'), () => msg('interesse', 'Selecione o que você precisa.')));
    vigiar($('#email'), problemaNoEmail);
    vigiar(tel, problemaNoNumero);

    const cs = $('#consent');
    cs && cs.addEventListener('change', () => {
      const ce = $('#consentError');
      if (ce && cs.checked) ce.textContent = '';
    });

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
                         (!enviado ? waEnviar : (waOk && !waOk.checked ? waOk : null));
        if (primeiro) primeiro.focus();
        return;
      }

      // Isca preenchida: só robô chega aqui. Nada é enviado, e ele vê sucesso
      // para não voltar tentando outro caminho.
      const isca = f.querySelector('[name="_honey"]');
      if (isca && isca.value) {
        f.reset();
        fb.textContent = msg('ok', 'Recebido. Um especialista entra em contato em até 1 dia útil.');
        fb.classList.add('ok');
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
      data.codigo_confirmacao = codigo;

      // Chaves em português: é isto que a pessoa da ACELERO lê no e-mail.
      const corpo = {
        _subject: 'Site — análise de operação: ' + (data.empresa || 'sem empresa'),
        _template: 'table',
        _captcha: 'false',
        'Nome': data.nome,
        'Empresa': data.empresa,
        'E-mail': data.email,
        'WhatsApp': data.telefone_e164,
        'WhatsApp confirmado': data.whatsapp_confirmado === 'sim' ? 'sim' : 'não',
        'Código da confirmação': data.codigo_confirmacao,
        'Precisa de': data.interesse,
        'Volume estimado': data.volume || '—',
        'Mensagem': data.mensagem || '—',
        'Idioma da página': idiomaAtual.toUpperCase(),
        'Enviado em': new Date().toLocaleString('pt-BR')
      };

      try {
        /* CONFIRMAÇÃO POR CÓDIGO (OTP): o passo do WhatsApp acima é
           declaratório — a pessoa afirma ter enviado a mensagem. Confirmar
           automaticamente exige enviar um código e ler a resposta, o que só
           um servidor faz (API do WhatsApp Business, Twilio Verify ou
           equivalente). Quando esse serviço existir, o lugar de chamá-lo é
           aqui, antes do POST. */
        const r = await fetch(ENVIO_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(corpo)
        });
        if (!r.ok) throw new Error('envio recusado: ' + r.status);

        f.reset();
        if (selPais) { selPais.value = 'BR'; tel.placeholder = modelo(pais()); }
        if (conf) conf.hidden = true;
        if (waNumero) waNumero.textContent = '+55';
        zerarConfirmacao();
        fb.textContent = msg('ok', 'Recebido. Um especialista entra em contato em até 1 dia útil.');
        fb.classList.add('ok');
      } catch (err) {
        // O lead não se perde: o mesmo conteúdo vira um e-mail pronto para a
        // pessoa disparar do próprio programa de e-mail.
        const linhas = Object.keys(corpo)
          .filter(k => k.charAt(0) !== '_')
          .map(k => k + ': ' + (corpo[k] == null ? '' : corpo[k]))
          .join('\n');
        fb.textContent = msg('erro', 'Não conseguimos enviar agora.') + ' ';
        const a = document.createElement('a');
        a.href = 'mailto:' + EMAIL_DESTINO +
                 '?subject=' + encodeURIComponent(corpo._subject) +
                 '&body=' + encodeURIComponent(linhas.slice(0, 1400));
        a.textContent = msg('erroLink', 'Enviar por e-mail');
        fb.appendChild(a);
        fb.classList.add('bad');
      } finally {
        btn.disabled = false; span.textContent = label;
      }
    });
  }

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

      idiomaAtual = idioma;
      document.documentElement.lang = idioma === 'pt' ? 'pt-BR' : idioma;
      if (rotulo) rotulo.textContent = idioma.toUpperCase();
      $$('button[data-idioma]', lista).forEach(b =>
        b.setAttribute('aria-selected', String(b.dataset.idioma === idioma)));
      try { localStorage.setItem('acelero.idioma', idioma); } catch (e) { /* sem armazenamento: segue */ }
      document.dispatchEvent(new CustomEvent('acelero:idioma'));
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

  /* ---------- 09. INÍCIO -------------------------------------------------- */
  function init() {
    comecarNoTopo();
    menu();
    entrada();
    ancoras();
    menuAtivo();
    slotsOpcionais();
    form();
    idiomas();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
