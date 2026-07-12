# Subham Das — BMLT Portfolio

A full-stack, responsive, 3D-enhanced personal portfolio website for a Bachelor of Medical Laboratory Technology (BMLT) student. Built with a "Clinical Futurism" design theme — clean, glassy, glowing, and precise.

## Tech Stack

| Category          | Technology                                            |
| ----------------- | ----------------------------------------------------- |
| **Frontend**      | Next.js 16 (App Router) + React 19 + TypeScript       |
| **Styling**       | Tailwind CSS v4 + shadcn/ui components                |
| **3D**            | Three.js via @react-three/fiber + @react-three/drei   |
| **Animation**     | Framer Motion                                         |
| **Backend**       | Next.js Route Handlers (REST API)                     |
| **Database**      | MongoDB Atlas + Mongoose ODM                          |
| **Auth**          | JWT + httpOnly cookies                                |
| **File Storage**  | Cloudinary                                            |
| **Validation**    | Zod (shared schemas)                                  |

## Design Theme — "Clinical Futurism"

- **Ice Blue:** `#E3F2FD` — backgrounds, light surfaces
- **Clinical Blue:** `#0077B6` — primary brand color, CTAs
- **Deep Diagnostic:** `#023E73` — headings, dark sections
- **Sterile White:** `#F8FAFC` — base background
- **Bio Teal accent:** `#00B4D8` — highlights, glow effects
- **Alert Coral:** `#FF6B6B` — errors/badges (sparingly)
- **Dark Mode:** `#0A1929` — near-black navy

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### 1. Clone & Install

```bash
git clone <repo-url>
cd portfolio
npm install
```

### 2. Environment Variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `MONGODB_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — random string for JWT signing
- `CLOUDINARY_CLOUD_NAME` — from Cloudinary dashboard
- `CLOUDINARY_API_KEY` — from Cloudinary dashboard
- `CLOUDINARY_API_SECRET` — from Cloudinary dashboard

### 3. Seed the Database

```bash
npx ts-node --compiler-options '{"module":"commonjs","moduleResolution":"node"}' scripts/seed.ts
```

This creates:
- Admin user: `admin@subhamdas.com` / `admin123`
- Sample certificates and workshops
- Portfolio profile
- A sample contact message

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### 5. Access Admin Dashboard

Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in with the admin credentials.

## Project Structure

```
/
├── app/
│   ├── page.tsx              # Home / Hero page with 3D scene
│   ├── layout.tsx             # Root layout (fonts, theme, nav, footer)
│   ├── globals.css            # Tailwind + Clinical Futurism theme
│   ├── about/                 # About page
│   ├── skills/                # Skills page
│   ├── certificates/          # Public certificates gallery
│   ├── workshops/             # Public workshops timeline
│   ├── contact/               # Contact form page
│   ├── admin/
│   │   ├── layout.tsx         # Admin layout (sidebar + auth protection)
│   │   ├── login/             # Admin login
│   │   ├── dashboard/         # Admin dashboard with stats
│   │   ├── certificates/      # CRUD management for certificates
│   │   ├── workshops/         # CRUD management for workshops
│   │   └── messages/          # View contact form submissions
│   └── api/                   # REST API routes
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── 3d/                    # Three.js components (DNAHelix, Particles, Scene)
│   ├── Navbar.tsx             # Glassmorphism navigation
│   ├── Footer.tsx             # Portfolio footer
│   ├── ThemeProvider.tsx      # Dark/light theme context
│   ├── ThemeToggle.tsx        # Theme toggle button
│   ├── GlassCard.tsx          # Reusable glassmorphism card
│   ├── CertificateCard.tsx    # Certificate display card
│   ├── WorkshopCard.tsx       # Workshop display card
│   ├── ScrollProgress.tsx     # Scroll progress indicator
│   └── LoadingSpinner.tsx     # Themed loading spinner
├── lib/
│   ├── mongodb.ts             # MongoDB connection
│   ├── auth.ts                # JWT auth utilities
│   ├── cloudinary.ts          # Cloudinary upload/delete
│   ├── api-response.ts        # Consistent API response helpers
│   └── utils.ts               # cn() utility
├── models/                    # Mongoose models
├── schemas/                   # Zod validation schemas
├── types/                     # TypeScript types
├── scripts/
│   └── seed.ts                # Database seed script
├── middleware.ts              # Admin route protection
└── .env.example               # Environment variable template
```

## API Endpoints

### Public
| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| GET    | `/api/certificates`       | List certificates (query params) |
| GET    | `/api/certificates/:id`   | Single certificate             |
| GET    | `/api/workshops`          | List workshops                 |
| GET    | `/api/workshops/:id`      | Single workshop                |
| GET    | `/api/profile`            | Portfolio profile              |
| POST   | `/api/contact`            | Submit contact message         |

### Admin (requires authentication)
| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| POST   | `/api/auth/login`         | Admin login                    |
| POST   | `/api/auth/logout`        | Admin logout                   |
| POST   | `/api/certificates`       | Create certificate             |
| PUT    | `/api/certificates/:id`   | Update certificate             |
| DELETE | `/api/certificates/:id`   | Delete certificate             |
| POST   | `/api/workshops`          | Create workshop                |
| PUT    | `/api/workshops/:id`      | Update workshop                |
| DELETE | `/api/workshops/:id`      | Delete workshop                |
| GET    | `/api/messages`           | List contact messages          |
| PATCH  | `/api/messages/:id`       | Mark message as read           |
| PUT    | `/api/profile`            | Update profile                 |

## Features

- **3D Hero Section** — Rotating DNA double-helix with bloom post-processing and mouse parallax
- **Dark/Light Theme** — Persisted toggle with smooth transitions
- **Glassmorphism UI** — Frosted glass cards with glow effects
- **Responsive Design** — Mobile-first, tested at 375px–1440px
- **Admin Dashboard** — Full CRUD for certificates and workshops
- **JWT Authentication** — Secure httpOnly cookie-based auth
- **Zod Validation** — Shared schemas between frontend and API
- **Loading States** — Skeleton loaders and spinners for all data fetching
- **Accessibility** — Keyboard-navigable, prefers-reduced-motion support, semantic HTML

## Deployment

### Vercel (Frontend + API)

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### MongoDB Atlas

1. Create free cluster
2. Whitelist Vercel IPs (0.0.0.0/0 for development)
3. Copy connection string to Vercel env vars

### Cloudinary

1. Create free account
2. Get cloud name, API key, and API secret
3. Add to Vercel env vars

## License

MIT
