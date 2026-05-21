# Handcrafted Haven — Issue Board Index

> **Package Manager:** `pnpm` | **Framework:** Next.js 16 (App Router, JavaScript)
> **Database:** PostgreSQL + Prisma ORM | **Auth:** Custom JWT (jose + bcryptjs) | **Styling:** Tailwind CSS v4

---

## 📋 Gitflow Strategy

Before starting **any** issue:

```bash
git checkout main
git pull origin main
git checkout -b [YOUR-INITIALS]-issue-[NUMBER]-short-name
```

**Example** (Pedro Moura working on issue 03):
```bash
git checkout main ; git pull origin main
git checkout -b PM-issue-03-prisma-schema
```

After finishing:
```bash
git add .
git commit -m "feat: setup prisma schema"
git push -u origin PM-issue-03-prisma-schema
```
Then open a **Pull Request** on GitHub → teammate reviews → merge into `main`.

---

## 📁 Issue Files

### EPIC 1 — Project Foundation
| # | File | Title |
|---|------|-------|
| 01 | [issue-01.md](./issue-01.md) | Initialize Next.js & Clean Boilerplate |
| 02 | [issue-02.md](./issue-02.md) | Install Dependencies & Configure Build |
| 03 | [issue-03.md](./issue-03.md) | Prisma ORM & Database Schema |
| 04 | [issue-04.md](./issue-04.md) | Core Libraries (prisma.js, auth.js, utils.js) |
| 05 | [issue-05.md](./issue-05.md) | Design System (globals.css) |

### EPIC 2 — Providers & Shared UI
| # | File | Title |
|---|------|-------|
| 06 | [issue-06.md](./issue-06.md) | Context Providers (Auth, Toast, Cart) |
| 07 | [issue-07.md](./issue-07.md) | Core UI Components (Button, Spinner, Badge, etc.) |
| 08 | [issue-08.md](./issue-08.md) | ProductCard, StarRating, Carousel Components |
| 09 | [issue-09.md](./issue-09.md) | Header, MobileMenu & Footer |
| 10 | [issue-10.md](./issue-10.md) | Shop Filter Components (SearchBar, Sort, etc.) |

### EPIC 3 — Layout & Error Pages
| # | File | Title |
|---|------|-------|
| 11 | [issue-11.md](./issue-11.md) | Root Layout, Error & 404 Pages |

### EPIC 4 — Authentication
| # | File | Title |
|---|------|-------|
| 12 | [issue-12.md](./issue-12.md) | Auth Server Actions |
| 13 | [issue-13.md](./issue-13.md) | Login & Register Pages |

### EPIC 5 — Backend (Server Actions & API Routes)
| # | File | Title |
|---|------|-------|
| 14 | [issue-14.md](./issue-14.md) | Product & Review Server Actions |
| 15 | [issue-15.md](./issue-15.md) | Cart & Order Server Actions |
| 16 | [issue-16.md](./issue-16.md) | API Routes (Products, Categories, Sellers) |

### EPIC 6 — Public Pages
| # | File | Title |
|---|------|-------|
| 17 | [issue-17.md](./issue-17.md) | Homepage |
| 18 | [issue-18.md](./issue-18.md) | Shop Page with Filters |
| 19 | [issue-19.md](./issue-19.md) | Product Detail Page |
| 20 | [issue-20.md](./issue-20.md) | Categories, Seller & About Pages |

### EPIC 7 — Cart, Checkout & Account
| # | File | Title |
|---|------|-------|
| 21 | [issue-21.md](./issue-21.md) | Cart & Checkout Pages |
| 22 | [issue-22.md](./issue-22.md) | Account Page |

### EPIC 8 — Seller Dashboard
| # | File | Title |
|---|------|-------|
| 23 | [issue-23.md](./issue-23.md) | Dashboard Layout & Overview |
| 24 | [issue-24.md](./issue-24.md) | Dashboard Product Management |
| 25 | [issue-25.md](./issue-25.md) | Dashboard Profile & Sell Pages |
