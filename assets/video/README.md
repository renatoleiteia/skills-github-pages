# /assets/video — vídeos do site

Dois vídeos são usados como fundo. Sem eles, o CSS exibe um gradiente animado
no lugar — o site nunca fica quebrado.

| Arquivo | Onde aparece | O que filmar |
|---|---|---|
| `navio-embarque.mp4` | Fundo do hero | Navio porta-contêineres em movimento e/ou guindaste embarcando contêiner. Plano contínuo, movimento lento e constante, sem cortes bruscos. |
| `navio-embarque.webm` | Fallback do hero | Mesma filmagem, exportada em WebM/VP9 (arquivo menor em navegadores compatíveis). |
| `linha-producao.mp4` | Fundo da seção "Nosso propósito" | Linha de produção industrial em operação, esteira, braço robótico, conferência de peças. Aparece com 50% de opacidade. |
| `inspecao-carga.mp4` | Reserva (troque em qualquer `<video>`) | Conferência de carga: contêiner sendo aberto, lacre, contagem de volumes. |

## Especificação técnica

- **Duração:** 8 a 15 segundos, com corte que faça o loop parecer contínuo.
- **Resolução:** 1920×1080 (1280×720 já é suficiente por ficar sob um véu escuro).
- **Codec:** H.264 (`.mp4`) + VP9 (`.webm`). Peso-alvo: **até 3 MB** por arquivo.
- **Sem áudio:** a trilha é removida na exportação (o vídeo roda em `muted`).
- **Sem texto na imagem:** a headline fica por cima; qualquer texto filmado polui.

Exemplo de compressão com FFmpeg:

```bash
# MP4 leve, sem áudio, 15s
ffmpeg -i original.mov -t 15 -an -vf "scale=1920:-2" \
  -c:v libx264 -crf 28 -preset slow -movflags +faststart navio-embarque.mp4

# WebM equivalente
ffmpeg -i original.mov -t 15 -an -vf "scale=1920:-2" \
  -c:v libvpx-vp9 -crf 36 -b:v 0 navio-embarque.webm
```
