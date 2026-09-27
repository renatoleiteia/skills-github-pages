# -*- coding: utf-8 -*-
"""Confere, de fora, se a publicação ficou de pé.

Roda de qualquer lugar com internet e não pede senha de nada: tudo o que ele
olha é público. Serve para responder "já subiu?" sem depender de abrir o
cPanel, e para não confundir "ainda não propagou" com "está quebrado" — são
coisas diferentes e o remédio de cada uma é outro.

    python3 tools/verificar.py
"""
import json, socket, sys, urllib.request, urllib.error

DOMINIO = 'acelerocomex.com.br'
NS_ESPERADO = 'hostgator'
OK, NAO, AVISO = 'OK   ', 'FALTA', 'AVISO'

def doh(nome, tipo, srv='https://dns.google/resolve'):
    try:
        req = urllib.request.Request('%s?name=%s&type=%s' % (srv, nome, tipo),
                                     headers={'accept': 'application/dns-json'})
        r = json.load(urllib.request.urlopen(req, timeout=12))
        return [a.get('data', '') for a in r.get('Answer', [])]
    except Exception:
        return []

def linha(estado, titulo, detalhe=''):
    print('  [%s] %-34s %s' % (estado, titulo, detalhe))

print('\n=== 1. DNS')
ns = doh(DOMINIO, 'NS')
delegado = any(NS_ESPERADO in x for x in ns)
linha(OK if delegado else NAO, 'delegação na hospedagem',
      ', '.join(ns) or 'sem resposta')
if not delegado:
    print('\n  A delegação ainda não virou. Todo o resto depende dela —')
    print('  não adianta investigar mais nada até esta linha ficar OK.')
    sys.exit(0)

a  = doh(DOMINIO, 'A')
w  = doh('www.' + DOMINIO, 'A')
linha(OK if a else NAO, 'endereço do site (A)', ', '.join(a) or 'vazio')
linha(OK if w else AVISO, 'www', ', '.join(w) or 'vazio')

print('\n=== 2. E-mail')
mx = [x for x in doh(DOMINIO, 'MX') if x.strip() not in ('0 .', '')]
linha(OK if mx else NAO, 'servidor de e-mail (MX)', ', '.join(mx) or 'vazio')

txt = doh(DOMINIO, 'TXT')
spf = [t for t in txt if 'v=spf1' in t]
linha(OK if spf else NAO, 'SPF', (spf[0][:64] if spf else 'não encontrado'))

dkim = doh('default._domainkey.' + DOMINIO, 'TXT')
linha(OK if dkim else NAO, 'DKIM (seletor default)',
      'chave publicada' if dkim else 'não encontrado')

dmarc = doh('_dmarc.' + DOMINIO, 'TXT')
linha(OK if dmarc else AVISO, 'DMARC',
      (dmarc[0][:56] if dmarc else 'opcional, mas recomendado'))

print('\n=== 3. Site no ar')
def pegar(url):
    # Accept-Encoding é obrigatório aqui: sem ele o servidor devolve sem
    # compactar — e o verificador acusava "compressão desligada" num servidor
    # que comprime perfeitamente. O teste tem que pedir o que um navegador pede.
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (verificador ACELERO)',
        'Accept-Encoding': 'gzip, deflate',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8'})
    return urllib.request.urlopen(req, timeout=20)

try:
    r = pegar('https://www.%s/' % DOMINIO)
    bruto = r.read()
    if r.headers.get('Content-Encoding') == 'gzip':
        import gzip as _gz
        html = _gz.decompress(bruto).decode('utf-8', 'replace')
        linha(OK, 'compressão', 'gzip — %.0f KB viram %.0f KB (%.0f%% a menos)' %
              (len(html.encode())/1024, len(bruto)/1024, 100 - 100*len(bruto)/len(html.encode())))
    else:
        html = bruto.decode('utf-8', 'replace')
    h = {k.lower(): v for k, v in r.headers.items()}
    linha(OK, 'https responde', 'HTTP %s' % r.status)
    linha(OK if 'ACELERO' in html else NAO, 'é o site certo',
          'título: ' + (html.split('<title>')[1].split('</title>')[0][:40] if '<title>' in html else '?'))
    if not h.get('content-encoding'):
        linha(NAO, 'compressão', 'nenhuma — mod_deflate desligado no plano?')
    linha(OK if h.get('x-content-type-options') else NAO, 'cabeçalhos de segurança',
          'nosniff presente' if h.get('x-content-type-options') else 'ausentes — o .htaccess subiu?')
    linha(OK if h.get('strict-transport-security') else AVISO, 'HSTS',
          h.get('strict-transport-security', 'desligado (ative só após o cadeado)')[:40])
except urllib.error.HTTPError as e:
    linha(NAO, 'https responde', 'HTTP %s' % e.code)
except Exception as e:
    linha(NAO, 'https responde', str(e)[:56])

for caminho in ('robots.txt', 'sitemap.xml', 'politica-privacidade.html'):
    try:
        r = pegar('https://www.%s/%s' % (DOMINIO, caminho))
        linha(OK, caminho, 'HTTP %s' % r.status)
    except Exception as e:
        linha(NAO, caminho, str(e)[:40])

class _NaoSeguir(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k): return None
_op = urllib.request.build_opener(_NaoSeguir)

def salto(url):
    # Sem desligar o "seguir redirecionamento" a checagem mente: o cliente segue
    # o 301 sozinho e a função só vê o 200 do destino.
    try:
        # UA completo: com um User-Agent curto a hospedagem responde 406 (o
        # desafio anti-robô) e a checagem do redirecionamento não acontece.
        r = _op.open(urllib.request.Request(url, headers={'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
            '(KHTML, like Gecko) Chrome/140.0 Safari/537.36'}), timeout=15)
        return r.status, None
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get('Location')
    except Exception as e:
        return None, str(e)[:40]

for origem, esperado in ((('http://%s/' % DOMINIO), 'https'),
                         (('https://%s/' % DOMINIO), 'www.')):
    cod, destino = salto(origem)
    ok = cod in (301, 302) and destino and esperado in destino
    linha(OK if ok else AVISO, 'redireciona: ' + origem.replace('://', '//')[:34],
          ('%s -> %s' % (cod, destino)) if destino else str(cod))

print('\n=== 4. Formulário')
try:
    req = urllib.request.Request('https://www.%s/enviar.php' % DOMINIO, method='GET',
                                 headers={'User-Agent': 'Mozilla/5.0 (verificador ACELERO)'})
    urllib.request.urlopen(req, timeout=15)
    linha(NAO, 'enviar.php recusa GET', 'respondeu 200 — deveria recusar')
except urllib.error.HTTPError as e:
    if e.code == 405:
        linha(OK, 'enviar.php recusa GET', 'HTTP 405, como deve')
    elif e.code in (406, 409):
        # A HostGator põe um desafio de cookie na frente de quem não parece
        # navegador. Não dá para concluir nada sobre o PHP a partir daqui — e
        # acusar defeito seria pior que não medir.
        linha(AVISO, 'enviar.php', 'HTTP %s — desafio anti-robô da hospedagem, '
              'não dá para testar de fora' % e.code)
    else:
        linha(NAO, 'enviar.php recusa GET', 'HTTP %s — PHP rodando?' % e.code)
except Exception as e:
    linha(NAO, 'enviar.php responde', str(e)[:50])

print('\nO envio de verdade só você consegue testar: preencha o formulário no')
print('site e confirme que a mensagem chegou em contato@%s.\n' % DOMINIO)
