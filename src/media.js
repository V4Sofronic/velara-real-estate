// Fetch a file fully into memory and return a blob URL. Seeking a blob is much
// snappier than seeking over HTTP range requests, which matters for scroll scrubbing.
// Falls back to the plain URL if fetch/streaming isn't possible.
const cache = new Map()
export function loadAsBlobUrl(src, onProgress) {
  if (!cache.has(src)) cache.set(src, fetchBlob(src, onProgress))
  else cache.get(src).then(() => onProgress?.(1))
  return cache.get(src)
}

async function fetchBlob(src, onProgress) {
  try {
    const res = await fetch(src)
    if (!res.ok) throw new Error(res.statusText)
    const total = Number(res.headers.get('content-length')) || 0
    if (!res.body || !total) {
      const blob = await res.blob()
      onProgress?.(1)
      return URL.createObjectURL(blob)
    }
    const reader = res.body.getReader()
    const chunks = []
    let got = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      got += value.length
      onProgress?.(got / total)
    }
    return URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }))
  } catch {
    onProgress?.(1)
    return src
  }
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const smooth = (a, b, v) => {
  if (a === b) return v >= a ? 1 : 0
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
