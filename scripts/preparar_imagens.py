#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Prepara as fotos do site: renomeia para os nomes que o index.html espera,
redimensiona e gera a versao .webp em assets/img/.

Uso interativo (o normal):
    python scripts/preparar_imagens.py "C:\\Users\\voce\\Downloads\\imagens acelero comex"

Uso direto, quando voce ja sabe qual arquivo vai em qual campo:
    python scripts/preparar_imagens.py PASTA --mapa transporte=foto1.jpg,entrega=foto2.jpg

Pillow e opcional. Sem ela o script apenas copia e renomeia, avisando que a
otimizacao ficou de fora. Com ela, gera .jpg redimensionado + .webp.
"""

import argparse
import os
import shutil
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, "assets", "img")

# nome do campo -> (arquivo final, largura maxima, descricao mostrada ao operador)
CAMPOS = [
    ("transporte",  "transporte.jpg",          1600, "Etapa 04 Transporte — navio/pátio visto de cima"),
    ("entrega",     "entrega.jpg",             1600, "Etapa 05 Entrega — paletes prontos no galpão"),
    ("prateleiras", "prateleiras-estoque.jpg", 2000, "Seção 04 Resultados — corredor de prateleiras (fundo)"),
    ("risco",       "risco-operacao.jpg",      2000, "Seção 07 Garantias — porto ao entardecer (fundo)"),
]

EXTENSOES = (".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff")


def listar_imagens(pasta):
    if not os.path.isdir(pasta):
        sys.exit("Pasta nao encontrada: %s" % pasta)
    achados = [n for n in sorted(os.listdir(pasta))
               if n.lower().endswith(EXTENSOES) and os.path.isfile(os.path.join(pasta, n))]
    if not achados:
        sys.exit("Nenhuma imagem em: %s" % pasta)
    return achados


def perguntar_mapa(pasta, arquivos):
    print("\nImagens encontradas em %s:\n" % pasta)
    for i, nome in enumerate(arquivos, 1):
        kb = os.path.getsize(os.path.join(pasta, nome)) // 1024
        print("  [%d] %s  (%d KB)" % (i, nome, kb))

    mapa = {}
    print("\nPara cada campo, digite o numero da imagem (ENTER pula o campo).\n")
    for campo, final, _larg, descricao in CAMPOS:
        while True:
            resposta = input("  %-12s %s\n               numero: " % (campo, descricao)).strip()
            if resposta == "":
                break
            if resposta.isdigit() and 1 <= int(resposta) <= len(arquivos):
                mapa[campo] = arquivos[int(resposta) - 1]
                break
            print("               numero invalido, tente de novo.")
    return mapa


def converter(origem, destino_jpg, largura_max):
    """Redimensiona e grava .jpg + .webp. Devolve o texto do que foi feito."""
    try:
        from PIL import Image
    except ImportError:
        shutil.copy2(origem, destino_jpg)
        return "copiado sem otimizar (Pillow ausente: pip install Pillow)"

    with Image.open(origem) as im:
        im = im.convert("RGB")
        if im.width > largura_max:
            altura = round(im.height * largura_max / im.width)
            im = im.resize((largura_max, altura), Image.LANCZOS)
        im.save(destino_jpg, "JPEG", quality=82, optimize=True, progressive=True)
        destino_webp = os.path.splitext(destino_jpg)[0] + ".webp"
        im.save(destino_webp, "WEBP", quality=78, method=6)
        return "%dx%d — jpg %d KB, webp %d KB" % (
            im.width, im.height,
            os.path.getsize(destino_jpg) // 1024,
            os.path.getsize(destino_webp) // 1024,
        )


def main():
    p = argparse.ArgumentParser(description="Prepara as fotos do site ACELERO COMEX.")
    p.add_argument("pasta", help="pasta com as imagens baixadas")
    p.add_argument("--mapa", help="campo=arquivo separados por virgula, para rodar sem perguntas")
    args = p.parse_args()

    pasta = os.path.abspath(args.pasta)
    arquivos = listar_imagens(pasta)

    if args.mapa:
        mapa = {}
        for par in args.mapa.split(","):
            if "=" not in par:
                sys.exit("Formato invalido em --mapa: %s" % par)
            campo, arquivo = par.split("=", 1)
            mapa[campo.strip()] = arquivo.strip()
    else:
        mapa = perguntar_mapa(pasta, arquivos)

    validos = {c[0] for c in CAMPOS}
    for campo in mapa:
        if campo not in validos:
            sys.exit("Campo desconhecido: %s (validos: %s)" % (campo, ", ".join(sorted(validos))))

    if not mapa:
        print("\nNenhum campo preenchido. Nada a fazer.")
        return

    os.makedirs(DESTINO, exist_ok=True)
    print("\nGravando em %s\n" % DESTINO)

    for campo, final, largura, _descricao in CAMPOS:
        if campo not in mapa:
            continue
        origem = os.path.join(pasta, mapa[campo])
        if not os.path.isfile(origem):
            print("  %-12s ARQUIVO NAO ENCONTRADO: %s" % (campo, mapa[campo]))
            continue
        resultado = converter(origem, os.path.join(DESTINO, final), largura)
        print("  %-12s %-26s %s" % (campo, final, resultado))

    print("\nPronto. Agora confira o site e faca o commit:")
    print("    git add assets/img")
    print('    git commit -m "Adiciona fotos de transporte, entrega, prateleiras e risco"')
    print("    git push -u origin claude/acelero-comex-site-j1lvb7")


if __name__ == "__main__":
    main()
