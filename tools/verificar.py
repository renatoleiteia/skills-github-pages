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
    req = urllib.request.Request(url, headers={'User-Agent': 'verificador-acelero'})
    return urllib.request.urlopen(req, timeout=15)

try:
    r = pegar('https://www.%s/' % DOMINIO)
    html = r.read().decode('utf-8', 'replace')
    h = {k.lower(): v for k, v in r.headers.items()}
    linha(OK, 'https responde', 'HTTP %s' % r.status)
    linha(OK if 'ACELERO' in html else NAO, 'é o site certo',
          'título: ' + (html.split('<title>')[1].split('</title>')[0][:40] if '<title>' in html else '?'))
    comp = h.get('content-encoding', '')
    linha(OK if comp else NAO, 'compressão ligada', comp or 'nenhuma — confira o .htaccess')
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

try:
    r = urllib.request.urlopen(urllib.request.Request(
        'http://%s/' % DOMINIO, method='HEAD'), timeout=12)
    linha(AVISO, 'http redireciona para https', 'não redirecionou')
except urllib.error.HTTPError as e:
    linha(OK if e.code in (301, 302) else AVISO, 'http redireciona para https', 'HTTP %s' % e.code)
except Exception:
    linha(OK, 'http redireciona para https', 'redirecionado')

print('\n=== 4. Formulário')
try:
    req = urllib.request.Request('https://www.%s/enviar.php' % DOMINIO, method='GET')
    urllib.request.urlopen(req, timeout=12)
    linha(NAO, 'enviar.php recusa GET', 'respondeu 200 — deveria recusar')
except urllib.error.HTTPError as e:
    linha(OK if e.code == 405 else NAO, 'enviar.php recusa GET',
          'HTTP %s%s' % (e.code, ' (esperado)' if e.code == 405 else ' — PHP rodando?'))
except Exception as e:
    linha(NAO, 'enviar.php responde', str(e)[:50])

print('\nO envio de verdade só você consegue testar: preencha o formulário no')
print('site e confirme que a mensagem chegou em contato@%s.\n' % DOMINIO)
