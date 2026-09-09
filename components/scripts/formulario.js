/* ============================================================================
   FORMULÁRIO — qualificação do contato
   ============================================================================
   Seletor de país com código de discagem, máscara com cursor preservado,
   recusa de e-mail pessoal, confirmação do WhatsApp por mensagem real e envio
   com retorno por e-mail direto se o serviço falhar.
   ========================================================================== */
window.ACELERO = window.ACELERO || {};

window.ACELERO.formulario = function formulario($, $$, msg, idioma) {
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
     A hospedagem é HostGator, com PHP. O lead vai para enviar.php, no mesmo
     domínio, e de lá sai como e-mail pelo próprio servidor: nenhum serviço
     de terceiro no meio, nada para ativar, e o dado de quem preenche não
     passa por fora da empresa.

     Trocar a caixa de destino é mexer em enviar.php, não aqui.

     Se o envio falhar — servidor fora do ar, PHP desligado, ou a página
     aberta por duplo clique, onde servidor não existe —, o lead não se
     perde: a mensagem de erro passa a oferecer o mesmo conteúdo como e-mail
     pronto para disparar.
     ------------------------------------------------------------------- */
  const EMAIL_DESTINO = 'contato@acelerocomex.com.br';
  const ENVIO_URL = 'enviar.php';

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
    ordenar(idioma()).forEach(pa => {
      const o = document.createElement('option');
      const nome = pa[idioma()] || pa.pt;
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
      // _assunto serve ao plano B por e-mail direto; o enviar.php compõe o
      // assunto dele por conta própria e ignora tudo que começa com "_".
      _assunto: 'Site — análise de operação: ' + (data.empresa || 'sem empresa'),
      'Nome': data.nome,
      'Empresa': data.empresa,
      'E-mail': data.email,
      'WhatsApp': data.telefone_e164,
      'WhatsApp confirmado': data.whatsapp_confirmado === 'sim' ? 'sim' : 'não',
      'Código da confirmação': data.codigo_confirmacao,
      'Precisa de': data.interesse,
      'Volume estimado': data.volume || '—',
      'Mensagem': data.mensagem || '—',
      'Idioma da página': idioma().toUpperCase(),
      'Enviado em': new Date().toLocaleString('pt-BR'),
      // A isca viaja junto: o servidor confere de novo, porque o navegador
      // pode ser contornado e o PHP não.
      '_honey': data._honey || ''
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
      // O PHP responde {ok:false, erro:'...'} quando recusa na validação
      // dele — que é a que vale, porque o navegador pode ser contornado.
      const resposta = await r.json().catch(() => ({ ok: true }));
      if (resposta.ok === false) throw new Error('servidor recusou: ' + (resposta.erro || '?'));

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
               '?subject=' + encodeURIComponent(corpo._assunto) +
               '&body=' + encodeURIComponent(linhas.slice(0, 1400));
      a.textContent = msg('erroLink', 'Enviar por e-mail');
      fb.appendChild(a);
      fb.classList.add('bad');
    } finally {
      btn.disabled = false; span.textContent = label;
    }
  });
}

  form();
};
