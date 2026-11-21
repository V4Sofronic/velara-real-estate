import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { timeline as T } from '../timeline.config.js'
import { loadAsBlobUrl, clamp, smooth } from '../media.js'

gsap.registerPlugin(ScrollTrigger)
const blocks = [{ ...T.hero, id: 'hero', isHero: true }, ...T.chapters]

/** Scroll-scrubbed cinematic film. Sticky stage inside a tall section, so the page keeps scrolling after it. */
export default function Film() {
  const sectionRef = useRef(null)
  const v1 = useRef(null), v2 = useRef(null), anchorRef = useRef(null)
  const blockRefs = useRef([])
  const gradeL = useRef(null), gradeR = useRef(null)
  const labelRef = useRef(null), meterRef = useRef(null), pctRef = useRef(null)
  const hintRef = useRef(null), timeRef = useRef(null)
  const [loaded, setLoaded] = useState(0)
  const [ready, setReady] = useState(false)

  // 1. load media ---------------------------------------------------------
  useEffect(() => {
    let alive = true
    const prog = [0, 0]
    const load = async (i, src, el) => {
      const url = await loadAsBlobUrl(src, (p) => { prog[i] = p; alive && setLoaded((prog[0] + prog[1]) / 2) })
      if (!alive) return
      await new Promise((res) => {
        el.addEventListener('loadedmetadata', res, { once: true })
        el.addEventListener('error', res, { once: true })
        el.src = url; el.load()
      })
      el.play?.().then(() => el.pause()).catch(() => {}) // unlock seeking on iOS
    }
    Promise.all([load(0, T.clip1.src, v1.current), load(1, T.clip2.src, v2.current)]).then(() => alive && (setLoaded(1), setReady(true)))
    return () => { alive = false }
  }, [])

  // 2. scroll -> film (imperative: no React re-render per frame) ------------
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileMQ = window.matchMedia(`(max-width: ${T.scroll.mobileBreakpoint}px)`)
    const sec = sectionRef.current

    const applyLayout = () => {
      sec.style.height = `${mobileMQ.matches ? T.scroll.mobileVh : T.scroll.desktopVh}vh`
      const pos = mobileMQ.matches ? T.framing.mobile : T.framing.desktop
      ;[v1.current, v2.current].forEach((v) => (v.style.objectPosition = pos))
      ScrollTrigger.refresh()
    }
    applyLayout()
    mobileMQ.addEventListener('change', applyLayout)

    const readProgress = () => {
      const r = sec.getBoundingClientRect()
      const max = r.height - window.innerHeight
      return max > 0 ? clamp(-r.top / max) : 0
    }
    const s = { target: readProgress(), current: readProgress(), lastLabel: -2, t1: -1, t2: -1, inFilm: null }
    const st = ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: (self) => { s.target = self.progress }, onRefresh: (self) => { s.target = readProgress() } })

    const seek = (v, t, key) => {
      if (!v.duration || Number.isNaN(v.duration)) return
      const time = clamp(t, 0, v.duration - 0.001)
      if (Math.abs(time - s[key]) < 1 / 120 || v.seeking) return
      s[key] = time; v.currentTime = time
    }

    const tick = (_t, deltaMs) => {
      const dt = Math.min(deltaMs, 100) / 1000
      s.current += (s.target - s.current) * (1 - Math.exp(-(reduced.matches ? 60 : T.feel.smoothing) * dt))
      if (Math.abs(s.target - s.current) < 0.00005) s.current = s.target
      const p = s.current
      const { at, halfWidth, peakOpacity } = T.seam
      const d1 = v1.current.duration || 0, d2 = v2.current.duration || 0
      seek(v1.current, clamp(p / at) * d1, 't1')
      seek(v2.current, clamp((p - at) / (1 - at)) * d2, 't2')
      v2.current.style.opacity = smooth(at - halfWidth, at + halfWidth, p)
      const bell = clamp(1 - Math.abs(p - at) / halfWidth)
      anchorRef.current.style.opacity = bell * bell * (3 - 2 * bell) * peakOpacity

      let l = 0, r = 0
      blocks.forEach((b, i) => {
        const el = blockRefs.current[i]; if (!el) return
        const fin = smooth(b.in[0], b.in[1], p), fout = smooth(b.out[0], b.out[1], p), o = fin * (1 - fout)
        el.style.opacity = o
        el.style.visibility = o < 0.003 ? 'hidden' : 'visible'
        el.style.pointerEvents = o > 0.5 ? 'auto' : 'none'
        el.style.transform = `translate3d(0, ${reduced.matches ? 0 : (1 - fin) * 28 - fout * 28}px, 0)`
        b.side === 'left' ? (l = Math.max(l, o)) : (r = Math.max(r, o))
      })
      gradeL.current.style.opacity = l
      gradeR.current.style.opacity = r

      const idx = T.chapters.findIndex((c) => p >= c.range[0] && p < c.range[1])
      const ci = idx === -1 ? T.chapters.length - 1 : idx
      if (ci !== s.lastLabel) { s.lastLabel = ci; const c = T.chapters[ci]; labelRef.current.textContent = `${c.num} / ${c.name}` }
      meterRef.current.style.setProperty('--p', p.toFixed(4))
      pctRef.current.textContent = String(Math.round(p * 100)).padStart(3, '0')
      hintRef.current.style.opacity = 1 - smooth(0, 0.03, p)
      const secs = p < at ? clamp(p / at) * d1 : d1 + clamp((p - at) / (1 - at)) * d2
      timeRef.current.textContent = `${secs.toFixed(1)}s / ${(d1 + d2).toFixed(1)}s`

      // tell the header whether it is floating over the film
      const inFilm = sec.getBoundingClientRect().bottom > window.innerHeight * 0.6
      if (inFilm !== s.inFilm) { s.inFilm = inFilm; document.documentElement.dataset.film = inFilm ? 'on' : 'off' }
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick); st.kill(); mobileMQ.removeEventListener('change', applyLayout)
      delete document.documentElement.dataset.film
    }
  }, [])

  return (
    <section ref={sectionRef} className="film-section" aria-label="VELARA film">
      <div className="stage">
        <video ref={v1} className="film" muted playsInline preload="auto" disablePictureInPicture tabIndex={-1} aria-hidden="true" />
        <video ref={v2} className="film" muted playsInline preload="auto" disablePictureInPicture tabIndex={-1} aria-hidden="true" style={{ opacity: 0 }} />
        <img ref={anchorRef} className="film anchor" src={T.seam.image} alt="" aria-hidden="true" style={{ opacity: 0 }} />
        <div className="grade grade--base" />
        <div ref={gradeL} className="grade grade--left" />
        <div ref={gradeR} className="grade grade--right" />

        {blocks.map((b, i) => (
          <div key={b.id} ref={(el) => (blockRefs.current[i] = el)} className={`copy copy--${b.side} ${b.isHero ? 'copy--hero' : ''}`} style={{ opacity: 0, visibility: 'hidden' }}>
            <p className="mono eyebrow">{b.isHero ? b.eyebrow : `${b.num} / ${b.name}`}</p>
            <h2 className={b.isHero ? 'h-hero' : 'h-chapter'}>{b.lines.map((ln) => <span key={ln} className="line">{ln}</span>)}</h2>
            {b.body && <p className="body">{b.body}</p>}
            {b.cta && <Link className="btn btn--light" to={b.cta.to}>{b.cta.label} <ArrowUpRight size={16} /></Link>}
          </div>
        ))}

        <div ref={meterRef} className="meter" aria-hidden="true"><div className="meter__fill" /><span ref={pctRef} className="mono meter__pct">000</span></div>
        <div className="foot mono" aria-hidden="true">
          <span ref={hintRef}>SCROLL TO EXPLORE ↓</span>
          <span ref={labelRef} className="chapter">01 / ARRIVAL</span>
          <span ref={timeRef}>0.0s / 0.0s</span>
        </div>

        <div className={`loader ${ready ? 'loader--done' : ''}`} role="status" aria-live="polite">
          <div className="brand">{T.brand}</div>
          <div className="loader__bar"><i style={{ transform: `scaleX(${loaded})` }} /></div>
          <span className="mono">{ready ? 'READY' : `LOADING ${Math.round(loaded * 100)}%`}</span>
        </div>
      </div>
    </section>
  )
}
