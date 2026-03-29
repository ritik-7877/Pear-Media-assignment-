# 🍐 Pear Media · AI Image & Text Studio

A full-stack web app built with **React + Vite** (frontend) and **Node.js/Express** (backend) that integrates **Google Gemini** and **OpenAI DALL-E 3** to provide two AI-powered creative workflows.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://your-live-link.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-blue)](https://github.com/yourusername/pear-media)

---

## ✨ Features

### Workflow 1: Text → Image
1. Enter a raw prompt in natural language
2. **Gemini 2.0 Flash** analyzes tone, intent, subject, and style
3. Returns an enhanced, DALL-E-optimized prompt for your review
4. Edit the prompt and optionally choose an art style
5. **DALL-E 3** generates a high-quality 1024×1024 image

### Workflow 2: Image → Variation
1. Upload any image (JPEG, PNG, WebP, GIF — up to 10MB)
2. **Gemini Vision** analyzes it: captions, objects, mood, color palette, composition, theme
3. Gemini generates 3 creative variation prompts
4. Choose a variation and **DALL-E 3** creates a new image inspired by the original
5. Compare original vs. variation side-by-side and download

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 8 |
| Backend | Node.js + Express 5 |
| Text NLP | Google Gemini 2.0 Flash |
| Image Vision | Google Gemini 2.0 Flash (Vision) |
| Image Generation | OpenAI DALL-E 3 |
| Styling | Vanilla CSS (custom design system) |
| Dev Tooling | concurrently, dotenv, multer |

---

## 🚀 Local Setup

### Prerequisites
- Node.js ≥ 18
- Google Gemini API Key → [Get one here](https://aistudio.google.com/app/apikey)
- OpenAI API Key → [Get one here](https://platform.openai.com/api-keys)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/pear-media.git
cd pear-media
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Keys
Create a `.env` file in the project root:
```bash
cp .env.example .env
```
Then edit `.env` and fill in your keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

### 4. Run Locally
```bash
npm run dev
```
This starts both:
- **React dev server** → [http://localhost:5173](http://localhost:5173)
- **Express API server** → [http://localhost:3001](http://localhost:3001)

---

## 📦 Project Structure

```
pear-media/
├── server.js              # Express backend — API routes
├── .env.example           # Environment variable template
├── vite.config.js         # Vite config (dev proxy to :3001)
├── index.html             # Entry HTML with SEO meta
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # Root component + tab navigation
    ├── index.css          # Full design system (CSS custom properties)
    └── components/
        ├── TextWorkflow.jsx   # Text → Image workflow
        └── ImageWorkflow.jsx  # Image → Variation workflow
```

---

## 🔌 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/enhance-text` | POST | Analyzes & enhances a text prompt via Gemini |
| `/api/generate-image` | POST | Generates an image from a prompt via DALL-E 3 |
| `/api/analyze-image` | POST | Analyzes an uploaded image via Gemini Vision |
| `/api/generate-variation` | POST | Generates a variation image via DALL-E 3 |

---

## 🌐 Deployment

### Deploying to Vercel (Full Stack)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import the repo
3. Set the following **Environment Variables** in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY`
4. For the Express backend, you'll need to deploy it separately (e.g., to [Railway](https://railway.app) or [Render](https://render.com)) and update the frontend API base URL.

> **Recommended**: Deploy the Express server to Railway/Render, and the React frontend to Vercel/Netlify.

---

## 📸 Screenshots

> *(Add screenshots of both workflows here)*

---

## 📹 Execution Video

> [Link to 5-minute demo video]

---

## 📄 License

MIT
