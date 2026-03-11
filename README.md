# ERP Web Application

A business management web app built with Nuxt.js 3, Tailwind CSS, Drizzle ORM, and PostgreSQL. It covers core ERP modules including accounting (invoices, revenue/expense reports, debts, tax), inventory management, and marketing analytics.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root and add your database connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your_jwt_secret"
```

3. Push the database schema:

```bash
npm run db:push
```

## Running the App

**Development:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production:**

```bash
npm run build
npm run preview
```

## Available Scripts

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `npm run dev`       | Start development server         |
| `npm run build`     | Build for production             |
| `npm run generate`  | Generate static site             |
| `npm run preview`   | Preview production build         |
| `npm run db:push`   | Push schema changes to database  |
| `npm run db:studio` | Open Drizzle Studio (DB browser) |

## Project Structure

```
nuxt-app/
├── app/
│   ├── components/     # Reusable Vue components
│   ├── composables/    # Shared composable logic
│   ├── pages/          # Application routes
│   └── layouts/        # Page layout templates
├── server/
│   ├── api/            # REST API endpoints
│   ├── db/             # Database schema (Drizzle ORM)
│   └── utils/          # Server-side utilities
└── public/             # Static assets
```
