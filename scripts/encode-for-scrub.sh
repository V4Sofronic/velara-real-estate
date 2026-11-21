#!/usr/bin/env bash
# Re-encode a clip so it scrubs smoothly: no audio, frequent keyframes, fast-start.
# usage: scripts/encode-for-scrub.sh input.mp4 output.mp4 [start_sec] [duration_sec]
# GOP=1 -> all-intra (smoothest scrubbing, biggest file). GOP=2..6 is a good balance.
set -euo pipefail
IN="$1"; OUT="$2"; SS="${3:-0}"; T="${4:-}"
ARGS=(-ss "$SS"); [ -n "$T" ] && ARGS+=(-t "$T")
ffmpeg -v error -y "${ARGS[@]}" -i "$IN" -an \
  -vf "scale='min(${MAXW:-1920},iw)':-2" \
  -c:v libx264 -preset "${PRESET:-slow}" -crf "${CRF:-22}" -g "${GOP:-2}" -keyint_min "${GOP:-2}" -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart "$OUT"
echo "wrote $OUT ($(du -h "$OUT" | cut -f1))"
