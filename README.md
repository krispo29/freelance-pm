# Freelance Project Manager (freelance-pm)

A powerful, streamlined project management tool designed specifically for freelancers to track projects, manage clients, monitor tasks, and keep an eye on income. Built with modern technologies for speed, reliability, and ease of use.

## ✨ Features

- **Project Tracking**: Comprehensive project management with status updates (Not Started, In Progress, Near Done, Completed, Maintenance, Cancelled).
- **Client Management**: Maintain a central database of clients, contact information, and project history.
- **Task Management**: Project-specific task lists with priority (Low, Medium, High) and status tracking.
- **Financial Monitoring**: Track income entries, payment statuses (Pending, Received, Overdue), and billing types (One-time, Milestone, Monthly).
- **Milestones**: Set and track key project milestones and deadlines.
- **Responsive Dashboard**: Get a birds-eye view of your ongoing projects, upcoming deadlines, and financial health.
- **Modern UI**: Clean, intuitive interface with dark mode support.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org) via [Neon](https://neon.tech)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Authentication**: [NextAuth.js](https://next-auth.js.org) (v5 Beta)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) (v4)
- **Components**: [Radix UI](https://www.radix-ui.com) & [Shadcn UI](https://ui.shadcn.com)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs)
- **Validation**: [Zod](https://zod.dev)
- **Testing**: [Playwright](https://playwright.dev) (E2E) & [Vitest](https://vitest.dev) (Unit)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (e.g., Neon.tech)

### Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/krispo29/freelance-pm.git
   cd freelance-pm
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env.local` file in the root directory and add the following:

   ```env
   DATABASE_URL=your_postgresql_url
   NEXTAUTH_SECRET=your_nextauth_secret
   AUTH_TRUST_HOST=true
   ```

4. **Initialize Database:**

   ```bash
   npx drizzle-kit push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run test:e2e`: Runs Playwright end-to-end tests.
- `npx drizzle-kit studio`: Visual database explorer.
