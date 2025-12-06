# Backend Structure Document

# Backend Structure Document

This document outlines the backend architecture, hosting setup, and infrastructure components for **ISP-Care Pro**. It’s written in everyday language so anyone can understand how the backend works.

## 1. Backend Architecture

We chose a modular, layered approach using Node.js and Express. This keeps code organized and easy to maintain:

- **Framework & Patterns**
  - Node.js with Express for handling HTTP requests
  - MVC (Model-View-Controller) style: controllers manage routes, services hold business logic, repositories talk to the database
  - Separate modules (Auth, Customers, Tickets, Finance, Reports, Notifications) so new features plug right in
- **Scalability**
  - Docker containers for each module, so we can spin up more instances when traffic grows
  - Stateless design: all user data and sessions live in PostgreSQL or Redis, not in memory
- **Maintainability**
  - Clear folder structure: `/controllers`, `/services`, `/repositories`, `/models`, `/routes`
  - Environment variables for configuration (no hard-coded values)
  - Automated tests split into unit and integration tests
- **Performance**
  - Caching of frequently requested data (e.g., service plans, tenant settings) in Redis
  - Asynchronous tasks (MikroTik polling, Telegram notifications) handled by a job queue

## 2. Database Management

We use PostgreSQL, a trusted relational database, with one database per cluster and row-level isolation for tenants.

- **Type & System**
  - SQL database: PostgreSQL
- **Multi-Tenancy**
  - Each record has a `tenant_id` column to keep data separate
  - Shared database, single schema
- **Data Structure & Access**
  - Tables for users, roles, tenants, customers, PPPoE secrets, tickets, transactions, audit logs, subscriptions, etc.
  - Indexes on key columns (`tenant_id`, `user_id`, `created_at`) to speed up queries
- **Data Management**
  - Daily backups (dump + WAL) to local backup server
  - Migrations handled with a tool like `knex` or `sequelize` CLI
  - CSV import endpoint that parses files in the backend and inserts data in batches

## 3. Database Schema

### Human-Readable Overview

- Tenants: businesses using the platform
- Users: Super Admin, Admin, Technician with roles and permissions
- Roles: maps to permission sets
- Customers: ISP customers, with address and geo-coordinates
- Service Plans: defines bandwidth and pricing
- PPPoE Secrets: records on MikroTik for each customer
- Tickets: support case lifecycle
- Transactions: income and expense entries
- Subscriptions: tracks subscription tier and billing period
- Audit Logs: who did what and when

### SQL Schema (PostgreSQL)

```sql
-- Tenants
CREATE TABLE tenants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  domain VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Roles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  tenant_id INT REFERENCES tenants(id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(id),
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(200) NOT NULL,
  full_name VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Service Plans
CREATE TABLE service_plans (
  id SERIAL PRIMARY KEY,
  tenant_id INT REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  bandwidth INT NOT NULL,    -- in Mbps
  price NUMERIC(10,2) NOT NULL,
  description TEXT
);

-- Customers
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  tenant_id INT REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  plan_id INT REFERENCES service_plans(id),
  status VARCHAR(20) DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT NOW()
);

-- PPPoE Secrets
CREATE TABLE pppoe_secrets (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
  mikrotik_id VARCHAR(50),
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  rate_limit VARCHAR(50),
  status VARCHAR(20) DEFAULT 'disabled',
  updated_at TIMESTAMP
);

-- Tickets
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  tenant_id INT REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id INT REFERENCES customers(id),
  created_by INT REFERENCES users(id),
  assigned_to INT REFERENCES users(id),
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Transactions
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  tenant_id INT REFERENCES tenants(id) ON DELETE CASCADE,
  type VARCHAR(10) CHECK (type IN ('income','expense')),
  category VARCHAR(50),
  amount NUMERIC(12,2) NOT NULL,
  transaction_date DATE NOT NULL,
  description TEXT,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  tenant_id INT REFERENCES tenants(id) ON DELETE CASCADE,
  tier VARCHAR(20) CHECK (tier IN ('Basic','Standard','Premium')),
  start_date DATE,
  end_date DATE,
  status VARCHAR(20)
);

-- Audit Logs
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  tenant_id INT REFERENCES tenants(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id),
  action VARCHAR(100),
  entity VARCHAR(50),
  entity_id INT,
  changes JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
```  

## 4. API Design and Endpoints

We use RESTful endpoints with clear URL patterns. JSON is the data exchange format.

### Authentication & User Management

- POST `/api/auth/login` – user login, returns JWT pair (access + refresh)
- POST `/api/auth/refresh` – refresh access token
- POST `/api/auth/logout` – invalidate refresh token
- GET `/api/users` – list users (Super Admin only)
- POST `/api/users` – create user
- PATCH `/api/users/:id` – edit user (roles, status)
- DELETE `/api/users/:id` – deactivate user

### Customer & PPPoE

