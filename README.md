# 🌐 DapLink

<p align="center">
  <strong>The Ultimate All-in-One Digital Identity Hub</strong><br />
  🔗 Link Shortener • 🎨 QR Code Generator • 💬 Real-Time Chat • 🗂️ Link-in-Bio Builder • 📊 Rich Analytics • 👥 Community Connections
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.7-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MongoDB-6.18.0-47a248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-4.8.1-010101?style=for-the-badge&logo=socket.dot-io" alt="Socket.io" />
  <img src="https://img.shields.io/badge/Framer_Motion-12.26-ff007f?style=for-the-badge&logo=framer" alt="Framer Motion" />
</p>

---

## 📝 Overview

**DapLink** is a state-of-the-art, high-profile platform designed for digital creators, professionals, and teams to streamline their online presence. It goes far beyond standard link shortening. DapLink combines highly customizable **Link-in-Bio profile landing pages**, dynamic **QR Code generation**, direct **real-time chat messaging**, professional **audience analytics**, and a robust **creator networking community** under one beautifully optimized web experience.

Built with Next.js 15 (App Router), Tailwind CSS v4, Framer Motion, MongoDB/Mongoose, and Socket.io, DapLink provides a seamless, immersive, and premium UI with smooth micro-animations, glassmorphism designs, and a modern responsive structure.

---

## ✨ Key Features

### 1. 🔗 Advanced Link Shortener (`/app/[code]`)
* **High-Speed Redirection:** Instantly maps short codes to target URLs.
* **Link Management:** Edit, deactivate, delete, and monitor links.
* **Analytic Tracking:** Captures clicks, device types, operating systems, browsers, and geographic locations automatically.

### 2. 🎨 Premium QR Code Engine (`/app/api/qrcode`)
* **Highly Customizable Stylers:** Custom control over primary/secondary foreground dot colors, gradients, and custom background colors.
* **Structural Designs:** Configure unique dot patterns, corner/eye styles, and frame shapes.
* **Logo Embedding:** Supports uploading and embedding custom branding logos (Base64/URL formats) in the center of the QR code.

### 3. 📱 Dynamic Link-in-Bio Landing Page Builder (`/app/Generate`)
* **Multi-Step Onboarding Funnel:** Choose handles, select themes, assign custom background patterns, and add digital links step-by-step.
* **Detailed Aesthetic Configuration:** Change page fonts, custom accent colors, background styling (soft, glow, gradient, image), button border-radius, element blurs, and border formatting.
* **Public Profiles:** Public-facing `/u/[handle]` endpoints with premium layouts, floating cards, social icons, custom bios, and connection triggers.

### 4. 💬 Live Socket-Powered Chat & Connections (`/app/Dashboard/messages`)
* **Instant Direct Messaging:** Built-in messaging platform powered by Socket.io.
* **Follow-to-Message Integration:** Network by searching the community, following profiles, and messaging connections directly.
* **Online Presence Indicators:** Seamless client-server synchronization of active chat conversations.

### 5. 📊 Rich Audience Analytics Dashboard (`/app/Dashboard/analytics`)
* **Geographical Mapping:** D3-based interactive World Map (`WorldMap.jsx`) charting target viewer origins.
* **Visual Charting:** Beautiful responsive layouts built with ECharts and Recharts for daily metrics, browser shares, operating systems, and device splits.
* **Traffic Ingress Logs:** Audit tables detailing exact referrers, coordinates, timestamps, and IP parameters.

---

## 📂 Project Directory Structure

