# Project Requirements Document

# ISP-Care Pro: Project Requirements Document

## 1. Project Overview

ISP-Care Pro is a web-based SaaS platform designed to help small and mid-sized retail internet service providers (ISPs) streamline daily operations and make data-driven decisions. It brings together customer management, automated PPPoE provisioning, interactive geographic monitoring, support ticketing, financial tracking, and robust reporting—all under one roof. By automating routine tasks (like creating PPPoE accounts on MikroTik routers) and centralizing insights, ISP-Care Pro eliminates manual overhead, reduces errors, and frees up staff to focus on growth.

This platform is being built to address the fragmented toolsets most small ISPs currently juggle (spreadsheets for finances, separate ticketing systems, and manual router configurations). Key objectives are:

*   Enable rapid customer onboarding with automated router integration.
*   Provide clear, real-time visibility into network health and business KPIs.
*   Simplify billing and expenses tracking with custom financial reports.
*   Deliver a mobile-friendly experience (PWA) plus Telegram notifications.
*   Ensure data isolation per business (multi-tenant) and strong security.

Success criteria include reducing average ticket resolution time by 30%, cutting manual PPPoE setup steps by 90%, and achieving a 90% satisfaction rate among pilot customers.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1.0)**

*   User authentication with JWT and role-based access control (Super Admin, Admin, Technician).
*   User management interface (Super Admin level) and self-service profile updates.
*   Customer CRUD and MikroTik RouterOS v7 REST API integration for PPPoE secret creation, modification, rate limits, and disabling.
*   Background sync of PPPoE status and on-demand status refresh.
*   Internet service plan (package) management.
*   Interactive OpenStreetMap view with Leaflet.js, status-coded markers, pop-ups, filters, and technician-only views.
*   Support ticketing module with ticket lifecycle, technician assignment, categorization, and performance KPIs.
*   Financial management: custom income/expense categories, transaction logging, Profit & Loss and Cash Flow reports, CSV/PDF export.
*   Executive dashboard showing top KPIs, detailed reports, and a custom report builder.
*   CSV import for legacy customers, tickets, and financial data.
*   Subscription tiers (Basic, Standard, Premium) and Xendit payment gateway integration.
*   Telegram channel notifications for account events and ticket updates.
*   Multi-tenant architecture with isolated PostgreSQL schemas/databases.
*   Progressive Web App support and on-premises deployment.

**Out-of-Scope (Phase 1)**

*   Native mobile applications (iOS/Android).
*   Integration with other router brands or protocols beyond MikroTik RouterOS v7.
*   SMS or email notification channels (Telegram only).
*   Advanced AI-driven predictive analytics.
*   Third-party CRM or ERP integrations.
*   White-labeling or custom branding per tenant.

## 3. User Flow

When a new business owner arrives on ISP-Care Pro, they click “Sign Up” and enter basic company details, contact info, and choose a subscription tier (Basic, Standard, or Premium). After submitting payment information via the embedded Xendit widget, they receive a Telegram message confirming activation and a secure link to set their password. Once they log in (JWT-backed), they land on the Executive Dashboard, where high-level metrics (Monthly Recurring Revenue, Churn Rate, Open Tickets) are displayed. A persistent left sidebar houses navigation links to Customers, Map, Tickets, Finances, Reports, and Settings.

Within Customers, they can add a new client by filling out a form; this action triggers REST calls to MikroTik to auto-provision PPPoE credentials. They see real-time status updates via a background sync process. Switching to the Map tab, they view color-coded markers for each customer and can filter by status or plan. Clicking a marker opens a pop-up to view details or create a ticket. In Tickets, admins assign issues to technicians, who access a dedicated view listing their open items. Finances let admins record transactions, view P&L and Cash Flow statements, and export CSV/PDF. Reports consolidate all data, and the custom builder lets users drag-and-drop metrics into charts. Super Admins head to Settings to manage users, roles, tenant parameters, CSV imports, and audit logs.

## 4. Core Features

*   **Authentication & RBAC**

    *   JWT-based login/logout, token refresh, and session handling.
    *   Predefined roles (Super Admin, Admin, Technician) with granular permissions.
    *   User account creation, editing, deactivation (Super Admin only).
    *   Self-service profile updates and password resets.

*   **Customer & PPPoE Management**

    *   Full CRUD for customer records.
    *   MikroTik RouterOS v7 REST API integration for PPPoE secret create/update/disable and rate-limit settings.
    *   Periodic polling to sync customer connection status.
    *   Service plan (package) creation and assignment.

*   **Geographic Customer Monitoring**

    *   Leaflet.js map with OpenStreetMap tiles.
    *   Color-coded status markers (Active, Inactive, Disabled).
    *   Pop-ups showing customer name, plan, status, and quick actions.
    *   Filters by status, plan, and search by name.
    *   Technician-specific view showing only assigned customers.

*   **Support Ticketing System**

    *   Lifecycle tracking (Open → In Progress → Resolved → Closed).
    *   Ticket categorization (e.g., No Connection, Slow Speed).
    *   Admin assignment to technicians.
    *   Technician Dashboard with individual KPIs (response time, resolution time).
    *   Audit log of status changes and user actions.

