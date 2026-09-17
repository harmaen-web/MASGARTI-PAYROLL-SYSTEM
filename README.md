# Masgarti Payroll Processing System

A full-stack payroll management application for **The Masgarti Business**, built with React, Node.js, Express, and MongoDB.

## Features

- Administrator login/logout with JWT authentication
- Payroll dashboard with monthly summary stats
- Employee management (add, view, edit, delete)
- Advanced employee search and filters (department, designation, salary range)
- Payroll processing with backend salary calculations
- Display-only currency formatting (INR / USD)
- Payroll history with search and filters
- Individual payslip view with Masgarti branding and print support
- Light and dark themes
- Toast notifications
- Responsive web UI aligned with the Figma design
- Mobile packaging readiness via Capacitor

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + React Router + Sonner
- **Backend:** Node.js + Express.js + JWT + bcrypt
- **Database:** MongoDB + Mongoose
- **Mobile:** Capacitor (configuration included)

## Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

If MongoDB is not installed locally, the backend automatically falls back to an in-memory MongoDB instance during development.

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed:admin
npm run seed
npm run dev
```

Backend runs at `http://localhost:5000`

Create a local `.env` from `.env.example`, then run `npm run seed:admin` to create the first administrator. Do not commit `.env` or share secrets.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Endpoints

### Public
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`

### Protected (Bearer token required)
- `GET /api/auth/me`
- `GET /api/dashboard/stats?month=September 2026`
- `GET /api/employees?search=&department=&designation=&min_salary=&max_salary=`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`
- `GET /api/payroll/preview?employeeId=:id`
- `POST /api/payroll/process`
- `GET /api/payroll/history?search=&month=&status=`
- `GET /api/payroll/:id`

### Development only
- `GET /db-viewer` (disabled in production)

## Payroll Calculation

```
Gross Salary = Basic Salary + Allowances
Net Salary = Gross Salary - Deductions
```

Example:
- Basic Salary: ₹30,000
- Allowances: ₹5,000
- Gross Salary: ₹35,000
- Deductions: ₹2,000
- Net Salary: ₹33,000

Currency selection is display-only. Salary values are not converted between currencies.

## Test Workflow

1. Start backend and frontend
2. Login with admin credentials
3. Add employee:
   - Employee ID: `EMP001`
   - Name: `Test Employee`
   - Department: `Engineering`
   - Designation: `Software Developer`
   - Basic Salary: `30000`
   - Allowances: `5000`
   - Deductions: `2000`
4. Go to Payroll Processing
5. Select employee and month
6. Verify gross salary = ₹35,000 and net salary = ₹33,000
7. Process payroll
8. Confirm record appears in Payroll History
9. Open payslip and verify details

## Mobile Build (Capacitor)

The project includes a Capacitor wrapper at the repository root. The React + Vite frontend lives in `frontend/`, and Capacitor copies the production build from `frontend/dist/` into native projects.

### Capacitor configuration

| Setting | Value |
|---|---|
| Config file | `capacitor.config.ts` (project root) |
| App name | `Masgarti Payroll` |
| App ID | `com.masgarti.payroll` |
| Web directory | `frontend/dist` |

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Capacitor wrapper (project root)
cd ..
npm install
```

### 2. Build the frontend

```bash
cd frontend
npm run build
```

Or from the project root:

```bash
npm run build:web
```

Vite outputs the production build to `frontend/dist/`.

### 3. Sync Capacitor

From the project root:

```bash
npx cap sync
```

Or build and sync in one step:

```bash
npm run cap:sync
```

### 4. Android setup

Native Android project is **not generated yet** in this repository.

Prerequisites on Windows:

- [Android Studio](https://developer.android.com/studio)
- Android SDK
- Java 17+

After the frontend build succeeds, add Android once from the project root:

```bash
npx cap add android
npx cap sync
npx cap open android
```

This is safe to run when the `android/` folder does not already exist. It creates a new native Android project without changing the React or Express code.

Build and run the app from Android Studio.

### 5. iOS setup

Native iOS project is **not generated yet** in this repository.

**iOS builds require macOS with Xcode installed.** You cannot compile or ship an iOS app from Windows alone.

On a Mac, after the frontend build succeeds:

```bash
npx cap add ios
npx cap sync
npx cap open ios
```

Build and run the app from Xcode.

### 6. Mobile API note

During local web development, Vite proxies `/api` to `http://localhost:5000`. In a native Capacitor build, configure the frontend API base URL to point to your deployed backend or LAN-accessible backend URL before production mobile use.

### 7. Git ignore note

The root `.gitignore` currently ignores:

- `android/`
- `ios/`
- `.capacitor/`

That is appropriate if you only want Capacitor configuration in Git and generate native projects locally. If you need the full `android/` or `ios/` project committed to GitHub, remove those entries only after confirming that requirement.

## Figma Design

Design file: `masgarti-payroll_system`

Implemented screens:
- Dashboard
- Employee List
- Add Employee
- Edit Employee
- Payroll Processing
- Payroll History
- Payslip
- Login
- Signup
- Responsive mobile/tablet layouts

## Project Status

The web payroll system is complete for HR use: authentication, employee CRUD, payroll processing, history, payslips (print and PDF), themes, and Capacitor configuration.

Native Android and iOS projects are not generated in this repository. Generate them locally with `npx cap add android` or `npx cap add ios` (iOS requires macOS and Xcode).

A code-review and bug-fix summary is in `CODE_REVIEW_PROGRESS_REPORT.md`.