```filepath
daplink/
├── app/                        # Next.js 15 App Router Directory
│   ├── [code]/                 # Dynamic route handling short URL redirects (route.js)
│   ├── api/                    # Server-side API endpoints & routes
│   │   ├── (Follow)/           # API endpoints to handle follow/unfollow operations & query statuses
│   │   ├── (UrlShortner)/      # API endpoints to manage database short link registrations
│   │   ├── (onboarding)/       # Handle check-ups and onboarding workflow progression
│   │   ├── ContactusApi/       # Handle customer inquiry submissions
│   │   ├── GetReview/          # Fetch platform testimonials
│   │   ├── Peoples/            # Search and fetch other DapLink creators
│   │   ├── Review/             # Review creation & publication
│   │   ├── Socket/             # Handlers and initializers for websockets
│   │   ├── Updatedetails/      # Profile modifications
│   │   ├── auth/               # Next-Auth settings and controllers
│   │   ├── backend/            # Utility controllers and server setups
│   │   ├── getDaplink/         # Fetch full profile and links configuration
│   │   ├── getQrcode/          # Retrieve generated user QR codes
│   │   ├── links/              # Main links management
│   │   ├── posthog/            # Analytics integrations
│   │   ├── qrcode/             # Custom QR code generation, updates & saves
│   │   └── theme/              # Personalized profile themes
│   ├── About/                  # Static About DapLink page
│   ├── Blog/                   # Blog page directory
│   ├── Contact/                # Feedback and contact forms
│   ├── Dashboard/              # Authenticated user dashboard section
│   │   ├── analytics/          # Rich analytics interface (ECharts, Recharts, WorldMap)
│   │   ├── bioPage/            # Link-in-bio personalization page
│   │   ├── community/          # Community connection listing page
│   │   ├── editProfile/        # User detail editing panel
│   │   ├── features/           # Showcase of creator features
│   │   ├── messages/           # Live chat client page (Socket.io-client)
│   │   ├── monetization/       # Monetization configurations (referred to as Monetize)
│   │   ├── mindset/            # High-productivity mindset hubs
│   │   └── settings/           # Account settings & credentials management
│   ├── Docu/                   # Platform documentation and API references
│   ├── Explorepeoples/         # Creator discovery directory (search, profiles, follows)
│   ├── Generate/               # Multi-step link-in-bio generation funnel
│   ├── Pricing/                # Tier packages page (Free vs Premium plans)
│   ├── Products/               # DapLink products list
│   ├── Templates/              # High-quality UI templates for bio profiles
│   ├── Trust/                  # Trust, privacy policy & compliance documentation
│   ├── u/                      # Public Creator Profiles
│   │   └── [handle]/           # Dynamic bio page rendering based on custom handle
│   ├── globals.css             # Tailwind v4 configuration and global styling
│   ├── layout.js               # Main layout wrapper injecting theme and auth context
│   └── page.js                 # Landing index showcasing Hero, Showcase, Pricing, and Testimonials
│
├── Components/                 # Reusable React UI Components
│   ├── DashboardComponents/    # Dedicated Dashboard layouts (Sidebar, Topbar, Tabs, WorldMap)
│   ├── modals/                 # Modular popup overlays for forms, alerts, and settings
│   ├── SkeletonScreen/         # Premium skeleton loaders for dashboard charts and lists
│   ├── ui/                     # Reusable atomic elements (Cards, Reveal wrappers, buttons)
│   ├── CalltoAction.js         # Direct user conversions layout
│   ├── FeatureShowcase.js      # Beautiful animated grid of core abilities
│   ├── Footer.js               # Styled comprehensive footer component
│   ├── Navbar.js               # Premium floating navigation bar with dark mode integration
│   ├── Realanalytics.js        # Showcase demo metrics for non-authenticated guests
│   └── Testimonial.js          # Interactive user review carousel
│
├── context/                    # React Context State Management
│   ├── Authenticate.js         # User session, login/registration tokens & state variables
│   └── ThemeContext.js         # Global light/dark theme tracking and DOM modifications
│
├── lib/                        # Utility & Core Initialization Libraries
│   ├── api/                    # Core API endpoints wrappers
│   ├── auth.js                 # JWT-based local authentication methods
│   ├── mongodb.js              # Highly optimized Mongoose/MongoDB connection pool config
│   └── QueryProvider.js        # React-Query / TanStack Query client registration
│
├── models/                     # Mongoose Database Schemas
│   ├── Contact.js              # Contact messages schema
│   ├── Link.js                 # Creator Bio Profile schema (UserId, Handle, Links array, ThemeConfig)
│   ├── Review.js               # Testimonial reviews database collection
│   ├── ShortUrl.js             # Short URLs record schema (title, shortCode, originalUrl, click tracker)
│   ├── Theme.js                # Custom visual presets
│   ├── qrcode.js               # Custom QR Codes styles & logo configs schema
│   └── user.js                 # User database collection schema (details, following, onboarding trackers)
│
├── utils/                      # Helper Scripts & Configurations
│   ├── GenerateShortCode.js    # Logic for cryptographically robust short URL key generator
│   └── Socket.js               # Server-side Socket.IO handler initializer
│
├── public/                     # Static media assets, icons, fonts, and maps
├── middleware.js               # Next.js navigation guards protecting Dashboard pathways
├── next.config.mjs             # Next.js compiler and target platform adjustments
├── postcss.config.mjs          # PostCSS adjustments
├── tailwind.config.js          # Extended styling presets
└── package.json                # Project dependencies, script configurations & workspace metadata
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Purpose |
|---|---|---|
| **Core Architecture** | Next.js 15 (App Router), React 19, JavaScript (ESM) | Complete frontend/backend framework |
| **Database & ODM** | MongoDB, Mongoose | Data persistence, modeling, and schemas |
| **Real-time Engine** | Socket.io, Socket.io-client | Direct chat channels and live connection state updates |
| **Styling & Motion** | Tailwind CSS v4, PostCSS, Framer Motion | High-profile visuals, dark mode toggles, micro-animations |
| **Data Analytics** | D3.js, ECharts, Recharts, TopoJSON-client | High-fidelity maps, graphical click telemetry, dashboards |
| **Security & Auth** | NextAuth.js, JWT, BcryptJS, js-cookie | Secure session management, password hashing, routing guards |
| **UI Enhancements** | Canvas-confetti, Lucide-React, React-icons, React-hot-toast | UI rewards, icons, and notifications |

---

## 🏁 Setup & Installation

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher recommended) and **MongoDB** installed or access to a MongoDB Atlas cluster.

### 2. Clone the Repository & Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd daplink

# Install all workspace dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and configure the following variables:
```env
# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/daplink

# NextAuth & JWT Secrets
NEXTAUTH_SECRET=your_super_secret_nextauth_key
JWT_SECRET=your_super_secret_jwt_sign_key
NEXTAUTH_URL=http://localhost:3000

# Analytical Trackers (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### 4. Running the Project
```bash
# Launch Next.js local development server
npm run dev

# Build for production
npm run build

# Start the compiled production build
npm run start

# Lint the codebase
npm run lint
```

---

## 🌟 Visual Theme & Design Systems
DapLink implements a premium, high-profile interface right out of the box:
* **Aurora Glowing Accents:** Smooth backdrop gradients that shift over time (`fixed inset-0 bg-purple-900/30...`).
* **Glassmorphic Cards:** High transparency blur layers (`backdrop-blur-md`) giving elements a premium frosted look.
* **Fluid Micro-Animations:** Clean, spring-based Framer Motion transitions upon button hover, input focusing, and step shifts.
* **Seamless Dark Mode:** Responsive global context theme transitions keeping layout brightness tailored to user settings.
