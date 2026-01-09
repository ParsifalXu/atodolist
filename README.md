# TaskMaster - Todo List Application

A modern, full-stack todo list application built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Features

- 🔐 User authentication (Sign up, Sign in)
- ✅ Task management (Create, Read, Update, Delete)
- 📁 Project organization
- 🎨 Beautiful UI with dark mode support
- 📱 Responsive design
- ⚡ Real-time updates with Supabase

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Icons**: Material Symbols Outlined

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd atodolist
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Set up Supabase database:
   - Create a new Supabase project
   - Run the SQL migration file located at `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor
   - This will create the necessary tables (projects, todos) and set up Row Level Security policies

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
atodolist/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Main dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Sign up page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page (redirects)
│   └── globals.css       # Global styles
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── supabase/         # Supabase client setup
│   └── utils.ts          # Utility functions
├── supabase/
│   └── migrations/        # Database migrations
└── public/               # Static assets
```

## Database Schema

### Projects Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `name` (TEXT)
- `color` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Todos Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `project_id` (UUID, Foreign Key to projects, nullable)
- `title` (TEXT)
- `completed` (BOOLEAN)
- `priority` (TEXT: 'low', 'medium', 'high')
- `due_date` (TIMESTAMP, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## API Routes

- `GET /api/todos` - Get all todos for the current user
- `POST /api/todos` - Create a new todo
- `PATCH /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo
- `GET /api/projects` - Get all projects for the current user
- `POST /api/projects` - Create a new project

## Features in Detail

### Authentication
- Email/password authentication via Supabase Auth
- Session management
- Protected routes

### Task Management
- Create tasks with title, priority, and due date
- Mark tasks as complete/incomplete
- Delete tasks
- Filter by priority
- Organize tasks by projects

### UI/UX
- Modern, clean design inspired by the reference screens
- Dark mode support
- Responsive layout
- Smooth animations and transitions
- Material Symbols icons

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- etc.

Make sure to set up your environment variables in your deployment platform.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

