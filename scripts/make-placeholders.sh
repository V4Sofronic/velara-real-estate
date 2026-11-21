#!/usr/bin/env bash
# Builds stand-in media from any single video so the site can be tested before real clips exist.
# usage: scripts/make-placeholders.sh some-video.mp4 [split_sec]
set -euo pipefail
SRC="$1"; SPLIT="${2:-4.0}"; D="$(dirname "$0")"
END=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")
GOP=2 "$D/encode-for-scrub.sh" "$SRC" public/assets/sequence-01.mp4 0 "$SPLIT"
GOP=2 "$D/encode-for-scrub.sh" "$SRC" public/assets/sequence-02.mp4 "$SPLIT" "$(python3 -c "print($END-$SPLIT)")"
"$D/make-anchor.sh" public/assets/sequence-01.mp4 public/assets/exploded-anchor.png
cp public/assets/exploded-anchor.png public/assets/final-hero.png
