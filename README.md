# 🌐 DapLink

<p align="center">
  <strong>The AI-Powered Interactive Identity & Smart Routing Hub</strong><br />
  🤖 AI Digital Twin • 🔀 Smart Link Router • 🎨 Context-Aware QR Engine • 💬 Direct Chat • 🗂️ Interactive Landing Pages • 📊 Geo Analytics
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.7-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Gemini_API-2.5_Flash-blue?style=for-the-badge&logo=google-gemini" alt="Gemini API" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MongoDB-6.18.0-47a248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-4.8.1-010101?style=for-the-badge&logo=socket.dot-io" alt="Socket.io" />
</p>

---

## 📝 Overview

**DapLink** is an AI-powered, context-responsive digital identity hub and smart routing platform designed for digital creators, professionals, and local businesses. 

Unlike standard static link directories (e.g. Linktree), DapLink transforms creator bios into active conversational portals using custom-trained **AI Digital Twins**. It also features a **Context-Aware Smart Redirect Router** that turns simple links and QR codes into responsive action triggers—redirecting scanners based on device type, time of day, or location.

Built with Next.js 15 (App Router), Tailwind CSS v4, Google Gemini API, MongoDB/Mongoose, and Socket.io, DapLink provides a premium user interface optimized for customer conversion and creator monetization.

---

## 🔄 Recent Updates & Bug Fixes (Post-Handover)

Below is a detailed log of the structural enhancements, feature additions, and bug fixes implemented since taking over the project repository:

### 1. 🎨 Layout Template Studio & Card Customization (New Feature)
We built a robust, custom layout engine allowing creators to construct unique interactive designs for their link-in-bio:
* **Four Unique Layout Templates**:
  * `classic` (Standard List): Centralized, elegant vertical flow of profile info, socials, and tab sections.
  * `bento` (Bento Grid): Modern dashboard grid deck containing user stats, bio, location, links, and updates.
  * `split` (Split Screen): Desktop-optimized split-view with a sticky left profile card and scrollable links/feed on the right.
  * `minimal` (Minimalist Card): Ultra-clean floating glassmorphic container set against dynamic backdrop glows.
* **Card Border & Panel Customization**: Added visual style presets for profile panels, cards, and links:
  * `glass` (Glassmorphic): Frosted blur effects with subtle borders and micro-shadows.
  * `flat` (Flat Solid): Clean, high-contrast flat backgrounds.
  * `glow` (Neon Border): Vibrant, glowing borders and ambient shadow accents colored by the creator's theme.
* **Real-time Studio Workspace**: Integrated Layout template selection and Card Border styles inside the **Appearance** tab in the dashboard editor ([app/Dashboard/editProfile/page.js](file:///e:/Kunal/codingplay/Projects/PROJECT-7(DapLink)/daplink/app/Dashboard/editProfile/page.js)) with instant real-time synchronization in the mockup phone preview.
* **Dynamic Server/Client Public Profile Renderer**: Optimized [app/u/[handle]/page.js](file:///e:/Kunal/codingplay/Projects/PROJECT-7(DapLink)/daplink/app/u/[handle]/page.js) to dynamically resolve user layout preferences, applying accent colors, font styling, and card borders with full SEO support.

### 2. 🐛 Key Bug Fixes & Code Optimizations
We identified and resolved critical errors in the original project files:
* **Dashboard JSX Mismatches**: Fixed a missing closing tag block inside the profile canvas editor component in [page.js](file:///e:/Kunal/codingplay/Projects/PROJECT-7(DapLink)/daplink/app/Dashboard/editProfile/page.js) that caused layout page rendering to break.
* **Temporal Dead Zone Hoisting Error**: Resolved a `ReferenceError: Cannot access 'routeHandle' before initialization` in the dynamic profile page [page.js](file:///e:/Kunal/codingplay/Projects/PROJECT-7(DapLink)/daplink/app/u/[handle]/page.js) by hoisting route parameter initialization higher in the scope.
* **Next.js HMR Webpack Cache Corruption**: Solved a Webpack cache corruption issue on Windows (`Cannot find module './5873.js'` / `Unexpected end of JSON input`) by migrating `favicon.ico` from dynamic routing (`app/`) to static serving (`public/`) and updating all layout/metadata icon paths to absolute roots.
* **Public Page Syntax Fixes**: Fixed double-parenthesis/semicolon syntax termination (`););`) inside the return layout of [page.js](file:///e:/Kunal/codingplay/Projects/PROJECT-7(DapLink)/daplink/app/u/[handle]/page.js).

---

## ✨ Key Features

### 1. 🤖 Interactive AI Digital Twin (Conversational Agent)
* **Real-Time Assistant Chat:** Public profile pages `/u/[handle]` embed an AI conversational agent representing the profile owner.
* **Knowledge Customization:** Train the AI on specific biographies, custom brand context, services, working hours, and targeted Q&A FAQs.
* **Interactive Resource Finder:** The AI searches the owner's active links and offers clickable resource cards directly inside the conversation thread.
* **Dashboard Simulator:** A floating preview mockup inside the creator's Dashboard lets owners test and interact with their twin in real-time.

### 2. 🔀 Context-Aware Smart Redirect Router
* **Device-Responsive Routing:** Automatically detects user devices (iOS vs Android vs Desktop) and routes links to different destination URLs (e.g., routing to the App Store or Google Play Store).
* **Scheduled Time Ranges:** Dynamically shifts link targets based on the time of the scan (e.g., directing tables in a cafe to a breakfast menu in the morning and a dinner menu in the evening).
* **Geographical Location Routing:** Inspects incoming country headers (`x-vercel-ip-country`) to direct visitors to region-specific URLs or local landing pages.
* **Dynamic QR Codes:** A single generated QR code can change behaviors on the fly based on these configured rules without requiring physical reprinting.

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
