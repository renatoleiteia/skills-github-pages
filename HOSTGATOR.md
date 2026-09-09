# O que criar e configurar na HostGator

Lista fechada do que o site precisa do lado do servidor. Nada aqui eu consigo
fazer daqui — tudo depende do painel da hospedagem e do registro.br.

Ordem obrigatória: **domínio → DNS → certificado → e-mails → arquivos →
testes**. Cada item diz onde ele aparece no site, para você saber o que quebra
se ficar de fora. Pular a ordem faz o passo seguinte falhar por um motivo que
não tem a ver com ele — é o que gera chamado desnecessário.

---

## 1. Domínio: registrado no registro.br, servido pela HostGator

O domínio já está registrado. Falta ligar as duas pontas — e a ordem importa:
**primeiro a HostGator aceita o domínio, depois o registro.br aponta para ela.**
Invertido, quem visitar cai numa página de erro da hospedagem durante horas.

### 1.1 — Descobrir os seus servidores DNS

Não use os nomes que aparecem em tutorial da internet: eles mudam por plano e
por servidor. Os seus estão em dois lugares:

- **cPanel → barra lateral direita → *Informações Gerais* → *Servidores de
  Nomes***
- ou no **e-mail de boas-vindas** da HostGator, no bloco "Nameservers"

São dois (às vezes quatro) endereços no formato `ns1.algumacoisa.com.br` e
`ns2.algumacoisa.com.br`. Anote os dois, exatamente como aparecem.

### 1.2 — Adicionar o domínio na HostGator

Depende de este ser o **primeiro** site do plano ou mais um:

**Se for o primeiro site do plano** (o normal), o domínio principal já foi
definido na contratação. Confira em **cPanel → Domínios**: se
`acelerocomex.com.br` já estiver listado como principal, este passo está feito
— pule para o 1.3.

**Se o plano já tem outro site**, adicione como domínio adicional:

1. cPanel → **Domínios** → **Criar um Domínio**
2. Em *Domínio*, digite `acelerocomex.com.br`
3. Deixe marcado *Compartilhar caminho do documento* **desmarcado** — você quer
   uma pasta própria
4. Em *Raiz do documento*, aceite o sugerido (`public_html/acelerocomex.com.br`)
   e **anote esse caminho**: é para lá que os arquivos vão, não para
   `public_html` direto
5. Enviar

> **Plano compartilhado só permite um domínio em alguns casos.** Se o botão de
> criar domínio não existir ou der erro de limite, o plano é de site único —
> aí é abrir chamado para migrar o domínio principal ou subir de plano.

### 1.3 — Apontar o registro.br para a HostGator

1. Entre em **registro.br** com sua conta
2. Clique no domínio `acelerocomex.com.br`
3. Vá em **DNS** → **Alterar servidores DNS** (ou *Usar servidores DNS de
   terceiros*)
4. Apague o que estiver lá e coloque os dois endereços do passo 1.1
5. Salvar

O registro.br leva de **30 minutos a 24 horas** para espalhar a mudança pela
internet. Não é defeito e não adianta repetir o procedimento — só espera.

### 1.4 — Conferir se chegou

No computador, abra o Prompt de Comando (Windows) ou o Terminal (Mac) e digite:

```
nslookup -type=ns acelerocomex.com.br
```

Se responder com os endereços da HostGator, a mudança propagou. Se ainda
mostrar os do registro.br, espere mais.

Alternativa sem terminal: **dnschecker.org**, digite o domínio e escolha `NS`.
Ele mostra o que cada país está enxergando.

### 1.5 — Certificado (só depois que o DNS propagar)

| # | O quê | Onde | Se faltar |
|---|---|---|---|
| 1.5 | Rodar o **AutoSSL** | cPanel → *SSL/TLS Status* → *Run AutoSSL* | Sem cadeado. O navegador marca "não seguro" e o webmail avisa |
| 1.6 | Forçar HTTPS | cPanel → *Domínios* → *Force HTTPS Redirect* | Metade das visitas fica em `http://`, sem cifra |

