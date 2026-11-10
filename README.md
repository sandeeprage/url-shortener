# URL Shortener

A complete, fully functional URL shortener built with Next.js, TypeScript, Tailwind CSS, PostgreSQL (SQLite for local dev), and Prisma ORM.

## Features

- ✅ Enter a long URL and generate a short URL
- ✅ Redirect short URLs to their original destinations
- ✅ Generate unique short codes (7 characters, alphanumeric)
- ✅ Copy shortened URLs to clipboard
- ✅ Track total clicks for each URL
- ✅ Display click statistics for each URL
- ✅ List previously shortened URLs in a table
- ✅ Delete shortened URLs
- ✅ Validate URLs and handle invalid inputs
- ✅ Persist all data in database (PostgreSQL/SQLite)
- ✅ Responsive, minimalist UI

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (production) / SQLite (development)
- **ORM**: Prisma
- **Runtime**: Node.js

## Project Structure

```
url-shortener/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── urls/       # API routes for URL operations
│   │   │   └── urls/[id]/  # API routes for individual URL
│   │   ├── [code]/         # Dynamic route for URL redirection
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main page (client component)
│   ├── components/
│   │   ├── UrlForm.tsx     # URL input and result display
│   │   └── UrlList.tsx     # Table of shortened URLs
│   ├── lib/
│   │   ├── prisma.ts       # Prisma client singleton
│   │   └── utils.ts        # Utility functions
│   └── types/
│       └── index.ts        # TypeScript types
├── .env                    # Environment variables
├── next.config.ts          # Next.js configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (for production)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd url-shortener
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   The `.env` file is already configured for local development with SQLite:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```
   
   For production with PostgreSQL, update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/url_shortener?schema=public"
   NEXT_PUBLIC_APP_URL="https://your-domain.com"
   ```

4. **Initialize the database:**
   ```bash
   npx prisma migrate dev --name init
   ```
   This creates the SQLite database and applies migrations.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma migrate dev` | Create and apply new migration |
| `npx prisma db push` | Push schema changes without migration |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/urls` | List all shortened URLs |
| POST | `/api/urls` | Create a new short URL |
| GET | `/api/urls/:id` | Get a specific URL |
| DELETE | `/api/urls/:id` | Delete a URL |
| GET | `/:code` | Redirect to original URL |

## Usage

### Creating a Short URL

1. Enter a long URL in the input field (e.g., `https://example.com/very/long/path`)
2. Click "Shorten URL"
3. The shortened URL appears with a "Copy" button
4. Click "Copy" to copy the short URL to clipboard

### Managing URLs

- **View all URLs**: The table below the form shows all previously shortened URLs
- **Click tracking**: Each URL shows its click count
- **Delete**: Click "Delete" to remove a URL (with confirmation)

### URL Redirection

- Visit `http://localhost:3000/abc123` (where `abc123` is your short code)
- Automatically redirects to the original URL
- Increments the click counter

## Testing

### Manual Testing Checklist

- [ ] Create a short URL with valid HTTP/HTTPS URL
- [ ] Create a short URL with URL missing protocol (should auto-add https://)
- [ ] Try to create a short URL with invalid input (should show error)
- [ ] Copy shortened URL to clipboard
- [ ] Visit short URL - should redirect to original
- [ ] Verify click count increments
- [ ] View list of all shortened URLs
- [ ] Delete a URL - should remove from list
- [ ] Refresh list - should update
- [ ] Try duplicate URLs - should generate different codes

### Edge Cases Handled

- Invalid URL formats (shows error)
- Empty input (button disabled)
- Duplicate short code generation (retries up to 10 times)
- Non-existent short codes (404 page)
- Database connection errors (graceful error handling)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXT_PUBLIC_APP_URL` - Your production URL
4. Deploy

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### PostgreSQL Setup (Production)

1. Create a PostgreSQL database
2. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
3. Update `DATABASE_URL` in environment variables

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `NEXT_PUBLIC_APP_URL` | Base URL for generating short links | Yes |

## Database Schema

```prisma
model Url {
  id          String   @id @default(cuid())
  code        String   @unique
  originalUrl String
  clicks      Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([code])
  @@index([createdAt])
}
```

## License

MIT