# StockSense AI: Comprehensive Project Overview

StockSense AI is a production-grade, AI-powered inventory management agent designed to transform qualitative customer feedback into quantitative inventory decisions. This document details every aspect of the project's development, architecture, and implementation.

---

## 🏗️ 1. Architecture & Technology Stack

### Core Framework
- **Next.js 14 (App Router)**: Utilizing the latest React features for server components, streaming, and efficient routing.
- **TypeScript**: Ensuring type safety across the entire codebase for robust development.

### Styling & UI
- **Tailwind CSS 4**: Providing a modern, utility-first design system.
- **shadcn/ui**: High-quality, accessible UI components (Card, Button, Input, Textarea, Badge).
- **Framer Motion**: Powering premium micro-animations and staggered entrance effects for a "premium" feel.
- **Lucide React**: A consistent and sleek icon set.

### AI & Data
- **Groq API**: Leveraging high-speed inference for the **Llama-3-70B** model.
- **React Context API**: Managing global state for analysis results, ensuring a seamless flow between the input and dashboard views.

---

## 🎨 2. Frontend Implementation Details

### Design Aesthetics
- **Premium Palette**: A professional Indigo and Zinc color scheme with dark mode support.
- **Visual Effects**: Radial gradients, backdrop blurs (glassmorphism), and subtle borders to create depth.
- **Responsive Layout**: Optimized for all devices, from mobile phones to high-resolution monitors.

### Page Breakdown
1.  **Input Page (`/`)**:
    - A clean, centered card for product data entry.
    - Real-time form validation.
    - Simulated and real loading states with interactive spinners.
2.  **Dashboard (`/dashboard`)**:
    - A multi-card grid layout displaying the "Intelligence" of the agent.
    - Automatic redirection logic if no analysis data is present.

### Component Deep-Dive
- **`InputForm`**: Handles data collection, API communication, and loading UX.
- **`SentimentCard`**: Visualizes the emotional tone of customer reviews with color-coded indicators.
- **`DemandCard`**: Displays the projected demand based on sentiment-driven heuristics.
- **`InventoryCard`**: Provides a clear "Reorder" vs "Risk" status.
- **`InsightsCard`**: Categorizes qualitative data into Strengths, Issues, and Improvements.
- **`ActionsCard`**: Offers one-click copyable templates for business operations.
- **`ExplanationCard`**: Translates the logic of the AI into a human-readable narrative.

---

## 🧠 3. Backend & AI Logic

### API Analysis (`/api/analyze`)
The backend is a robust TypeScript route that performs the following steps:
1.  **Validation**: Strict checking of input types and presence of data.
2.  **LLM Inference**: Calls the Groq API with a sophisticated system prompt that forces the model to output a strict JSON contract.
3.  **Heuristic Simulation**:
    - **Base Demand**: Starts with a baseline of 50 units.
    - **Sentiment Adjustment**: Modulates demand by up to ±20% based on the AI's sentiment score.
    - **Inventory Matching**: Subtracts current stock from demand to provide a precise reorder recommendation.
4.  **Template Generation**: Dynamically creates supplier emails and restock plans based on the urgency of the inventory risk.

### State Management
The `AnalysisProvider` (`context/analysis-context.tsx`) acts as the "Single Source of Truth."
- Stores the complete `AnalysisData` object.
- Persists data across navigation events.
- Ensures components always have access to the latest analysis without passing props through multiple levels.

---

## 🛠️ 4. Setup & Deployment

### Environment Configuration
- Uses `.env.local` for secure storage of the `GROQ_API_KEY`.
- Configured for local development on port `3001` to avoid common conflicts.

### Git Workflow
- Phase-based commits (`phase 1`, `phase 3`) documented on GitHub.
- Clean branch management with a production-ready `main` branch.

---

## 🚀 5. Roadmap & Future Potential
- **Multi-Source Analysis**: Integrating directly with Amazon/Shopify review APIs.
- **Predictive Analytics**: Using historical time-series data for true statistical forecasting.
- **Team Collaboration**: Shared dashboards and automated procurement workflows.

---
**Developed with precision by the StockSense AI Team.**
