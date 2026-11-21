import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Fades/slides children in when scrolled into view. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (reduced()) return setOn(true)
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    io.observe(ref.current); return () => io.disconnect()
  }, [])
  return <Tag ref={ref} className={`reveal ${on ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>{children}</Tag>
}

/** 3D pointer-tilt wrapper (mouse only). */
export function Tilt({ children, max = 7, className = '' }) {
  const ref = useRef(null)
  const move = (e) => {
    if (e.pointerType !== 'mouse' || reduced()) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) translateZ(0)`
    ref.current.style.setProperty('--gx', `${(x + 0.5) * 100}%`); ref.current.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const leave = () => { ref.current.style.transform = '' }
  return <div ref={ref} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave}>{children}</div>
}

/** Counts up when scrolled into view. */
export function Counter({ value, decimals = 0, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const set = (v) => (el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`)
    if (reduced()) return set(value)
    set(0)
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect(); const o = { v: 0 }
      gsap.to(o, { v: value, duration: 1.8, ease: 'power3.out', onUpdate: () => set(o.v) })
    }, { threshold: 0.6 })
    io.observe(el); return () => io.disconnect()
  }, [value, decimals, prefix, suffix])
  return <span ref={ref}>{prefix}{value}{suffix}</span>
}

export function SectionHead({ eyebrow, title, children, align = 'left' }) {
  return (
    <Reveal className={`sec-head sec-head--${align}`}>
      <p className="mono eyebrow"><i className="rule" /> {eyebrow}</p>
      <h2 className="h-section">{title}</h2>
      {children && <p className="lede">{children}</p>}
    </Reveal>
  )
}

export function Spinner({ label = 'Loading' }) {
  return <div className="spinner" role="status"><i /> <span className="mono">{label}</span></div>
}
