import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useProperties } from '../hooks/useProperties'
import PropertyCard from '../components/PropertyCard'
import { Spinner } from '../components/ui'
import { initials } from '../utils'

export default function Account() {
  const { user, ready, favs, signOut } = useAuth()
  const { list } = useProperties()
  const [inq, setInq] = useState(null)
  const loc = useLocation(), nav = useNavigate()
  useEffect(() => { if (user) api.listInquiries().then(setInq).catch(() => setInq([])) }, [user])

  if (!ready) return <main className="page container"><Spinner /></main>
  if (!user) return <Navigate to="/signin" replace state={{ from: loc.pathname, notice: 'Please sign in to view your account.' }} />
  const saved = (list || []).filter((p) => favs.includes(p.id))

  return (
    <main className="page container">
      <div className="acct-head">
        <span className="avatar avatar--xl">{initials(user.name)}</span>
        <div><p className="mono eyebrow">MY ACCOUNT</p><h1 className="h-section">{user.name}</h1>
          <p className="muted">{user.email} · Member since {new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p></div>
        <button className="btn btn--ghost" onClick={async () => { await signOut(); nav('/') }}>Sign out</button>
      </div>

      <h3 className="sub">Saved homes ({saved.length})</h3>
      {saved.length ? <div className="grid">{saved.map((p) => <PropertyCard key={p.id} p={p} />)}</div>
        : <div className="panel empty"><p className="muted">No saved homes yet. Tap the heart on any property to keep it here.</p></div>}

      <h3 className="sub">My enquiries</h3>
      {inq === null ? <Spinner /> : inq.length ? (
        <ul className="inq">{inq.map((i) => <li key={i.id} className="panel"><div><strong>{i.propertyTitle || 'General enquiry'}</strong><span className="mono muted">{new Date(i.createdAt).toLocaleString('en-GB')}</span></div><p className="muted">{i.message}</p></li>)}</ul>
      ) : <div className="panel empty"><p className="muted">You haven’t sent any enquiries yet.</p></div>}
    </main>
  )
}
