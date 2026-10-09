# Portfolio Admin Backend (NestJS + MongoDB)

High-performance NestJS backend with MongoDB integration designed for collecting and managing portfolio website and mobile APK analytics.

---

## 🚀 Features

- **Admin Authentication**: JWT-based secure authentication with bcrypt password hashing.
- **Enquiry Management**: Captures visitor inquiries with IP, city, country, browser, OS, and source (`web` or `apk`).
- **Visitor Tracking**: Logs visitors across web and APK platforms with device type, referrer, visit counts, and location.
- **APK Download Tracking**: Records who, when, and where users download the Android APK.
- **Aggregated Analytics & KPIs**: Real-time metrics on conversion, geography, and traffic.
- **Resilient Hybrid Storage**: Seamlessly stores data in MongoDB via Mongoose, with an automatic in-memory fallback if MongoDB is connecting or offline.

---

## 🛠️ Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Local server port | `3000` |
| `MONGODB_URI` | MongoDB Atlas or local connection string | `mongodb://127.0.0.1:27017/portfolio_admin` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_secure_jwt_secret_token` |
| `ADMIN_EMAIL` | Default administrator login email | `shubh-tech96@gmail.com` |
| `ADMIN_PASSWORD` | Default administrator password | `your_secure_admin_password` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |

---

## 💻 Running Locally

```bash
# Navigate to the admin folder
cd admin

# Install dependencies
npm install

# Start development server
npm run start:dev

# Or run production build
npm run build
npm run start:prod
```

Server will be running at `http://localhost:3000/api`.

---

## 📡 API Endpoints

### 1. Authentication
- `POST /api/auth/login` — Admin login (returns JWT token and user profile)
- `GET /api/auth/me` *(Protected)* — Current authenticated admin details

### 2. Contact Inquiries
- `POST /api/enquiries` *(Public)* — Submit enquiry from website or APK (auto-extracts IP, location, device)
- `GET /api/enquiries` *(Protected)* — List all inquiries with filtering, search, and pagination
- `PATCH /api/enquiries/:id/status` *(Protected)* — Update status (`new`, `read`, `replied`, `archived`)
- `DELETE /api/enquiries/:id` *(Protected)* — Remove enquiry

### 3. Visitor Tracking
- `POST /api/visitors/track` *(Public)* — Record a visit (on page view or APK launch)
- `GET /api/visitors` *(Protected)* — List visitors with country, device, and source filters

### 4. APK Download Tracking
- `POST /api/downloads/track` *(Public)* — Record an APK download click event
- `GET /api/downloads/apk` *(Public)* — Direct download endpoint with auto-tracking redirect
- `GET /api/downloads` *(Protected)* — List all APK download records

### 5. Dashboard Analytics
- `GET /api/stats` *(Protected)* — Summary KPIs, source breakdown, device breakdown, top countries, and recent activity timeline

---

## ☁️ Vercel Deployment

When deployed to Vercel, the NestJS application is automatically executed as a serverless function via `/api/index.ts`. All `/api/*` routes are handled seamlessly without requiring an independent running server.
