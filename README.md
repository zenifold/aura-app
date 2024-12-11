# Aura - Modern Project Management Platform

Aura is a comprehensive project and task management platform that combines the best features of JIRA, Trello, Miro, ClickUp, and Monday.com into one seamless experience.

## Features

- Multiple task views:
  - List/Table view (default)
  - Kanban/Board view
  - Calendar/Timeline view
  - Interactive Canvas view
  - Notes/Idea Space
- Project-task associations
- Task relationship mapping
- Responsive design for desktop and mobile
- Real-time collaboration
- Modern authentication with Clerk
- Cloud database storage

## Tech Stack

- Frontend: Next.js 14 with TypeScript
- Styling: Tailwind CSS
- Authentication: Clerk
- Database: PostgreSQL with Prisma ORM
- State Management: Zustand
- UI Components: shadcn/ui

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=

# API Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## License

MIT
