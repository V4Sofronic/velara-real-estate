/**
 * Data layer. The UI only ever calls `api.*`.
 *  - No VITE_API_URL  -> MOCK mode: everything lives in localStorage (no server needed).
 *  - VITE_API_URL set -> REMOTE mode: same functions call your REST API (see server/index.js).
 * Both return identical shapes, so switching needs no UI changes.
 */
import { properties } from '../data/properties.js'

const BASE = import.meta.env.VITE_API_URL
export const isRemote = Boolean(BASE)
const TOKEN = 'velara.token'

// ------------------------------------------------------------------ mock
const sleep = (ms = 280) => new Promise((r) => setTimeout(r, ms))
const read = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f } catch { return f } }
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v))
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
const pub = ({ passHash, ...u }) => u

// DEMO ONLY: not real security. Real hashing happens on the server (bcrypt).
async function hash(s) {
  const text = 'velara:' + s
  if (globalThis.crypto?.subtle) {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')
  }
  let h = 0; for (const c of text) h = (h * 31 + c.charCodeAt(0)) | 0
  return String(h)
}

async function seedDemo() {
  const users = read('velara.users', [])
  if (!users.some((u) => u.email === 'demo@velara.com')) {
    users.push({ id: 'demo', name: 'Demo Buyer', email: 'demo@velara.com', passHash: await hash('Demo1234'), createdAt: '2026-01-01T00:00:00.000Z' })
    write('velara.users', users)
  }
}

const mock = {
  async signUp({ name, email, password }) {
    await sleep(); await seedDemo()
    email = email.trim().toLowerCase()
    const users = read('velara.users', [])
    if (users.some((u) => u.email === email)) throw new Error('An account with this email already exists.')
    const user = { id: uid(), name: name.trim(), email, passHash: await hash(password), createdAt: new Date().toISOString() }
    write('velara.users', [...users, user]); localStorage.setItem('velara.session', user.id)
    return pub(user)
  },
  async signIn({ email, password }) {
    await sleep(); await seedDemo()
    const u = read('velara.users', []).find((x) => x.email === email.trim().toLowerCase())
    if (!u || u.passHash !== (await hash(password))) throw new Error('Incorrect email or password.')
    localStorage.setItem('velara.session', u.id)
    return pub(u)
  },
  async me() {
    await seedDemo()
    const id = localStorage.getItem('velara.session')
    const u = read('velara.users', []).find((x) => x.id === id)
    return u ? pub(u) : null
  },
  async signOut() { localStorage.removeItem('velara.session') },
  async listProperties() { await sleep(120); return properties },
  async getProperty(id) { await sleep(120); return properties.find((p) => p.id === id) || null },
  async listFavorites() { return read('velara.favs.' + localStorage.getItem('velara.session'), []) },
  async setFavorite(id, on) {
    const key = 'velara.favs.' + localStorage.getItem('velara.session')
    const set = new Set(read(key, [])); on ? set.add(id) : set.delete(id)
    write(key, [...set]); return [...set]
  },
  async sendInquiry(data) {
    await sleep(400)
    const rec = { id: uid(), userId: localStorage.getItem('velara.session'), createdAt: new Date().toISOString(), ...data }
    write('velara.inquiries', [rec, ...read('velara.inquiries', [])]); return rec
  },
  async listInquiries() {
    const id = localStorage.getItem('velara.session')
    return read('velara.inquiries', []).filter((i) => i.userId === id)
  },
}

// ---------------------------------------------------------------- remote
async function req(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem(TOKEN)
  let res
  try {
    res = await fetch(BASE + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined })
  } catch { throw new Error('Cannot reach the server. Is the backend running?') }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

const remote = {
  async signUp(b) { const d = await req('/auth/signup', { method: 'POST', body: b }); localStorage.setItem(TOKEN, d.token); return d.user },
  async signIn(b) { const d = await req('/auth/signin', { method: 'POST', body: b }); localStorage.setItem(TOKEN, d.token); return d.user },
  async me() { if (!localStorage.getItem(TOKEN)) return null; try { return (await req('/auth/me')).user } catch { localStorage.removeItem(TOKEN); return null } },
  async signOut() { localStorage.removeItem(TOKEN) },
  async listProperties() { return (await req('/properties')).properties },
  async getProperty(id) { try { return (await req('/properties/' + id)).property } catch { return null } },
  async listFavorites() { return (await req('/favorites')).ids },
  async setFavorite(id, on) { return (await req('/favorites/' + id, { method: on ? 'POST' : 'DELETE' })).ids },
  async sendInquiry(b) { return (await req('/inquiries', { method: 'POST', body: b })).inquiry },
  async listInquiries() { return (await req('/inquiries')).inquiries },
}

export const api = isRemote ? remote : mock