*   **Financial Management**

    *   Dynamic income and expense categories.
    *   Transaction logging interface.
    *   Prebuilt Profit & Loss and Cash Flow reports.
    *   Date/category filtering and CSV/PDF export.
    *   Audit trail for exported reports.

*   **Reporting & Analytics Hub**

    *   Executive Dashboard with top-level KPIs.
    *   In-depth, filterable module reports.
    *   Custom Report Builder (drag-and-drop metrics, grouping, chart types).
    *   Save, schedule, and export reports.

*   **Billing & Subscription**

    *   Three tiers: Basic, Standard, Premium.
    *   Xendit payment gateway integration.
    *   Tier-based feature gating.

*   **Notifications & Alerting**

    *   In-app notifications.
    *   Telegram channel integration for critical events.

*   **Data Import & Audit**

    *   CSV upload for existing customers, tickets, finances.
    *   Audit logs for all significant user actions.

## 5. Tech Stack & Tools

*   **Frontend**

    *   React (hooks, context API)
    *   Progressive Web App (service workers)
    *   Leaflet.js + OpenStreetMap
    *   JWT handling in browser storage

*   **Backend**

    *   Node.js with Express
    *   RESTful API endpoints
    *   MikroTik RouterOS v7 REST API integration
    *   Xendit payment API
    *   Telegram Bot API for notifications

*   **Database**

    *   PostgreSQL (multi-tenant schemas or separate DB per tenant)

*   **Authentication & Security**

    *   JSON Web Tokens (JWT)
    *   Role-Based Access Control (RBAC) middleware

*   **DevOps & Hosting**

    *   On-premises servers or private data center
    *   Docker containers for services
    *   CI/CD pipeline (GitHub Actions or Jenkins)

*   **Data Import/Export**

    *   CSV parser library (e.g., csv-parse)
    *   PDF and CSV generation tools (e.g., pdfkit, fast-csv)

*   **IDE & Integrations**

    *   VS Code with ESLint, Prettier, and Docker extensions

## 6. Non-Functional Requirements

*   **Performance**

    *   API response time ≤ 200 ms for standard queries.
    *   Dashboard initial load ≤ 2 s on 4G network.

*   **Scalability**

    *   Support up to 1,000 concurrent users per tenant.
    *   Multi-tenant sharding strategy as customer base grows.

*   **Security & Compliance**

    *   TLS encryption for all traffic.
    *   Encrypted JWT secrets and environment variables.
    *   Audit log retention policy (e.g., 90 days).
    *   GDPR-style data isolation per tenant.

*   **Usability**

    *   Mobile-first responsive design (PWA).
    *   WCAG AA accessibility for forms and dashboards.

*   **Reliability & Availability**

    *   99.9% uptime SLA.
    *   Automated health checks and alerts.

## 7. Constraints & Assumptions

*   **On-Premises Hosting**

    *   All services run within the client's data center or private cloud.
    *   Network access rules must allow RouterOS API calls and Telegram API connections.

*   **MikroTik Availability**

    *   MikroTik RouterOS v7’s REST API must be enabled and reachable.

*   **Multi-Tenant Architecture**

    *   Assumes PostgreSQL can handle schema isolation or multiple databases per tenant.
    *   Tenant onboarding scripts will provision database schemas.

*   **CSV Imports**

    *   Incoming CSV files follow agreed column formats.
    *   Large imports may be rate-limited to avoid DB contention.

*   **Telegram Notifications**

    *   Users must have Telegram accounts and join the designated channel.

## 8. Known Issues & Potential Pitfalls

*   **RouterOS Rate Limits**

    *   Rapid provisioning calls could hit MikroTik API rate limits.
    *   Mitigation: introduce request queuing and exponential back-off.

*   **Data Sync Lags**

    *   Background polling for PPPoE status might lag during network outages.
    *   Mitigation: implement stale-data indicators and retry logic.

*   **CSV Format Variability**

    *   Users may upload malformed CSVs.
    *   Mitigation: build strict schema validation with clear error messages.

*   **Multi-Tenant Resource Contention**

    *   Performance may degrade if one tenant runs heavy reports.
    *   Mitigation: use query quotas or schedule heavy jobs off-peak.

*   **PWA Browser Compatibility**

    *   Older browsers may not fully support service workers.
    *   Mitigation: detect support and fall back to standard web behavior.

*   **On-Premises Network Configuration**

    *   Firewalls or proxies may block outbound calls to Telegram or Xendit.
    *   Mitigation: provide network configuration guidelines and fallbacks.

This document serves as the single source of truth for ISP-Care Pro’s Version 1.0. Subsequent technical specifications (Tech Stack Document, Frontend Guidelines, Backend Structure, Flowcharts, Security Guidelines) can be generated directly from these requirements without further clarifications.


---
**Document Details**
- **Project ID**: 5df15940-ecfb-4c61-a11c-4146dc32684e
- **Document ID**: bb9a320f-5efc-4da6-81f0-f761669b3e0b
- **Type**: custom
- **Custom Type**: project_requirements_document
- **Status**: completed
- **Generated On**: 2025-12-02T03:03:33.607Z
- **Last Updated**: 2025-12-06T14:34:36.801Z
