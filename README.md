# 🧠 StockSense AI — Intelligent Inventory Agent

> **Team CocoCode** · EFOS Hackathon Submission

StockSense AI is a production-grade, AI-powered inventory intelligence platform that analyzes customer reviews using a large language model (LLM) to forecast demand, assess stockout risk, recommend reorder quantities, and automatically trigger procurement emails when critical inventory thresholds are breached.

---

## 📋 Table of Contents

- [Project Purpose](#-project-purpose)
- [Team](#-team)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [API Reference](#-api-reference)
- [Database Details](#-database-details)
- [Environment Variables](#-environment-variables)
- [Local Development](#-local-development)
- [Deploy on Vercel](#-deploy-on-vercel)

---

## 🎯 Project Purpose

Traditional inventory management is reactive — you only know you're out of stock after the fact. **StockSense AI** flips this by using real customer sentiment as a leading demand indicator.

The system:
1. Accepts a product name, current stock level, and customer reviews
2. Uses **Groq's Llama 3.3-70B** to score sentiment and extract insights
3. Calculates demand forecast, risk level, and reorder quantity
4. Provides a rich analytics dashboard with stockout countdown and market benchmarking
5. **Automatically sends a procurement email** (via Resend) when sentiment is high and stock is critically low — acting as an autonomous AI agent

---

## 👥 Team

| Role | Detail |
|---|---|
| **Team Name** | CocoCode |
| **Hackathon** | EFOS Hackathon |

---

## ✨ Features

- 🤖 **LLM Sentiment Analysis** — Groq Llama 3.3-70B analyzes reviews in real time
- 📊 **Demand Forecasting** — Calculates projected demand from sentiment signals
- ⚠️ **Risk Classification** — Low / Medium / High / Critical inventory risk
- 📅 **Stockout Countdown** — Projects exact date when stock runs out
- 🎯 **Market Benchmarking** — Ranks product sentiment against 30+ reference scores
- 📧 **Automated Procurement Email** — Resend API triggers email when `sentiment > 0.5` AND risk is `High/Critical`
- 📄 **PDF Report** — Beautifully styled, print-to-PDF report for stakeholders
- 🗂️ **Product Database** — 60 seeded products across 4 categories (Electronics, Fashion, Home, Beauty)
- 🧮 **What-If Simulator** — Simulates different stock scenarios in real time
- 🌙 **Dark Mode** — Full dark/light mode support

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| LLM | Groq API (Llama 3.3-70B-Versatile) |
| Email | Resend API |
| Database | SQLite (Node.js built-in `node:sqlite`) |
| PDF | jsPDF (server-side) + Browser Print API |
| Runtime | Node.js 22+ |

---

## 📡 API Reference

### `POST /api/analyze`

The core intelligence endpoint. Analyzes a product and returns full inventory intelligence.

**Request Body:**
```json
{
  "productName": "Sony WH-1000XM5",
  "stock": 15,
  "reviews": [
    "Absolutely amazing noise cancellation!",
    "Best headphones I've ever owned."
  ]
}
```

**Response:**
```json
{
  "sentiment_score": 0.82,
  "sentiment_label": "Positive",
  "issues": [],
  "strengths": ["Outstanding noise cancellation", "Premium build quality"],
  "improvements": ["Add more color options"],
  "confidence": 0.91,
  "demand": 61,
  "reorder": 46,
  "risk": "Critical",
  "email": "mailto:supplier@example.com?subject=...",
  "restock_plan": "Initiate expedited air freight for 46 units within 24 hours...",
  "explanation": "Based on exceptionally positive customer sentiment...",
  "daily_burn_rate": 2.0,
  "stockout_days": 7,
  "stockout_date": "2026-05-10",
  "sentiment_rank": 2,
  "sentiment_percentile": 94,
  "total_products_compared": 31,
  "email_triggered": true
}
```

**Email Trigger Logic:**
```
if (sentiment_score > 0.5 && (risk === "High" || risk === "Critical"))
  → sends automated procurement email via Resend
```

---

### `GET /api/products`

Returns all products in the database (for the product catalog selector).

**Response:**
```json
[
  {
    "id": "prod_abc123",
    "name": "EliteTime Watch",
    "category": "Fashion",
    "reviewCount": 10
  }
]
```

---

### `GET /api/products/[id]`

Returns full product details including all customer reviews.

**Response:**
```json
{
  "id": "prod_abc123",
  "name": "EliteTime Watch",
  "category": "Fashion",
  "reviews": [
    "Best purchase I've made this year. Highly recommended.",
    "The quality is exceptional for the price."
  ]
}
```

---

### `POST /api/generate-pdf`

Generates a formatted PDF report server-side using jsPDF.

**Request Body:** Full analysis data object (same shape as `/api/analyze` response + `productName`, `stock`, `reviewCount`, `category`, `analyzedAt`)

**Response:** Binary PDF file with `Content-Disposition: attachment` header.

---

## 🗄 Database Details

**File:** `stocksense.db` (SQLite, Node.js built-in `node:sqlite`)  
**Location:** Project root  
**Viewer:** [DB Browser for SQLite](https://sqlitebrowser.org/) or VS Code extension "SQLite Viewer"

### Schema

#### `products` table
| Column | Type | Description |
|---|---|---|
| `id` | TEXT (PK) | Unique product ID (`prod_xxxxxxxx`) |
| `name` | TEXT | Product name |
| `category` | TEXT | Category: Electronics, Fashion, Home, Beauty |

#### `reviews` table
| Column | Type | Description |
|---|---|---|
| `id` | INTEGER (PK, AUTOINCREMENT) | Review ID |
| `product_id` | TEXT (FK) | References `products.id` |
| `review` | TEXT | Customer review text |

### Seeded Data
- **60 products** across 4 categories (15 per category)
- **5–15 reviews per product** (randomly generated mix of positive/neutral/negative)
- Re-seed at any time: `node scripts/seed-db.mjs`

### Categories & Example Products

| Category | Example Products |
|---|---|
| Electronics | UltraVision 4K Monitor, SonicBlast Wireless Speaker, ProTrack Fitness Watch |
| Fashion | UrbanStride Sneakers, EliteTime Watch, WeatherProof Parka |
| Home | PureAir Purifier, AutoBrew Coffee Maker, SleepTight Mattress Topper |
| Beauty | GlowRoot Hair Serum, HydraPure Face Cream, LashLift Mascara |

### Email Trigger Candidates (from DB)
Based on current seed data, these products are most likely to trigger automated procurement emails (high sentiment + low stock scenario):

| Product | Category | Avg Sentiment |
|---|---|---|
| **EliteTime Watch** | Fashion | ~80% positive |
| **SleepTight Mattress Topper** | Home | ~78% positive |
| **GlowRoot Hair Serum** | Beauty | ~64% positive |

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
# Groq LLM API — for sentiment analysis (required)
GROQ_API_KEY=your_groq_api_key_here

# Resend Email API — for automated procurement alerts (required)
RESEND_API_KEY=your_resend_api_key_here
```

### Where to get these keys:

| Variable | Provider | URL |
|---|---|---|
| `GROQ_API_KEY` | Groq Cloud | https://console.groq.com/keys |
| `RESEND_API_KEY` | Resend | https://resend.com/api-keys |

> **Note:** If `GROQ_API_KEY` is missing, the system falls back to a keyword-based heuristic analyzer. If `RESEND_API_KEY` is missing, email sending is skipped silently (API still works).

---

## 💻 Local Development

### Prerequisites
- **Node.js 22+** (required for `node:sqlite`)
- npm

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/StockSense--EFOS_Hackathon-Team-CocoCode.git
cd StockSense--EFOS_Hackathon-Team-CocoCode

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.local.example .env.local
# → Edit .env.local and add your API keys

# 4. Seed the database (optional — db is already seeded)
node scripts/seed-db.mjs

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deploy on Vercel

### Step 1 — Push to GitHub
```bash
git add .
git commit -m "Final fix and polish"
git push origin main
```

### Step 2 — Import on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Add New Project"** → **"Import Git Repository"**
3. Select your `StockSense--EFOS_Hackathon-Team-CocoCode` repository
4. Click **"Import"**

### Step 3 — Configure Environment Variables

In the Vercel project settings, add these environment variables:

| Name | Value |
|---|---|
| `GROQ_API_KEY` | `gsk_...` (your Groq API key) |
| `RESEND_API_KEY` | `re_...` (your Resend API key) |

**How to add:**
1. Go to your project on Vercel → **Settings** → **Environment Variables**
2. Add each variable for **Production**, **Preview**, and **Development**
3. Click **Save**

### Step 4 — Configure Node.js Runtime

Vercel must use **Node.js 22.x** for `node:sqlite` to work.

1. Go to **Settings** → **General** → **Node.js Version**
2. Select **22.x**
3. Click **Save**

> This is also enforced via `vercel.json` and `package.json` `engines` field already in the repo.

### Step 5 — Deploy

Click **"Deploy"**. Vercel will:
1. Install dependencies with `npm install`
2. Build with `npm run build`
3. Deploy to a global CDN

Your app will be live at `https://your-project.vercel.app` 🎉

### ⚠️ Important Notes for Vercel

- The `stocksense.db` file is **read-only** on Vercel (no writes to filesystem). This is fine — the app only reads from the database.
- The database is bundled with the deployment via `outputFileTracingIncludes` in `next.config.ts`.
- **Do not** commit `.env.local` — it is already in `.gitignore`.

---

## 📁 Project Structure

```
StockSense--EFOS_Hackathon-Team-CocoCode/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts        # Core AI analysis + email trigger
│   │   ├── generate-pdf/route.ts   # Server-side PDF generation
│   │   ├── products/route.ts       # List all products
│   │   └── products/[id]/route.ts  # Get product + reviews
│   ├── dashboard/page.tsx          # Analytics dashboard
│   ├── products/page.tsx           # Product catalog browser
│   └── page.tsx                    # Home / analysis form
├── components/
│   ├── dashboard/                  # Dashboard cards (sentiment, demand, etc.)
│   ├── ui/                         # Reusable UI components
│   └── input-form.tsx              # Main analysis form
├── context/
│   └── analysis-context.tsx        # React context for analysis state
├── lib/
│   └── db.ts                       # SQLite database helpers
├── scripts/
│   └── seed-db.mjs                 # Database seeding script
├── data/
│   └── products.json               # Reference product data
├── stocksense.db                   # SQLite database (committed)
├── vercel.json                     # Vercel deployment config
├── next.config.ts                  # Next.js config
└── package.json
```

---

## 📧 Automated Email Alert

The system sends an automated procurement email when:

```
sentiment_score > 0.5 AND (risk === "High" OR risk === "Critical")
```

**Email details:**
- **From:** `StockSense AI <onboarding@resend.dev>`
- **To:** `bhuvaneshwaritbsm@gmail.com`
- **Subject:** `Stock Alert: Reorder Required for {productName}`
- **Content:** Product name, sentiment score, risk level, recommended reorder quantity

The `email_triggered` field in the API response indicates whether an email was sent for that request.

---

## 📄 License

MIT — Built with ❤️ by **Team CocoCode** for the EFOS Hackathon.
