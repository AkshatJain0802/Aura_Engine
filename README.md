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

## Deployment Guide

### 1. GitHub

1. Create a new public repository.
2. Push the monorepo to the repository.
3. Confirm `.env` files are excluded from version control.
4. Include both README files so the repo supports both public users and reviewers.

### 2. MongoDB Atlas

1. Create an Atlas cluster.
2. Create a database user with read/write access.
3. Add your IP address to Network Access.
4. Use a URI like:

```text
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/aura_engine?retryWrites=true&w=majority&appName=Cluster0
```

5. Update [server/.env](server/.env) with the Atlas URI.

### 3. Render Backend

Recommended Render settings:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `MONGODB_URI`
  - `PORT=5000`
  - `CORS_ORIGIN=<your Vercel URL>`

After deployment, your API will be available at the Render service URL.

### 4. Vercel Frontend

Recommended Vercel settings:

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_BASE_URL=<your Render backend URL>`

After deployment, your dashboard will be available at the Vercel project URL.

## API Endpoints

### Inventory

- `GET /api/inventory?page=1&limit=50&search=audio&category=electronics&sort=-price`
- `POST /api/inventory`
- `PUT /api/inventory/:id`

### Analytics

- `GET /api/analytics`

## Demo Checklist

- Open the browser Network tab and show 50 items loading per page
- Search for a specific product using the Search button
- Export the current page to CSV
- Show the valuation chart updating from the aggregation endpoint
- Run `GET /api/inventory?search=laptop&limit=5` in Postman
- Show `GET /api/analytics` returning aggregated totals quickly

## Notes

- The inventory API never loads all records into the browser at once.
- Analytics are computed in MongoDB using aggregation pipelines, not JavaScript loops over the full dataset.
- The project is public-facing under the code name Aura Engine.

