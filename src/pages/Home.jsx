import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Search, Star, Quote } from 'lucide-react'
import Film from '../components/Film'
import VideoShowcase from '../components/VideoShowcase'
import Spaces from '../components/Spaces'
import PropertyCard from '../components/PropertyCard'
import { Reveal, SectionHead, Counter, Spinner } from '../components/ui'
import { useProperties } from '../hooks/useProperties'
import { stats, steps, testimonials, marquee } from '../data/site'

export default function Home() {
  const { list, loading } = useProperties()
  const nav = useNavigate()
  const [q, setQ] = useState({ status: '', type: '', city: '' })
  const featured = (list || []).filter((p) => p.featured).slice(0, 6)
  const cities = [...new Set((list || []).map((p) => p.city))].sort()

  const go = (e) => {
    e.preventDefault()
    const sp = new URLSearchParams(Object.entries(q).filter(([, v]) => v))
    nav('/properties' + (sp.toString() ? `?${sp}` : ''))
  }

  return (
    <>
      <Film />

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...marquee, ...marquee, ...marquee, ...marquee].map((m, i) => <span key={i}>{m} <i /></span>)}
        </div>
      </div>

      <section className="section container">
        <Reveal className="search">
          <form onSubmit={go} aria-label="Quick property search">
            <label>Looking to<select value={q.status} onChange={(e) => setQ({ ...q, status: e.target.value })}><option value="">Buy or rent</option><option value="sale">Buy</option><option value="rent">Rent</option></select></label>
            <label>Property type<select value={q.type} onChange={(e) => setQ({ ...q, type: e.target.value })}><option value="">Any type</option>{['Estate', 'Villa', 'Penthouse', 'Townhouse', 'Apartment'].map((t) => <option key={t}>{t}</option>)}</select></label>
            <label>Location<select value={q.city} onChange={(e) => setQ({ ...q, city: e.target.value })}><option value="">Anywhere</option>{cities.map((c) => <option key={c}>{c}</option>)}</select></label>
            <button className="btn btn--light"><Search size={16} /> Search</button>
          </form>
        </Reveal>
      </section>

      <section className="section container">
        <SectionHead eyebrow="THE COLLECTION" title={<>Residences chosen<br />for what they look out on.</>}>A rotating selection from our private portfolio. Hover a card, it moves with you.</SectionHead>
        {loading ? <Spinner /> : <div className="grid">{featured.map((p, i) => <Reveal key={p.id} delay={i * 70}><PropertyCard p={p} /></Reveal>)}</div>}
        <Reveal className="center"><Link to="/properties" className="btn btn--ghost">View all properties <ArrowRight size={16} /></Link></Reveal>
      </section>

      <VideoShowcase />

      <Spaces list={list} />

      <section className="section section--band">
        <div className="container stats">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="stat">
              <strong><Counter {...s} /></strong><span className="mono">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container">
        <SectionHead eyebrow="HOW IT WORKS" title={<>Three steps.<br />No noise.</>} />
        <div className="steps">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 110} className="step">
              <span className="step__n mono">{s.n}</span><i className="rule rule--long" />
              <h3>{s.t}</h3><p className="muted">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container">
        <SectionHead eyebrow="CLIENT NOTES" title="Quietly recommended." align="center" />
        <div className="quotes">
          {testimonials.map((t, i) => (
            <Reveal key={t.n} delay={i * 100}>
              <figure className="quote"><Quote size={22} /><blockquote>{t.q}</blockquote>
                <figcaption><strong>{t.n}</strong><span className="muted">{t.c}</span><span className="stars" aria-label="5 stars">{[...Array(5)].map((_, k) => <Star key={k} size={14} fill="currentColor" />)}</span></figcaption></figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <Reveal className="container center">
          <p className="mono eyebrow">PRIVATE CLIENT SERVICE</p>
          <h2 className="h-section">Find the home that<br />hasn’t been listed yet.</h2>
          <div className="row center-row"><Link to="/signup" className="btn btn--light">Create free account</Link><Link to="/contact" className="btn btn--ghost">Speak to an advisor</Link></div>
        </Reveal>
      </section>
    </>
  )
}
