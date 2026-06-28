# Campus Field Finder

A full-stack web platform that connects university students with internship, field training, industrial practical training, and attachment opportunities posted by companies.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4 |
| Backend | Laravel 8, PHP, Laravel Sanctum (token auth) |
| Database | MySQL |
| State Management | Zustand (with persistence) |
| HTTP Client | Axios |
| Charts | Recharts |

---

## Project Structure

```
campus-field-finder/
├── frontend/                    # Next.js application
│   ├── app/
│   │   ├── page.tsx             # Public home page
│   │   ├── login/page.tsx       # Login page
│   │   ├── register/page.tsx    # Registration page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx       # Dashboard shell (sidebar + navbar)
│   │   │   ├── student/         # Student dashboard
│   │   │   ├── company/         # Company dashboard
│   │   │   └── admin/           # Admin dashboard
│   │   ├── internships/         # Public internship listings
│   │   ├── profile/             # Profile page
│   │   └── settings/            # Settings page
│   ├── components/
│   │   ├── cards/               # ApplicationCard, InternshipCard, StatCard
│   │   ├── navbar/              # DarkNavbar
│   │   ├── sidebar/             # DarkSidebar
│   │   └── sections/
│   │       ├── BrowseSection.tsx
│   │       ├── ApplicationsSection.tsx
│   │       ├── CVSection.tsx
│   │       ├── SavedSection.tsx
│   │       ├── NotificationsSection.tsx
│   │       ├── MessagesSection.tsx
│   │       ├── ProfileSection.tsx
│   │       ├── SettingsSection.tsx
│   │       ├── PostOpportunitySection.tsx
│   │       ├── admin/           # Admin-specific sections
│   │       └── company/         # Company-specific sections
│   ├── hooks/                   # useAuth, useRole, useFetch, useChartTheme
│   ├── lib/                     # axios.ts, constants.ts, helpers.ts
│   ├── services/                # API service modules per resource
│   ├── store/                   # Zustand stores (auth, theme, dashboard)
│   ├── types/                   # TypeScript type definitions
│   ├── proxy.ts                 # Route protection (Next.js proxy/middleware)
│   ├── next.config.ts
│   └── .env.local
│
└── backend/                     # Laravel application
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/API/ # All API controllers
    │   │   └── Middleware/      # RoleMiddleware, Auth, etc.
    │   ├── Models/              # User, Student, Company, Internship, Application, etc.
    │   ├── Repositories/        # ApplicationRepository, InternshipRepository
    │   └── Services/            # AuthService, InternshipService, RecommendationService
    ├── database/
    │   ├── migrations/          # All table migrations
    │   └── seeders/             # AdminSeeder
    ├── routes/
    │   └── api.php              # All API routes
    └── .env
```

---

## Features

### Student
- Browse and search internship/attachment opportunities
- Save internships for later
- Apply with a cover letter
- Withdraw pending applications
- Track application status (pending / accepted / rejected)
- Upload and manage CV and documents
- Receive in-app and email notifications on application status changes

### Company
- Post, edit and delete internship/attachment opportunities
- View all applicants per listing with student details
- Accept or reject applications
- View dashboard stats (total applications, accepted, pending)

### Admin
- Approve or reject company registrations
- View all students, companies, applications and internships
- Delete users and internships
- Platform overview statistics

---

## Getting Started

### Prerequisites

- PHP >= 8.0
- Composer
- Node.js >= 18
- MySQL

---

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure your database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=field_finder
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations and seed the admin user:

```bash
php artisan migrate
php artisan db:seed --class=AdminSeeder
```

Link storage for file uploads:

```bash
php artisan storage:link
```

Start the development server:

```bash
php artisan serve
```

The API will be available at `http://localhost:8000/api`

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create the environment file:

```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `APP_KEY` | Laravel application key |
| `DB_DATABASE` | MySQL database name |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `MAIL_MAILER` | Mail driver (`smtp` or `log`) |
| `MAIL_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `MAIL_PORT` | SMTP port (e.g. `587`) |
| `MAIL_USERNAME` | SMTP username / email address |
| `MAIL_PASSWORD` | SMTP password or app password |
| `MAIL_FROM_ADDRESS` | Sender email address |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Laravel API |

---

## Default Admin Account

After running `AdminSeeder`:

| Field | Value |
|---|---|
| Email | `dicklamaswili@gmail.com` |
| Password | `Admin@1234` |

> Change the password after first login from the Settings section.

---

## API Overview

### Public

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive token |
| GET | `/api/internships` | List all internships |
| GET | `/api/internships/{id}` | Get internship details |
| GET | `/api/companies` | List all companies |

### Authenticated (Sanctum token required)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/notifications` | Get notifications |
| GET | `/api/documents` | List documents |
| POST | `/api/documents` | Upload document |

### Student only

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/applications` | My applications |
| POST | `/api/applications` | Submit application |
| DELETE | `/api/applications/{id}` | Withdraw application |
| GET | `/api/saved-internships` | Saved internships |
| POST | `/api/saved-internships` | Save an internship |
| GET | `/api/internships/recommended` | Recommended internships |

### Company only

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/internships` | Post opportunity |
| PUT | `/api/internships/{id}` | Update opportunity |
| DELETE | `/api/internships/{id}` | Delete opportunity |
| GET | `/api/internships/{id}/applications` | View applicants |
| PATCH | `/api/applications/{id}/status` | Accept / reject |

### Admin only

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Platform stats |
| GET | `/api/admin/companies` | All companies |
| PATCH | `/api/admin/companies/{id}/approve` | Approve company |
| PATCH | `/api/admin/companies/{id}/reject` | Reject company |
| GET | `/api/admin/students` | All students |
| DELETE | `/api/admin/users/{id}` | Delete user |
| DELETE | `/api/admin/internships/{id}` | Delete internship |

---

## Email Notifications

Emails are sent on:
- New user registration (welcome email)
- Company submits registration (admin notified)
- Student submits application (company notified)
- Application status updated (student notified)
- Company approved / rejected (company notified)

To enable real email delivery, set `MAIL_MAILER=smtp` and provide valid SMTP credentials in `backend/.env`. For testing without real credentials, set `MAIL_MAILER=log` — emails will be written to `backend/storage/logs/laravel.log`.

---

## License

This project is for academic and educational use.
