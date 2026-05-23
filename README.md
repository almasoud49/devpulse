# Issue Tracker API

A role-based issue tracking system built with Node.js, Express, TypeScript, and PostgreSQL. Supports contributors and maintainers with granular permissions for creating, viewing, updating, and managing issues.

## Live URL

`https://your-api-domain.com` (Production URL to be added)

Question-01:
`https://drive.google.com/file/d/1a_S8cBah-h871niQk9c-pzRxyapp4oMF/view?usp=drive_link`

Question-02:
`https://drive.google.com/file/d/1VClZOjNzSUgeUZ9ehbAG5yi_YWGXHvWf/view?usp=drive_link`

## Features

### Authentication & Authorization
- User registration and login with JWT authentication
- Role-based access control (Contributor & Maintainer roles)
- Password hashing with bcrypt (10 salt rounds)
- Protected routes with permission-based middleware

### Issue Management
- Create issues (Bug reports or Feature requests)
- View all issues with filtering capabilities
- Update any issue field (maintainers only)
- Delete issues (maintainers only)
- Independent workflow status management (maintainers only)

### System Features
- Access internal system metrics (maintainers only)
- Raw SQL queries for optimal performance
- Modular Express router architecture
- TypeScript for type safety

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 24.x (LTS) | Runtime environment |
| TypeScript | Latest stable | Type-safe development |
| Express.js | 4.x | Web framework |
| PostgreSQL | 16.x | Relational database |
| pg | Latest | Native PostgreSQL driver |
| bcrypt | Latest | Password hashing (10 rounds) |
| jsonwebtoken | Latest | JWT authentication |

**Note:** No ORMs, query builders, or SQL JOINs used - all database operations use raw `pool.query()` calls.

## Prerequisites

- Node.js 24.x or higher
- PostgreSQL 16.x or higher
- npm or yarn package manager

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/almasoud49/devpulse
cd devpulse
```

### Step 2: Install Dependencies

```bash
npm install
```
### Step 3: Configure Environment Variables
Create .env file in root directory:

```bash
PORT=8000
NODE_ENV=development

DB_HOST=localhost
DB_NAME=devpulse
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_key


```

### Step 4: Start Application
```bash 
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoint List

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | User login | Public |
| GET | /api/auth/me | Get current user | Private |

### Issue Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/issues | Create issue | Contributor+ |
| GET | /api/issues | List all issues | Contributor+ |
| GET | /api/issues/:id | Get issue by ID | Contributor+ |
| PUT | /api/issues/:id | Update issue | Maintainer |
| DELETE | /api/issues/:id | Delete issue | Maintainer |
| PATCH | /api/issues/:id/status | Change status | Maintainer |


## Database Schema Summary

### Table: users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| name | VARCHAR(100) | NOT NULL | User full name |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'contributor' | User role (contributor/maintainer) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes:** `idx_users_email`, `idx_users_role`

### Table: issues

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique issue identifier |
| title | VARCHAR(200) | NOT NULL | Issue title/summary |
| description | TEXT | NOT NULL | Detailed issue description |
| type | VARCHAR(20) | NOT NULL | Issue type (bug/feature) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'open' | Workflow status |
| priority | VARCHAR(10) | NOT NULL, DEFAULT 'medium' | Priority level |
| created_by | UUID | FOREIGN KEY, NOT NULL | User who created issue |
| assigned_to | UUID | FOREIGN KEY, NULL | User assigned to issue |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Issue creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |