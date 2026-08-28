# 🏦 Tally — Digital Bank

> Tu banco digital. Envía, recibe y gestiona tu dinero desde tu celular.

![Tally Banner](public/icon-512x512.png)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [PWA](#pwa)
- [Contributing](#contributing)
- [License](#license)

---

## About

**Tally** is a modern neobank web application designed to provide a seamless banking experience on mobile devices. Built with a dark-themed glassmorphism UI, Tally allows users to manage their money, send transfers, view transaction history, and control their debit card — all from a progressive web app.

### Mission

To deliver a fast, secure, and beautiful digital banking experience that works on any device, starting from the mobile screen.

---

## Features

### 🔐 Authentication & Security
- **Email/password registration** with form validation (react-hook-form)
- **Login** with persistent sessions via JWT tokens
- **Protected routes** — unauthenticated users are redirected to login
- **KYC badge** displayed for verified accounts
- **Session auto-expiry** — expired tokens redirect to login automatically

### 💰 Dashboard & Balance
- **Real-time balance display** with account number
- **Refresh account** data with pull-to-refresh style button
- **Loading skeletons** for smooth UX during data fetch

### 💸 Money Transfers
- **Send money** to any registered user by email
- **Transfer form** with amount validation, concept field, and balance check
- **Processing screen** with animated spinner during transfer
- **Success/error screens** with detailed transfer receipt
- **Frequent payees** — save and reuse beneficiaries
- **Transfer history** with paginated "load more" and caching

### 💳 Bank Cards
- **Virtual card display** with masked data (toggle visibility)
- **Card security settings**:
  - 🧊 Freeze/unfreeze card
  - 🌐 Toggle international payments
  - 👁️ Show/hide card details
- **Card info**: number, holder name, expiration, CVV

### 🔔 Notifications
- **Real-time notification feed** with read/unread states
- **Mark as read** individual or all notifications
- **Notification types**: transfers sent, transfers received, system alerts
- **Caching** for faster subsequent loads

### 📱 Profile & Settings
- **Profile page** with user info, avatar, and KYC status
- **Personal data** section
- **Security settings**
- **Information page**
- **Logout** with full local cache cleanup

### 🌐 Progressive Web App (PWA)
- **Installable** on mobile and desktop devices
- **Service worker** for offline caching
- **Web app manifest** with app icons and splash screen
- **Install prompt modal** for first-time visitors

### 🎨 UI/UX
- **Dark mode only** — deep black background with glassmorphism cards
- **Mobile-first responsive design** (centered on desktop with `max-w-lg`)
- **Animated transitions** and micro-interactions
- **Skeleton loading states** for every data-dependent section
- **Toast notifications** for in-app messages
- **Consistent typography** using Inter Variable Font

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Compiler** | React Compiler (via Babel plugin) |
| **Bundler** | Vite 8 |
| **Styling** | Tailwind CSS v4 (CSS-first config) |
| **Routing** | React Router v7 |
| **Forms** | React Hook Form |
| **Icons** | Phosphor React |
| **Font** | Inter Variable (self-hosted) |
| **PWA** | Service Worker + Web App Manifest |
| **Deployment** | Vercel |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Emcahell/tally-frontend.git

# Navigate to the project
cd tally-frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

---

## Project Structure

```
tally-frontend/
├── public/                          # Static assets
│   ├── favicon.ico
│   ├── icon-192x192.png             # PWA icon
│   ├── icon-512x512.png             # PWA icon
│   ├── manifest.json                # PWA manifest
│   └── sw.js                        # Service worker
├── src/
│   ├── assets/
│   │   └── fonts/Inter/             # Self-hosted Inter Variable Font
│   ├── components/
│   │   ├── ui/                      # Reusable UI primitives (no business logic)
│   │   │   ├── Avatar.tsx
│   │   │   ├── FieldError.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   ├── IconButton.tsx
│   │   │   ├── InstallPwaModal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Toast.tsx
│   │   └── shared/
│   │       ├── Imagotipo.tsx        # Brand logo (full)
│   │       ├── Isotipo.tsx          # Brand logo (icon only)
│   │       ├── TransferListItem.tsx
│   │       ├── TransactionDetailModal.tsx
│   │       ├── forms/               # Shared form components
│   │       ├── layout/              # Shell layout
│   │       │   ├── AuthLayout.tsx
│   │       │   ├── BottomNav.tsx
│   │       │   ├── Header.tsx
│   │       │   └── PageHeader.tsx
│   │       └── modals/              # Shared modals
│   ├── config/
│   │   └── api.ts                   # API client (fetch wrapper + error handling)
│   ├── constants/                   # Global constants
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Auth state provider
│   │   └── auth-context.ts          # Auth types
│   ├── hooks/
│   │   ├── useAuth.ts               # Auth hook
│   │   └── usePwaInstall.ts         # PWA install prompt hook
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── cards/
│   │   │   ├── CardsPage.tsx
│   │   │   └── components/
│   │   │       └── BankCard.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   └── components/
│   │   │       ├── BalanceCard.tsx
│   │   │       └── RecentTransactions.tsx
│   │   ├── notifications/
│   │   │   └── NotificationsPage.tsx
│   │   ├── profile/
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── PersonalDataPage.tsx
│   │   │   ├── InformationPage.tsx
│   │   │   └── SecurityPage.tsx
│   │   ├── terms/
│   │   │   └── TermsAndConditionsPage.tsx
│   │   ├── transfer/
│   │   │   ├── SendMoneyPage.tsx
│   │   │   └── components/
│   │   │       └── PayeesModal.tsx
│   │   ├── transfers/
│   │   │   └── TransfersHistoryPage.tsx
│   │   └── welcome/
│   │       └── WelcomePage.tsx
│   ├── routes/
│   │   └── ProtectedRoute.tsx       # Route guards (auth, public-only, redirect)
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── account.service.ts
│   │   ├── transfer.service.ts
│   │   └── notification.service.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── transfer.ts
│   │   └── notification.ts
│   ├── utils/
│   │   ├── cache.ts                 # In-memory TTL cache
│   │   ├── transfer-format.ts
│   │   └── validation.ts            # Form validation rules
│   ├── App.tsx                      # Route definitions
│   ├── index.css                    # Global styles + Tailwind theme
│   └── main.tsx                     # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── vercel.json
├── DESIGN.md                        # Design system documentation
└── README.md
```

---

## Design System

Tally uses a custom dark-themed design system with glassmorphism. Full details are in [`DESIGN.md`](DESIGN.md).

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#10B981` | Buttons, active links, strong accents |
| `bg-deep` | `#04060C` | App background (near-black) |
| `bg-card` | `rgba(12, 18, 32, 0.7)` | Glassmorphism cards |
| `accent-cyan` | `#06B6D4` | Deposits, info |
| `accent-rose` | `#F43F5E` | Errors, expenses |

### Key Principles

- **Glassmorphism** — `backdrop-blur-xl` + semi-transparent backgrounds + subtle borders
- **Mobile-first** — designed for phones, centered on desktop
- **Token-driven** — all colors use Tailwind theme tokens, never hardcoded values
- **Consistent spacing** — `px-5` horizontal, `space-y-6` between sections

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Type-check with `tsc` and build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint |

---

## Deployment

The app is configured for **Vercel** deployment with SPA routing support:

```json
{
  "rewrites": [
    { "source": "/((?!assets/|.*\\..*).*)", "destination": "/index.html" }
  ]
}
```

### Deploy to Vercel

1. Push to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Vercel auto-detects Vite and deploys

Or use the Vercel CLI:

```bash
npx vercel
```

---

## PWA

Tally is a **Progressive Web App** — users can install it directly from the browser.

### Features

- **Add to Home Screen** prompt for mobile users
- **Offline caching** via service worker
- **Standalone display** — no browser chrome when installed
- **Portrait orientation** locked

### Manifest

- **Name**: Tally — Digital Bank
- **Theme color**: `#10B981` (Tally Green)
- **Background**: `#04060C` (Deep Dark)
- **Icons**: 192x192 and 512x512 PNG

---

## License

This project is proprietary software. All rights reserved.

---

<p align="center">
  <strong>Tally</strong> — Tu dinero <span style="color: #10B981;">Tally</span> como es.
</p>
