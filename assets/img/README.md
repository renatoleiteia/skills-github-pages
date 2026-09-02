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

## Pendentes — os quatro slots preparados

O `index.html` já tem os quatro slots, com `<picture>` (webp + jpg) e o
tratamento visual pronto. Enquanto o arquivo não existir, o `main.js` sonda a
URL na carga e remove a figura inteira — nada de imagem quebrada nem de espaço
vazio na grade.

| Nome do arquivo | Onde entra | Tratamento |
|---|---|---|
| `transporte.jpg` + `.webp` | Processo, etapa **04 Transporte** | dessaturado, escurecido |
| `entrega.jpg` + `.webp` | Processo, etapa **05 Entrega** | dessaturado, escurecido |
| `prateleiras-estoque.jpg` + `.webp` | Fundo da seção **04 Resultados** | duotone azul + degradê de leitura |
| `risco-operacao.jpg` + `.webp` | Fundo da seção **07 Garantias** | duotone azul + degradê de leitura |

Para gerar os arquivos com os nomes e tamanhos certos, rode
`scripts/preparar_imagens.bat` apontando para a pasta onde você baixou as
fotos — ele renomeia, redimensiona e gera o `.webp` de cada uma.

**Decisão registrada:** a foto do corredor de prateleiras entra **com a logo
ACELERO COMEX** gravada na imagem, conforme pedido do Renato.

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
