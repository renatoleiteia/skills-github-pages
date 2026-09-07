# -*- coding: utf-8 -*-
"""Monta a pasta `publicar/` com exatamente o que sobe para a HostGator.

Existe porque a raiz do repositório tem código-fonte, documentação e a versão
antiga do site. Subir tudo funciona, mas deixa no servidor arquivos que ninguém
deveria conseguir baixar — e um `index.md` do GitHub Pages que diz "Welcome to
my blog!". Aqui a escolha é explícita: o que não está na lista não sobe.
"""
import os, shutil, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(RAIZ)
DESTINO = 'publicar'

ARQUIVOS = [
    'index.html',
    'politica-privacidade.html',
    'webmail.html',
    'styles.css',
    'scripts.js',
    'enviar.php',
    '.htaccess',
    'robots.txt',
    'sitemap.xml',
]
PASTAS = ['assets/fonts', 'assets/img']

# Originais do cliente ficam no repositório, não no servidor: são arquivos
# grandes que nenhuma página referencia.
IGNORAR_EM = {'assets/img': ['originais']}

if os.path.isdir(DESTINO):
    shutil.rmtree(DESTINO)

faltando = [a for a in ARQUIVOS if not os.path.exists(a)]
if faltando:
    sys.exit('ERRO: arquivo esperado não existe: ' + ', '.join(faltando))

total = 0
for a in ARQUIVOS:
    os.makedirs(os.path.join(DESTINO, os.path.dirname(a)) or DESTINO, exist_ok=True)
    shutil.copy2(a, os.path.join(DESTINO, a))
    total += os.path.getsize(a)

for p in PASTAS:
    for raiz, dirs, arqs in os.walk(p):
        dirs[:] = [d for d in dirs if d not in IGNORAR_EM.get(p, [])]
        for nome in arqs:
            if nome.startswith('.') or nome.endswith('.md') or nome.endswith('.txt'):
                continue
            org = os.path.join(raiz, nome)
            dst = os.path.join(DESTINO, org)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(org, dst)
            total += os.path.getsize(org)

n = sum(len(a) for _, _, a in os.walk(DESTINO))
print('publicar/: %d arquivos, %.1f MB' % (n, total / 1048576))
print('\nSobe para public_html exatamente isto:')
for raiz, dirs, arqs in sorted(os.walk(DESTINO)):
    rel = os.path.relpath(raiz, DESTINO)
    if arqs:
        print('  %s/' % ('.' if rel == '.' else rel))
        for a in sorted(arqs):
            print('      %s' % a)
