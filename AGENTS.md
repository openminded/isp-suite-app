# AI Development Agent Guidelines

## Project Overview
**Project:** SaaS Web App
**** 
I want to build a web-based platform for  small business owners to ISP Business. This application simplifies daily operations and provides actionable insights to help users grow their business.

Project Name: 
ISP-Care Pro: Feature List
Target Audience:
small to mid-sized retail businesses 

Core Features:

Module 1: Authentication & User Management
Secure Login/Logout: JWT-based session management for secure user authentication.
Role-Based Access Control (RBAC): Granular control over user permissions.
Predefined Roles:
Super Admin: Full system access, including user management.
Admin: Manages customers, tickets, and finances.
Technician: Views and updates assigned tickets only.
User Management: Interface for creating, editing, and deactivating user accounts (Super Admin only).
User Profiles: Allow users to update their own profile information.
Module 2: Customer & PPPoE Management
Customer CRUD: Full Create, Read, Update, and Delete operations for customer data.
Mikrotik RouterOS v7 Integration: Uses the REST API for seamless automation.
Automated PPPoE Control: Automatically creates, modifies, rate-limits, and disables PPPoE secrets on Mikrotik based on actions in the app.
Real-Time Status Sync: Periodically polls Mikrotik to synchronize customer connection status (Active, Inactive, Disabled).
Package Management: Interface to create and manage various internet service plans.
Module 3: Geographic Customer Monitoring
Interactive Map View: Displays all customers as location markers on an OpenStreetMap (using Leaflet.js).
Color-Coded Status: Markers are color-coded for quick visual identification (e.g., Green for Active, Red for Disabled).
Informative Pop-ups: Clicking a marker shows customer details (Name, Plan, Status) and quick actions (View Profile, Create Ticket).
Advanced Filtering: Filter map markers by customer status, service plan, or search by name.
Role-Based Views: Technicians only see markers for customers with tickets assigned to them.
Module 4: Support Ticketing System
Ticket Lifecycle Management: Tracks tickets from creation to resolution (Open -> In Progress -> Resolved -> Closed).
Technician Assignment: Allows admins to assign tickets to specific technicians.
Technician Dashboard: A dedicated view for technicians to see and manage their assigned tasks.
Performance KPIs: Monitors key metrics like average response time and resolution time per technician.
Issue Categorization: Categorize tickets (e.g., "No Connection," "Slow Speed") for analytical reporting.
Module 5: Financial Management
Dynamic Categories: Admins can create and manage custom income and expense categories.
Transaction Logging: Simple interface to record all business income and expenses.
Financial Reporting: Generates key reports like Profit & Loss and Cash Flow statements.
Customizable Reports: Filter and export financial data by date range and category.
Module 6: Reporting & Analytics Hub
Executive Dashboard: A central dashboard displaying top-level KPIs from all modules (e.g., Monthly Recurring Revenue, Customer Churn Rate, Open Tickets).
Detailed Module Reports: In-depth, filterable, and exportable (CSV/PDF) reports for customers, tickets, and finances.
Custom Report Builder: A tool to allow users to generate custom reports based on various data points.

 
Design Preferences:
A clean, minimalistic interface with easy-to-read fonts, neutral colors, and clear navigation menus.

## CodeGuide CLI Usage Instructions

This project is managed using CodeGuide CLI. The AI agent should follow these guidelines when working on this project.

### Essential Commands

#### Project Setup & Initialization
```bash
# Login to CodeGuide (first time setup)
codeguide login

# Start a new project (generates title, outline, docs, tasks)
codeguide start "project description prompt"

# Initialize current directory with CLI documentation
codeguide init
```

#### Task Management
```bash
# List all tasks
codeguide task list

# List tasks by status
codeguide task list --status pending
codeguide task list --status in_progress
codeguide task list --status completed

# Start working on a task
codeguide task start <task_id>

# Update task with AI results
codeguide task update <task_id> "completion summary or AI results"

# Update task status
codeguide task update <task_id> --status completed
```

#### Documentation Generation
```bash
# Generate documentation for current project
codeguide generate

# Generate documentation with custom prompt
codeguide generate --prompt "specific documentation request"

# Generate documentation for current codebase
codeguide generate --current-codebase
```

#### Project Analysis
```bash
# Analyze current project structure
codeguide analyze

# Check API health
codeguide health
```

### Workflow Guidelines

1. **Before Starting Work:**
   - Run `codeguide task list` to understand current tasks
   - Identify appropriate task to work on
   - Use `codeguide task update <task_id> --status in_progress` to begin work

2. **During Development:**
   - Follow the task requirements and scope
   - Update progress using `codeguide task update <task_id>` when significant milestones are reached
   - Generate documentation for new features using `codeguide generate`

3. **Completing Work:**
   - Update task with completion summary: `codeguide task update <task_id> "completed work summary"`
   - Mark task as completed: `codeguide task update <task_id> --status completed`
   - Generate any necessary documentation

### AI Agent Best Practices

- **Task Focus**: Work on one task at a time as indicated by the task management system
- **Documentation**: Always generate documentation for new features and significant changes
- **Communication**: Provide clear, concise updates when marking task progress
- **Quality**: Follow existing code patterns and conventions in the project
- **Testing**: Ensure all changes are properly tested before marking tasks complete

### Project Configuration
This project includes:
- `codeguide.json`: Project configuration with ID and metadata
- `documentation/`: Generated project documentation
- `AGENTS.md`: AI agent guidelines

### Getting Help
Use `codeguide --help` or `codeguide <command> --help` for detailed command information.

---
*Generated by CodeGuide CLI on 2025-12-06T14:51:01.130Z*
