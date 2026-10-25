# ✨ Celebration & Event Planner
> **Google PromptWars Virtual Challenge 05 Entry**  
> A modern, responsive celebration management command center for weddings, milestone birthdays, anniversaries, community festivals, and charity galas. Powered by React, Vite, Tailwind CSS, and the Google Gemini API with instant offline fallback resilience.

---

## 🎯 Problem Statement & Solution

### The Challenge
Planning significant celebrations (weddings, milestone birthdays, galas, and community festivals) is notoriously fragmented. Event organizers, couples, and community leaders juggle disconnected spreadsheets for budgets, messaging apps for vendors, notebook task lists for timelines, and scattered Pinterest boards for creative themes. When budget overruns occur or vendors miss deadlines, hosts face unnecessary stress and chaotic coordination.

### The Solution
**Celebration & Event Planner** unites the entire celebration lifecycle in a single, high-fidelity web application:
1. **Financial Clarity**: Real-time budget tracking across 8 dedicated categories with automated ceiling math and instant over-budget warnings.
2. **Operational Control**: Phased milestones spanning 3+ months out through day-of execution and post-event wrap-up, equipped with dynamic countdown urgency badges.
3. **Vendor Management**: End-to-end supplier directory with stage-based pipeline statuses, click-to-contact shortcuts, and committed quote ledgers.
4. **AI-Powered Inspiration**: Personalized celebration themes, 4-swatch palettes, decor staging ideas, playlist direction, and tailored budget tips generated via **Google Gemini API (`gemini-3.5-flash`)**.
5. **Zero-Downtime Offline Resilience**: 100% of core planning, budget math, timelines, vendor directories, and curated smart theme recommendations remain accessible locally with zero network dependency or API keys required.

---

## 🌟 Key Features

### 1. 🎉 Event Creation & Multi-Event Management
* **Specialized Event Presets**: Built-in defaults tailored for Weddings 💍, Milestone Birthdays 🎂, Anniversaries 🥂, Community Festivals 🤝, Charity Galas 🎭, and Baby Showers 👶.
* **Granular Event Metadata**: Title, date, start time, venue, expected guest count, ceiling budget, and custom vibe notes.
* **Concurrent Event Switching**: Seamlessly manage multiple celebrations with instant switcher, event duplication, and deletion.
* **Strict Validation**: Real-time form validation preventing negative budgets, invalid guest counts, or expired chronological dates.

### 2. 💰 Smart Budget Planner
* **Automated Real-Time Math**: Calculates **Total Budget**, **Total Allocated**, **Actual Spent**, and **Remaining Funds**.
* **Visual Over-Budget Warnings**: High-visibility alert banners trigger automatically if actual spending exceeds the ceiling budget.
* **8 Core Expense Categories**: Venue & Rentals, Catering & Beverages, Photography & Video, Decoration & Florals, Music & Entertainment, Attire & Beauty, Invitations & Stationery, Miscellaneous.
* **Interactive Expense Ledger**: Mark expenses as Paid or Pending, filter by category or status, search by keyword, and edit/delete entries inline.

### 3. ⏱️ Phased Timeline & Milestones
* **5 Structured Planning Phases**:
  1. *Early Planning* (3+ Months Prior)
  2. *Month Out* (4–6 Weeks Prior)
  3. *Final Countdown* (1–2 Weeks Prior)
  4. *Day of Celebration*
  5. *Post-Event Wrap-up*
* **Dynamic Due-Date Badges**: Automatic color-coded calculation of "Due Today", "Due in X Days", or "Overdue by X Days".
* **Celebratory Confetti**: Toggling milestone completion triggers confetti burst animations!
* **Multi-Filter Controls**: Filter milestones by priority (High 🔥, Medium ⚡, Low 🌱), phase, or completion status.

### 4. 🤝 Vendor Directory & Pipeline
* **Category Tagging**: Catering, Florals, Venue, Photography, DJ, Cake, Attire, and Equipment Rentals.
* **5-Stage Pipeline Status**: Move vendors smoothly across `Researching` ➔ `Contacted` ➔ `Quote Received` ➔ `Booked / Confirmed` ➔ `Deposit Paid`.
* **Quick Contact Shortcuts**: Instant one-click phone dialing (`tel:`) and email dispatch (`mailto:`).
* **Financial Commitment Tracking**: Store contracted quotes and star ratings with automatic totals aggregation.

### 5. ✨ AI Theme & Idea Studio (Google Gemini API)
* **Live Gemini API Integration**: Leverages `gemini-3.5-flash` via the official Google AI `v1beta` `generateContent` endpoint to generate 3 tailored concepts based on event type, venue, guest count, budget, and custom notes.
* **Rich Concept Schema**:
  - Creative concept name & evocative tagline
  - 4-color signature palette with hex swatches and descriptive color titles
  - 4 specific decor and staging highlights
  - Atmospheric musical direction
  - Signature catering & beverage ideas
  - Actionable budget optimization tip tailored to guest count
* **One-Click Theme Application**: Directly applies the chosen color palette to your celebration card and appends decor recommendations into your timeline tasks.
* **Intelligent Error Categorization**: Accurately distinguishes temporary Google server spikes (HTTP 503 high demand), rate limit cooldowns (HTTP 429 quota), invalid keys (HTTP 401), and timeouts (HTTP 408), offering actionable guidance rather than generic error popups.

### 6. 📊 Executive Dashboard & Export Suite
* **Live Countdown Banner**: Dynamic days, hours, and minutes ticking down to the celebration.
* **Executive KPI Cards**: Real-time budget health gauge, milestone completion rate, booked vendor ratio, and calculated cost-per-guest.
* **Printable Briefing Sheet**: Clean, print-optimized summary sheet for venue coordinators and day-of planners (`window.print()`).
* **JSON Backup & Restore**: One-click data export to JSON with schema-validated backup import.

---

## 🏗️ Application Architecture

```
src/
├── assets/                  # Optimized SVG icons and graphics
├── components/
│   ├── ai/                  # AI Theme & Idea Studio (live generation & fallbacks)
│   ├── budget/              # Budget Planner, Expense Ledger & Expense Form Modal
│   ├── common/              # Navbar, API Key Settings Modal, Notification Toasts
│   ├── dashboard/           # Countdown Banner, Stat Cards, Quick Actions, Overview
│   ├── events/              # Event Creation, Switcher & Edit Modals
│   ├── export/              # Printable Master Plan & JSON Data Backup/Restore
│   ├── timeline/            # Phased Timeline View & Task Form Modal
│   └── vendors/             # Vendor Pipeline Checklist & Vendor Form Modal
├── context/
│   └── EventContext.jsx     # Centralized React Context state provider & actions
├── data/
│   └── defaultData.js       # Curated presets, sample events & offline themes catalog
└── services/
    ├── geminiService.js     # Gemini API client, error mapping & offline heuristic engine
    └── storageService.js    # Browser localStorage serialization & schema validation
```

### Architecture Highlights
* **State Management**: A centralized React Context (`EventContext`) coordinates multi-event state, active event switching, and persistence across views.
* **Decoupled API Service Layer**: `geminiService.js` encapsulates all network communications, AbortController timeouts (45s), JSON extraction, and detailed HTTP status categorization.
* **Offline Fallback Heuristics**: If the Gemini API key is missing or Google servers experience high demand, the service falls back instantly to the local recommendation engine in `defaultData.js`, matching event types, budgets, and guest counts with zero latency.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **React 19.3** | Component-driven UI architecture and declarative state |
| **Build Tool & Bundler** | **Vite 8.3** | High-speed ESM development server and optimized rollup production bundling |
| **Styling** | **Tailwind CSS 3.4** | Utility-first responsive design, modern dark/light cards, and glassmorphism |
| **Typography** | **Plus Jakarta Sans** & **Outfit** | Modern, premium Google Fonts pairing |
| **Iconography** | **Lucide React** | Clean, accessible iconography |
| **Visual Delights** | **Canvas-Confetti** | Rewarding micro-animations upon task completion |
| **Persistence** | **Browser `localStorage`** | Privacy-first client-side data persistence with JSON export/import |
| **AI Reasoning** | **Google Gemini API (`gemini-3.5-flash`)** | Creative theme, palette, and timeline suggestions via `v1beta` endpoint |

---

## 🚀 Installation & Setup Instructions

### Prerequisites
* **Node.js**: v18.0.0 or newer (tested on Node.js v24)
* **npm**: v9.0.0 or newer

### 1. Clone & Install Dependencies
```bash
# Navigate to the project root directory
npm install
```

### 2. Configure Gemini API Key (Optional)
The application works immediately out of the box with built-in smart offline recommendations. To enable live Google Gemini AI generation:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and insert your API key:
   ```env
   VITE_GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
   ```
3. Alternatively, enter and test your API key in the running app via the **AI Settings** modal in the navigation bar.

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Automated Tests
```bash
npm test
```
Executes 22 automated unit tests across domain calculators, milestone urgency logic, vendor statistics, and Gemini service error mappings.

### 5. Run Linter
```bash
npm run lint
```
Runs `oxlint` across `src/` to verify React best practices, strict type safety, and zero unresolved lint errors.

### 6. Build for Production
```bash
npm run build
```
Verify the production build locally:
```bash
npm run preview
```

