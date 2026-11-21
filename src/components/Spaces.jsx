import { Link } from 'react-router-dom'
import { Reveal, SectionHead } from './ui'

const WANT = [
  ['Living rooms', 'Living room'], ['Master suites', 'Master bedroom'],
  ['Chef’s kitchens', 'Chef’s kitchen'], ['Spa bathrooms', 'Spa bathroom'],
]

/** Browse-by-space mosaic built from the villas' own room photos. */
export default function Spaces({ list }) {
  const tiles = WANT.map(([label, name], i) => {
    const hits = (list || []).flatMap((p) => p.rooms.filter((r) => r.name === name).map((r) => ({ ...r, p })))
    const pick = hits[(i * 2) % Math.max(hits.length, 1)]
    return pick && { label, ...pick, count: hits.length }
  }).filter(Boolean)
  if (!tiles.length) return null
  return (
    <section className="section container">
      <SectionHead eyebrow="INSIDE THE HOMES" title={<>Every room,<br />photographed.</>}>Living rooms, suites, kitchens and spas, from across the portfolio.</SectionHead>
      <div className="spaces">
        {tiles.map((t, i) => (
          <Reveal key={t.label} delay={i * 80} className={`space space--${i}`}>
            <Link to={`/properties/${t.p.id}`}>
              <img src={t.image} alt={`${t.label} at ${t.p.title}`} loading="lazy" />
              <span className="space__shade" aria-hidden="true" />
              <span className="space__txt"><strong>{t.label}</strong><small className="mono">{t.p.title} · {t.p.city}</small></span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
