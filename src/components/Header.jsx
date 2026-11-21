import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { initials } from '../utils'

const links = [['/', 'Home'], ['/properties', 'Properties'], ['/agents', 'Agents'], ['/contact', 'Contact']]

export default function Header() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation(), nav = useNavigate()

  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <Link to="/" className="brand" aria-label="VELARA home">VELARA<span className="brand__dot" /></Link>
      <nav className="nav__links" aria-label="Main">
        {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
      </nav>
      <div className="nav__auth">
        {user ? (
          <>
            <Link to="/account" className="avatar" title={user.name} aria-label="My account">{initials(user.name)}</Link>
            <button className="link-btn" onClick={async () => { await signOut(); nav('/') }}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/signin" className="link-btn">Sign in</Link>
            <Link to="/signup" className="btn btn--light btn--sm">Sign up</Link>
          </>
        )}
      </div>
      <button className="icon-btn nav__burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      {open && (
        <div className="drawer">
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
          <hr />
          {user ? (<><NavLink to="/account">My account</NavLink><button onClick={async () => { await signOut(); nav('/') }}>Sign out</button></>)
                : (<><NavLink to="/signin">Sign in</NavLink><NavLink to="/signup">Sign up</NavLink></>)}
        </div>
      )}
    </header>
  )
}