> **O AutoSSL falha se rodar antes da propagação.** Ele precisa provar que o
> domínio aponta para aquele servidor. Rodou e deu erro? Espere o DNS e rode de
> novo — não é preciso abrir chamado.

> **Só depois do cadeado funcionando**, descomente a linha de HSTS no
> `.htaccess`. Ela obriga https por um ano; se o certificado falhar depois
> disso, o site fica inacessível pelo mesmo período.

---

## 2. Contas de e-mail

cPanel → **Contas de E-mail** → *Criar*. Três contas, e cada uma tem um motivo:

| # | Conta | Para quê | Onde aparece |
|---|---|---|---|
| 2.1 | `contato@acelerocomex.com.br` | **Recebe os leads do formulário.** É a caixa que alguém precisa abrir todo dia | Rodapé, canais de contato, `enviar.php` |
| 2.2 | `site@acelerocomex.com.br` | **Remetente** do formulário. Ninguém precisa ler; ela só existe para o e-mail sair com endereço do próprio domínio | `enviar.php`, campo `$DE` |
| 2.3 | `privacidade@acelerocomex.com.br` | **Canal do titular de dados (LGPD).** A política promete resposta em até 15 dias por esse endereço | Política de Privacidade, seções 01, 08 e rodapé |

> **Por que a conta 2.2 existe.** Se o formulário enviar com remetente de outro
> domínio (um `@gmail`, por exemplo), o servidor de destino trata como
> falsificação: a mensagem cai em spam ou é recusada. O remetente precisa ser
> do domínio que está enviando.

> **A conta 2.3 não é enfeite.** A política afirma que ela existe e é lida. Se
> ninguém abrir essa caixa, o documento promete algo que a empresa não cumpre —
> e isso é exatamente o tipo de falha que a ANPD cobra.

### Ainda no e-mail: SPF e DKIM

cPanel → **Autenticação de E-mail** → ative **SPF** e **DKIM**.

São dois registros que dizem aos outros servidores "este servidor tem
autorização para enviar em nome deste domínio". Sem eles, mesmo com o
remetente certo, boa parte das mensagens do formulário vai para a caixa de
spam de quem recebe.

---

## 3. Arquivos e PHP

| # | O quê | Onde | Observação |
|---|---|---|---|
| 3.1 | Subir os arquivos para `public_html` | cPanel → *Gerenciador de Arquivos* | Passo a passo em `PUBLICAR.md` |
| 3.2 | Conferir a versão do PHP | cPanel → *Select PHP Version* | O `enviar.php` roda de PHP 5.6 em diante, mas prefira 8.x — é o que ainda recebe correção de segurança |
| 3.3 | Confirmar que a função `mail()` está habilitada | teste enviando o formulário | Se estiver desligada no plano, abra chamado pedindo a liberação |

---

## 4. Webmail

Nada a criar: o cPanel já serve o Roundcube. Só confirme **qual endereço
responde**, porque varia com a configuração do plano:

- `acelerocomex.com.br/webmail` ← é o que está no código hoje
- `acelerocomex.com.br:2096`
- `webmail.acelerocomex.com.br`

Abra os três no navegador. Se o primeiro não cair no Roundcube, me diga qual
caiu: é uma linha em `components/scripts/webmail.js`.

---

## 5. Testes depois de tudo pronto

Nesta ordem, porque cada um depende do anterior:

1. `acelerocomex.com.br` abre a capa do site
2. Cadeado na barra, e `http://` redireciona para `https://`
3. **Envie o formulário de verdade** e confira se o e-mail chegou em `contato@`
4. Confira se a mensagem caiu na **caixa de entrada**, não no spam (se caiu no
   spam, o item de SPF/DKIM ficou pendente)
5. O botão Webmail abre o Roundcube
6. O link da Política de Privacidade abre a página

---

## O que NÃO precisa

- **Banco de dados.** O site não usa.
- **WordPress ou instalador.** É HTML puro; instalar um CMS por cima só
  atrapalharia.
- **Node, npm ou build.** Não existe etapa de compilação no servidor.
- **Certificado pago.** O AutoSSL da HostGator (Let's Encrypt) resolve.
