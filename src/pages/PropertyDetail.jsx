import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bed, Bath, Maximize, Calendar, MapPin, Check, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../api'
import { agents } from '../data/site'
import { useProperties } from '../hooks/useProperties'
import { FavButton } from '../components/PropertyCard'
import PropertyCard from '../components/PropertyCard'
import InquiryForm from '../components/InquiryForm'
import { Reveal, Spinner } from '../components/ui'
import { money, moneyFull, sqft, initials } from '../utils'
import NotFound from './NotFound'

function Mortgage({ price }) {
  const [down, setDown] = useState(30), [rate, setRate] = useState(5.5), [years, setYears] = useState(25)
  const monthly = useMemo(() => {
    const L = price * (1 - down / 100), r = rate / 100 / 12, n = years * 12
    return r === 0 ? L / n : (L * r) / (1 - Math.pow(1 + r, -n))
  }, [price, down, rate, years])
  return (
    <div className="panel calc">
      <h3>Mortgage estimate</h3>
      <label>Deposit: <b>{down}%</b> <small>({moneyFull(price * down / 100)})</small><input type="range" min="10" max="80" value={down} onChange={(e) => setDown(+e.target.value)} /></label>
      <label>Interest rate: <b>{rate.toFixed(1)}%</b><input type="range" min="1" max="10" step="0.1" value={rate} onChange={(e) => setRate(+e.target.value)} /></label>
      <label>Term: <b>{years} years</b><input type="range" min="5" max="35" value={years} onChange={(e) => setYears(+e.target.value)} /></label>
      <div className="calc__out"><span className="mono">ESTIMATED MONTHLY</span><strong>{moneyFull(monthly)}</strong></div>
      <small className="muted">Illustrative only. Not financial advice.</small>
    </div>
  )
}

export default function PropertyDetail() {
  const { id } = useParams()
  const [p, setP] = useState(undefined)
  const [i, setI] = useState(0)
  const { list } = useProperties()

  useEffect(() => { setP(undefined); setI(0); api.getProperty(id).then(setP); window.scrollTo(0, 0) }, [id])
  if (p === undefined) return <main className="page container"><Spinner /></main>
  if (p === null) return <NotFound />

  const agent = agents.find((a) => a.id === p.agentId) || agents[0]
  const similar = (list || []).filter((x) => x.id !== p.id && (x.type === p.type || x.country === p.country)).slice(0, 3)
  const step = (d) => setI((i + d + p.images.length) % p.images.length)

  return (
    <main className="page container">
      <nav className="crumbs mono" aria-label="Breadcrumb"><Link to="/properties">Properties</Link> / <span>{p.title}</span></nav>

      <div className="gallery">
        <div className="gallery__main">
          {p.images.map((src, k) => <img key={src + k} src={src} alt={k === i ? `${p.title} photo ${k + 1}` : ''} className={k === i ? 'on' : ''} style={{ objectPosition: p.focus }} />)}
          <button className="gallery__nav gallery__nav--l" onClick={() => step(-1)} aria-label="Previous photo"><ChevronLeft /></button>
          <button className="gallery__nav gallery__nav--r" onClick={() => step(1)} aria-label="Next photo"><ChevronRight /></button>
          <span className={`badge badge--${p.status}`}>{p.status === 'sale' ? 'For sale' : 'For rent'}</span>
          {p.captions?.[i] && <span className="gallery__cap mono">{p.captions[i]}</span>}
          <span className="gallery__count mono">{i + 1} / {p.images.length}</span>
        </div>
        <div className="gallery__thumbs">
          {p.images.map((src, k) => <button key={src + k} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Show photo ${k + 1}`}><img src={src} alt="" /></button>)}
        </div>
      </div>

      <div className="detail">
        <div>
          <Reveal>
            <p className="mono eyebrow"><i className="rule" /> {p.type.toUpperCase()}</p>
            <h1 className="h-section">{p.title}</h1>
            <p className="loc"><MapPin size={16} /> {p.city}, {p.country}</p>
            <ul className="facts">
              <li><Bed /><strong>{p.beds}</strong><span className="mono">Bedrooms</span></li>
              <li><Bath /><strong>{p.baths}</strong><span className="mono">Bathrooms</span></li>
              <li><Maximize /><strong>{sqft(p.area)}</strong><span className="mono">Sq ft</span></li>
              <li><Calendar /><strong>{p.year}</strong><span className="mono">Built</span></li>
            </ul>
          </Reveal>
          <Reveal><h3 className="sub">About this residence</h3><p className="prose">{p.description}</p><p className="prose muted">Plot: {p.lot}.</p></Reveal>
          <Reveal><h3 className="sub">Features</h3><ul className="features">{p.features.map((f) => <li key={f}><Check size={16} /> {f}</li>)}</ul></Reveal>
          {p.rooms?.length > 0 && (
            <Reveal><h3 className="sub">Inside the residence</h3>
              <div className="rooms">{p.rooms.map((r) => (
                <figure key={r.image} className="room"><img src={r.image} alt={`${r.name}, ${p.title}`} loading="lazy" /><figcaption><strong>{r.name}</strong><span className="muted">{r.note}</span></figcaption></figure>
              ))}</div>
            </Reveal>
          )}
          {p.status === 'sale' && <Reveal><Mortgage price={p.price} /></Reveal>}
        </div>

        <aside className="side">
          <div className="panel price">
            <span className="mono">{p.status === 'sale' ? 'GUIDE PRICE' : 'RENT'}</span>
            <strong>{money(p.price, p.status)}</strong>
            <FavButton id={p.id} className="fav--wide" />
          </div>
          <div className="panel agent">
            <span className="avatar avatar--lg">{initials(agent.name)}</span>
            <div><strong>{agent.name}</strong><p className="muted">{agent.role}</p></div>
            <a href={`tel:${agent.phone}`}><Phone size={14} /> {agent.phone}</a>
            <a href={`mailto:${agent.email}`}><Mail size={14} /> {agent.email}</a>
          </div>
          <InquiryForm property={p} />
        </aside>
      </div>

      {similar.length > 0 && <section className="section"><h3 className="sub">You may also like</h3><div className="grid">{similar.map((x) => <PropertyCard key={x.id} p={x} />)}</div></section>}
    </main>
  )
}
