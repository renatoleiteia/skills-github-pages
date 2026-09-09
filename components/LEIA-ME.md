# components/ — a fonte do site

O site é HTML, CSS e JavaScript puros. Sem framework, sem empacotador, sem
`npm install`. Ele abre com duplo clique e funciona sem internet.

## Como está organizado

```
index.html                  a página
styles.css                  ← MONTADO. não edite
scripts.js                  ← MONTADO. não edite
components/
  styles/                   as partes do CSS, uma por assunto
  scripts/                  os módulos de JavaScript
assets/
  img/                      fotos (.jpg e .webp)
  fonts/                    Archivo e IBM Plex, servidas daqui
tools/montar.py             junta components/ em styles.css e scripts.js
versao-1/                   o site anterior, congelado
```

**`styles.css` e `scripts.js` são gerados.** Edite em `components/` e rode:

```
python3 tools/montar.py
```

Por que juntar em vez de linkar cada parte: sem empacotador, cada `<link>` e
cada `<script>` é uma requisição a mais, e o CSS bloqueia a pintura da página.
Um arquivo de cada carrega mais rápido. Os montados ficam versionados, então
rodar o script só é necessário depois de mexer em `components/` — nunca para
usar o site.

A ordem de junção está no topo de `tools/montar.py` e **importa**: os tokens
antes de quem os usa, `movimento` e `microinteracoes` depois da base porque
ajustam o que já foi declarado, e `inicio.js` por último porque chama todos os
outros.

## Como acrescentar coisas

**Uma seção nova**
1. Escreva o bloco em `index.html` seguindo o padrão: `<section class="bloco"
   id="…">` com um `<div class="wrap">` dentro e o cabeçalho `.cab`.
2. Marque o que deve entrar por rolagem com `data-ap` (ou `data-ap="esq"`,
   `"dir"`, `"zoom"`). Para listas, `data-ap-fila` no contêiner — os filhos
   ganham o atraso sozinhos.
3. Crie `components/styles/nome.css` e acrescente `'nome'` à lista `ESTILOS`.
4. Rode o montador.

**Um carrossel novo**

```html
<div class="carrossel" data-carrossel data-ap>
  <div class="carrossel__topo">
    <h3 class="carrossel__t">Título</h3>
    <div class="carrossel__nav">
      <button type="button" data-ant aria-label="Anterior">…</button>
      <button type="button" data-prox aria-label="Próximo">…</button>
    </div>
  </div>
  <div class="carrossel__vp" data-vp id="meuCarrossel" aria-label="Descrição">
    <article>…</article>
    <article>…</article>
  </div>
  <div class="carrossel__pts" data-pts></div>
</div>
```

O JavaScript encontra sozinho pelo `data-carrossel`. Se tudo couber na tela,
as setas e os pontos somem — controle que não anda confunde.

**Um idioma novo**
1. Duplique um bloco em `components/scripts/dados-idiomas.js` com o código do
   idioma (`fr`, por exemplo) e traduza as 208 chaves.
2. Acrescente o botão em `index.html`, dentro de `#idiomaL`.
3. Rode o montador. O português continua morando no HTML: nada a traduzir lá.

**Trocar para onde o formulário envia**

Em `components/scripts/formulario.js`, duas constantes no topo da função:
`EMAIL_DESTINO` e `ENVIO_URL`. O corpo sai como JSON com as chaves em
português — serve para n8n, Make, Zapier ou uma rota própria.

## Regras da casa

- **Movimento serve à leitura.** Deslocamento curto, meio segundo, uma vez só.
  Nada anda sozinho; carrossel automático rouba a leitura de quem parou para
  ler.
- **Só `opacity` e `transform` são animados** — são as duas propriedades que o
  navegador resolve na GPU sem recalcular layout.
- **`prefers-reduced-motion` desliga tudo.** Toda regra de movimento tem a
  contrapartida no fim do arquivo.
- **Rolagem é do navegador.** Só o clique em âncora é suavizado, com
  `scrollTo({behavior:'smooth'})` nativo.
- **Sem CDN.** Fonte e biblioteca moram no repositório; o site tem de abrir
  offline.

## Conteúdo que espera preenchimento

Duas estruturas estão prontas e **não aparecem na página** até serem
preenchidas. É de propósito: um site no ar não mostra "Nome do Especialista"
com foto cinza. Melhor não ter a seção do que ter uma que anuncia que ninguém
a preencheu.

### Quem atende (seção 01)

No gerador, a lista `EQUIPE`. Cada pessoa: `(id, arquivo da foto, nome)`.
O cargo e a linha de trajetória vêm das chaves `eq.<id>.cargo` e `eq.<id>.bio`
— em `chaves.json` para o português, em `dados-idiomas.js` para inglês e
espanhol.

A foto entra em 4:5, cortada a partir do topo, em preto e branco, e ganha cor
quando o mouse passa. O que fotografar está em `FOTOS.md`.

### Um caso real (seção 04)

No gerador, o dicionário `CASO`. Campos: setor, o que travava, o que foi feito,
o número com unidade, e a chancela.

**A chancela não é enfeite.** É a linha que diz que a operação foi encerrada,
que o número foi conferido com o cliente e que a publicação foi autorizada por
escrito. Sem as três coisas, o caso não sobe — número sem procedência vale
menos que espaço vazio, porque a primeira pessoa que perguntar "de onde saiu?"
não terá resposta.
