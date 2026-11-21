import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { Reveal, Spinner } from '../components/ui'
import { useProperties } from '../hooks/useProperties'

const TYPES = ['Estate', 'Villa', 'Penthouse', 'Townhouse', 'Apartment']

export default function Properties() {
  const { list, loading, error } = useProperties()
  const [sp, setSp] = useSearchParams()
  const f = { q: sp.get('q') || '', status: sp.get('status') || '', type: sp.get('type') || '', city: sp.get('city') || '', beds: sp.get('beds') || '', sort: sp.get('sort') || 'featured' }
  const set = (k, v) => setSp((prev) => { const n = new URLSearchParams(prev); v ? n.set(k, v) : n.delete(k); return n }, { replace: true })
  const cities = useMemo(() => [...new Set((list || []).map((p) => p.city))].sort(), [list])

  const results = useMemo(() => {
    if (!list) return []
    const q = f.q.trim().toLowerCase()
    let r = list.filter((p) =>
      (!q || `${p.title} ${p.city} ${p.country} ${p.type}`.toLowerCase().includes(q)) &&
      (!f.status || p.status === f.status) && (!f.type || p.type === f.type) && (!f.city || p.city === f.city) && (!f.beds || p.beds >= +f.beds))
    const by = { 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, size: (a, b) => b.area - a.area, featured: (a, b) => Number(b.featured) - Number(a.featured) }
    return [...r].sort(by[f.sort] || by.featured)
  }, [list, f.q, f.status, f.type, f.city, f.beds, f.sort])

  const active = ['q', 'status', 'type', 'city', 'beds'].some((k) => f[k])
  return (
    <main className="page container">
      <Reveal className="page-head">
        <p className="mono eyebrow"><i className="rule" /> PROPERTIES</p>
        <h1 className="h-section">Find your next address.</h1>
        <p className="lede">Sample listings with sample data. Filters update instantly and are saved in the URL.</p>
      </Reveal>

      <div className="filters" role="search">
        <SlidersHorizontal size={16} className="filters__icon" />
        <input type="search" placeholder="Search name, city, country…" value={f.q} onChange={(e) => set('q', e.target.value)} aria-label="Search" />
        <select value={f.status} onChange={(e) => set('status', e.target.value)} aria-label="Buy or rent"><option value="">Buy & rent</option><option value="sale">For sale</option><option value="rent">For rent</option></select>
        <select value={f.type} onChange={(e) => set('type', e.target.value)} aria-label="Type"><option value="">All types</option>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        <select value={f.city} onChange={(e) => set('city', e.target.value)} aria-label="Location"><option value="">All locations</option>{cities.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={f.beds} onChange={(e) => set('beds', e.target.value)} aria-label="Bedrooms"><option value="">Any beds</option>{[3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}+ beds</option>)}</select>
        <select value={f.sort} onChange={(e) => set('sort', e.target.value)} aria-label="Sort"><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="size">Largest</option></select>
        {active && <button className="link-btn" onClick={() => setSp({}, { replace: true })}><X size={14} /> Clear</button>}
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? <Spinner /> : (
        <>
          <p className="mono count">{results.length} {results.length === 1 ? 'PROPERTY' : 'PROPERTIES'}</p>
          {results.length ? <div className="grid">{results.map((p) => <PropertyCard key={p.id} p={p} />)}</div>
            : <div className="panel empty"><h3>No matches</h3><p className="muted">Try removing a filter or searching a different location.</p></div>}
        </>
      )}
    </main>
  )
}
