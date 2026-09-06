/* ATENÇÃO: arquivo montado. Não edite aqui — a fonte é
   components/scripts/, e a junção é feita por tools/montar.py. */

/* ============================================================================
   ACELERO COMEX — paises.js

   Códigos de discagem para o campo de WhatsApp. `dig` é a faixa de dígitos
   do número NACIONAL (sem o código do país), usada para recusar número curto
   ou longo demais antes mesmo de alguém tentar ligar.

   A lista privilegia as praças que a operação atende — América do Sul
   inteira, os parceiros de origem na Ásia, a Europa e a América do Norte.
   Acrescentar um país é acrescentar uma linha.
   ========================================================================== */

window.ACELERO_PAISES = [
  // América do Sul
  { iso: 'BR', ddi: '55',  dig: [10, 11], pt: 'Brasil',            en: 'Brazil',           es: 'Brasil' },
  { iso: 'AR', ddi: '54',  dig: [10, 11], pt: 'Argentina',         en: 'Argentina',        es: 'Argentina' },
  { iso: 'UY', ddi: '598', dig: [8, 9],   pt: 'Uruguai',           en: 'Uruguay',          es: 'Uruguay' },
  { iso: 'PY', ddi: '595', dig: [9, 9],   pt: 'Paraguai',          en: 'Paraguay',         es: 'Paraguay' },
  { iso: 'CL', ddi: '56',  dig: [9, 9],   pt: 'Chile',             en: 'Chile',            es: 'Chile' },
  { iso: 'BO', ddi: '591', dig: [8, 8],   pt: 'Bolívia',           en: 'Bolivia',          es: 'Bolivia' },
  { iso: 'PE', ddi: '51',  dig: [9, 9],   pt: 'Peru',              en: 'Peru',             es: 'Perú' },
  { iso: 'CO', ddi: '57',  dig: [10, 10], pt: 'Colômbia',          en: 'Colombia',         es: 'Colombia' },
  { iso: 'EC', ddi: '593', dig: [9, 9],   pt: 'Equador',           en: 'Ecuador',          es: 'Ecuador' },
  { iso: 'VE', ddi: '58',  dig: [10, 10], pt: 'Venezuela',         en: 'Venezuela',        es: 'Venezuela' },
  { iso: 'GY', ddi: '592', dig: [7, 7],   pt: 'Guiana',            en: 'Guyana',           es: 'Guyana' },
  { iso: 'SR', ddi: '597', dig: [6, 7],   pt: 'Suriname',          en: 'Suriname',         es: 'Surinam' },

  // América do Norte e Central
  { iso: 'US', ddi: '1',   dig: [10, 10], pt: 'Estados Unidos',    en: 'United States',    es: 'Estados Unidos' },
  { iso: 'CA', ddi: '1',   dig: [10, 10], pt: 'Canadá',            en: 'Canada',           es: 'Canadá' },
  { iso: 'MX', ddi: '52',  dig: [10, 10], pt: 'México',            en: 'Mexico',           es: 'México' },
  { iso: 'PA', ddi: '507', dig: [8, 8],   pt: 'Panamá',            en: 'Panama',           es: 'Panamá' },
  { iso: 'CR', ddi: '506', dig: [8, 8],   pt: 'Costa Rica',        en: 'Costa Rica',       es: 'Costa Rica' },
  { iso: 'DO', ddi: '1',   dig: [10, 10], pt: 'República Dominicana', en: 'Dominican Republic', es: 'República Dominicana' },

  // Europa
  { iso: 'PT', ddi: '351', dig: [9, 9],   pt: 'Portugal',          en: 'Portugal',         es: 'Portugal' },
  { iso: 'ES', ddi: '34',  dig: [9, 9],   pt: 'Espanha',           en: 'Spain',            es: 'España' },
  { iso: 'DE', ddi: '49',  dig: [10, 11], pt: 'Alemanha',          en: 'Germany',          es: 'Alemania' },
  { iso: 'FR', ddi: '33',  dig: [9, 9],   pt: 'França',            en: 'France',           es: 'Francia' },
  { iso: 'IT', ddi: '39',  dig: [9, 10],  pt: 'Itália',            en: 'Italy',            es: 'Italia' },
  { iso: 'NL', ddi: '31',  dig: [9, 9],   pt: 'Países Baixos',     en: 'Netherlands',      es: 'Países Bajos' },
  { iso: 'BE', ddi: '32',  dig: [9, 9],   pt: 'Bélgica',           en: 'Belgium',          es: 'Bélgica' },
  { iso: 'GB', ddi: '44',  dig: [10, 10], pt: 'Reino Unido',       en: 'United Kingdom',   es: 'Reino Unido' },
  { iso: 'IE', ddi: '353', dig: [9, 9],   pt: 'Irlanda',           en: 'Ireland',          es: 'Irlanda' },
  { iso: 'CH', ddi: '41',  dig: [9, 9],   pt: 'Suíça',             en: 'Switzerland',      es: 'Suiza' },
  { iso: 'AT', ddi: '43',  dig: [10, 11], pt: 'Áustria',           en: 'Austria',          es: 'Austria' },
  { iso: 'PL', ddi: '48',  dig: [9, 9],   pt: 'Polônia',           en: 'Poland',           es: 'Polonia' },
  { iso: 'SE', ddi: '46',  dig: [9, 9],   pt: 'Suécia',            en: 'Sweden',           es: 'Suecia' },
  { iso: 'NO', ddi: '47',  dig: [8, 8],   pt: 'Noruega',           en: 'Norway',           es: 'Noruega' },
  { iso: 'DK', ddi: '45',  dig: [8, 8],   pt: 'Dinamarca',         en: 'Denmark',          es: 'Dinamarca' },
  { iso: 'FI', ddi: '358', dig: [9, 10],  pt: 'Finlândia',         en: 'Finland',          es: 'Finlandia' },
  { iso: 'TR', ddi: '90',  dig: [10, 10], pt: 'Turquia',           en: 'Türkiye',          es: 'Turquía' },
  { iso: 'RU', ddi: '7',   dig: [10, 10], pt: 'Rússia',            en: 'Russia',           es: 'Rusia' },

  // Ásia e Oriente Médio
  { iso: 'CN', ddi: '86',  dig: [11, 11], pt: 'China',             en: 'China',            es: 'China' },
  { iso: 'HK', ddi: '852', dig: [8, 8],   pt: 'Hong Kong',         en: 'Hong Kong',        es: 'Hong Kong' },
  { iso: 'TW', ddi: '886', dig: [9, 9],   pt: 'Taiwan',            en: 'Taiwan',           es: 'Taiwán' },
  { iso: 'JP', ddi: '81',  dig: [10, 10], pt: 'Japão',             en: 'Japan',            es: 'Japón' },
  { iso: 'KR', ddi: '82',  dig: [9, 10],  pt: 'Coreia do Sul',     en: 'South Korea',      es: 'Corea del Sur' },
  { iso: 'IN', ddi: '91',  dig: [10, 10], pt: 'Índia',             en: 'India',            es: 'India' },
  { iso: 'VN', ddi: '84',  dig: [9, 10],  pt: 'Vietnã',            en: 'Vietnam',          es: 'Vietnam' },
  { iso: 'TH', ddi: '66',  dig: [9, 9],   pt: 'Tailândia',         en: 'Thailand',         es: 'Tailandia' },
  { iso: 'ID', ddi: '62',  dig: [9, 12],  pt: 'Indonésia',         en: 'Indonesia',        es: 'Indonesia' },
  { iso: 'MY', ddi: '60',  dig: [9, 10],  pt: 'Malásia',           en: 'Malaysia',         es: 'Malasia' },
  { iso: 'SG', ddi: '65',  dig: [8, 8],   pt: 'Singapura',         en: 'Singapore',        es: 'Singapur' },
  { iso: 'BD', ddi: '880', dig: [10, 10], pt: 'Bangladesh',        en: 'Bangladesh',       es: 'Bangladés' },
  { iso: 'PK', ddi: '92',  dig: [10, 10], pt: 'Paquistão',         en: 'Pakistan',         es: 'Pakistán' },
  { iso: 'AE', ddi: '971', dig: [9, 9],   pt: 'Emirados Árabes',   en: 'United Arab Emirates', es: 'Emiratos Árabes' },
  { iso: 'SA', ddi: '966', dig: [9, 9],   pt: 'Arábia Saudita',    en: 'Saudi Arabia',     es: 'Arabia Saudita' },
  { iso: 'IL', ddi: '972', dig: [9, 9],   pt: 'Israel',            en: 'Israel',           es: 'Israel' },

  // África
  { iso: 'AO', ddi: '244', dig: [9, 9],   pt: 'Angola',            en: 'Angola',           es: 'Angola' },
  { iso: 'ZA', ddi: '27',  dig: [9, 9],   pt: 'África do Sul',     en: 'South Africa',     es: 'Sudáfrica' },
  { iso: 'MZ', ddi: '258', dig: [9, 9],   pt: 'Moçambique',        en: 'Mozambique',       es: 'Mozambique' },
  { iso: 'MA', ddi: '212', dig: [9, 9],   pt: 'Marrocos',          en: 'Morocco',          es: 'Marruecos' },
  { iso: 'EG', ddi: '20',  dig: [10, 10], pt: 'Egito',             en: 'Egypt',            es: 'Egipto' },
  { iso: 'NG', ddi: '234', dig: [10, 10], pt: 'Nigéria',           en: 'Nigeria',          es: 'Nigeria' },

  // Oceania
  { iso: 'AU', ddi: '61',  dig: [9, 9],   pt: 'Austrália',         en: 'Australia',        es: 'Australia' },
  { iso: 'NZ', ddi: '64',  dig: [8, 10],  pt: 'Nova Zelândia',     en: 'New Zealand',      es: 'Nueva Zelanda' }
];

