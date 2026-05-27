# 🚀 Workspace — Collaborative Project Management Platform

A real-time collaborative workspace application that enables teams to manage projects, tasks, meetings, and communication in one unified platform.

🌐 **Live Demo:** [https://workspace-fe.happysea-04483485.australiaeast.azurecontainerapps.io](https://workspace-fe.happysea-04483485.australiaeast.azurecontainerapps.io)

> ⚠️ This project is still actively under development and new features/improvements are continuously being added.  
> Initial loading time may be slower than expected because the application is hosted on lower-tier Azure subscriptions and services.

---

## ✨ Features

- **Project Management** — Create, update, and manage projects with team members
- **Task Board** — Kanban-style task board with drag-and-drop support and timeline view
- **Real-time Chat** — Project-scoped messaging with typing indicators
- **Video Meetings** — WebRTC-powered video conferencing with instant and scheduled meetings
- **Collaborative Whiteboard** — Real-time shared whiteboard during meetings
- **Authentication** — Secure SSO via Keycloak with PKCE flow
- **File Storage** — Avatar uploads via Google Cloud Storage (Firebase)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Internet                         │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────▼───────────────┐
         │   Azure Container Apps (FE)   │
         │   Nginx + React (Vite)        │
         │   Proxy /api/ → Backend       │
         └───────────────┬───────────────┘
                         │
         ┌───────────────▼───────────────┐
         │   Azure Container Apps (BE)   │
         │   Node.js + Express           │
         │   Socket.IO (WebSocket)       │
         └──┬──────────┬────────────┬───┘
            │          │            │
   ┌────────▼──┐ ┌─────▼──────┐ ┌──▼──────────────┐
   │  MongoDB  │ │  Keycloak  │ │ Firebase Storage │
   │  Atlas    │ │  Azure App │ │ Google Cloud     │
   └───────────┘ │  Service   │ └─────────────────┘
                 └────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| Redux Toolkit | State management |
| Socket.IO Client | Real-time communication |
| PeerJS (WebRTC) | Video conferencing |
| Keycloak JS | Authentication |
| Tailwind CSS | Styling |
| Radix UI | UI components |
| DnD Kit | Drag and drop |
| Playwright | E2E testing |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Socket.IO | WebSocket server |
| Mongoose | MongoDB ODM |
| Keycloak (authMiddleware) | Token verification |
| Firebase Admin | File storage |
| node-schedule | Meeting scheduling |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| express-mongo-sanitize | NoSQL injection prevention |

### Infrastructure
| Technology | Purpose |
|---|---|
| Azure Container Apps | Frontend + Backend hosting |
| Azure App Service | Keycloak hosting |
| Azure Container Registry | Docker image registry |
| MongoDB Atlas | Database |
| GitHub Actions | CI/CD pipeline |
| Docker + Docker Compose | Containerization |
| Turborepo | Monorepo management |

---

## 🔐 Security

- **Authentication** — Keycloak SSO with PKCE (Proof Key for Code Exchange)
- **Authorization** — JWT token verification on every API request via `authMiddleware`
- **CORS** — Restricted to allowed origins only
- **Rate Limiting** — 100 req/15min globally, 10 req/15min on auth endpoints
- **HTTP Headers** — Helmet.js for security headers (CSP, HSTS, X-Frame-Options)
- **NoSQL Injection** — `express-mongo-sanitize` strips malicious operators
- **Brute Force Protection** — Keycloak built-in brute force detection (lockout after 5 failed attempts)
- **HTTPS** — Enforced on all Azure services

---

## 📁 Project Structure

```
workspace/                          # Turborepo monorepo root
├── apps/
│   ├── workspace-fe/               # React frontend
│   │   ├── src/
│   │   │   ├── components/         # Reusable UI components
│   │   │   ├── pages/              # Page components
│   │   │   ├── store/              # Redux slices
│   │   │   ├── services/           # API service functions
│   │   │   └── model/              # Data models
│   │   ├── tests/                  # Playwright E2E tests
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   └── workspace-be/               # Node.js backend
│       ├── src/
│       │   ├── Controllers/        # Route handlers
│       │   ├── Services/           # Business logic
│       │   ├── Models/             # Mongoose schemas
│       │   ├── Routes/             # Express routers
│       │   ├── middleware/         # Auth middleware
│       │   └── utils/              # Utilities
│       ├── tests/                  # Jest unit tests
│       └── Dockerfile
├── .github/
│   └── workflows/
│       ├── ci.yml                  # PR checks (lint + test)
│       ├── staging.yml             # Deploy to staging
│       └── production.yml          # Deploy to production
├── docker-compose.yml              # Local development
└── turbo.json
```

---

## 📄 License

MIT
