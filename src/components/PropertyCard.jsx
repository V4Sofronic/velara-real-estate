import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bed, Bath, Maximize, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Tilt } from './ui'
import { money, sqft } from '../utils'

export function FavButton({ id, className = '' }) {
  const { favs, toggleFavorite } = useAuth()
  const nav = useNavigate(), loc = useLocation()
  const on = favs.includes(id)
  const click = async (e) => {
    e.preventDefault(); e.stopPropagation()
    const ok = await toggleFavorite(id)
    if (!ok) nav('/signin', { state: { from: loc.pathname + loc.search, notice: 'Sign in to save homes to your account.' } })
  }
  return (
    <button className={`fav ${on ? 'fav--on' : ''} ${className}`} onClick={click} aria-pressed={on} aria-label={on ? 'Remove from saved homes' : 'Save home'}>
      <Heart size={18} fill={on ? 'currentColor' : 'none'} />
    </button>
  )
}

export default function PropertyCard({ p, tilt = true }) {
  const card = (
    <Link to={`/properties/${p.id}`} className="card">
      <div className="card__img">
        <img src={p.images[0]} alt={`${p.title}, ${p.city}`} loading="lazy" style={{ objectPosition: p.focus }} />
        <span className={`badge badge--${p.status}`}>{p.status === 'sale' ? 'For sale' : 'For rent'}</span>
        <FavButton id={p.id} />
        <span className="card__glare" aria-hidden="true" />
      </div>
      <div className="card__body">
        <div className="card__row"><h3>{p.title}</h3><strong>{money(p.price, p.status)}</strong></div>
        <p className="muted">{p.city}, {p.country} · {p.type}</p>
        <ul className="meta">
          <li><Bed size={15} /> {p.beds}</li><li><Bath size={15} /> {p.baths}</li><li><Maximize size={15} /> {sqft(p.area)} sq ft</li>
        </ul>
      </div>
    </Link>
  )
  return tilt ? <Tilt>{card}</Tilt> : card
}
