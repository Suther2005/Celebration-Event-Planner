# 🎬 Celebration & Event Planner — 2-Minute Demo Script & Screenshot Guide
> **Google PromptWars Virtual Challenge 05 Demo Presentation Guide**

---

## ⏱️ 2-Minute Video / Live Demo Script

| Timestamp | Screen / View | Action & Visuals | Speaker Narration (Voiceover Script) |
|---|---|---|---|
| **0:00 - 0:20** | **Executive Dashboard** | Open `http://localhost:5173`. Show the live countdown clock, KPI meters (budget gauge, milestones completed, vendors booked), and the quick event switcher. | *"Welcome to Celebration & Event Planner, built for PromptWars Challenge 05. Planning major celebrations—like weddings, milestone birthdays, or community carnivals—usually means juggling messy spreadsheets, scattered notes, and chaotic messages. Our application unifies the entire event journey into one elegant, real-time command center."* |
| **0:20 - 0:45** | **Smart Budget Planner** | Click **Budget Planner** tab. Point out the 8 categories, allocation vs. spent progress bars, and over-budget alert indicators. Toggle an expense to 'Paid'. | *"Here in the Budget Planner, organizers have complete financial clarity. With 8 core categories—from venue to florals—the app calculates spent funds, remaining balances, and automatically triggers high-visibility warnings if actual expenses threaten the ceiling budget. Every expense supports granular status tracking and instant filtering."* |
| **0:45 - 1:10** | **Phased Timeline & Vendor Directory** | Navigate to **Timeline & Tasks**, check off a milestone (watch the confetti burst 🎉). Then switch to **Vendors** to demonstrate pipeline status changes and click-to-contact shortcuts. | *"Execution requires timing. Our phased timeline organizes tasks across 5 structured horizons—from 3 months prior to day-of coordination—with dynamic badges flagging overdue deadlines, complete with rewarding confetti celebrations upon completion. In the Vendor Directory, coordinators manage quotes and track bookings through a 5-stage pipeline with one-touch phone and email shortcuts."* |
| **1:10 - 1:40** | **AI Theme & Idea Studio (Gemini API)** | Switch to **AI Theme Studio**. Click **Generate AI Concepts**. Show live generation with `gemini-3.5-flash`, the 3 generated concepts, 4-swatch hex palettes, decor staging ideas, and click **Apply Theme**. | *"Where Celebration & Event Planner truly shines is the AI Theme Studio, powered by Google's Gemini API (`gemini-3.5-flash`). By analyzing the event type, guest count, location, and budget, Gemini crafts 3 distinct creative concepts with custom 4-color palettes, decor highlights, music direction, and cost-per-guest budget advice. With one click, 'Apply Theme' stamps the palette and injects decor milestones directly into your timeline."* |
| **1:40 - 2:00** | **Offline Fallback & Wrap-up** | Open **AI Settings** modal to show connection testing, or click **Load Smart Recommendations (Offline)** to show instant 0ms generation. Point to Printable Summary & JSON Export. | *"Crucially, the app is 100% offline-ready. If servers experience high demand or no network is available, our heuristic recommendation engine generates rich, cohesive themes with zero downtime. Combined with printable briefing sheets and JSON backups, Celebration & Event Planner is complete, production-ready, and resilient. Thank you!"* |

---

## 📸 Recommended Screenshots to Capture

For your submission gallery, slide deck, or challenge portal, capture the following high-resolution screenshots:

### 1. `01_dashboard_overview.png`
* **View**: Main Executive Dashboard (`/`)
* **What to Show**:
  - Celebration Countdown banner (*Days, Hours, Minutes, Seconds*)
  - 4 Executive KPI Stat Cards (*Total Budget Spent, Milestones Progress, Booked Vendors, Cost Per Guest*)
  - Quick Action Grid (*Add Expense, New Task, Add Vendor, AI Ideas*)
  - Upcoming High-Priority Tasks list and Recent Budget Allocation breakdown
* **Key Callout**: "Unified executive command center with live celebration countdown and real-time planning health metrics."

### 2. `02_budget_planner.png`
* **View**: Budget Planner Tab
* **What to Show**:
  - Total Budget, Total Spent, and Remaining Funds cards
  - 8 Category cards with color-coded spend progress bars
  - Search bar and category filter chips
  - Interactive Expense Ledger showing Paid and Pending status pills
* **Key Callout**: "Real-time ceiling calculations, category spend distribution, and over-budget warnings."

### 3. `03_timeline_milestones.png`
* **View**: Timeline & Tasks Tab
* **What to Show**:
  - Phased milestone groupings (*Early Planning, Month Out, Final Countdown, Day Of, Post-Event*)
  - Overdue and upcoming dynamic badges (*Due Today, Due in 5d, Overdue*)
  - Priority pills (*High 🔥, Medium ⚡, Low 🌱*)
  - Celebration confetti animation mid-burst
* **Key Callout**: "Structured 5-phase timeline with automated deadline tracking and interactive milestone celebrations."

### 4. `04_vendor_directory.png`
* **View**: Vendor Checklist Tab
* **What to Show**:
  - Vendor pipeline filter tabs (*All, Researching, Contacted, Quote Received, Booked, Deposit Paid*)
  - Supplier cards with star ratings, committed quote amounts, and contact shortcuts (`tel:`, `mailto:`)
* **Key Callout**: "End-to-end vendor pipeline tracking from initial quote through confirmed booking and deposit."

### 5. `05_ai_theme_studio_live.png`
* **View**: AI Theme & Idea Studio Tab (Live Generation)
* **What to Show**:
  - Green active badge: `Live Gemini AI (gemini-3.5-flash)`
  - 3 generated concept cards with:
    - Evocative title and tagline
    - 4-color signature hex palette swatches
    - 4 decor staging highlights
    - Catering, music, and budget optimization tip
  - Prominent "Apply Theme to Event" button
* **Key Callout**: "Personalized celebration themes, palettes, and decor staging generated dynamically via Google Gemini API."

### 6. `06_ai_connection_modal.png`
* **View**: Gemini API Key Settings Modal
* **What to Show**:
  - Configured model badge (`gemini-3.5-flash`)
  - Green `[HTTP 200] Connection Verified: Model gemini-3.5-flash is active, authorized & ready!`
  - Privacy and client-side security notices
* **Key Callout**: "Verified live API connectivity with transparent HTTP status reporting and offline fallback assurance."

### 7. `07_printable_master_plan.png`
* **View**: Printable Summary Sheet (`Print Plan` action)
* **What to Show**:
  - Clean, printer-friendly single-sheet overview with event metadata, budget ledger, timeline, and vendor contacts
  - Backup & Restore JSON export button
* **Key Callout**: "Zero-clutter printable briefing sheets for venue coordinators and seamless JSON data backup/restore."

---

## 💡 Submission Highlights Checklist

When writing your submission pitch or presentation slides, emphasize these 4 pillars:
1. **User-Centric Utility**: Solves real chaos for couples, families, and community volunteers by unifying budgeting, scheduling, and vendors.
2. **Technical Craftsmanship**: Built with modern React 19, Vite 8, Tailwind CSS 3.4, clean modular components, and full accessibility.
3. **Real Live Gemini Intelligence**: Uses Google's official `gemini-3.5-flash` model on `v1beta` to deliver genuinely tailored, creative event concepts.
4. **Unbreakable Reliability**: Incorporates a 100% offline recommendation engine and granular HTTP error handling so users are never stranded.
