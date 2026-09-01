# /assets/video — vídeo do site

## Estado atual: vazio, e o site funciona assim

O hero roda um **globo de rotas comerciais desenhado em canvas** (veja
`js/main.js`, módulo 02): uma esfera em arame com os portos reais da operação
e arcos de círculo máximo ligando Santos e Itajaí a Xangai, Shenzhen, Roterdã,
Miami, Istambul, Mumbai, Ho Chi Minh e Cidade do México. É procedural — sem
imagem, sem dado de mapa, sem biblioteca.

## Sobre o vídeo enviado

O arquivo `Vi_deo_navio.mov` é uma **pré-visualização da Adobe Stock com marca
d'água**: o texto "Adobe Stock" atravessa o quadro inteiro, além de um padrão
repetido sobre toda a imagem. Não é possível usá-lo publicado — a marca é uma
medida de licenciamento sobre obra de terceiro, e removê-la não é uma opção.

**Para ativá-lo:** licencie o clipe na Adobe Stock, baixe a versão limpa,
comprima com os comandos abaixo e salve como `navio-embarque.mp4` nesta pasta.
Não é preciso mexer em uma linha de código: `js/main.js` detecta o arquivo,
faz o vídeo entrar em fade sobre o globo e passa a usá-lo como fundo do hero.

## Especificação

- **Duração:** 8 a 15 s, com corte que faça o loop parecer contínuo
- **Resolução:** 1920×1080 (1280×720 basta — o vídeo fica sob um véu escuro)
- **Sem áudio** (roda em `muted`) e **sem texto na imagem** (a headline vai por cima)
- **Peso-alvo:** até 3 MB

```bash
# MP4 leve, sem áudio, 12s
ffmpeg -i original.mov -t 12 -an -vf "scale=1920:-2" \
  -c:v libx264 -crf 28 -preset slow -movflags +faststart navio-embarque.mp4
```

## Alternativa sem custo

**Pexels Videos** e **Coverr** têm filmagem de navio porta-contêineres e
terminal portuário com licença comercial gratuita e sem marca d'água. Buscas
que funcionam: `container ship`, `cargo port crane`, `shipping terminal aerial`.
