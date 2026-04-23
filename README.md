# 🚌 KSRTC Bus Reservation System

A full-stack microservices-based bus reservation system for Karnataka KSRTC buses, built with Node.js, Express, MongoDB, and React.

---

## 📁 Project Structure

```
bus-reservation-system/
├── api-gateway/              # API Gateway (port 5000)
├── services/
│   ├── auth-service/         # Authentication & OAuth (port 5001)
│   ├── bus-service/          # Bus management (port 5002)
│   ├── booking-service/      # Booking management (port 5003)
│   ├── payment-service/      # Payment simulation (port 5004)
│   ├── user-service/         # User profiles (port 5005)
│   └── notification-service/ # Email notifications (port 5006)
└── frontend/                 # React + Vite frontend (port 5173)
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- [Google Cloud Console](https://console.cloud.google.com/) project with OAuth 2.0 credentials
- Gmail account with an [App Password](https://myaccount.google.com/apppasswords) for notifications

---

## 🔐 Environment Setup

Each service has its own `.env` file. Copy the `.env.example` in each folder and fill in your values.

> ⚠️ **Important:** `JWT_SECRET` must be the **same value** across all services.

### api-gateway/.env
```
PORT=5000
JWT_SECRET=your_jwt_secret_here
AUTH_SERVICE_URL=http://localhost:5001
BUS_SERVICE_URL=http://localhost:5002
BOOKING_SERVICE_URL=http://localhost:5003
PAYMENT_SERVICE_URL=http://localhost:5004
USER_SERVICE_URL=http://localhost:5005
NOTIFICATION_SERVICE_URL=http://localhost:5006
```

### services/auth-service/.env
```
PORT=5001
JWT_SECRET=your_jwt_secret_here
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

### services/bus-service/.env
```
PORT=5002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
```

### services/booking-service/.env
```
PORT=5003
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
AUTH_SERVICE_URL=http://localhost:5001
BUS_SERVICE_URL=http://localhost:5002
PAYMENT_SERVICE_URL=http://localhost:5004
```

### services/payment-service/.env
```
PORT=5004
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
BOOKING_SERVICE_URL=http://localhost:5003
NOTIFICATION_SERVICE_URL=http://localhost:5006
```

### services/user-service/.env
```
PORT=5005
MONGO_URI=your_mongodb_connection_string
AUTH_SERVICE_URL=http://localhost:5001
```

### services/notification-service/.env
```
PORT=5006
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

---

## 🚀 Running the Project

### Option 1 — Docker (Recommended)

Make sure Docker Desktop is running, then from the project root:

```bash
# Copy and fill in the root .env file first
cp .env.example .env

docker-compose up --build
```

| Service      | URL                    |
|--------------|------------------------|
| Frontend     | http://localhost:3000  |
| API Gateway  | http://localhost:5000  |

To stop:
```bash
docker-compose down
```

---

### Option 2 — Manual (Development)

Open **8 terminals**, one per service:

```bash
# Terminal 1 — Auth Service
cd services/auth-service
npm install
node src/server.js

# Terminal 2 — Bus Service
cd services/bus-service
npm install
npm run dev

# Terminal 3 — Booking Service
cd services/booking-service
npm install
npm run dev

# Terminal 4 — Payment Service
cd services/payment-service
npm install
npm run dev

# Terminal 5 — User Service
cd services/user-service
npm install
npm run dev

# Terminal 6 — Notification Service
cd services/notification-service
npm install
npm run dev

# Terminal 7 — API Gateway
cd api-gateway
npm install
npm run dev

