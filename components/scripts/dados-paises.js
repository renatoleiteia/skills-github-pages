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
