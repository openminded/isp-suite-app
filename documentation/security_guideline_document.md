# Security Guideline Document

# ISP-Care Pro: Detailed Implementation Plan

## Table of Contents
1. Architecture Overview
2. Data Model & Multi-Tenancy Strategy
3. Backend (Node.js + Express)
4. Frontend (React + Leaflet.js)
5. Mikrotik RouterOS Integration
6. Security Controls & Best Practices
7. CI/CD, Containerization & Deployment
8. Monitoring, Logging & Audit
9. CSV Import & Data Migration
10. Notifications & External Integrations

---

## 1. Architecture Overview

- **Client**: React SPA (PWA-ready), served via Nginx reverse proxy over HTTPS.
- **API**: Express.js with JWT-based auth, rate limiting, CORS, security headers.
- **Database**: PostgreSQL with schema-per-tenant for data isolation.
- **ORM**: Sequelize (parameterized queries, migrations).
- **Authentication**: JWT + optional MFA, RBAC.
- **Infrastructure**: Docker Compose (app, db, nginx), GitLab CI/CD pipelines.
- **Load Balancer**: Nginx for SSL termination, request routing.

---

## 2. Data Model & Multi-Tenancy Strategy

1. **Tenants Table**: `Tenants (id, name, created_at, config)`
2. **Schema-Per-Tenant**
   - Dynamically create a DB schema for each tenant.
   - Sequelize config dynamically sets `search_path`.
3. **Shared Tables**: `Users`, `Roles`, `AuditLogs` in a central schema.
4. **Tenant-Scoped Tables** (per schema): `Customers`, `PPPoESessions`, `Tickets`, `Transactions`, `Packages`, `Reports`.
5. **Indexes & Constraints**
   - Foreign keys within each schema.
   - Unique constraints on tenant-scoped identifiers.

---

## 3. Backend (Node.js + Express)

### 3.1 Project Structure

- `/src`
  - `config/` (env loader, secrets management)
  - `middleware/` (auth, rate-limiting, error handler)
  - `controllers/` (modules: auth, users, customers, tickets, finance, reports)
  - `models/` (Sequelize models per schema)
  - `services/` (Mikrotik API client, Telegram notifier)
  - `routes/` (versioned: v1/*)
  - `utils/` (validation, encryption, logging)
  - `app.js`, `server.js`

### 3.2 Key Features

- **Authentication**
  - Password hashing: bcrypt or Argon2 with per-user salt.
  - JWT: RS256 (asymmetric keys) or HS512, `exp` claim, token revocation list.
  - MFA: TOTP via authenticator apps (optional flow).

- **RBAC**
  - Define roles: SuperAdmin, Admin, Technician.
  - Permissions table to map roles → endpoints/actions.
  - Middleware to enforce permissions on each route.

- **API Endpoints**
  - Versioning: `/api/v1/auth`, `/api/v1/users`, `/api/v1/customers`, etc.
  - Input validation: Joi or Yup in controllers.
  - Output encoding: sanitize responses.

- **Rate Limiting & Throttling**
  - express-rate-limit per IP/user on auth endpoints.

- **CSRF Protection**
  - For cookie-based auth flows (if used), use csurf tokens.

- **Error Handling**
  - Central error handler. No stack traces in production.
  - Custom error codes and messages.

---

## 4. Frontend (React + Leaflet.js)

### 4.1 Structure

- **Pages/Routes**
  - Login, Dashboard, Customer Map, PPPoE Management, Tickets, Finance, Reports, Profile.
- **State Management**
  - React Context + custom hooks for auth & tenant data.
- **UI Components**
  - Modular, themeable (neutral palette), responsive (Flexbox, CSS Grid).
- **Forms**
  - Validation with Formik + Yup (client + server validation synergy).
- **Map**
  - Leaflet.js: marker clustering, custom icons for status.

### 4.2 Security

- **CSP**: `default-src 'self'; script-src 'self';` etc.
- **SRI**: For any CDN scripts.
- **Secure Cookies**: `HttpOnly`, `Secure`, `SameSite=Strict`.
- **Sanitize HTML**: DomPurify for any rich text.

---

## 5. Mikrotik RouterOS Integration

- **Service**: `MikrotikClient` using RouterOS v7 REST API.
- **Config**: Base URL + API token in Vault (not in code).
- **Operations**
  - Create/Update PPPoE user
  - Set rate-limit profiles
  - Enable/Disable accounts
  - Poll `/ppp/active` for real-time sync (CRON or message queue)
- **Error Handling & Retries**: Exponential backoff on network errors.

---

## 6. Security Controls & Best Practices

1. **Secure Defaults**
   - Disabled debug mode in production.
2. **Secrets Management**
   - Use AWS Secrets Manager / HashiCorp Vault for DB credentials, JWT keys, Mikrotik token.
3. **Transport Encryption**
   - TLS 1.2+ everywhere. HSTS via Nginx.
4. **DB Security**
   - Dedicated DB user per tenant with minimal privileges.
   - Encrypt at rest (PostgreSQL pgcrypto or disk encryption).
5. **Headers**
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: no-referrer`
6. **Logging & Monitoring**
   - Centralized logs (stdout → ELK/Prometheus).
   - Log access attempts, admin actions, Mikrotik calls (obfuscate PII).
7. **Dependency Management**
   - npm audit in CI, Dependabot for updates.

---

## 7. CI/CD, Containerization & Deployment

- **GitLab CI/CD**
  - Stages: lint → test → build → scan → deploy.
  - Sast/SCA scans integrated.
- **Docker Compose**
  - Services: `app`, `db`, `nginx`, `redis` (for caching & rate limits).
- **Deployment**
  - On-premises VM or k8s cluster.
  - Nginx for reverse proxy & load balancing.

---

## 8. Monitoring, Logging & Audit

- **Audit Logs**: Immutable write-only store for user actions.
- **Metrics**: Prometheus + Grafana dashboards for API latency, error rates.
- **Alerting**: PagerDuty/Slack alerts on high error rates or security events.

---

## 9. CSV Import & Data Migration

- **CSV Parser**: `csv-parser` with header validation.
- **Validation**: Column whitelist, type checks, referential integrity.
- **Batch Processing**: Chunked imports (via Bull queue) with progress reporting.
- **Error Reporting**: Detailed import logs, failure reasons.

---

## 10. Notifications & External Integrations

- **Telegram**: Bot integration via `node-telegram-bot-api`.
  - Event hooks: new ticket, subscription expired, etc.
- **Payment Gateway (Xendit)**
  - Webhook endpoint with HMAC signature validation.
- **Export & Reporting**
  - CSV/PDF exports via `json2csv` / `pdfkit`.

---

**Next Steps**
- Flesh out API contracts (OpenAPI spec).
- Define Sequelize migrations.
- Prototype authentication & RBAC flows.
- Security review of container images.

*This plan aligns with security-by-design, least privilege, and defense-in-depth principles to deliver a robust, extensible ISP-Care Pro platform.*

---
**Document Details**
- **Project ID**: 5df15940-ecfb-4c61-a11c-4146dc32684e
- **Document ID**: 5af48176-64d0-4677-9cbd-f8e3f4a7ea48
- **Type**: custom
- **Custom Type**: security_guideline_document
- **Status**: completed
- **Generated On**: 2025-12-02T03:06:22.034Z
- **Last Updated**: N/A
