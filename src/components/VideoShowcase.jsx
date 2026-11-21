import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Reveal } from './ui'

/** Looping, muted walkthrough clip. Plays only while on screen (saves battery/data). */
export default function VideoShowcase() {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => { e.isIntersecting ? v.play().catch(() => {}) : v.pause() }, { threshold: 0.25 })
    io.observe(v); return () => io.disconnect()
  }, [])
  return (
    <section className="walk">
      <video ref={ref} className="walk__video" src="/assets/walkthrough.mp4" poster="/img/v/walkthrough-poster.jpg" muted loop playsInline preload="metadata" aria-label="Walkthrough of a Velara residence from driveway to living room" />
      <div className="walk__shade" aria-hidden="true" />
      <Reveal className="walk__copy container">
        <p className="mono eyebrow"><i className="rule" /> THE WALKTHROUGH</p>
        <h2 className="h-section">From the driveway<br />to the living room.</h2>
        <p className="lede">Every residence is filmed and photographed room by room, so you arrive already knowing the house.</p>
        <Link to="/properties" className="btn btn--light">Explore the residences <ArrowRight size={16} /></Link>
      </Reveal>
    </section>
  )
}