/* DDDs válidos no Brasil. Sem esta checagem, "(00) 00000-0000" passa como
   número legítimo — e foi exatamente o placeholder que o formulário sugeria. */
window.ACELERO_DDD_BR = [
  11,12,13,14,15,16,17,18,19, 21,22,24, 27,28,
  31,32,33,34,35,37,38, 41,42,43,44,45,46, 47,48,49,
  51,53,54,55, 61, 62,64, 63, 65,66, 67, 68, 69,
  71,73,74,75,77, 79, 81,87, 82, 83, 84, 85,88, 86,89,
  91,93,94, 92,97, 95, 96, 98,99
];

/* Provedores de e-mail pessoal. O formulário é para operação de comércio
   exterior: recusar estes é uma escolha do negócio, não uma regra técnica —
   e por isso a lista fica aqui, à mão, fácil de afrouxar. */
window.ACELERO_EMAIL_PESSOAL = [
  'gmail.com', 'googlemail.com', 'hotmail.com', 'hotmail.com.br', 'outlook.com',
  'outlook.com.br', 'live.com', 'msn.com', 'yahoo.com', 'yahoo.com.br',
  'ymail.com', 'bol.com.br', 'uol.com.br', 'terra.com.br', 'ig.com.br',
  'globo.com', 'globomail.com', 'r7.com', 'zipmail.com.br', 'oi.com.br',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com', 'proton.me',
  'gmx.com', 'mail.com', 'yandex.com', 'zoho.com', 'tutanota.com',
  'hotmail.es', 'yahoo.es', 'outlook.es', 'libero.it', 'orange.fr', 'web.de'
];

/* ============================================================================
   ACELERO COMEX — idiomas.js

   Dicionário de traduções. O português vive no próprio index.html (bom para
   SEO e para quem abre com JavaScript desligado); aqui ficam apenas inglês e
   espanhol, com as mesmas chaves `data-i18n`. Ao voltar para o português, o
   main.js restaura o texto original capturado na carga.

   Os valores carregam a mesma marcação inline do original (<em>, <strong>,
   <span class="mono">, <li>…) — quem traduz precisa preservá-la.
   ========================================================================== */

