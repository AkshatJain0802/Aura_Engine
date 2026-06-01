# Aura Engine

Aura Engine is a full-stack inventory management dashboard built for large catalog workloads. It combines a Node.js and Express API, MongoDB Atlas, and a React + TypeScript frontend to deliver server-side search, pagination, validation, and analytics over 50,000+ products without freezing the browser.

## Highlights

- Server-side inventory search, filtering, sorting, and pagination
- MongoDB aggregation for category valuation and inventory summaries
- Strict API validation with business rules enforced at the backend
- Standalone seeder that creates 50,000 realistic mock products
- CSV export for the currently loaded inventory page

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts
- Backend: Node.js, Express, Mongoose, Zod
- Database: MongoDB Atlas
- Tooling: npm workspaces, Concurrently, Faker, Nodemon

## Repository Structure

- [client](client): React dashboard application
- [server](server): Express API, validation, analytics, and seed script

## Public Repo Notes

- Environment files are excluded from version control.
- Internal build notes and AI transparency logs are excluded from the public repository.

## Screens

- KPI summary cards for totals and low-stock counts
- Valuation-by-category chart
- Inventory table with server-side pagination
- Search, filter, sort, and page-size controls
- CSV export for the active page

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- MongoDB Atlas cluster or a compatible MongoDB deployment

## Environment Setup

### Server

Copy [server/.env.example](server/.env.example) to [server/.env](server/.env) and set:

- `MONGODB_URI`: MongoDB connection string
- `PORT`: API port, usually `5000`
- `CORS_ORIGIN`: Frontend URL, usually `http://localhost:5173` in development

### Client

Copy [client/.env.example](client/.env.example) to [client/.env](client/.env) and set:

- `VITE_API_BASE_URL`: Backend URL, usually `http://localhost:5000` in development

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Configure the server environment file.

3. Seed the database with 50,000 products:

```bash
npm run seed:drop
```

4. Start both applications:

```bash
npm run dev
```

5. Open the app:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Deployment

This section contains the essential deployment notes and placeholders for your live URLs. Replace the example values with your own when you publish.

### Live URLs (replace with your values)

- Frontend (example): YOUR_FRONTEND_URL  
  e.g. https://aura-engine-client.vercel.app/
- Backend (example): YOUR_BACKEND_URL  
  e.g. https://aura-engine-api-7n4u.onrender.com

### Render (backend) — essential settings

- Root directory: `server`
- Build command: `npm ci`
- Start command: `npm start`
- Env variables (minimum):
  - `MONGODB_URI` — MongoDB Atlas connection string
  - `PORT` — typically `5000`
  - `CORS_ORIGIN` — set to your frontend URL (e.g. `https://your-frontend.example`)

After updating environment variables in the Render dashboard, trigger a redeploy.

### Vercel (frontend) — essential settings

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Env variable:
  - `VITE_API_BASE_URL` — set to your backend URL (e.g. `https://your-backend.example`)

### Quick verification

Use these commands (replace `YOUR_BACKEND_URL`) to verify endpoints and CORS from a terminal:

```bash
curl -i "YOUR_BACKEND_URL/api/inventory?page=1&limit=1"
curl -i "YOUR_BACKEND_URL/api/analytics"
```

Expect an `Access-Control-Allow-Origin` header that matches your frontend URL.

Notes:
- Avoid using `*` for `CORS_ORIGIN` in production — lock it to your frontend origin.
- Optionally add a `render.yaml` at the repository root to store reproducible Render service settings.

## API Endpoints

### Inventory

- `GET /api/inventory?page=1&limit=50&search=audio&category=electronics&sort=-price`
- `POST /api/inventory`
- `PUT /api/inventory/:id`

## Notes

- The inventory API never loads all records into the browser at once.
- Analytics are computed in MongoDB using aggregation pipelines, not JavaScript loops over the full dataset.


