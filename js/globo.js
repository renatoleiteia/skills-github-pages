/* ============================================================================
   ACELERO COMEX — globo.js

   O globo de rotas comerciais, isolado num arquivo próprio porque duas
   páginas o usam: o site (herói, propósito, contato e o cursor) e a entrada
   do webmail. Duplicar a matemática em dois lugares seria pedir para as
   duas versões divergirem.

   Uso:  ACELERO_GLOBO.criar(canvas, { scale, speed, cx, cy, rotas, nos })

   Sem dependências. A esfera é desenhada por trigonometria — não há dado de
   mapa nem imagem envolvida.
   ========================================================================== */

(function () {
  'use strict';

  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 02. GLOBO DE ROTAS ---------------------------------------
   Esfera em arame desenhada por trigonometria — sem dados de mapa e sem
   imagem. Os pontos são portos reais; as rotas seguem o arco de círculo
   máximo entre eles, que é o caminho que um navio de fato percorre.
   ------------------------------------------------------------------- */
const PORTOS = {
  // Brasil — origem e destino da operação
  santos:      [-23.96,  -46.33], itajai:    [-26.91,  -48.66],
  paranagua:   [-25.50,  -48.51], suape:     [ -8.39,  -34.97],
  // Demais da América do Sul
  montevideu:  [-34.90,  -56.19], buenosaires:[-34.60, -58.38],
  valparaiso:  [-33.05,  -71.62],
  // América do Norte
  novayork:    [ 40.68,  -74.02], miami:     [ 25.77,  -80.19],
  longbeach:   [ 33.75, -118.20], montreal:  [ 45.50,  -73.55],
  manzanillo:  [ 19.05, -104.32],
  // Europa
  lisboa:      [ 38.71,   -9.14], hamburgo:  [ 53.55,    9.99],
  lehavre:     [ 49.49,    0.11], roterda:   [ 51.92,    4.48],
  antuerpia:   [ 51.26,    4.40], valencia:  [ 39.45,   -0.33],
  istambul:    [ 41.01,   28.98],
  // África
  luanda:      [ -8.84,   13.23], durban:    [-29.87,   31.02],
  cidadedocabo:[-33.92,   18.42], tangermed: [ 35.89,   -5.50],
  // Ásia e Oriente Médio
  xangai:      [ 31.23,  121.47], shenzhen:  [ 22.54,  114.06],
  ningbo:      [ 29.87,  121.55], singapura: [  1.29,  103.85],
  busan:       [ 35.10,  129.04], toquio:    [ 35.44,  139.64],
  mumbai:      [ 18.95,   72.95], hochimin:  [ 10.82,  106.63],
  jebelali:    [ 25.01,   55.06],
  // Oceania
  sydney:      [-33.86,  151.21]
};

const ROTAS = [
  // Radiais a partir dos portos brasileiros
  ['santos','xangai'],     ['santos','roterda'],     ['santos','novayork'],
  ['santos','hamburgo'],   ['santos','lisboa'],      ['santos','longbeach'],
  ['santos','durban'],     ['santos','jebelali'],    ['santos','montevideu'],
  ['santos','buenosaires'],
  ['itajai','shenzhen'],   ['itajai','antuerpia'],   ['itajai','miami'],
  ['itajai','luanda'],     ['itajai','busan'],       ['itajai','valparaiso'],
  ['paranagua','ningbo'],  ['paranagua','lehavre'],  ['paranagua','montreal'],
  ['paranagua','cidadedocabo'],
  ['suape','tangermed'],   ['suape','valencia'],     ['suape','manzanillo'],
  // Travessias que dão a leitura de rede, não só de leque
  ['xangai','roterda'],    ['singapura','jebelali'], ['toquio','longbeach'],
  ['hochimin','hamburgo'], ['sydney','shenzhen'],    ['mumbai','istambul']
];

// Inclinação do eixo de rotação da Terra: 23,5°. Todos os globos do site
// usam este mesmo valor, para que sejam o mesmo planeta.
const INCLINACAO_TERRA = 23.5 * Math.PI / 180;   // eixo de rotação da Terra

const rad = d => d * Math.PI / 180;
const toVec = ([la, lo]) => {
  const a = rad(la), b = rad(lo);
  return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)];
};
// Interpolação sobre o arco de círculo máximo (slerp) — o caminho que um
// navio de fato percorre entre dois portos.
const slerp = (u, v, t) => {
  let d = clamp(u[0]*v[0] + u[1]*v[1] + u[2]*v[2], -1, 1);
  const o = Math.acos(d);
  if (o < 1e-6) return u.slice();
  const s = Math.sin(o), a = Math.sin((1 - t) * o) / s, b = Math.sin(t * o) / s;
  return [u[0]*a + v[0]*b, u[1]*a + v[1]*b, u[2]*a + v[2]*b];
};

/* Geometria fixa, calculada UMA vez e compartilhada pelos três globos.
   A rotação acontece na projeção, então nada disto muda por quadro —
   recalcular 33 portos e 30 rotas a 60 fps seria desperdício puro. */
const GEO = (() => {
  const paralelos = [], meridianos = [], rotas = [], nos = [];
  for (let la = -60; la <= 60; la += 30) {
    const l = [];
    for (let lo = 0; lo <= 360; lo += 5) l.push(toVec([la, lo]));
    paralelos.push(l);
  }
  for (let lo = 0; lo < 360; lo += 30) {
    const l = [];
    for (let la = -90; la <= 90; la += 5) l.push(toVec([la, lo]));
    meridianos.push(l);
  }
  ROTAS.forEach(([a, b]) => {
    const u = toVec(PORTOS[a]), v = toVec(PORTOS[b]), pts = [];
    const N = 44;
    for (let i = 0; i <= N; i++) {
      const m = slerp(u, v, i / N);
      const alt = 1 + 0.15 * Math.sin(Math.PI * (i / N));  // arco acima da superfície
      pts.push([m[0] * alt, m[1] * alt, m[2] * alt]);
    }
    rotas.push(pts);
  });
  Object.keys(PORTOS).forEach(k => nos.push(toVec(PORTOS[k])));
  return { paralelos, meridianos, rotas, nos };
})();

