# VELARA: cinematic real estate website

Scroll-controlled film hero + full multi-page real estate site (listings, filters, detail pages,
sign-in / sign-up, saved homes, enquiries) with sample data. Runs with **no backend** (demo mode),
and can be switched to a small included **Express API** with one command.

## Live Demo
https://velara-real-estate.digital11.workers.dev/

## Run it
```bash
npm install
npm run dev            # demo mode  -> http://localhost:5173  (data in your browser's localStorage)
```
Demo login: `demo@velara.com` / `Demo1234` (or create your own account).

## Run with the real backend
```bash
# terminal 1
npm run server         # API on http://localhost:4000  (data in server/db.json)
# terminal 2
npm run dev:api        # frontend, talks to the API through Vite's /api proxy
```

## Pages
`/` film + collection · `/properties` search & filters (URL-synced) · `/properties/:id` gallery, facts,
mortgage calculator, viewing request · `/agents` · `/contact` · `/signin` · `/signup` · `/account` (protected).

## Where things live
| Want to change…                      | Edit                              |
|--------------------------------------|-----------------------------------|
| Hero film timing, copy, scroll length| `src/timeline.config.js`          |
| Listings (dummy data)                | `src/data/properties.js`          |
| Agents, stats, testimonials          | `src/data/site.js`                |
| Colors / fonts / spacing             | top of `src/styles.css` (`:root`) |
| How data is fetched/saved            | `src/api/index.js`                |
| Backend                              | `server/index.js`                 |

## Replace the media
- Film: put clips at `public/assets/sequence-01.mp4` and `sequence-02.mp4`, re-encode with
  `scripts/encode-for-scrub.sh`, regenerate the seam still with `scripts/make-anchor.sh`.
- Listing photos: files live in `public/img/v/` (p1-1.jpg = villa 1, photo 1...). The `SHOTS` table at the bottom of
  `src/data/properties.js` maps each photo to a villa, caption and room type. Every photo is used once.
- Walkthrough video (home page, below the collection): `public/assets/walkthrough.mp4` + poster `public/img/v/walkthrough-poster.jpg`.

## Backend API (what `server/index.js` implements)
| Method | Path                    | Auth | Purpose                    |
|--------|-------------------------|------|----------------------------|
| POST   | /api/auth/signup        |      | create account → `{token,user}` |
| POST   | /api/auth/signin        |      | sign in → `{token,user}`   |
| GET    | /api/auth/me            | yes  | current user               |
| GET    | /api/properties[/:id]   |      | listings                   |
| GET    | /api/favorites          | yes  | saved ids                  |
| POST/DELETE | /api/favorites/:id | yes  | save / unsave              |
| POST   | /api/inquiries          | opt. | send enquiry               |
| GET    | /api/inquiries          | yes  | my enquiries               |

Use your own backend instead? Implement those endpoints (same JSON shapes) and set `VITE_API_URL`.

## Deploy
```bash
npm run build                       # frontend -> dist/
JWT_SECRET=long-random NODE_ENV=production npm run server   # API also serves dist/ if present
```
Static hosts need an SPA fallback: `public/_redirects` (Netlify) and `vercel.json` are included.
For a split deploy (frontend on Vercel/Netlify, API elsewhere) build with `VITE_API_URL=https://api.yoursite.com/api`
and run the API with `CLIENT_ORIGIN=https://yoursite.com`.

## Production checklist
Demo mode stores passwords in the browser and is **not secure**; use the API for anything real. The JSON-file
database is for development: move to Postgres/Supabase/Mongo before launch. Add rate limiting, HTTPS and
email verification. Replace sample photos, fictional brand and `*.example` contact details.
