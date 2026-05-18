# Handcrafted Haven

Handcrafted Haven is a beautiful, community-driven marketplace connecting independent artisans with customers who value high-quality, handmade, and sustainable products. Built on a modern tech stack, it features a seamless shopping experience for buyers and a powerful management dashboard for sellers.

## Features

### For Buyers
- **Explore & Discover:** Search for products with a powerful debounced search, or filter by category, price, and rating.
- **Cart & Checkout:** Add products to your cart and proceed through a simulated smooth checkout process.
- **Reviews:** Leave reviews and ratings on products you've purchased.
- **Account Management:** Track your recent orders, manage your profile, and upgrade to a seller account at any time.

### For Sellers
- **Dedicated Dashboard:** A native app-like dashboard experience designed for efficiency on both desktop and mobile.
- **Product Management:** Add, edit, and delete products. Includes rich integration with Cloudinary for seamless drag-and-drop image uploads.
- **Order Tracking:** View and manage incoming orders from buyers.
- **Community Engagement:** Reply directly to customer reviews on your products.

## Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, Server Actions)
- **Styling:** Vanilla CSS with custom Tailwind-like utility classes and CSS variables for theming.
- **Database:** PostgreSQL (via [Render](https://render.com))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** Custom JWT-based authentication
- **Image Hosting:** [Cloudinary](https://cloudinary.com)
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js (v18+)
- `pnpm` package manager
- A PostgreSQL database URL
- A Cloudinary account

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd haven-handcrafted-test
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://user:password@host/dbname"
   JWT_SECRET="your_secure_jwt_secret"
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_unsigned_upload_preset"
   CLOUDINARY_API_SECRET="your_api_secret"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   # Optional: Seed the database with sample data
   node update-seed.js
   ```

5. **Start the development server:**
   ```bash
   pnpm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## Project Structure

- `/src/app`: Next.js App Router pages (auth, dashboard, shop, etc.)
- `/src/components/ui`: Reusable UI components (Buttons, Inputs, Modals, Cards)
- `/src/components/providers`: React Context providers (Auth, Cart, Toast)
- `/src/lib`: Core utilities (Prisma client, Auth logic, Formatting)
- `/src/app/api`: Next.js Route Handlers for backend endpoints
- `/prisma`: Database schema definition

## Design Philosophy

The application prioritizes a clean, warm, and highly responsive aesthetic. It utilizes a combination of soft "surface" colors, strong typography (Outfit for display, Inter for body), and micro-animations to create a premium, artisan-focused user experience that works flawlessly on mobile, tablet, and desktop devices.


# Handcrafted Haven — GitHub Kanban / Issues (Final Version with NextAuth JWT)

Stack:
- Next.js App Router
- JavaScript
- TailwindCSS
- Prisma ORM
- Neon PostgreSQL
- Cloudinary
- NextAuth (JWT strategy)

---

# Git Workflow Rules

## Main Branch Rules
- `main` must always be stable and working
- Never commit directly to `main`
- Every task must be done in a feature branch

---

## Workflow Steps

### 1. Start from latest main
```bash
git checkout main
git pull origin main
```

---

### 2. Create feature branch
Format:
```txt
initials/feature-name
```

Example:
```bash
git checkout -b jc/product-form
```

---

### 3. Atomic commit rules

Each commit must represent ONE logical change.

### Allowed prefixes:
```txt
feat: new feature
fix: bug fix
refactor: code improvement
style: UI changes only
docs: documentation
test: testing changes
```

---

### 4. Push branch
```bash
git push origin jc/product-form
```

---

### 5. Pull Request rules
- Always create PR after push
- Ensure no merge conflicts
- Ask team approval on Teams before merging

Message template:
```txt
PR ready for review:
Feature: Product Creation Form
Branch: jc/product-form
No merge conflicts detected
Ready to merge into main?
```

---

# SIMPLE LABELS

```txt
frontend
backend
bug
urgent
testing
```

---

# ISSUE 1 — Setup Project

## Title
Initialize Next.js Project with TailwindCSS

## Labels
frontend, urgent

---

## User Story

**Title:** Initial Project Setup for Team Development

**Description:**  
As a developer joining the project, I need a fully configured Next.js application with TailwindCSS, ESLint, and a structured folder system so that I can immediately start building features without setup delays or inconsistencies across the team.

**Benefit:**  
Ensures all developers work in the same environment and prevents configuration issues.

---

## Tasks

- [ ] Create Next.js app (App Router)
- [ ] Enable TailwindCSS
- [ ] Configure ESLint
- [ ] Setup `/src/app`, `/src/components`, `/src/lib`
- [ ] Push initial commit
- [ ] Verify project runs locally

---

## Acceptance Criteria

- App runs with `npm run dev`
- TailwindCSS works correctly
- Repository is ready for team development

---

# ISSUE 2 — Prisma + Neon Setup

## Title
Configure Prisma ORM with Neon PostgreSQL

## Labels
backend, urgent

---

## User Story

**Title:** Persistent Database Connection for Marketplace Data

**Description:**  
As a developer, I need a PostgreSQL database connected via Prisma so that users, products, reviews, and seller profiles can be stored and retrieved reliably across sessions.

**Benefit:**  
Enables full backend functionality for the marketplace.

---

## Tasks

- [ ] Create Neon database
- [ ] Add DATABASE_URL to `.env`
- [ ] Install Prisma
- [ ] Initialize Prisma
- [ ] Configure schema datasource
- [ ] Run first migration
- [ ] Open Prisma Studio

---

## Acceptance Criteria

- Database connected successfully
- Prisma Studio shows schema correctly

---

# ISSUE 3 — Database Models

## Title
Create Marketplace Database Schema

## Labels
backend, urgent

---

## User Story

**Title:** Structured Data Model for Marketplace Features

**Description:**  
As a developer, I need database models for users, seller profiles, products, categories, and reviews so that relationships between sellers, products, and customers are properly managed.

**Benefit:**  
Enables complete marketplace data structure.

---

## Tasks

- [ ] Create User model
- [ ] Create SellerProfile model
- [ ] Create Product model
- [ ] Create Category model
- [ ] Create Review model
- [ ] Define relationships
- [ ] Run migration

---

## Acceptance Criteria

- All tables exist in DB
- Relationships work in Prisma Studio

---

# ISSUE 4 — Authentication (NextAuth JWT)

## Title
Implement Authentication using NextAuth (JWT Strategy)

## Labels
frontend, backend, urgent

---

## User Story

**Title:** Secure Login and Session Management for Users

**Description:**  
As a user, I want to register and log in securely using email and password so that I can access protected features like creating products, managing my profile, and leaving reviews. The system should maintain my login session without requiring repeated authentication.

**Benefit:**  
Ensures secure access control while keeping the system simple and scalable.

---

## Tasks

- [ ] Install NextAuth
- [ ] Setup Credentials Provider
- [ ] Configure JWT session strategy
- [ ] Create login page
- [ ] Create register page
- [ ] Hash passwords using bcrypt
- [ ] Store users in database
- [ ] Protect routes like `/sell`

---

## Important Concept — JWT in NextAuth

We are using:

```js
session: {
  strategy: "jwt"
}
```

### What this means:
- After login, NextAuth creates a JWT token
- Token is stored in a secure cookie
- No session table is needed in the database

### Flow:
```txt
User logs in → JWT created → stored in cookie → used for authentication
```

### Why we use JWT here:
- simpler setup (no session database)
- perfect for MVP projects
- works well with Prisma + Neon
- easier to deploy on Vercel

---

## Acceptance Criteria

- Users can register and log in
- Sessions persist across refresh
- Protected routes are inaccessible without login

---

# ISSUE 5 — Cloudinary Image Uploads

## Title
Implement Image Upload System with Cloudinary

## Labels
frontend, backend

---

## User Story

**Title:** Upload Product Images for Listings

**Description:**  
As a seller, I want to upload images of my products so that buyers can visually evaluate items before purchasing.

**Benefit:**  
Improves product presentation and trust.

---

## Tasks

- [ ] Create Cloudinary account
- [ ] Configure API keys
- [ ] Build upload helper
- [ ] Create image upload component
- [ ] Store image URLs in DB

---

## Acceptance Criteria

- Images upload successfully
- URLs stored and displayed correctly

---

# ISSUE 6 — Product Creation

## Title
Build Product Listing Creation System

## Labels
frontend, backend, urgent

---

## User Story

**Title:** Create Product Listings for Marketplace

**Description:**  
As a seller, I want to create product listings with title, description, price, category, and images so that my handcrafted items appear in the marketplace.

**Benefit:**  
Enables core marketplace functionality.

---

## Tasks

- [ ] Create `/sell` page
- [ ] Build product form UI
- [ ] Add validation (Zod)
- [ ] Integrate Cloudinary upload
- [ ] Save product with Prisma
- [ ] Redirect after submission

---

## Acceptance Criteria

- Product is saved in DB
- Product appears on homepage

---

# ISSUE 7 — Marketplace Grid

## Title
Display Products in Marketplace

## Labels
frontend

---

## User Story

**Title:** Browse Available Products

**Description:**  
As a user, I want to browse all products in a clean grid layout so that I can discover handcrafted items easily.

**Benefit:**  
Main browsing experience of the app.

---

## Tasks

- [ ] Fetch products from DB
- [ ] Create ProductCard
- [ ] Build responsive grid
- [ ] Add loading state

---

## Acceptance Criteria

- Products render correctly
- Layout responsive

---

# ISSUE 8 — Product Details Page

## Title
Product Detail Page

## Labels
frontend

---

## User Story

**Title:** View Full Product Information

**Description:**  
As a user, I want to click a product and view its full details including images, description, price, seller info, and reviews so that I can decide whether to purchase it.

**Benefit:**  
Improves buying confidence.

---

## Tasks

- [ ] Create dynamic route `/products/[id]`
- [ ] Fetch product by ID
- [ ] Display full details
- [ ] Handle invalid IDs

---

## Acceptance Criteria

- Product page loads correctly
- 404 works for invalid products

---

# ISSUE 9 — Seller Profiles

## Title
Create Seller Profiles

## Labels
frontend, backend

---

## User Story

**Title:** Manage Public Seller Profile

**Description:**  
As a seller, I want a profile page where I can display my bio, profile picture, and all my products so that customers can learn about me and my work.

**Benefit:**  
Builds trust and identity for sellers.

---

## Tasks

- [ ] Create profile page
- [ ] Add bio field
- [ ] Add image upload
- [ ] Link products to seller
- [ ] Create public profile page

---

## Acceptance Criteria

- Profiles are editable
- Public profiles show products

---

# ISSUE 10 — Search

## Title
Product Search Functionality

## Labels
frontend, backend

---

## User Story

**Title:** Search Products by Keyword

**Description:**  
As a user, I want to search products by typing keywords so that I can quickly find specific items without browsing manually.

**Benefit:**  
Improves navigation efficiency.

---

## Tasks

- [ ] Create search input
- [ ] Add debounce
- [ ] Query DB (title + description)
- [ ] Display results dynamically

---

## Acceptance Criteria

- Search works instantly
- Relevant results shown

---

# ISSUE 11 — Category Filter

## Title
Filter Products by Category

## Labels
frontend

---

## User Story

**Title:** Filter Products by Category Type

**Description:**  
As a user, I want to filter products by category (e.g., jewelry, woodwork, ceramics) so that I can quickly find items that match my interests.

**Benefit:**  
Improves product discovery.

---

## Tasks

- [ ] Create category dropdown
- [ ] Fetch categories from DB
- [ ] Filter products
- [ ] Sync with URL

---

## Acceptance Criteria

- Filtering works correctly

---

# ISSUE 12 — Price Filter

## Title
Filter Products by Price Range

## Labels
frontend

---

## User Story

**Title:** Filter Products by Budget

**Description:**  
As a user, I want to filter products by minimum and maximum price so that I only see items that fit my budget.

**Benefit:**  
Improves shopping experience.

---

## Tasks

- [ ] Create price inputs
- [ ] Filter logic
- [ ] Combine filters
- [ ] Reset filters

---

## Acceptance Criteria

- Price filtering works correctly

---

# ISSUE 13 — Reviews System

## Title
Product Reviews and Ratings

## Labels
frontend, backend

---

## User Story

**Title:** Leave Reviews on Products

**Description:**  
As a user, I want to leave a star rating and written review for a product I purchased so that I can share my experience and help others make better decisions.

**Benefit:**  
Builds trust in the marketplace.

---

## Tasks

- [ ] Create review form
- [ ] Add star rating system
- [ ] Save reviews in DB
- [ ] Display reviews
- [ ] Calculate average rating

---

## Acceptance Criteria

- Reviews submit correctly
- Ratings display properly

---

# ISSUE 14 — Mobile Navigation

## Title
Responsive Navigation Bar

## Labels
frontend

---

## User Story

**Title:** Mobile-Friendly Navigation

**Description:**  
As a mobile user, I want the navigation menu to adapt to small screens so that I can browse easily on my phone.

**Benefit:**  
Improves usability on mobile devices.

---

## Tasks

- [ ] Create navbar
- [ ] Add hamburger menu
- [ ] Add responsive styles
- [ ] Test on mobile

---

## Acceptance Criteria

- Works on all screen sizes

---

# ISSUE 15 — Accessibility

## Title
Improve Accessibility (WCAG)

## Labels
frontend, testing

---

## User Story

**Title:** Screen Reader Compatibility

**Description:**  
As a user with visual impairments, I want the site navigation to be accessible via screen readers so that I can browse independently.

**Benefit:**  
Ensures accessibility for all users.

---

## Tasks

- [ ] Add aria-labels
- [ ] Add alt text
- [ ] Improve keyboard navigation
- [ ] Run Lighthouse audit

---

## Acceptance Criteria

- Accessibility score ≥ 90

---

# ISSUE 16 — Deployment

## Title
Deploy Application to Vercel

## Labels
backend, urgent

---

## User Story

**Title:** Make Marketplace Publicly Accessible

**Description:**  
As a team, we want to deploy the application online so that users and instructors can access the marketplace in a real environment.

**Benefit:**  
Enables real-world usage and final presentation.

---

## Tasks

- [ ] Connect GitHub to Vercel
- [ ] Add environment variables
- [ ] Deploy project
- [ ] Test production build
- [ ] Verify database connection

---

## Acceptance Criteria

- Live site works correctly

---

# ISSUE 17 — Final Testing

## Title
Full QA Testing and Bug Fixing

## Labels
testing, bug

---

## User Story

**Title:** Ensure System Stability Before Delivery

**Description:**  
As a team, we need to test all features including authentication, product creation, image uploads, search, filters, and navigation to ensure the application is stable and free of critical bugs before submission.

**Benefit:**  
Ensures a reliable final product for presentation.

---

## Tasks

- [ ] Test authentication
- [ ] Test product creation
- [ ] Test image upload
- [ ] Test search and filters
- [ ] Test responsiveness
- [ ] Fix bugs

---

## Acceptance Criteria

- No critical bugs
- App stable for demo