window.ACELERO_IDIOMAS = {

  en: {
    'hdnum.5': '05 — Operations',
    'cases.h.l1': 'What runs',
    'cases.h.l2': 'through <em>our operation.</em>',
    'lead.3': 'Instead of client figures you have no way of checking, the map of what we handle today: sectors, markets, modes and regimes. If your case is on this list, we have already run an operation like yours.',
    'op.h.1': 'Sectors we serve',
    'op.l.1': '<li>Auto parts and industrial components</li><li>Electronics and home appliances</li><li>Food and beverages</li><li>Machinery and equipment</li><li>Construction and finishing materials</li><li>Chemical inputs and plastics</li>',
    'op.h.2': 'Origins and destinations',
    'op.l.2': '<li>China, Vietnam, India and Turkey</li><li>European Union and United Kingdom</li><li>United States and Mexico</li><li>Mercosur: Argentina, Uruguay, Paraguay and Chile</li><li>Exports to Latin America, the United States and Europe</li>',
    'op.h.3': 'Modes and regimes',
    'op.l.3': '<li>Ocean FCL and LCL</li><li>Air and courier for urgent shipments and samples</li><li>Road within Mercosur</li><li>Direct import, import on behalf of a third party and import to order</li><li>Tariff exemptions, drawback and other special regimes</li>',
    'op.h.4': 'Where we clear customs',
    'op.l.4': '<li>Santos <span class="mono">SP</span></li><li>Itajaí and Navegantes <span class="mono">SC</span></li><li>Paranaguá <span class="mono">PR</span></li><li>Vitória and Vila Velha <span class="mono">ES</span></li><li>Viracopos and Guarulhos <span class="mono">SP · air</span></li><li>Bonded warehouses and dry ports</li>',
    'op.nota.1': 'We do not publish a client name or a third party\u2019s figures without written consent. In the review meeting we show a case equivalent to yours, with the calculation open.',
    /* navegação */
    'nav.sobre': '<span class="mono">01</span>About',
    'nav.servicos': '<span class="mono">02</span>Services',
    'nav.processo': '<span class="mono">03</span>Process',
    'nav.cases': '<span class="mono">05</span>Operations',
    'nav.contato': '<span class="mono">09</span>Contact',
    'nav.cta': 'Book a consultation',
    'menu.1': 'About Acelero', 'menu.2': 'Services', 'menu.3': 'Process',
    'menu.4': 'Results', 'menu.5': 'Operations', 'menu.6': 'Why we do it',
    'menu.7': 'Guarantees', 'menu.8': 'Frequently asked questions',
    'menu.9': 'Talk to the specialist',

    /* hero */
    'hero.tag.1': 'End-to-end foreign trade management',
    'hero.h.l1': 'Import and export',
    'hero.h.l2': 'with end-to-end',
    'hero.h.l3': '<em>management.</em>',
    'hero.sub.1': 'From negotiating with the supplier to delivering the cargo, get <strong>clarity on costs, timelines and next steps</strong> — with ACELERO COMEX running the operation.',
    'hero.cta1.1': 'Book a consultation',
    'hero.cta2.1': 'What we do',
    'hero.kpi.1': 'shipments managed',
    'hero.kpi.2': 'countries operated',
    'hero.kpi.3': 'cleared on the green channel',
    'hero.kpi.4': 'stay with us past 24 months',
    'hero.role.1': 'Scroll',

    /* seções — numeração */
    'hdnum.1': '01 — About', 'hdnum.2': '02 — Services', 'hdnum.3': '03 — Process',
    'hdnum.4': '04 — Results', 'hdnum.6': '06 — Why we do it',
    'hdnum.7': '07 — Guarantees', 'hdnum.8': '08 — Questions', 'hdnum.9': '09 — Contact',

    /* sobre */
    'sobre.h.l1': 'We are not another',
    'sobre.h.l2': 'middleman. We are your',
    'sobre.h.l3': '<em>foreign trade</em>',
    'sobre.h.l4': '<em>department.</em>',
    'sobre.txt.1': '<p> ACELERO COMEX was born of a simple frustration: Brazilian companies lose margin, time and sleep because international operations are treated as a jigsaw of disconnected suppliers — one quotes, another ships, another clears customs, and nobody answers for the outcome. </p> <p> We bring all of it under one team, one process and one accountable owner. You talk to one person; we coordinate the rest of the planet. </p>',
    'tri.lbl.1': 'Mission',
    'tri.h.1': 'Make the world reachable for those who produce and sell in Brazil.',
    'tri.p.1': 'Shorten the distance between your company and any supplier or customer on the planet, with full clarity on cost, lead time and risk.',
    'tri.lbl.2': 'Vision',
    'tri.h.2': 'To be the most predictable foreign trade operation in Latin America.',
    'tri.p.2': 'Not the largest. The most dependable — the one where the board can plan a whole quarter without fearing what is coming from the other side of the ocean.',
    'tri.lbl.3': 'Values',
    'tri.h.3': 'Radical transparency, data before opinion, ownership end to end.',
    'tri.p.3': 'If something goes wrong, you hear it from us — before it turns into a loss. No hidden fees, no “that one is not on us”.',

    /* serviços */
    'serv.h.l1': 'Four fronts.',
    'serv.h.l2': 'One <em>single</em> operation.',
    'lead.1': 'You can hire a single front or hand the whole operation to our team. In practice, whoever starts with one ends up moving everything across — because the gain lies precisely in nobody being able to pass the blame to the next link.',
    'card.n.1': 'S/01',
    'card.h.1': 'Import and Export',
    'card.p.1': 'From supplier vetting to customs clearance — and, in the other direction, from label compliance to the certificate of origin. A <em>landed cost</em> simulation before you approve the purchase, not after the invoice lands.',
    'card.b.1': '<span class="mono">Gain</span> You commit to a purchase knowing the final cost on your own shelf, with the margin calculated rather than guessed.',
    'card.cta.1': 'Simulate my operation',
    'card.n.2': 'S/02',
    'card.h.2': 'International Logistics',
    'card.p.2': 'Ocean, air, road and multimodal, on contracts negotiated at volume. We pick the mode against your sales calendar, not the agent’s convenience — and we track every leg to the destination dock.',
    'card.b.2': '<span class="mono">Gain</span> Competitive freight with guaranteed space in peak season, and an ETA you can safely promise your own customer.',
    'card.cta.2': 'Quote my freight',
    'card.n.3': 'S/03',
    'card.h.3': 'Customs Clearance',
    'card.p.3': 'Our own brokerage team, paperwork checked before arrival, and daily contact with the terminals. When a shipment is flagged for inspection, we already know the move — and you hear about it the same day.',
    'card.b.3': '<span class="mono">Gain</span> Fewer days of storage and demurrage, which is exactly where a shipment’s profit evaporates in silence.',
    'card.cta.3': 'Release a stuck shipment',
    'card.n.4': 'S/04',
    'card.h.4': 'Strategic Consulting',
    'card.p.4': 'A tax and logistics review of your current operation: tariff classification, special regimes, drawback, tariff exemptions, trade agreements and route design. This is the front that usually pays for itself before the third shipment.',
    'card.b.4': '<span class="mono">Gain</span> Recurring savings on every future operation, in a report your accountants can actually audit.',
    'card.cta.4': 'Request a review',

    /* processo */
    'proc.h.l1': 'Five stages.',
    'proc.h.l2': 'No <em>surprises.</em>',
    'lead.2': 'Every stage has a defined deliverable, deadline and owner. You always know where your operation stands and what happens next — and that clarity is what removes the fear of importing.',
    'step.t.1': 'Days 1 to 7',
    'step.h.1': 'Planning',
    'step.p.1': 'Product, tariff code, volume and seasonality reviewed; mode, incoterm, tax regime and schedule designed. If an import licence or registration is pending, we settle it now — before any commitment to the supplier.',
    'step.o.1': '<span class="mono">Deliverable</span> Operating plan with a target cost and a target lead time.',
    'step.t.2': 'Weeks 2 to 4',
    'step.h.2': 'Production',
    'step.p.2': 'Supplier approved through document audit and capacity checks, order placed on protected terms, and weekly follow-up on the line. You watch progress without ever entering someone else’s time zone.',
    'step.o.2': '<span class="mono">Deliverable</span> Supplier dossier plus a monitored production schedule.',
    'step.t.3': 'Before shipping',
    'step.h.3': 'Inspection',
    'step.p.3': 'We verify quantity, specification and packing at origin, with a photographic report. Shipping is released only after that — a discrepancy caught at the factory costs a fraction of the same discrepancy found once the container has landed.',
    'step.o.3': '<span class="mono">Deliverable</span> Inspection report with photographs and a conformity certificate.',
    'step.t.4': 'In transit',
    'step.h.4': 'Transport',
    'step.p.4': 'Booking, documentation, insurance and live tracking. You follow it on the dashboard and get a proactive alert on any route deviation, vessel delay or change of port window — before it becomes a calendar problem.',
    'step.o.4': '<span class="mono">Deliverable</span> Access to the control tower plus automated alerts.',
    'step.t.5': 'Arrival',
    'step.h.5': 'Delivery',
    'step.p.5': 'Advance filing, clearance, release and final haul to your dock. We close with the shipment’s real cost set against the budget — so the next operation is more accurate than this one.',
    'step.o.5': '<span class="mono">Deliverable</span> Cargo on your dock plus a financial closing report.',
    'proc.band.1': 'Want to see this process applied to <em>your</em> product and your tariff code?',
    'proc.bandcta.1': 'Book a free review',

    /* resultados */
    'res.h.l1': 'A result is not a',
    'res.h.l2': 'promise. It is an <em>audited</em>',
    'res.h.l3': '<em>number.</em>',
    'num.1': 'Shipments managed since 2016',
    'num.2': 'Average cut in logistics cost in the first year',
    'num.3': 'Cargo cleared on the green channel',
    'num.4': 'Days saved, on average, from order to dock',
    'num.5': 'Countries of origin and destination operated',
    'num.6': 'Of clients still with us after 24 months',
    'res.nota.1': 'Consolidated indicators from the active portfolio. At the review meeting we show the calculation behind them — a number without a source is worth nothing.',

    /* cases */ /* propósito */
    'purp.h.l1': 'Every company has the power to compete with the <em>entire world.</em>',
    'purp.h.l2': 'should be able to compete',
    'purp.h.l3': 'with the <em>whole world.</em>',
    'purp.man.1': '<ul class="man"><li>Foreign trade cannot be <em>slow</em>.</li><li>Foreign trade cannot be <em>manual</em>.</li><li>Foreign trade cannot be <em>unsafe</em>.</li><li>Foreign trade cannot be <em>a maze</em>.</li></ul><p class="man__f">Foreign trade needs to be <b>ACELERO</b>.</p>',
    'purp.txt.1': '<p> Foreign trade in Brazil was built to be hard. A language of its own, a bureaucracy that shifts without notice, and a chain of intermediaries in which almost nobody has an incentive to tell you the truth about cost and lead time. </p> <p> The result is that excellent companies give up on importing better, or never try selling abroad at all. They lose margin to competitors who are not better — only better organised internationally. </p> <p> <strong>We exist to erase that disadvantage.</strong> Every operation we simplify is a company that grows without trading predictability for opportunity. In the long run, we want importing and exporting to be as unremarkable as issuing an invoice. </p>',

    /* garantias */
    'offer.h.l1': 'The risk of trying',
    'offer.h.l2': 'is <em>ours.</em> The gain is yours.',
    'offer.kick.1': 'Acelero Review — no cost',
    'offer.h3.1': 'In 45 minutes we show you exactly where your operation is losing money — and how much of it you can recover on the very next shipment.',
    'offer.d.1': 'This is not a sales meeting in disguise. It is a technical analysis of your current operation, run by a senior specialist, with the numbers on screen. If you then want to run it all yourself, the material is yours, with nothing expected in return.',
    'offer.lista.1': '<li>Review of your tariff classification and the regimes that apply to it</li> <li>A <em>landed cost</em> simulation for your main product</li> <li>Mode and route comparison with realistic lead times</li> <li>A map of the three largest customs risks in your current operation</li> <li>An action plan ranked by financial return</li>',
    'offer.cta.1': 'Book my review',
    'offer.sc.1': 'We take on a limited number of new operations each month to protect the standard of service. Slots left in this cycle: <b>4</b>.',
    'gtee.h.1': 'Agreed lead time, guaranteed',
    'gtee.p.1': 'We set a cycle SLA per shipment together with you. If a delay is caused by a failure on our side, the management fee for that shipment is not charged. In writing.',
    'gtee.h.2': 'Cost transparency',
    'gtee.p.2': 'You receive the original invoice from every supplier in the chain. Our fee is declared and fixed — we take no commission buried in freight, currency exchange or storage.',
    'gtee.h.3': 'A reply within 4 business hours',
    'gtee.p.3': 'A direct line to your account manager and to the customs team. A held shipment is resolved in hours, not in days of unanswered email.',
    'bonus.lbl.1': 'Bonuses for closing within the cycle',
    'bonus.lista.1': '<li><b>Digital control tower</b> — the tracking dashboard at no extra cost.</li> <li><b>Audit of 2 suppliers</b> — document verification and an initial inspection.</li> <li><b>Foreign trade playbook</b> — the process written up for your company, for your own team.</li>',

    /* FAQ */
    'faq.h.l1': 'Questions everyone',
    'faq.h.l2': 'asks before',
    'faq.h.l3': '<em>getting started.</em>',
    'lead.4': 'If your question is not here, send it on WhatsApp. We answer with the technical answer, even when it does not help the sale.',
    'faq.q.1': 'My company has never imported. Can we start from zero?',
    'faq.a.1': 'You can, and it is the most common situation among our new clients. We handle the customs registration, the tax framework, the choice of supplier and the entire first shipment. You take the commercial decisions; the technical side stays with us.',
    'faq.q.2': 'What is the minimum volume to make it worthwhile?',
    'faq.a.2': 'We do not work to a rigid minimum, we work to viability. Operations from roughly one container per quarter, or recurring air cargo, usually carry enough gain. At the review we say plainly if it is not yet your moment — wasting time on an operation that does not add up is bad for both sides.',
    'faq.q.3': 'How do you charge?',
    'faq.a.3': 'We agree in advance on either a management fee per shipment or a monthly retainer, depending on volume. Third-party costs — freight, insurance, storage, duties, port charges — are passed through with the original invoice attached. No buried commission: if a partner pays us anything, it is declared and deducted.',
    'faq.q.4': 'Do you guarantee the delivery date?',
    'faq.a.4': 'We guarantee the SLA on the stages under our management, set out in the contract. A port strike, a weather event or an extraordinary inspection are beyond any operator’s control — but in those cases you are told immediately, with a plan B on the table. When the delay comes from a failure on our side, the management fee for that shipment is not charged.',
    'faq.q.5': 'What if my cargo is flagged for inspection?',
    'faq.a.5': 'It is part of the operation and no cause for panic. Our paperwork is checked before arrival precisely to reduce that chance — and when it happens, the customs team takes over the dialogue with the authorities and the terminal the same day. Today, 98.4% of our cargo clears on the green channel.',
    'faq.q.6': 'Do you work with suppliers in China?',
    'faq.a.6': 'Yes, and also in India, Vietnam, Turkey, the United States, Mexico and the European Union. We have inspection partners at origin, which means your product’s conformity is verified before shipping — not once the container is already in Brazil.',
    'faq.q.7': 'I already have a customs broker. Do I have to replace everything?',
    'faq.a.7': 'No. Many clients start with strategic consulting or logistics alone, keeping their current broker. If consolidating later makes sense, we run the transition without interrupting shipments in progress.',
    'faq.q.8': 'How do I follow my operations day to day?',
    'faq.a.8': 'Through the digital control tower: the status of each shipment, documents, accumulated cost and an updated ETA, on desktop or phone. On top of that you have a direct line to your account manager, answered within 4 business hours.',
    'faq.q.9': 'Is the review really free?',
    'faq.a.9': 'It is. We invest those 45 minutes because, in practice, it is our best demonstration of competence. You leave with the material in hand, whether you hire us or not. What we ask in return is that whoever joins the meeting has access to the operation’s numbers — without them, the analysis becomes guesswork.',

    /* contato */
    'cont.h.l1': 'Talk to a',
    'cont.h.l2': '<em>specialist</em> now.',
    'cont.lead.1': 'Fill in the form and a senior specialist — not a screening agent — will get in touch within 1 business day to schedule the review. If you prefer, message us directly on WhatsApp.',
    'chan.em.1': 'WhatsApp — answered within minutes, in business hours',
    'chan.em.2': 'Landline, 8:30 to 18:30',
    'chan.em.3': 'For proposals, RFPs and documentation',
    'cont.re.1': '<b>No obligation and no cost.</b> You leave the meeting with the map of your operation, whether you hire us or not. Your data is not shared with third parties.',
    'form.t.1': 'Request an operation review',
    'form.lbl.1': 'Full name *', 'form.lbl.2': 'Company *', 'form.lbl.3': 'Work email *',
    'form.lbl.4': 'WhatsApp *', 'form.lbl.5': 'What do you need? *',
    'form.lbl.6': 'Estimated volume', 'form.lbl.7': 'Tell us briefly about the operation',
    'form.conf.t': 'Confirm the number — this is how we will reach you',
    'form.conf.c': 'I have already sent the confirmation message from my WhatsApp.',
    'form.conf.l': 'Send the confirmation from my WhatsApp',
    'form.conf.k': 'Reference code',
    'form.cta.1': 'Request my free review',
    'form.n.1': 'Answered within 1 business day. No spam.',

    /* rodapé */
    'foot.h.l1': 'Accelerate your <em>foreign trade.</em>',
    'foot.p.1': 'We take care of the processes, costs, logistics and compliance of your company\u2019s imports and exports.',
    'foot.cta.1': 'Talk to the specialist',
    'foot.desc.1': 'Complete foreign trade management for manufacturers, e-commerce operations and importers who cannot afford to rely on luck.',
    'foot.serv.1': 'Import and Export', 'foot.serv.2': 'International Logistics',
    'foot.serv.3': 'Customs Clearance', 'foot.serv.4': 'Strategic Consulting',
    'foot.emp.1': 'About Acelero', 'foot.emp.2': 'Process', 'foot.emp.3': 'Operations',
    'foot.emp.4': 'Why we do it', 'foot.emp.5': 'Frequently asked questions',
    'foot.hora': 'Mon to Fri, 8:30 to 18:30',
    'foot.lbl.1': 'Services', 'foot.lbl.2': 'Company', 'foot.lbl.3': 'Contact'
  },

  es: {
    'hdnum.5': '05 — Operación',
    'cases.h.l1': 'Lo que pasa',
    'cases.h.l2': 'por <em>nuestra operación.</em>',
    'lead.3': 'En lugar de cifras de clientes que usted no puede verificar, el mapa de lo que atendemos hoy: sectores, plazas, modales y regímenes. Si su caso está aquí, ya operamos algo como el suyo.',
    'op.h.1': 'Sectores atendidos',
    'op.l.1': '<li>Autopartes y componentes industriales</li><li>Electrónicos y línea blanca</li><li>Alimentos y bebidas</li><li>Máquinas y equipos</li><li>Materiales de construcción y acabado</li><li>Insumos químicos y plásticos</li>',
    'op.h.2': 'Orígenes y destinos',
    'op.l.2': '<li>China, Vietnam, India y Turquía</li><li>Unión Europea y Reino Unido</li><li>Estados Unidos y México</li><li>Mercosur: Argentina, Uruguay, Paraguay y Chile</li><li>Exportación a América Latina, Estados Unidos y Europa</li>',
    'op.h.3': 'Modales y regímenes',
    'op.l.3': '<li>Marítimo FCL y LCL</li><li>Aéreo y courier para urgencias y muestras</li><li>Terrestre en el Mercosur</li><li>Importación propia, por cuenta y orden y por encargo</li><li>Ex-tarifario, drawback y demás regímenes especiales</li>',
    'op.h.4': 'Dónde despachamos',
    'op.l.4': '<li>Santos <span class="mono">SP</span></li><li>Itajaí y Navegantes <span class="mono">SC</span></li><li>Paranaguá <span class="mono">PR</span></li><li>Vitória y Vila Velha <span class="mono">ES</span></li><li>Viracopos y Guarulhos <span class="mono">SP · aéreo</span></li><li>Recintos aduaneros y puertos secos</li>',
    'op.nota.1': 'No publicamos nombre de cliente ni cifras de terceros sin autorización por escrito. En la reunión de diagnóstico mostramos un caso equivalente al suyo, con el cálculo abierto.',
    /* navegación */
    'nav.sobre': '<span class="mono">01</span>Nosotros',
    'nav.servicos': '<span class="mono">02</span>Servicios',
    'nav.processo': '<span class="mono">03</span>Proceso',
    'nav.cases': '<span class="mono">05</span>Operación',
    'nav.contato': '<span class="mono">09</span>Contacto',
    'nav.cta': 'Agendar consultoría',
    'menu.1': 'Sobre Acelero', 'menu.2': 'Servicios', 'menu.3': 'Proceso',
    'menu.4': 'Resultados', 'menu.5': 'Operación', 'menu.6': 'Por qué lo hacemos',
    'menu.7': 'Garantías', 'menu.8': 'Preguntas frecuentes',
    'menu.9': 'Hable con el especialista',

    /* hero */
    'hero.tag.1': 'Gestión integral de comercio exterior',
    'hero.h.l1': 'Importación y exportación',
    'hero.h.l2': 'con gestión de',
    'hero.h.l3': '<em>punta&nbsp;a&nbsp;punta.</em>',
    'hero.sub.1': 'De la negociación con el proveedor a la entrega de la carga, tenga <strong>claridad de costos, plazos y próximos pasos</strong> — con ACELERO COMEX coordinando la operación.',
    'hero.cta1.1': 'Agendar consultoría',
    'hero.cta2.1': 'Qué hacemos',
    'hero.kpi.1': 'embarques gestionados',
    'hero.kpi.2': 'países operados',
    'hero.kpi.3': 'liberadas en canal verde',
    'hero.kpi.4': 'siguen tras 24 meses',
    'hero.role.1': 'Baje',

    /* secciones — numeración */
    'hdnum.1': '01 — Nosotros', 'hdnum.2': '02 — Servicios', 'hdnum.3': '03 — Proceso',
    'hdnum.4': '04 — Resultados', 'hdnum.6': '06 — Por qué lo hacemos',
    'hdnum.7': '07 — Garantías', 'hdnum.8': '08 — Dudas', 'hdnum.9': '09 — Contacto',

    /* nosotros */
    'sobre.h.l1': 'No somos otro',
    'sobre.h.l2': 'intermediario. Somos su',
    'sobre.h.l3': '<em>departamento</em>',
    'sobre.h.l4': '<em>de comercio exterior.</em>',
    'sobre.txt.1': '<p> ACELERO COMEX nació de una inconformidad simple: las empresas brasileñas pierden margen, tiempo y noches de sueño porque la operación internacional se trata como un rompecabezas de proveedores desconectados — uno cotiza, otro embarca, otro despacha en aduana, y nadie responde por el resultado. </p> <p> Nosotros reunimos todo bajo un solo equipo, un solo proceso y un solo responsable. Usted habla con una persona; nosotros coordinamos el resto del planeta. </p>',
    'tri.lbl.1': 'Misión',
    'tri.h.1': 'Hacer el mundo accesible para quien produce y vende en Brasil.',
    'tri.p.1': 'Acortar la distancia entre su empresa y cualquier proveedor o cliente del planeta, con claridad total de costo, plazo y riesgo.',
    'tri.lbl.2': 'Visión',
    'tri.h.2': 'Ser la operación de comercio exterior más previsible de América Latina.',
    'tri.p.2': 'No la más grande. La más confiable — aquella en la que la dirección planifica el trimestre entero sin temer lo que viene del otro lado del océano.',
    'tri.lbl.3': 'Valores',
    'tri.h.3': 'Transparencia radical, dato antes que opinión, responsabilidad de punta a punta.',
    'tri.p.3': 'Si algo sale mal, usted se entera por nosotros — antes de que se convierta en pérdida. Sin tarifas ocultas, sin “eso no nos corresponde”.',

    /* servicios */
    'serv.h.l1': 'Cuatro frentes.',
    'serv.h.l2': 'Una <em>sola</em> operación.',
    'lead.1': 'Puede contratar un frente aislado o entregar toda la operación a nuestro equipo. En la práctica, quien empieza por uno termina migrando todo — porque la ganancia está justamente en que nadie pueda pasarle la responsabilidad al de al lado.',
    'card.n.1': 'S/01',
    'card.h.1': 'Importación y Exportación',
    'card.p.1': 'Desde la homologación del proveedor hasta la nacionalización — y, en el otro sentido, desde la adecuación de etiqueta hasta el certificado de origen. Simulación de <em>landed cost</em> antes de que apruebe la compra, no después de que llegue la factura.',
    'card.b.1': '<span class="mono">Ganancia</span> Usted decide comprar sabiendo el costo final en su propio estante, con el margen calculado y no estimado.',
    'card.cta.1': 'Simular mi operación',
    'card.n.2': 'S/02',
    'card.h.2': 'Logística Internacional',
    'card.p.2': 'Marítimo, aéreo, terrestre y multimodal con contratos negociados por volumen. Elegimos el modal por su calendario de ventas, no por la conveniencia del agente — y monitoreamos cada tramo hasta el muelle de destino.',
    'card.b.2': '<span class="mono">Ganancia</span> Flete competitivo con espacio garantizado en temporada alta y un ETA que usted puede prometerle a su cliente.',
    'card.cta.2': 'Cotizar mi flete',
    'card.n.3': 'S/03',
    'card.h.3': 'Despacho Aduanero',
    'card.p.3': 'Equipo propio de despacho, documentación revisada antes del arribo y relación diaria con las terminales. Cuando una carga cae en canal amarillo o rojo, ya sabemos qué hacer — y usted se entera el mismo día.',
    'card.b.3': '<span class="mono">Ganancia</span> Menos días de almacenaje y demoras, que es donde la utilidad del embarque se evapora en silencio.',
    'card.cta.3': 'Destrabar una carga',
    'card.n.4': 'S/04',
    'card.h.4': 'Consultoría Estratégica',
    'card.p.4': 'Diagnóstico tributario y logístico de la operación actual: revisión de clasificación arancelaria, regímenes especiales, drawback, exenciones arancelarias, acuerdos comerciales y diseño de ruta. Es el frente que suele pagarse solo antes del tercer embarque.',
    'card.b.4': '<span class="mono">Ganancia</span> Ahorro recurrente en cada operación futura, con un informe que su contabilidad puede auditar.',
    'card.cta.4': 'Pedir un diagnóstico',

    /* proceso */
    'proc.h.l1': 'Cinco etapas.',
    'proc.h.l2': 'Ninguna <em>sorpresa.</em>',
    'lead.2': 'Cada etapa tiene entregable, plazo y responsable definidos. Usted siempre sabe en qué punto está su operación y qué viene después — es esa claridad la que elimina el miedo a importar.',
    'step.t.1': 'Días 1 a 7',
    'step.h.1': 'Planificación',
    'step.p.1': 'Diagnóstico de producto, clasificación arancelaria, volumen y estacionalidad; diseño de modal, incoterm, régimen tributario y cronograma. Si hay una habilitación o licencia pendiente, la resolvemos ahora — antes de cualquier compromiso con el proveedor.',
    'step.o.1': '<span class="mono">Entregable</span> Plan operativo con costo objetivo y plazo objetivo.',
    'step.t.2': 'Semanas 2 a 4',
    'step.h.2': 'Producción',
    'step.p.2': 'Proveedor homologado mediante auditoría documental y verificación de capacidad productiva, pedido firmado con términos protegidos y seguimiento semanal de la línea. Usted sigue el avance sin entrar en ningún huso horario ajeno.',
    'step.o.2': '<span class="mono">Entregable</span> Expediente del proveedor + cronograma de producción monitoreado.',
    'step.t.3': 'Antes del embarque',
    'step.h.3': 'Inspección',
    'step.p.3': 'Verificamos cantidad, especificación y embalaje en origen, con informe fotográfico. El embarque se libera solo después de eso — una discrepancia detectada en la fábrica cuesta una fracción de lo que cuesta con el contenedor ya en destino.',
    'step.o.3': '<span class="mono">Entregable</span> Informe de inspección con fotos y certificado de conformidad.',
    'step.t.4': 'Tránsito internacional',
    'step.h.4': 'Transporte',
    'step.p.4': 'Booking, documentación, seguro y rastreo en tiempo real. Usted lo sigue en el panel y recibe alerta proactiva ante cualquier desvío de ruta, retraso de buque o cambio de ventana portuaria — antes de que se vuelva un problema de agenda.',
    'step.o.4': '<span class="mono">Entregable</span> Acceso a la torre de control + alertas automáticas.',
    'step.t.5': 'Arribo',
    'step.h.5': 'Entrega',
    'step.p.5': 'Registro anticipado, despacho, liberación y transporte final hasta su muelle. Cerramos con el costo real del embarque comparado con lo presupuestado — para que la próxima operación sea aún más precisa que esta.',
    'step.o.5': '<span class="mono">Entregable</span> Carga en su muelle + informe de cierre financiero.',
    'proc.band.1': '¿Quiere ver este proceso aplicado a <em>su</em> producto y su clasificación arancelaria?',
    'proc.bandcta.1': 'Agendar diagnóstico gratuito',

    /* resultados */
    'res.h.l1': 'Un resultado no es',
    'res.h.l2': 'promesa. Es <em>número</em>',
    'res.h.l3': '<em>auditado.</em>',
    'num.1': 'Embarques gestionados desde 2016',
    'num.2': 'Reducción media de costo logístico en el primer año',
    'num.3': 'Cargas liberadas en canal verde',
    'num.4': 'Menos, en promedio, en el ciclo pedido → muelle',
    'num.5': 'Países de origen y destino operados',
    'num.6': 'De los clientes siguen con nosotros tras 24 meses',
    'res.nota.1': 'Indicadores consolidados de la cartera activa. En la reunión de diagnóstico mostramos la memoria de cálculo — un número sin origen no vale nada.',

    /* casos */ /* propósito */
    'purp.h.l1': 'Toda empresa tiene el poder de competir con el <em>mundo entero.</em>',
    'purp.h.l2': 'debería poder competir',
    'purp.h.l3': 'con el <em>mundo entero.</em>',
    'purp.man.1': '<ul class="man"><li>El COMEX no puede ser <em>lento</em>.</li><li>El COMEX no puede ser <em>manual</em>.</li><li>El COMEX no puede ser <em>inseguro</em>.</li><li>El COMEX no puede ser <em>un laberinto</em>.</li></ul><p class="man__f">El COMEX necesita ser <b>ACELERO</b>.</p>',
    'purp.txt.1': '<p> El comercio exterior en Brasil fue construido para ser difícil. Un lenguaje propio, una burocracia que cambia sin aviso y una cadena de intermediarios en la que casi nadie tiene incentivo para decir la verdad sobre costo y plazo. </p> <p> El resultado es que empresas excelentes desisten de importar mejor, o nunca prueban vender afuera. Pierden margen frente a competidores que no son mejores — solo tienen una operación internacional más organizada. </p> <p> <strong>Existimos para borrar esa desventaja.</strong> Cada operación que simplificamos es una empresa que crece sin cambiar previsibilidad por oportunidad. A largo plazo, queremos que importar y exportar sea tan corriente como emitir una factura. </p>',

    /* garantías */
    'offer.h.l1': 'El riesgo de intentar',
    'offer.h.l2': 'es <em>nuestro.</em> La ganancia es suya.',
    'offer.kick.1': 'Diagnóstico Acelero — sin costo',
    'offer.h3.1': 'En 45 minutos le mostramos exactamente dónde su operación pierde dinero — y cuánto puede recuperar ya en el próximo embarque.',
    'offer.d.1': 'No es una reunión comercial disfrazada. Es un análisis técnico de su operación actual, hecho por un especialista sénior, con los números en pantalla. Si después de eso quiere llevarlo todo solo, el material es suyo, sin contrapartida.',
    'offer.lista.1': '<li>Revisión de su clasificación arancelaria y de los regímenes aplicables</li> <li>Simulación de <em>landed cost</em> de su principal producto</li> <li>Comparativo de modales y rutas con plazos realistas</li> <li>Mapa de los tres mayores riesgos aduaneros de la operación actual</li> <li>Plan de acción priorizado por retorno financiero</li>',
    'offer.cta.1': 'Agendar mi diagnóstico',
    'offer.sc.1': 'Atendemos un número limitado de nuevas operaciones por mes para mantener el estándar de acompañamiento. Cupos del ciclo actual: <b>4</b>.',
    'gtee.h.1': 'Garantía del plazo acordado',
    'gtee.p.1': 'Definimos con usted un SLA de ciclo por embarque. Si el retraso se debe a una falla nuestra, la tarifa de gestión de ese embarque no se cobra. Por contrato.',
    'gtee.h.2': 'Transparencia de costo',
    'gtee.p.2': 'Usted recibe la factura original de cada proveedor de la cadena. Nuestra remuneración es declarada y fija — no ganamos comisión incorporada en flete, cambio de divisas ni almacenaje.',
    'gtee.h.3': 'Respuesta en hasta 4 horas hábiles',
    'gtee.p.3': 'Canal directo con su gerente de cuenta y con el equipo de aduana. Una carga detenida se resuelve en horas, no en días de correos sin respuesta.',
    'bonus.lbl.1': 'Bonos para quien cierra en el ciclo',
    'bonus.lista.1': '<li><b>Torre de control digital</b> — panel de seguimiento sin costo adicional.</li> <li><b>Auditoría de 2 proveedores</b> — verificación documental e inspección inicial.</li> <li><b>Playbook de comercio exterior</b> — el proceso aplicado a su empresa, para su equipo interno.</li>',

    /* preguntas */
    'faq.h.l1': 'Preguntas que todos',
    'faq.h.l2': 'hacen antes',
    'faq.h.l3': '<em>de empezar.</em>',
    'lead.4': 'Si su duda no está aquí, escríbanos por WhatsApp. Respondemos con la respuesta técnica, incluso cuando no favorece la venta.',
    'faq.q.1': 'Mi empresa nunca importó. ¿Se puede empezar desde cero?',
    'faq.a.1': 'Se puede, y es el escenario más común entre nuestros clientes nuevos. Nos ocupamos de la habilitación aduanera, del encuadre tributario, de la elección del proveedor y del primer embarque completo. Usted participa de las decisiones comerciales; la parte técnica queda con nosotros.',
    'faq.q.2': '¿Cuál es el volumen mínimo para que valga la pena?',
    'faq.a.2': 'No trabajamos con un mínimo rígido, sino con viabilidad. Operaciones a partir de cerca de un contenedor por trimestre, o cargas aéreas recurrentes, ya suelen tener ganancia suficiente. En el diagnóstico decimos con claridad si aún no es su momento — perder tiempo con una operación que no cierra es malo para ambos lados.',
    'faq.q.3': '¿Cómo cobran ustedes?',
    'faq.a.3': 'Acordamos previamente una tarifa de gestión por embarque o un fee mensual, según el volumen. Los costos de terceros — flete, seguro, almacenaje, tributos, tasas portuarias — se trasladan con la factura original adjunta. Sin comisión incorporada: si un socio nos paga algo, se declara y se descuenta.',
    'faq.q.4': '¿Garantizan el plazo de entrega?',
    'faq.a.4': 'Garantizamos el SLA de las etapas bajo nuestra gestión, definido por contrato. Una huelga portuaria, un evento climático o una fiscalización extraordinaria están fuera del control de cualquier operador — pero en esos casos usted es avisado de inmediato, con un plan B sobre la mesa. Cuando el retraso proviene de una falla nuestra, la tarifa de gestión de ese embarque no se cobra.',
    'faq.q.5': '¿Y si mi carga cae en canal amarillo o rojo?',
    'faq.a.5': 'Es parte de la operación y no es motivo de pánico. Nuestra documentación se revisa antes del arribo justamente para reducir esa probabilidad — y, cuando ocurre, el equipo de aduana asume la interlocución con la autoridad y con la terminal el mismo día. Hoy, el 98,4% de nuestras cargas se liberan en canal verde.',
    'faq.q.6': '¿Trabajan con proveedores de China?',
    'faq.a.6': 'Sí, y también con India, Vietnam, Turquía, Estados Unidos, México y la Unión Europea. Tenemos socios de inspección en origen, lo que significa que la conformidad de su producto se verifica antes del embarque — no cuando el contenedor ya está en destino.',
    'faq.q.7': 'Ya tengo despachante. ¿Tengo que cambiar todo?',
    'faq.a.7': 'No. Muchos clientes empiezan solo por la consultoría estratégica o por la logística, manteniendo su despachante actual. Si en algún momento tiene sentido consolidar, la transición la hacemos nosotros, sin interrumpir embarques en curso.',
    'faq.q.8': '¿Cómo sigo mis operaciones en el día a día?',
    'faq.a.8': 'Por la torre de control digital: estado de cada embarque, documentos, costo acumulado y ETA actualizado, en la computadora o en el celular. Además, tiene canal directo con el gerente de cuenta, con respuesta en hasta 4 horas hábiles.',
    'faq.q.9': '¿El diagnóstico es realmente gratuito?',
    'faq.a.9': 'Lo es. Invertimos esos 45 minutos porque, en la práctica, es nuestra mejor demostración de competencia. Usted se va con el material en la mano, nos contrate o no. Lo que pedimos a cambio es que quien participe de la reunión tenga acceso a los números de la operación — sin eso, el análisis se vuelve suposición.',

    /* contacto */
    'cont.h.l1': 'Hable con un',
    'cont.h.l2': '<em>especialista</em> ahora.',
    'cont.lead.1': 'Complete el formulario y un especialista sénior — no un agente de filtro — lo contactará en hasta 1 día hábil para agendar el diagnóstico. Si prefiere, escríbanos directo por WhatsApp.',
    'chan.em.1': 'WhatsApp — respuesta en minutos, en horario comercial',
    'chan.em.2': 'Teléfono fijo, de 8:30 a 18:30',
    'chan.em.3': 'Para propuestas, licitaciones y documentación',
    'cont.re.1': '<b>Sin compromiso y sin costo.</b> Usted sale de la reunión con el mapa de su operación, nos contrate o no. Sus datos no se comparten con terceros.',
    'form.t.1': 'Solicitar análisis de la operación',
    'form.lbl.1': 'Nombre completo *', 'form.lbl.2': 'Empresa *', 'form.lbl.3': 'Correo corporativo *',
    'form.lbl.4': 'WhatsApp *', 'form.lbl.5': '¿Qué necesita? *',
    'form.lbl.6': 'Volumen estimado', 'form.lbl.7': 'Cuéntenos brevemente sobre la operación',
    'form.conf.t': 'Confirme el número — por ahí lo vamos a contactar',
    'form.conf.c': 'Ya envié el mensaje de confirmación desde mi WhatsApp.',
    'form.conf.l': 'Enviar la confirmación desde mi WhatsApp',
    'form.conf.k': 'Código de esta solicitud',
    'form.cta.1': 'Solicitar mi análisis gratuito',
    'form.n.1': 'Respuesta en hasta 1 día hábil. Sin spam.',

    /* pie */
    'foot.h.l1': 'Acelere su <em>comercio exterior.</em>',
    'foot.p.1': 'Cuidamos de los procesos, costos, logística y compliance de la importación y exportación de su empresa.',
    'foot.cta.1': 'Hable con el especialista',
    'foot.desc.1': 'Gestión integral de comercio exterior para industrias, e-commerces e importadores que no pueden depender de la suerte.',
    'foot.serv.1': 'Importación y Exportación', 'foot.serv.2': 'Logística Internacional',
    'foot.serv.3': 'Despacho Aduanero', 'foot.serv.4': 'Consultoría Estratégica',
    'foot.emp.1': 'Sobre Acelero', 'foot.emp.2': 'Proceso', 'foot.emp.3': 'Operación',
    'foot.emp.4': 'Por qué lo hacemos', 'foot.emp.5': 'Preguntas frecuentes',
    'foot.hora': 'Lun a vie, 8:30 a 18:30',
    'foot.lbl.1': 'Servicios', 'foot.lbl.2': 'Empresa', 'foot.lbl.3': 'Contacto'
  }
};

