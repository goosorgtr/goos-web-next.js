# School Management System - Web Frontend

A comprehensive school management system built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🏫 **Multi-role Support**: Admin, Teacher, Student, and Parent dashboards
- 📚 **Academic Management**: Classes, courses, exams, grades, and homework
- 💰 **Finance Management**: Payment plans, debt tracking, and installments
- 🍔 **Canteen System**: Product management, orders, and balance tracking
- 📢 **Communication**: Announcements, events, and notifications
- 🚌 **Transportation**: Vehicle and student assignment management
- 📊 **Reporting**: Academic and financial reports with export capabilities

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   └── (dashboard)/       # Dashboard pages (admin, teacher, student, parent)
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── forms/            # Form components
│   ├── tables/           # Table components
│   └── ...
├── lib/                   # Utility functions and configurations
│   ├── api/              # API client and endpoints
│   ├── services/         # API service functions
│   ├── validations/      # Zod schemas
│   └── utils/            # Helper functions
├── hooks/                 # Custom React hooks
├── store/                 # Zustand stores
├── types/                 # TypeScript type definitions
└── constants/            # App constants
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running on `http://localhost:5000`

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd goos-web-next.js
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env.local
```

4. Update environment variables in `.env.local`

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## User Roles

### Admin
- Full system access
- User management (students, teachers, parents)
- Academic management (classes, courses, semesters)
- Finance management (payment plans, debts)
- Canteen management
- Reports and analytics

### Teacher
- Course and student management
- Exam creation and grading
- Attendance tracking
- Homework assignment and evaluation

### Student
- View courses and schedule
- Submit homework
- View grades and attendance
- Use canteen system
- View payments

### Parent
- Monitor children's academic progress
- View grades and attendance
- Track payments and debts
- Manage canteen balance
- Communicate with teachers

## Development Status

This project is currently in initial setup phase. The basic folder structure and configuration files have been created.

## License

This project is licensed under the MIT License.
