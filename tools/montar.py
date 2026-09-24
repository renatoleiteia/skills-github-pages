#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Junta os arquivos de components/ em styles.css e scripts.js.

Por que juntar em vez de linkar cada parte: sem empacotador, cada <link> e cada
<script> é uma requisição a mais, e o CSS bloqueia a pintura. Um arquivo de
cada carrega mais rápido — e o site continua abrindo por duplo clique, offline,
sem instalar nada.

Os arquivos montados ficam versionados no repositório: rodar isto é necessário
só depois de editar algo em components/, nunca para usar o site.

    python3 tools/montar.py
"""
import io, os, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# A ordem importa: tokens antes de quem os usa; movimento e microinterações
# depois da base, porque ajustam o que já foi declarado.
ESTILOS = ['fontes', 'base', 'tipografia', 'cabecalho', 'botoes', 'capa', 'secoes',
           'cases', 'frentes', 'carrossel', 'proposito', 'oferta', 'faq', 'contato',
           'rodape', 'movimento', 'microinteracoes', 'responsivo']

# navegacao primeiro (posiciona), inicio por último (chama todo mundo).
SCRIPTS = ['dados-paises', 'dados-idiomas', 'navegacao', 'revelar', 'carrossel', 'formulario', 'idiomas', 'inicio']

CABECALHO = ('/* ATENÇÃO: arquivo montado. Não edite aqui — a fonte é\n'
             '   components/%s/, e a junção é feita por tools/montar.py. */\n\n')

def juntar(pasta, nomes, ext, destino):
    partes = [CABECALHO % pasta]
    for n in nomes:
        caminho = os.path.join(RAIZ, 'components', pasta, n + '.' + ext)
        if not os.path.exists(caminho):
            sys.exit('faltando: ' + caminho)
        partes.append(io.open(caminho, encoding='utf-8').read().rstrip() + '\n\n')
    texto = ''.join(partes)
    io.open(os.path.join(RAIZ, destino), 'w', encoding='utf-8').write(texto)
    print('%-12s %5d linhas  %6.1f KB' % (destino, texto.count('\n'), len(texto.encode()) / 1024))

# As páginas irmãs têm CSS e JS próprios, que não entram no pacote da home:
# ninguém que abre a capa precisa do código do webmail. Mas elas precisavam
# virar arquivo de raiz do mesmo jeito — apontar direto para components/ deixou
# as duas SEM estilo e SEM JavaScript no servidor, porque components/ não é
# publicado (é código-fonte) e o .htaccess devolve 404 para essa pasta.
PAGINAS = {
    'webmail': (['webmail'], ['webmail']),
    'legal':   (['legal'],   ['legal']),
}

juntar('styles', ESTILOS, 'css', 'styles.css')
juntar('scripts', SCRIPTS, 'js', 'scripts.js')
for nome, (css, js) in PAGINAS.items():
    juntar('styles', css, 'css', 'pagina-%s.css' % nome)
    juntar('scripts', js, 'js', 'pagina-%s.js' % nome)