# Terminal 8 — Frontend
cd frontend
npm install
npm run dev
```

| Service      | URL                         |
|--------------|-----------------------------|
| Frontend     | http://localhost:5173       |
| API Gateway  | http://localhost:5000       |
| Auth         | http://localhost:5001       |
| Bus          | http://localhost:5002       |
| Booking      | http://localhost:5003       |
| Payment      | http://localhost:5004       |
| User         | http://localhost:5005       |
| Notification | http://localhost:5006       |

---

## 🌱 Seeding the Database

After starting the bus-service, populate it with 50 KSRTC Karnataka buses:

```bash
cd services/bus-service
npm run seed
```

This seeds buses across all major Karnataka routes (Bangalore → Mysore, Mangalore, Hubli, etc.) with 5 bus types:

| Type              | Price  | Seats |
|-------------------|--------|-------|
| KSRTC Ordinary    | ₹120   | 52    |
| KSRTC Express     | ₹180   | 52    |
| KSRTC Rajahamsa   | ₹280   | 52    |
| KSRTC Airavat     | ₹420   | 36    |
| KSRTC Club Class  | ₹600   | 24    |

---

## 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Set **Authorized redirect URI** to:
   ```
   http://localhost:5001/api/oauth/google/callback
   ```
4. Copy the **Client ID** and **Client Secret** into `services/auth-service/.env`

---

## 📧 Email Notifications Setup

1. Enable 2-Step Verification on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Add to `services/notification-service/.env`:
   ```
   EMAIL_USER=your@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```

---

## 🗺️ API Routes

All requests go through the **API Gateway** at `http://localhost:5000`.

### Auth (`/api/auth`)
| Method | Route                    | Auth | Description          |
|--------|--------------------------|------|----------------------|
| POST   | /api/auth/register       | ❌   | Register user        |
| POST   | /api/auth/login          | ❌   | Login user           |
| GET    | /api/auth/validate       | ✅   | Validate JWT token   |
| GET    | /api/auth/google         | ❌   | Google OAuth login   |
| GET    | /api/auth/google/callback| ❌   | Google OAuth callback|

### Bus (`/api/bus`)
| Method | Route              | Auth  | Description         |
|--------|--------------------|-------|---------------------|
| GET    | /api/bus/cities    | ❌    | Get all cities      |
| GET    | /api/bus/search    | ❌    | Search buses        |
| GET    | /api/bus/:id       | ✅    | Get bus by ID       |
| POST   | /api/bus/add       | Admin | Add a bus           |
| PUT    | /api/bus/:id       | Admin | Update a bus        |
| DELETE | /api/bus/:id       | Admin | Delete a bus        |

### Booking (`/api/booking`)
| Method | Route                        | Auth | Description              |
|--------|------------------------------|------|--------------------------|
| POST   | /api/booking/create          | ✅   | Create booking           |
| GET    | /api/booking/my              | ✅   | Get my bookings          |
| GET    | /api/booking/:id             | ✅   | Get booking by ID        |
| PATCH  | /api/booking/:id/cancel      | ✅   | Cancel booking           |

### Payment (`/api/payment`)
| Method | Route                        | Auth | Description              |
|--------|------------------------------|------|--------------------------|
| POST   | /api/payment/process         | ✅   | Process payment          |
| GET    | /api/payment/:bookingId      | ✅   | Get payment by booking   |

### User (`/api/user`)
| Method | Route              | Auth | Description         |
|--------|--------------------|------|---------------------|
| GET    | /api/user/profile  | ✅   | Get user profile    |
| PUT    | /api/user/profile  | ✅   | Update user profile |

---

## 🏗️ Architecture

```
Browser
   │
   ▼
Frontend (React/Vite :5173)
   │  /api/* requests
   ▼
API Gateway (:5000)
   │  routes + JWT validation + rate limiting
   ├──▶ Auth Service (:5001)      — MongoDB
   ├──▶ Bus Service (:5002)       — MongoDB
   ├──▶ Booking Service (:5003)   — MongoDB
   ├──▶ Payment Service (:5004)   — MongoDB
   ├──▶ User Service (:5005)      — MongoDB
   └──▶ Notification Service (:5006) — Gmail SMTP
```

### Inter-service communication
```
Booking → Bus Service       (verify seats)
Booking → Payment Service   (trigger payment)
Payment → Booking Service   (update payment status)
Payment → Notification      (send confirmation email)
User    → Auth Service      (validate token)
```

---

## 🧪 Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Frontend     | React 19, Vite, React Router v6   |
| API Gateway  | Express 5, http-proxy-middleware  |
| Services     | Node.js, Express, Mongoose        |
| Database     | MongoDB Atlas                     |
| Auth         | JWT, Passport.js, Google OAuth2   |
| Email        | Nodemailer + Gmail SMTP           |
| Container    | Docker, Docker Compose            |
