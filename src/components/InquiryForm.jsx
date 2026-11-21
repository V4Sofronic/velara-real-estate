import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

export default function InquiryForm({ property, title = 'Request a private viewing' }) {
  const { user } = useAuth()
  const [f, setF] = useState({ name: user?.name || '', email: user?.email || '', phone: '', message: property ? `I'd like to arrange a viewing of ${property.title}.` : '' })
  const [state, setState] = useState({ busy: false, done: false, error: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setState({ busy: false, done: false, error: 'Please enter a valid email address.' })
    if (f.name.trim().length < 2 || f.message.trim().length < 5) return setState({ busy: false, done: false, error: 'Please add your name and a short message.' })
    setState({ busy: true, done: false, error: '' })
    try { await api.sendInquiry({ ...f, propertyId: property?.id || null, propertyTitle: property?.title || null }); setState({ busy: false, done: true, error: '' }) }
    catch (err) { setState({ busy: false, done: false, error: err.message }) }
  }

  if (state.done) return <div className="panel success"><CheckCircle2 size={28} /><h3>Thank you, {f.name.split(' ')[0]}.</h3><p className="muted">Your enquiry has been received. An advisor will reply to {f.email} within one business day.</p></div>
  return (
    <form className="panel form" onSubmit={submit} noValidate>
      <h3>{title}</h3>
      <label>Full name<input value={f.name} onChange={set('name')} autoComplete="name" required /></label>
      <div className="form__grid">
        <label>Email<input type="email" value={f.email} onChange={set('email')} autoComplete="email" required /></label>
        <label>Phone <small>(optional)</small><input value={f.phone} onChange={set('phone')} autoComplete="tel" /></label>
      </div>
      <label>Message<textarea rows={4} value={f.message} onChange={set('message')} required /></label>
      {state.error && <p className="error" role="alert">{state.error}</p>}
      <button className="btn btn--light" disabled={state.busy}>{state.busy ? 'Sending…' : 'Send enquiry'}</button>
    </form>
  )
}
