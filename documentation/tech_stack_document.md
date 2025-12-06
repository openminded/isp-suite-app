# Tech Stack Document

# Tech Stack Document for ISP-Care Pro

This document explains, in everyday language, the technology choices behind ISP-Care Pro, our web-based platform for small to mid-sized retail businesses. It outlines how each piece fits together to deliver a secure, reliable, and user-friendly solution.

## 1. Frontend Technologies

These are the tools and libraries that power everything you see and interact with in your browser or on your phone:

- **React**  
  A popular JavaScript library for building interfaces. React lets us break the UI into reusable pieces (called components), making the app easy to maintain and extend.

- **React Router**  
  Manages page navigation in a single-page app. It ensures smooth transitions between Dashboard, Customer, Ticketing, and other sections without full page reloads.

- **Progressive Web App (PWA)**  
  Converts the web app into an installable experience on mobile devices. Users can add ISP-Care Pro to their home screen and get fast loading, even offline or on flaky networks.

- **Leaflet.js + OpenStreetMap**  
  Powers the interactive map view. Leaflet.js is a lightweight library for maps, and OpenStreetMap provides the base map data. Together, they let us plot customer locations, color-code statuses, and show pop-ups with quick actions.

- **Styling and Layout**  
  We use a simple CSS approach (CSS Modules or a similar scoped-CSS solution) for a clean, minimalistic look. This keeps styles organized, prevents conflicts, and matches our neutral color palette and easy-to-read fonts.

- **State Management**  
  React’s built-in Context API (or Redux for more complex cases) handles global data like user info, notifications, and real-time updates, ensuring all components stay in sync.

## 2. Backend Technologies

These components power the server side, manage data, and handle the business logic:

- **Node.js & Express.js**  
  Node.js is a fast, JavaScript-based server platform. Express.js is a minimal framework on top of Node that helps us build RESTful APIs to serve data and handle requests from the frontend.

- **PostgreSQL**  
  A reliable relational database for structured data—users, roles, customers, tickets, and financial records. Its strong support for complex queries and data integrity makes it ideal for our needs.

- **Sequelize ORM**  
  An Object-Relational Mapping tool that simplifies database interactions. Instead of writing raw SQL, we use JavaScript methods to read and write data, reducing errors and speeding up development.

- **JSON Web Tokens (JWT)**  
  Manages secure login sessions. After a user logs in, the server issues a signed token that the frontend sends with each request to prove identity—no server-side session storage needed.

- **Role-Based Access Control (RBAC)**  
  Defines permissions for Super Admin, Admin, and Technician. Middleware checks each request against the user’s role, ensuring only authorized actions are allowed.

- **MikroTik RouterOS REST API**  
  Automates PPPoE secret creation, modification, rate limits, and status checks. Our backend talks to the router via its REST API whenever customer service plans change.

- **Multi-Tenant Architecture**  
  Each business operates in its own isolated environment (separate database schema). This keeps data from different clients completely separate for privacy and security.

## 3. Infrastructure and Deployment

How we host, update, and manage the overall system:

- **On-Premises Servers**  
  All components run on servers you control, offering full control over data and network security.

- **Git & GitLab (Self-Hosted)**  
  Version control with Git keeps track of every code change. A self-hosted GitLab instance stores repositories and supports collaboration.

- **CI/CD Pipelines (GitLab CI/CD)**  
  Automated scripts that build, test, and deploy the app whenever new code is merged. This minimizes human error and speeds up releases.

- **Docker Containerization**  
  Packages each part of the system (frontend, backend, database) into isolated containers. This ensures consistency across development, testing, and production.

- **Nginx Reverse Proxy & Load Balancer**  
  Routes incoming web traffic to the right service and ensures HTTPS encryption. It can also distribute load across multiple backend instances if needed.

## 4. Third-Party Integrations

These external services extend functionality without reinventing the wheel:

- **Xendit Payment Gateway**  
  Handles subscription payments for Basic, Standard, and Premium plans. Xendit manages credit card processing, billing, and recurring payments securely.

- **Telegram API**  
  Sends real-time alerts and notifications (account activation, ticket updates) directly to a Telegram channel of your choice.

- **CSV Import Functionality**  
  Allows businesses to upload existing customer, ticket, or financial data via CSV files. The backend parses and imports these records into PostgreSQL.

- **OpenStreetMap API**  
  Provides map tiles and geocoding support for the interactive map view.

## 5. Security and Performance Considerations

Measures and optimizations to keep data safe and the app fast:

- **Authentication & Data Protection**  
  - Passwords hashed with bcrypt before storing in the database  
  - JWT tokens signed with a strong secret and short expiration  
  - HTTPS for all client-server communication

- **Access Control & Auditing**  
  - RBAC enforces permissions at the API level  
  - Audit logs track who did what and when (user updates, ticket changes, report exports)

- **Input Validation & Rate Limiting**  
  - Server-side checks to prevent malformed or malicious data  
  - Rate limiting on critical endpoints to guard against abuse

- **Performance Optimizations**  
  - Database indexing on frequently queried columns (e.g., customer status, ticket state)  
  - Caching of static assets via PWA service worker  
  - Code splitting and lazy loading in React to reduce initial page load size  
  - Background jobs for non-urgent tasks (e.g., polling router status) to keep the API responsive

## 6. Conclusion and Overall Tech Stack Summary

ISP-Care Pro’s technology choices were made to balance reliability, scalability, and ease of use:

- A modern **React** frontend with **PWA** support ensures a smooth, app-like experience on any device.  
- A **Node.js/Express** backend and **PostgreSQL** database provide a robust foundation for secure data management and RESTful APIs.  
- **On-premises** deployment with **Docker**, **GitLab CI/CD**, and **Nginx** offers full control over hosting, rapid updates, and high availability.  
- Integrations like **Xendit** and **Telegram** deliver seamless payments and real-time alerts without building these systems from scratch.  
- Security measures (JWT, RBAC, auditing) and performance tweaks (caching, indexing) ensure data protection and a responsive user experience.

Together, this stack aligns with our goal of delivering a user-friendly, secure, and scalable platform that helps small businesses streamline daily operations and gain actionable insights to grow their ISP services.


---
**Document Details**
- **Project ID**: 5df15940-ecfb-4c61-a11c-4146dc32684e
- **Document ID**: 9c83bc6a-53d9-4cdf-942c-1441fdcab9ca
- **Type**: custom
- **Custom Type**: tech_stack_document
- **Status**: completed
- **Generated On**: 2025-12-02T03:05:37.134Z
- **Last Updated**: N/A