---

## 🔒 Security & Privacy Notice

> [!IMPORTANT]
> **Client-Side API Key Exposure Warning**:
> In a single-page frontend application (SPA) built with Vite, environment variables prefixed with `VITE_` are compiled directly into the client-side JavaScript bundle. Any user opening the browser's Developer Tools (Network / Sources tabs) can inspect outbound HTTP requests and observe the API key.
> 
> * **For Development / Demonstrations**: Using `.env` or entering your key in the app's local settings modal is standard and convenient. Your key is stored solely in your local browser's memory and `localStorage`.
> * **For Production Deployments**: Do **NOT** expose administrative or paid Gemini API keys in client-side bundles. Instead, deploy an authenticated backend proxy (e.g., Node.js/Express, Cloudflare Worker, Next.js API route, or Google Cloud Functions) to append the secret key securely on the server side and enforce user rate limits.

### Safe Git Practices
* `.gitignore` explicitly excludes `.env` and all `.env.*` files (preserving only `.env.example`).
* No keys or credentials are hardcoded or tracked in Git version control.

---

## 💡 How Offline Recommendations Work

**Celebration & Event Planner** is architected so that organizers are never left without inspiration:
1. **Network Independence**: If no API key is supplied, or if the device is offline, or if Google's servers experience a temporary high-demand spike (HTTP 503), the application automatically activates its **Smart Offline Recommendation Engine**.
2. **Context-Aware Heuristics**: The engine analyzes the active event's:
   * **Celebration Type** (Wedding, Birthday, Anniversary, Community, Gala, Baby Shower)
   * **Budget Tier** (Luxury, Moderate, Economy, Community)
   * **Guest Count Scale** (Intimate, Mid-size, Large Gathering)
3. **Structured Delivery**: Generates 3 rich, cohesive themes with 4-swatch hex palettes, curated decor recommendations, entertainment styling, signature catering, and realistic budget-optimization tips—instantly, with 0ms latency.

---

## ⚠️ Known Limitations

1. **Client-Side Storage Quota**: Data is persisted in browser `localStorage`, which is typically capped at ~5MB per origin. For celebrations with thousands of line items, use the built-in **JSON Export/Backup** feature.
2. **API Rate Limits on Free Tier**: Free-tier Google AI Studio keys have limits on requests per minute (RPM). If exceeded, the application displays an actionable HTTP 429 badge advising a brief cooldown.
3. **Regional Capacity Fluctuations**: Google Gemini's preview clusters occasionally experience temporary traffic surges (HTTP 503). The app gracefully handles these with specific advice and instant fallback to offline mode.

---

## 🏆 PromptWars Virtual Challenge 05 Compliance Matrix

| Requirement | Implementation Status | Evidence / Location |
|---|:---:|---|
| **Modern, responsive UI** | ✅ Complete | Tailwind CSS, responsive layouts, modern cards, and badges |
| **Event creation form** | ✅ Complete | [EventFormModal.jsx](file:///d:/Celebration%20&%20Event%20Planner/src/components/events/EventFormModal.jsx) with validation |
| **Budget planner with math** | ✅ Complete | [BudgetPlanner.jsx](file:///d:/Celebration%20&%20Event%20Planner/src/components/budget/BudgetPlanner.jsx) with 8 categories & remaining calculations |
| **Event timeline with tasks** | ✅ Complete | [TimelineView.jsx](file:///d:/Celebration%20&%20Event%20Planner/src/components/timeline/TimelineView.jsx) with 5 phases & dynamic due-dates |
| **Vendor checklist** | ✅ Complete | [VendorChecklist.jsx](file:///d:/Celebration%20&%20Event%20Planner/src/components/vendors/VendorChecklist.jsx) with 5-stage pipeline & contacts |
| **Personalized AI themes** | ✅ Complete | [ThemeIdeaStudio.jsx](file:///d:/Celebration%20&%20Event%20Planner/src/components/ai/ThemeIdeaStudio.jsx) powered by Gemini API |
| **Executive dashboard** | ✅ Complete | [DashboardOverview.jsx](file:///d:/Celebration%20&%20Event%20Planner/src/components/dashboard/DashboardOverview.jsx) with countdown & KPIs |
| **Offline functionality** | ✅ Complete | [geminiService.js](file:///d:/Celebration%20&%20Event%20Planner/src/services/geminiService.js) smart fallback engine |
| **LocalStorage persistence** | ✅ Complete | [storageService.js](file:///d:/Celebration%20&%20Event%20Planner/src/services/storageService.js) with JSON import/export |
| **Security & build integrity** | ✅ Complete | `.gitignore` rules, zero lint errors, clean `npm run build` |
