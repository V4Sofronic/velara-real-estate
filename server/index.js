/**
 * Minimal VELARA API: Express + JSON file storage + JWT auth.
 * Endpoints are exactly what src/api/index.js (remote mode) calls.
 * Swap the tiny `db` helpers for Postgres/Mongo/Supabase when you outgrow the JSON file.
 */
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import { properties } from '../src/data/properties.js'

const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me'
const ORIGIN = process.env.CLIENT_ORIGIN // e.g. https://velara.com (not needed when using the Vite proxy)
if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'dev-only-secret-change-me') {
  console.error('Refusing to start: set JWT_SECRET in production.'); process.exit(1)
}

// ---------------------------------------------------------------- storage
const FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'db.json')
const db = {
  data: { users: [], favorites: {}, inquiries: [] },
  load() { if (fs.existsSync(FILE)) this.data = JSON.parse(fs.readFileSync(FILE, 'utf8')) },
  save() { fs.writeFileSync(FILE, JSON.stringify(this.data, null, 2)) },
}
db.load()
if (!db.data.users.some((u) => u.email === 'demo@velara.com')) {
  db.data.users.push({ id: 'demo', name: 'Demo Buyer', email: 'demo@velara.com', passHash: bcrypt.hashSync('Demo1234', 10), createdAt: new Date().toISOString() })
  db.save()
}

// ---------------------------------------------------------------- helpers
const pub = ({ passHash, ...u }) => u
const sign = (u) => jwt.sign({ sub: u.id }, JWT_SECRET, { expiresIn: '7d' })
const bad = (res, msg, code = 400) => res.status(code).json({ error: msg })
const isEmail = (s) => typeof s === 'string' && /^\S+@\S+\.\S+$/.test(s)

function auth(required = true) {
  return (req, res, next) => {
    const t = (req.headers.authorization || '').replace(/^Bearer /, '')
    try { req.user = db.data.users.find((u) => u.id === jwt.verify(t, JWT_SECRET).sub) || null } catch { req.user = null }
    if (required && !req.user) return bad(res, 'Please sign in.', 401)
    next()
  }
}

// ------------------------------------------------------------------- app
const app = express()
app.use(cors(ORIGIN ? { origin: ORIGIN } : {}))
app.use(express.json({ limit: '50kb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body || {}
  if (typeof name !== 'string' || name.trim().length < 2) return bad(res, 'Please enter your full name.')
  if (!isEmail(email)) return bad(res, 'Please enter a valid email address.')
  if (typeof password !== 'string' || password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) return bad(res, 'Password must be 8+ characters and include a letter and a number.')
  const e = email.trim().toLowerCase()
  if (db.data.users.some((u) => u.email === e)) return bad(res, 'An account with this email already exists.', 409)
  const user = { id: randomUUID(), name: name.trim(), email: e, passHash: await bcrypt.hash(password, 10), createdAt: new Date().toISOString() }
  db.data.users.push(user); db.save()
  res.status(201).json({ token: sign(user), user: pub(user) })
})

app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body || {}
  const user = isEmail(email) && db.data.users.find((u) => u.email === email.trim().toLowerCase())
  if (!user || typeof password !== 'string' || !(await bcrypt.compare(password, user.passHash))) return bad(res, 'Incorrect email or password.', 401)
  res.json({ token: sign(user), user: pub(user) })
})

app.get('/api/auth/me', auth(), (req, res) => res.json({ user: pub(req.user) }))

app.get('/api/properties', (_req, res) => res.json({ properties }))
app.get('/api/properties/:id', (req, res) => {
  const property = properties.find((p) => p.id === req.params.id)
  property ? res.json({ property }) : bad(res, 'Property not found.', 404)
})

app.get('/api/favorites', auth(), (req, res) => res.json({ ids: db.data.favorites[req.user.id] || [] }))
const setFav = (on) => (req, res) => {
  if (!properties.some((p) => p.id === req.params.id)) return bad(res, 'Property not found.', 404)
  const set = new Set(db.data.favorites[req.user.id] || []); on ? set.add(req.params.id) : set.delete(req.params.id)
  db.data.favorites[req.user.id] = [...set]; db.save(); res.json({ ids: [...set] })
}
app.post('/api/favorites/:id', auth(), setFav(true))
app.delete('/api/favorites/:id', auth(), setFav(false))

app.post('/api/inquiries', auth(false), (req, res) => {
  const { name, email, phone = '', message, propertyId = null, propertyTitle = null } = req.body || {}
  if (typeof name !== 'string' || name.trim().length < 2 || !isEmail(email) || typeof message !== 'string' || message.trim().length < 5) return bad(res, 'Please complete name, a valid email and a message.')
  const inquiry = { id: randomUUID(), userId: req.user?.id || null, name: name.trim().slice(0, 100), email, phone: String(phone).slice(0, 40), message: message.trim().slice(0, 2000), propertyId, propertyTitle, createdAt: new Date().toISOString() }
  db.data.inquiries.unshift(inquiry); db.save()
  res.status(201).json({ inquiry })
})
app.get('/api/inquiries', auth(), (req, res) => res.json({ inquiries: db.data.inquiries.filter((i) => i.userId === req.user.id) }))

app.use('/api', (_req, res) => bad(res, 'Not found.', 404))

// Optional: serve the built frontend from the same server (single deploy).
const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST))
  app.use((req, res, next) => (req.method === 'GET' ? res.sendFile(path.join(DIST, 'index.html')) : next()))
}

app.listen(PORT, () => console.log(`VELARA API on http://localhost:${PORT}`))
