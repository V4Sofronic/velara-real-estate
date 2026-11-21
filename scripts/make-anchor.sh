#!/usr/bin/env bash
# Grab the last frame of a clip as the seam-bridge still.
# usage: scripts/make-anchor.sh public/assets/sequence-01.mp4 public/assets/exploded-anchor.png
set -euo pipefail
ffmpeg -v error -y -sseof -0.15 -i "$1" -update 1 -frames:v 1 "$2"
echo "wrote $2"
