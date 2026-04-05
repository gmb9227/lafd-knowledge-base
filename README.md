# LAFD Knowledge Base — AI Policy Reference System

A proof-of-concept AI-powered knowledge base for LA City and County firefighters. Ask questions about fire codes, testing schedules, SOPs, and department policies in plain English.

**Demo** — 18 sample policies loaded. Production version would ingest hundreds of documents from LAFD and LA County Fire sources.

---

## Deploy to Vercel (Free) — 4 Steps

### Step 1: Get an Anthropic API Key

1. Go to **https://console.anthropic.com**
2. Sign up or log in
3. Go to **Settings → API Keys**
4. Click **Create Key** and copy it (starts with `sk-ant-...`)

> New accounts get $5 free credit — more than enough for a demo.

### Step 2: Push to GitHub

If you don't have Git set up, the easiest way:

1. Go to **https://github.com/new** and create a new repository (e.g., `lafd-knowledge-base`)
2. Keep it **Public** or **Private** — either works
3. Don't add a README (we already have one)

Then in your terminal:

```bash
cd lafd-kb
git init
git add .
git commit -m "LAFD Knowledge Base - initial deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lafd-knowledge-base.git
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to **https://vercel.com** and sign up with your GitHub account
2. Click **"Add New Project"**
3. Select your `lafd-knowledge-base` repo
4. Vercel will auto-detect it as a Vite project — leave defaults as-is
5. **Before clicking Deploy**, expand **"Environment Variables"**
6. Add: **Name** = `ANTHROPIC_API_KEY` / **Value** = your `sk-ant-...` key
7. Click **Deploy**

Takes about 60 seconds. You'll get a live URL like `lafd-knowledge-base.vercel.app`.

### Step 4: Test It

Visit your URL. Try asking:
- "How often do fire pumps need testing?"
- "What's the MAYDAY procedure?"
- "What are the brush clearance requirements?"

---

## Project Structure

```
lafd-kb/
├── api/
│   └── chat.js          ← Serverless function (keeps API key secure)
├── public/
│   └── hero.jpg         ← Hero banner image
├── src/
│   ├── main.jsx         ← React entry point
│   └── App.jsx          ← Full app UI + policy database
├── index.html           ← HTML shell
├── package.json
├── vite.config.js
├── vercel.json
├── .env.example
└── .gitignore
```

## How It Works

- **Frontend**: React + Vite — the entire UI with policy data embedded
- **AI Backend**: Vercel serverless function (`/api/chat.js`) proxies requests to the Anthropic API so the API key never touches the browser
- **Model**: Claude Sonnet — receives all 18 policies as context and answers with document ID citations
- **Cost**: ~$0.01-0.03 per question at demo scale

## Next Steps (Production)

- [ ] Scrape real LAFD and LA County Fire policy documents
- [ ] Add vector database (pgvector) for semantic search across thousands of docs
- [ ] PDF upload for new policy ingestion
- [ ] User authentication for department personnel
- [ ] Response caching for common questions
- [ ] Offline/PWA mode for field use