function createGlobe(canvas, opt) {
  if (!canvas) return null;
  const o = Object.assign({ scale: .42, speed: .0007, inclinacao: INCLINACAO_TERRA, elevacao: -0.30, rotas: true, nos: true, cx: .5, cy: .5 }, opt);
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, R = 0, cx = 0, cy = 0;
  let ang = 0, raf = null;
  let ca = 1, sa = 0, ce = 1, se = 0, ci = 1, si = 0;   // senos e cossenos do quadro

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = Math.min(W, H) * o.scale;
    cx = W * o.cx; cy = H * o.cy;
  }

  // Projeção ortográfica em três estágios, nesta ordem:
  //
  //   1. Ry(ang)           o planeta gira em torno do PRÓPRIO eixo
  //   2. Rx(elevacao)      a câmera sobe um pouco acima do plano do equador,
  //                        o que dá aos paralelos a curva de elipse
  //   3. Rz(inclinacao)    os 23,5° do eixo terrestre, no PLANO DA TELA
  //
  // O estágio 3 vem por último de propósito: sendo uma rotação no próprio
  // plano da tela, nada depois dele altera o ângulo, e a inclinação desenhada
  // é exatamente a pedida.
  //
  // Inclinar em X — como estava antes — não produzia inclinação nenhuma: o
  // eixo Y é invariante ao giro em Y, e o giro em X preserva x = 0, então os
  // dois polos caíam na mesma vertical e o eixo saía reto na tela.
  //
  // Os senos e cossenos vêm prontos do quadro — ver frame().
  function proj(v) {
    const x1 = v[0] * ca - v[2] * sa;           // giro do planeta
    const z1 = v[0] * sa + v[2] * ca;
    const y2 = v[1] * ce - z1 * se;             // elevação da câmera
    const z2 = v[1] * se + z1 * ce;
    return {
      x: cx + (x1 * ci - y2 * si) * R,          // inclinação do eixo
      y: cy - (x1 * si + y2 * ci) * R,
      z: z2
    };
  }

  function traco(linhas, cor) {
    ctx.strokeStyle = cor;
    linhas.forEach(pts => {
      ctx.beginPath();
      let caneta = false;
      for (let i = 0; i < pts.length; i++) {
        const q = proj(pts[i]);
        if (q.z <= 0) { caneta = false; continue; }
        caneta ? ctx.lineTo(q.x, q.y) : (ctx.moveTo(q.x, q.y), caneta = true);
      }
      ctx.stroke();
    });
  }

  function desenharRotas(t) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(63,178,224,.50)';
    GEO.rotas.forEach(pts => {
      ctx.beginPath();
      let caneta = false;
      for (let i = 0; i < pts.length; i++) {
        const q = proj(pts[i]);
        if (q.z < -0.2) { caneta = false; continue; }
        caneta ? ctx.lineTo(q.x, q.y) : (ctx.moveTo(q.x, q.y), caneta = true);
      }
      ctx.stroke();
    });
    // Pulsos: só em parte das rotas, senão a tela vira pisca-pisca.
    for (let i = 0; i < GEO.rotas.length; i += 2) {
      const pts = GEO.rotas[i];
      const k = (t * 0.00013 + i * 0.11) % 1;
      const v = pts[Math.floor(k * (pts.length - 1))];
      if (!v) continue;
      const q = proj(v);
      if (q.z < -0.05) continue;
      const x = q.x, y = q.y;
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(63,178,224,.95)'; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(63,178,224,.18)'; ctx.fill();
    }
  }

  function desenharNos(t) {
    GEO.nos.forEach((v, i) => {
      const q = proj(v);
      if (q.z <= 0) return;
      const x = q.x, y = q.y;
      const pulso = .5 + .5 * Math.sin(t * .0012 + i * .7);
      ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(237,242,246,.9)'; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 3.4 + pulso * 4.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(63,178,224,' + (.26 - pulso * .19) + ')';
      ctx.lineWidth = 1; ctx.stroke();
    });
  }

  function frame(t) {
    ca = Math.cos(ang);          sa = Math.sin(ang);
    ce = Math.cos(o.elevacao);   se = Math.sin(o.elevacao);
    ci = Math.cos(o.inclinacao); si = Math.sin(o.inclinacao);

    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    traco(GEO.paralelos,  'rgba(126,150,172,.46)');
    traco(GEO.meridianos, 'rgba(126,150,172,.32)');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(63,178,224,.58)'; ctx.stroke();

    if (o.rotas) desenharRotas(t);
    if (o.nos) desenharNos(t);

    if (!reduced) ang += o.speed * 16;
    raf = requestAnimationFrame(frame);
  }

  resize();
  addEventListener('resize', resize, { passive: true });

  // Só anima enquanto estiver na viewport — três canvas rodando à toa
  // gastam bateria sem nenhum ganho visual.
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !raf) raf = requestAnimationFrame(frame);
    if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
  }), { threshold: 0 }).observe(canvas);

  if (reduced) { frame(0); cancelAnimationFrame(raf); raf = null; }
  return { resize };
}

  window.ACELERO_GLOBO = { criar: createGlobe, INCLINACAO_TERRA: INCLINACAO_TERRA };
})();