- GET `/api/customers` – list customers (with filters)
- POST `/api/customers` – add customer
- GET `/api/customers/:id` – get details
- PATCH `/api/customers/:id` – update customer
- DELETE `/api/customers/:id` – remove customer
- POST `/api/customers/:id/pppoe` – create/modify PPPoE
- PATCH `/api/customers/:id/pppoe/status` – enable/disable secret
- GET `/api/customers/:id/status` – real-time connection status

### Geographic Monitoring

- GET `/api/customers/geo` – returns geo-coordinates and status for map markers

### Support Ticketing

- GET `/api/tickets` – list tickets
- POST `/api/tickets` – open a ticket
- PATCH `/api/tickets/:id` – update status or assign technician
- GET `/api/tickets/:id` – ticket details

### Financial Management

- GET `/api/transactions` – list income/expenses
- POST `/api/transactions` – add transaction
- GET `/api/reports/financial` – profit & loss, cash flow

### Reporting & Analytics

- GET `/api/reports/executive` – top‐level KPIs
- GET `/api/reports/:module` – module‐specific reports
- POST `/api/reports/custom` – generate custom report

### Integrations & Utilities

- POST `/api/import/csv` – upload CSV for bulk import
- POST `/api/webhooks/xendit` – handle payment events
- POST `/api/webhooks/mikrotik` – handle router events (optional)
- POST `/api/notifications/telegram` – send Telegram alerts
- GET `/api/audit/logs` – view audit trail (Super Admin)

## 5. Hosting Solutions

We’re hosting entirely on-premises to meet data-control requirements:

- **Containerization**
  - Docker for app services and worker queues
  - Docker Compose or Kubernetes (if the environment supports it)
- **Load Balancing**
  - Nginx or HAProxy as reverse proxy and load balancer
- **Database Server**
  - Dedicated PostgreSQL server with replication standby for failover
- **Storage**
  - Network-attached storage (NAS) for backups and uploaded files
- **Benefits**
  - Full control over hardware and data
  - Predictable costs (no cloud bills)
  - Compliance with strict security policies

## 6. Infrastructure Components

- **Load Balancer**
  - Distributes HTTP traffic across multiple Node.js instances
- **Caching**
  - Redis for:
    - JWT blacklisting
    - PPPoE status caching
    - Rate limiting counters
- **Message Queue**
  - Redis Queue or RabbitMQ for background jobs:
    - Polling MikroTik router statuses
    - Sending Telegram notifications
    - Generating reports
- **Content Delivery / Static Assets**
  - Nginx serves PWA assets; uses aggressive caching headers
  - Optionally integrate with an external CDN for global caching
- **API Gateway** (optional)
  - Nginx with JWT validation plugin for a single entry point

## 7. Security Measures

- **Authentication & Authorization**
  - JWT tokens (short-lived access, longer refresh) over HTTPS
  - RBAC middleware checks user roles on each endpoint
- **Data Protection**
  - TLS encryption for all network traffic
  - Disk encryption on database server
  - Environment variables or vault for secrets
- **Input Validation**
  - Validate and sanitize all inputs with a library like Joi
- **Rate Limiting & DDOS Protection**
  - express-rate-limit to throttle requests
- **Audit Logging**
  - Every create/update/delete is logged with old vs. new values
- **Vulnerability Scans**
  - Regular dependency checks (`npm audit`)
  - Periodic penetration tests if policy requires

## 8. Monitoring and Maintenance

- **Logging**
  - Winston writes structured logs to file
  - Forward logs to a local ELK stack or Graylog
- **Metrics & Health**
  - Prometheus Node Exporter on each service
  - Grafana dashboards for:
    - CPU/memory usage
    - Request latency & error rates
    - Database query performance
  - `/health` endpoint for uptime checks
- **Alerts**
  - Alertmanager triggers email or SMS on high error rates or service down
- **Backups & Updates**
  - Daily database dumps + WAL archiving
  - Weekly restores test on a staging server
  - CI/CD pipeline runs tests and deploys new images
  - Scheduled maintenance windows for upgrades

## 9. Conclusion and Overall Backend Summary

The ISP-Care Pro backend is a modular Node.js/Express system with a PostgreSQL core, designed for small to mid-sized ISPs. It supports:

- Secure, token-based login and fine-grained roles
- Automated PPPoE management via MikroTik integration
- Interactive, role-based maps of customer locations
- Full support ticket lifecycle and technician dashboard
- Financial tracking and dynamic reporting tools
- CSV import, Telegram notifications, and payment handling via Xendit
- On-premises deployment for maximum data control

This setup delivers a scalable, maintainable, and secure foundation—ready to grow with ISP businesses while keeping daily operations smooth and data safe.

---
**Document Details**
- **Project ID**: 5df15940-ecfb-4c61-a11c-4146dc32684e
- **Document ID**: beae79c0-91ec-48d3-8750-0c64d69fc56d
- **Type**: custom
- **Custom Type**: backend_structure_document
- **Status**: completed
- **Generated On**: 2025-12-02T03:06:51.595Z
- **Last Updated**: N/A