/* Textos que não vivem em elementos com data-i18n: placeholders do formulário,
   opções dos selects e as mensagens que o JavaScript emite. */
window.ACELERO_IDIOMAS_EXTRA = {
  en: {
    placeholders: {
      nome: 'What should we call you?', empresa: 'Registered or trading name',
      email: 'you@yourcompany.com', telefone: '+55 (00) 00000-0000',
      mensagem: 'Product, country of origin or destination, target date, biggest difficulty today…'
    },
    opcoes: {
      interesse: ['Select…', 'Import (already importing)', 'Import (never imported)', 'Export',
                  'International logistics / freight', 'Customs clearance',
                  'Consulting and tax review', 'Release an urgent shipment'],
      volume: ['Select…', 'Not sure yet', 'Up to 2 containers/year', '3 to 12 containers/year',
               'More than 12 containers/year', 'Air freight / courier only']
    },
    cursor: {
      'Agendar': 'Book', 'Ver': 'View', 'Detalhes': 'Details', 'Vamos?': 'Let’s go',
      'Planejamento': 'Planning', 'Produção': 'Production', 'Inspeção': 'Inspection',
      'Transporte': 'Transport', 'Entrega': 'Delivery', 'Ligar': 'Call',
      'E-mail': 'Email', 'Enviar': 'Send', 'WhatsApp': 'WhatsApp',
      'Ir': 'Go', 'Abrir': 'Open', 'Ler': 'Read', 'Fechar': 'Close',
      'Digite': 'Type', 'Escolha': 'Choose', 'Marcar': 'Tick', 'Clique': 'Click',
      'Idioma': 'Language'
    },
    consentimento: 'I authorise ACELERO COMEX to contact me and I agree to the <a href="politica-privacidade.html">Privacy Policy</a>. *',
    msg: {
      enviando: 'Sending…',
      ok: 'Received. A specialist will be in touch within 1 business day.',
      erro: 'We could not send it right now.',
      erroLink: 'Send it by email instead',
      campos: 'Check the highlighted fields above.',
      nome: 'Please enter your name.', empresa: 'Please enter the company name.',
      interesse: 'Please select what you need.', email: 'Please enter a valid email.',
      telefone: 'Please enter a WhatsApp number with area code.',
      consent: 'You need to authorise contact before sending.',
      telDig: 'Number is incomplete for the country you selected.',
      telLongo: 'Number has too many digits for the country you selected.',
      telFalso: 'This does not look like a real number. Please check it.',
      telDDD: 'That Brazilian area code does not exist. Check the first two digits.',
      telCel: 'WhatsApp in Brazil is a mobile line: 11 digits, with a 9 after the area code.',
      emailCorp: 'Please use your company email. We do not take enquiries from personal email.',
      waEnvio: 'Send the confirmation message on WhatsApp — that is how we know the number is yours.',
      waConf: 'Tick the WhatsApp confirmation so we can reach you.'
    }
  },
  es: {
    placeholders: {
      nome: '¿Cómo podemos llamarlo?', empresa: 'Razón social o nombre comercial',
      email: 'usted@suempresa.com', telefone: '+55 (00) 00000-0000',
      mensagem: 'Producto, país de origen o destino, plazo deseado, principal dificultad hoy…'
    },
    opcoes: {
      interesse: ['Seleccione…', 'Importar (ya importo)', 'Importar (nunca importé)', 'Exportar',
                  'Logística internacional / flete', 'Despacho aduanero',
                  'Consultoría y revisión tributaria', 'Destrabar una carga urgente'],
      volume: ['Seleccione…', 'Aún no sé estimar', 'Hasta 2 contenedores/año',
               '3 a 12 contenedores/año', 'Más de 12 contenedores/año', 'Solo carga aérea / courier']
    },
    cursor: {
      'Agendar': 'Agendar', 'Ver': 'Ver', 'Detalhes': 'Detalles', 'Vamos?': '¿Vamos?',
      'Planejamento': 'Planificación', 'Produção': 'Producción', 'Inspeção': 'Inspección',
      'Transporte': 'Transporte', 'Entrega': 'Entrega', 'Ligar': 'Llamar',
      'E-mail': 'Correo', 'Enviar': 'Enviar', 'WhatsApp': 'WhatsApp',
      'Ir': 'Ir', 'Abrir': 'Abrir', 'Ler': 'Leer', 'Fechar': 'Cerrar',
      'Digite': 'Escriba', 'Escolha': 'Elija', 'Marcar': 'Marcar', 'Clique': 'Clic',
      'Idioma': 'Idioma'
    },
    consentimento: 'Autorizo el contacto de ACELERO COMEX y acepto la <a href="politica-privacidade.html">Política de Privacidad</a>. *',
    msg: {
      enviando: 'Enviando…',
      ok: 'Recibido. Un especialista lo contactará en hasta 1 día hábil.',
      erro: 'No pudimos enviarlo ahora.',
      erroLink: 'Enviar por correo',
      campos: 'Revise los campos destacados arriba.',
      nome: 'Informe su nombre.', empresa: 'Informe el nombre de la empresa.',
      interesse: 'Seleccione lo que necesita.', email: 'Informe un correo válido.',
      telefone: 'Informe un WhatsApp con código de área.',
      consent: 'Es necesario autorizar el contacto para enviar.',
      telDig: 'Número incompleto para el país elegido.',
      telLongo: 'Número con demasiados dígitos para el país elegido.',
      telFalso: 'Este número no parece real. Verifíquelo e ingréselo de nuevo.',
      telDDD: 'Ese código de área brasileño no existe. Revise los dos primeros dígitos.',
      telCel: 'En Brasil WhatsApp es celular: 11 dígitos, con el 9 después del código de área.',
      emailCorp: 'Use el correo de la empresa. No atendemos por correo personal.',
      waEnvio: 'Envíe el mensaje de confirmación por WhatsApp — así sabemos que el número es suyo.',
      waConf: 'Marque la confirmación de WhatsApp para que podamos contactarlo.'
    }
  }
};

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

  comecarNoTopo();
  menu();
  ancoras();
  menuAtivo();
  slotsOpcionais();
};

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

