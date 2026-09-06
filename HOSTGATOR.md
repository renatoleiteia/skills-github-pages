# O que criar e configurar na HostGator

Lista fechada do que o site precisa do lado do servidor. Nada aqui eu consigo
fazer daqui — tudo depende do painel da hospedagem e do registro.br.

Ordem sugerida: **domínio → e-mails → arquivos → testes**. Cada item diz onde
ele aparece no site, para você saber o que quebra se ficar de fora.

---

## 1. Domínio e certificado

| # | O quê | Onde | Se faltar |
|---|---|---|---|
| 1.1 | Apontar `acelerocomex.com.br` para os servidores DNS da HostGator | registro.br → *Alterar servidores DNS* | Nada funciona: o domínio não chega no site |
| 1.2 | Rodar o **AutoSSL** | cPanel → *SSL/TLS Status* → *Run AutoSSL* | Sem cadeado. O navegador marca "não seguro" e o webmail avisa |
| 1.3 | Forçar HTTPS | cPanel → *Domínios* → *Force HTTPS Redirect* | Metade das visitas fica em `http://`, sem cifra |

A propagação do DNS leva de minutos a algumas horas. Enquanto isso, tudo o que
depende do domínio parece quebrado — é normal, não é defeito do site.

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
