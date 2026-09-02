# /assets/img — imagens do site

## Em uso (fornecidas pelo cliente, já otimizadas)

| Arquivo | Onde aparece | Origem |
|---|---|---|
| `conteiner-acelero.jpg` / `.webp` (2000px) | Faixa full-bleed da seção **Sobre** | Fornecida — contêiner com o nome ACELERO COMEX estampado |
| `conteiner-acelero-1200w.jpg` / `.webp` | Mesma imagem, telas menores e `og:image` | idem |
| `linha-producao.jpg` / `.webp` (1150px) | Processo, etapa **01 — Planejamento** | Fornecida — corredor de linha de produção |
| `inspecao-fornecedor.jpg` / `.webp` (1100px) | Processo, etapa **02 — Produção** | Fornecida — equipe conferindo desenhos e amostras |

Cada imagem tem versão `.webp` (30–45% menor) servida via `<picture>`, com o
`.jpg` como reserva. Nenhuma passa de 280 KB.

## Em uso — as quatro que faltavam (commit e6a4878)

| Arquivo | Onde entra | Origem |
|---|---|---|
| `transporte.jpg` + `.webp` (1060px) | Processo, etapa **04 Transporte** | porto visto de cima, navio saindo |
| `entrega.jpg` + `.webp` (474px) | Processo, etapa **05 Entrega** | paletes filmados no galpão |
| `prateleiras-estoque.jpg` + `.webp` (1488px) | Fundo da seção **04 Resultados** | corredor de prateleiras, duotone azul |
| `risco-operacao.jpg` + `.webp` (1052px) | Fundo da seção **07 Garantias** | porto ao entardecer, duotone azul |

A foto do corredor entra **com a logo ACELERO COMEX** gravada, conforme
pedido do Renato. Sob o duotone ela lê como marca d'água discreta no piso.

**Atenção à resolução de `entrega.jpg`:** o original tem 474px de largura e o
slot exibe 476px. Em tela retina isso aparece com metade da nitidez das
outras. Se houver um original maior (a partir de 1000px), vale substituir.

## Guardados em `originais/`

Os arquivos enviados que não foram usados diretamente, mantidos para consulta:
`PRATELEIRAS.jpg` e `risco.jpg` (fontes das duas placas, antes do tratamento),
`contanner.jpg` e `navio com contaner.jpg` (portos, reserva), `inspeção.jpg`
(mesma cena já em uso, em resolução menor), `acelero comex.jpg` e
`acelero_comex-removebg-preview.png` (arte da logo, ainda não aplicada).

## Não incluídas

A 4ª imagem enviada (paleteira carregando contêiner ao pôr do sol) **não foi
incluída**: ela traz um selo de coroa de banco de imagens no canto inferior
esquerdo, o que indica um arquivo de pré-visualização, não licenciado. Assim
que você tiver o download licenciado, salve como `carga-conteiner.jpg` e me
avise — ela cai bem na seção de Cases.

## Se for buscar mais imagens

O site é escuro e as fotos recebem `saturate(.72) brightness(.86)`. Procure
imagens com sombra profunda e um ponto de luz; foto de fundo branco estourado
briga com o layout.

Buscas que funcionam (em inglês, que é como esses acervos indexam):

| Slot | Busca | O que escolher |
|---|---|---|
| Hero (reserva do vídeo) | `container ship aerial dusk` | Plano aberto, navio em movimento, céu com gradiente |
| Cases — logística | `warehouse forklift container loading` | Movimento real, sem pose de banco de imagem |
| Cases — e-commerce | `distribution center conveyor parcels` | Profundidade, linhas de fuga |
| Cases — agro | `grain export terminal loading` | Escala industrial |
| Aduana | `customs inspection cargo clipboard` | Pessoa em ação, não olhando para a câmera |
| Equipe | *fotografia própria* | Nenhum banco resolve: é o seu time, no seu escritório |

Acervos com licença comercial gratuita: **Unsplash**, **Pexels**,
**Openverse**. Evite qualquer arquivo que chegue com marca d'água, selo de
"premium" ou faixa de pré-visualização — isso significa que ele não está
licenciado.
