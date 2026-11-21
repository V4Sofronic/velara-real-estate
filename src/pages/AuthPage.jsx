import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { isRemote } from '../api'

export default function AuthPage({ mode }) {
  const signup = mode === 'signup'
  const { user, ready, signIn, signUp } = useAuth()
  const nav = useNavigate(), loc = useLocation()
  const from = loc.state?.from || '/account'
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  if (ready && user && !busy) return <Navigate to={from} replace />

  const validate = () => {
    if (signup && f.name.trim().length < 2) return 'Please enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return 'Please enter a valid email address.'
    if (signup && !(f.password.length >= 8 && /[A-Za-z]/.test(f.password) && /\d/.test(f.password))) return 'Password must be 8+ characters and include a letter and a number.'
    if (!f.password) return 'Please enter your password.'
    return ''
  }
  const submit = async (e) => {
    e.preventDefault()
    const v = validate(); if (v) return setErr(v)
    setErr(''); setBusy(true)
    try { await (signup ? signUp(f) : signIn(f)); nav(from, { replace: true }) }
    catch (x) { setErr(x.message); setBusy(false) }
  }

  return (
    <main className="auth">
      <div className="auth__art" aria-hidden="true"><img src="/img/ext-1.jpg" alt="" /><div><p className="mono eyebrow">VELARA</p><h2 className="h-section">{signup ? <>Your private<br />property file.</> : <>Welcome<br />back.</>}</h2><p className="muted">Save homes, track enquiries and get early access to off-market listings.</p></div></div>
      <form className="auth__form" onSubmit={submit} noValidate>
        <h1>{signup ? 'Create your account' : 'Sign in'}</h1>
        {loc.state?.notice && <p className="notice"><Info size={16} /> {loc.state.notice}</p>}
        {signup && <label>Full name<input value={f.name} onChange={set('name')} autoComplete="name" /></label>}
        <label>Email<input type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label>
        <label>Password
          <span className="pw"><input type={show ? 'text' : 'password'} value={f.password} onChange={set('password')} autoComplete={signup ? 'new-password' : 'current-password'} />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></span>
        </label>
        {err && <p className="error" role="alert">{err}</p>}
        <button className="btn btn--light" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}</button>
        {!signup && <button type="button" className="btn btn--ghost" onClick={() => setF({ ...f, email: 'demo@velara.com', password: 'Demo1234' })}>Fill demo account</button>}
        <p className="muted switch">{signup ? 'Already have an account?' : 'New to Velara?'} <Link to={signup ? '/signin' : '/signup'} state={loc.state}>{signup ? 'Sign in' : 'Create an account'}</Link></p>
        <p className="mono hint">{isRemote ? 'CONNECTED TO API SERVER' : 'DEMO MODE · DATA STORED IN THIS BROWSER ONLY'}</p>
      </form>
    </main>
  )
}
