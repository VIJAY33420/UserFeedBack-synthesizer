# Traige - User Feedback Synthesizer 🛡️✨

**Traige** is a state-of-the-art, intelligent feedback processing and summarization pipeline built for modern SaaS products. It features an offline processing engine (sentiment analysis, priority ranking, thematic clustering, and deduplication) overlaid with an advanced dual-engine AI summarization layer (supporting both **Grok (xAI)** and **Google Gemini**) with built-in offline mock fallbacks for resilient hackathon presentations.

---

## 🎨 Premium UI Design

The user interface features a sleek, dark glassmorphic design inspired by modern developers' tools, utilizing the **Traige** brand logo color palette:
*   **Cobalt Blue & Ice/Sky Blue** radial background glows.
*   **Lightened Glass Borders** (`rgba(255, 255, 255, 0.24)`) for crisp layouts on dark canvases.
*   **Custom Micro-animations & Typewriter Effects** powered by `framer-motion` to reveal AI insights with dynamic, staggering cascades.
*   **Globally Styled Forms** with a custom dark theme styling for select/option tags, ensuring native rendering across all desktop and mobile browsers.

---

## 🚀 Key Features & AI Architecture

### 1. Dual-Engine AI Summarization (Grok + Gemini)
*   **Dynamic API Routing:** The backend checks your environment variables automatically. If `GROK_API_KEY` is present, it uses the **xAI Grok-2** model. If not, it falls back to **Google Gemini 1.5 Flash**.
*   **Resilient Mock Fallbacks:** In case of network drops, rate limits, or missing billing credits (e.g., Grok 403 credit error), the controller catches the error and serves a high-fidelity mock summary offline.
*   **Direct Payload Fallback:** Supports both database lookups (fetching reviews from MongoDB by product name) and raw review array postings (direct array synthesis), mapping `"reviews"` as a parameter fallback for custom testing payloads.

### 2. Offline Feedback Analytical Pipeline
Every feedback submission is parsed locally on the machine within milliseconds:
*   **Sentiment Analysis:** Evaluates comments locally utilizing the offline `sentiment` package.
*   **Thematic Clustering:** Dynamically tags comments into clusters (`Bug`, `Pricing`, `UX`, `Onboarding`, `Performance`, or `General`).
*   **Jaccard Deduplication:** Applies word-overlap similarity check (> 0.7) to flag redundant submissions and link duplicates back to their original document (`isDuplicateOf`).
*   **Priority Math:** Calculates a dynamic priority score ($0.0$ to $1.0$) using the formula:
    $$\text{Priority} = (\text{Frequency} \times 0.4) + (\text{Normalized Negative Sentiment} \times 0.4) + (\text{Urgency Score} \times 0.2)$$
*   **Action Tagging:** Maps priority to tags: `"Fix Now"`, `"Research"`, `"Nice to Have"`, or `"Low Priority"`.

---

## 🗺️ Navbar Features & Pages

| Tab / Page | Description | How It Works |
| :--- | :--- | :--- |
| 📊 **Dashboard** | Core operational dashboard. | Displays key volume stats, average sentiment indexes, and recent logs. Contains the **Synthesize Feedback** widget where judges can input reviews and watch the typewriter animation reveal AI key problems in real-time. |
| ⚡ **Shortlist** | Developers' prioritized checklist. | Lists the top 10 unique, non-duplicate feedback comments sorted by priority score, helping teams focus on critical bottlenecks. |
| 🗂️ **Clusters** | Structural theme categorization. | Aggregates volume metrics and average sentiments grouped by product feature categories. |
| 📈 **Trend** | Timeline sentiment logs. | Renders interactive area charts demonstrating daily average sentiment shifts to gauge customer satisfaction over time. |
| 📥 **Submit** | Live signal simulator. | Form allowing users to input user feedback. Submitting instantly triggers the local analytical pipeline (scoring, clustering, deduplication). |
| ✨ **AI Summary** | Dedicated AI report generator. | Redesigned with tabs. **DB Product Lookup** queries comments from MongoDB by product name, while **Paste Raw Reviews** lets you copy-paste standard list text blocks (one per line) and summarize them directly. |

---

## ⚙️ Setup & Installation

### Prerequisite
*   **MongoDB:** Must be running locally on port `27017` (e.g., `mongodb://localhost:27017/feedback`).

### Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `Backend/`:
   ```env
   MONGO_URI=mongodb://localhost:27017/feedback
   JWT_SECRET=super_secret_jwt_for_hackathon_2026
   PORT=3000
   GEMINI_API_KEY=your_google_gemini_api_key_here
   GROK_API_KEY=your_xai_grok_api_key_here
   ```
4. Start development server:
   ```bash
   npx nodemon server.js
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `frontend/`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```
4. Start the Vite server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.