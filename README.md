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

Default admin credentials:
- Email: `admin@masgarti.com`
- Password: `admin123`

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

Capacitor config is included, but native projects are not generated in this repo.

```bash
cd frontend
npm run build
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init
npx cap add android
npx cap add ios
npx cap sync
```

Then open Android Studio or Xcode to build APK / iOS app.

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
- Responsive mobile/tablet layouts
