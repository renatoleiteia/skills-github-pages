# Como publicar o site na HostGator

O site é HTML, CSS, JS e uma página PHP. Não tem build, não tem `npm install`:
subir é copiar arquivos.

## O que sobe

Tudo isto, para dentro de `public_html` no cPanel, mantendo as pastas:

```
index.html
politica-privacidade.html
webmail.html
enviar.php
styles.css
scripts.js
components/          (styles/ e scripts/)
assets/              (img/ e fonts/)
```

**Não sobe:** `versao-1/`, `tools/`, `README.md`, `_config.yml`, `index.md`.
São arquivos de trabalho e do GitHub — no servidor só ocupam espaço.

## Passo a passo

1. Baixe o repositório em ZIP e descompacte.
2. cPanel → **Gerenciador de Arquivos** → entre em `public_html`.
3. Apague o `index.html` de boas-vindas da HostGator, se houver.
4. **Carregar** → suba o ZIP e use **Extrair** ali mesmo. É muito mais rápido
   e confiável do que arrastar centenas de arquivos por FTP.
5. Confira que o `index.html` ficou na raiz de `public_html`, e não dentro de
   uma subpasta com o nome do repositório.

## Depois de subir, teste nesta ordem

| O quê | Como saber que está certo |
|---|---|
| Site no ar | `acelerocomex.com.br` abre a capa |
| HTTPS | cadeado na barra. cPanel → **SSL/TLS Status** → *Run AutoSSL* |
| Formulário | preencha e envie de verdade; o e-mail tem de chegar em `contato@` |
| Webmail | o botão leva a `acelerocomex.com.br/webmail` e abre o Roundcube |
| Política | o link do rodapé abre a página |

## Se o formulário não enviar

Quase sempre é uma destas três, nesta ordem de probabilidade:

1. **`enviar.php` não subiu** ou ficou em outra pasta. Ele precisa estar ao
   lado do `index.html`.
2. **O remetente não existe.** Em `enviar.php`, `$DE` tem de ser um endereço
   real **do próprio domínio** (`site@acelerocomex.com.br`). Crie a conta em
   cPanel → *Contas de E-mail*. Com remetente de outro domínio, o servidor de
   destino trata como falsificação e a mensagem cai em spam ou é recusada.
3. **A função `mail()` está desligada** no plano. Abre um chamado na HostGator
   pedindo para habilitar, ou troque para envio por SMTP autenticado.

Enquanto o envio falhar, o site não perde o contato: a mensagem de erro passa
a oferecer o mesmo conteúdo como e-mail pronto para a pessoa disparar.

## Imagem pendente

O rodapé espera a foto do polo industrial em:

```
assets/img/polo-industrial-china.jpg
```

Enquanto o arquivo não existir, o JavaScript cai para a foto do contêiner
(`assets/img/conteiner-acelero.jpg`, a mesma da capa) e o rodapé fecha com a
imagem que abre o site — sem ícone de imagem quebrada. Basta subir o arquivo
com esse nome exato para o polo industrial assumir; não há nada a fazer no
código, nem para trocar, nem para voltar atrás.

O único vestígio de espera é um 404 no console do navegador: é a sondagem que
descobre se a foto definitiva já subiu. Ele some assim que o arquivo estiver
no lugar.

Recomendado: no mínimo 1600 px de largura e abaixo de 300 KB. A foto entra
dessaturada e a 17% de opacidade, então detalhe fino se perde — o que importa
é a silhueta.

## Quando mexer no código

`styles.css` e `scripts.js` são **gerados**. Edite em `components/` e rode:

```
python3 tools/montar.py
```

Depois suba os dois arquivos gerados junto com o que você mudou. Detalhes em
`components/LEIA-ME.md`.
