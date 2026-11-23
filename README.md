# VELARA — Cinematic Real Estate Website

A cinematic real estate website featuring a scroll-controlled film hero, interactive property listings, advanced search filters, property detail pages, and a frontend demo shopping-style experience for discovering and saving homes.

## Features

- Cinematic scroll-controlled hero experience
- Property listings with search and filters
- URL-synced property filters
- Individual property detail pages
- Property image galleries
- Mortgage calculator
- Viewing request forms
- Agent profiles and contact pages
- Sign-in and sign-up pages
- Protected account and saved homes
- Demo authentication and browser-based data storage
- Optional Express API backend

## Tech Stack

- React
- Vite
- JavaScript
- Express.js
- CSS
- localStorage

## Getting Started

Install dependencies:

```bash
npm install
```

Start the frontend in demo mode:

```bash
npm run dev
```

Open the local development URL shown in your terminal.

## Demo Login

- Email: `demo@velara.com`
- Password: `Demo1234`

Demo mode stores information in browser localStorage. It is intended for demonstration purposes only.

## Optional Backend

Start the Express API:

```bash
npm run server
```

Start the frontend configured for the API:

```bash
npm run dev:api
```

The API uses a local JSON-file database for development.

## Production Build

```bash
npm run build
```

The production frontend is generated in the `dist/` directory.

## Customization

- Hero timing and copy: `src/timeline.config.js`
- Property listings: `src/data/properties.js`
- Agents and testimonials: `src/data/site.js`
- Colours, fonts, and spacing: `src/styles.css`
- API configuration: `src/api/index.js`
- Backend: `server/index.js`

## Deployment

The frontend can be deployed on Vercel using the Vite production build.

The Express API requires separate backend hosting if live backend functionality is needed.

## Production Notice

This project is a demonstration, not a production-ready real estate platform.

Demo authentication is not secure. The included JSON-file database is intended for development only. Real deployments require secure authentication, a production database, HTTPS, rate limiting, and verified contact information.

---

© V4Softronic. All rights reserved.