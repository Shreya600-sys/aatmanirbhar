<div align="center">

<img src="Client/public/logo.png" alt="Aatmanirbhar Nari" width="220" />

# Aatmanirbhar Nari

**Dream. Learn. Earn. Grow.**

A home business portal that helps women entrepreneurs reach local customers.

</div>

---

## About

**Aatmanirbhar Nari** is a MERN web application where women running home-based businesses (tiffin services, tailoring, beauty services, handicrafts, baking, mehendi art, home tuition and more) can list their services, and customers can find, book and review them.

## Features

**Customers**
- Sign up / log in with email and password
- Search services by keyword, category and price; sort by newest or price
- Book a service for a date and time (double bookings are blocked)
- Track bookings in a dashboard, cancel them, and review completed ones

**Entrepreneurs**
- Create, edit and delete service listings (with image links)
- Accept, reject or complete incoming bookings
- Dashboard with active orders and earnings

> Payments are not handled by the site. Customers pay the entrepreneur directly.

## Tech Stack

| Part | Technology |
|------|------------|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, TanStack Query, React Hook Form |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB (Atlas free tier or local) |
| Login | Email + password, JWT token |

No email service, Google login, or image-upload service is needed.

## Project Structure

```
aatmanirbhar-nari/
├── Client/   React app (Vite)
│   └── src/  components, context, features, hooks, layouts, lib, pages
└── Server/   Express API
    └── config, controllers, middleware, models, routes, utils, server.js
```

## Run Locally

You need **Node.js 18+** and a **MongoDB** database (a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster is easiest).

### 1. Backend
```bash
cd Server
npm install
cp .env.example .env      # then open .env and fill in MONGO_URI and JWT_SECRET
npm run dev               # runs on http://localhost:8080
```
The default categories (Tiffin Service, Tailoring, ...) are added automatically the first time the server starts.

### 2. Frontend
```bash
cd Client
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:8080 is already correct for local use
npm run dev               # opens on http://localhost:5173
```

Open http://localhost:5173, create an account, and you are logged in straight away.
Choose **"I'm an Entrepreneur"** when registering to be able to post services.

## Deploy

Deploy the backend first, then the frontend (it needs the backend's URL).

### 1. Database: MongoDB Atlas
1. Create a free cluster and a database user.
2. **Network Access** -> add `0.0.0.0/0` (so your hosted server can connect).
3. Copy the connection string (`mongodb+srv://...`) and put your password in it.

### 2. Backend: Render (or Railway)
Create a **Web Service** from your GitHub repo:

| Setting | Value |
|---------|-------|
| Root Directory | `Server` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Environment variables:

| Name | Value |
|------|-------|
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | any long random text |
| `CLIENT_URL` | *(optional)* your frontend URL, no trailing slash. Set it after step 3 |

When it is live, open `https://<your-backend>.onrender.com/`. You should see **"Aatmanirbhar Nari API is running..."**.
(On Render's free plan the server sleeps when idle, so the first request can take up to a minute.)

### 3. Frontend: Vercel (or Netlify)
Import the same repo:

| Setting | Value |
|---------|-------|
| Root Directory | `Client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Environment variable: `VITE_API_URL` = your backend URL (e.g. `https://<your-backend>.onrender.com`).

Page refreshes on routes like `/dashboard` already work (`vercel.json` and `public/_redirects` handle this).

> `VITE_` variables are baked in when the site is **built**. If you change one, redeploy the frontend.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Server stops with "Missing environment variable" | Add `MONGO_URI` and `JWT_SECRET` to `Server/.env` (or your host's settings) |
| "Could not start the server" | Wrong `MONGO_URI`, or Atlas Network Access doesn't allow your server |
| Site says "Network Error" after deploying | `VITE_API_URL` is wrong or missing, or `CLIENT_URL` on the backend doesn't exactly match your frontend URL |
| "Invalid email or password" | Wrong credentials. Accounts from the old version still work, with the same password |
| Asked to log in again | Your login lasts 7 days (`JWT_EXPIRE`). Log in again |

## Customising
- Brand name, tagline and contact details: `Client/src/config/site.js`
- Logo: replace `Client/public/logo.png` (and `favicon.png`, `apple-touch-icon.png`)
- Starter categories: `Server/utils/seedCategories.js`

---

<div align="center">Made with ❤️ for women entrepreneurs · <b>Dream. Learn. Earn. Grow.</b></div>
