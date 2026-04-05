# LAFD Knowledge Base — Deployment Guide

## What You're About to Do

You're going to put this app on the internet so anyone with the link can use it. Think of it like uploading a video to YouTube — you upload the files, and a service (Vercel) hosts it for free and gives you a link.

There are 3 parts:
1. Get an AI "password" (API key) so the app can talk to Claude
2. Upload the project files to GitHub (like a Google Drive for code)
3. Connect GitHub to Vercel (the free hosting service that runs your app)

Total time: about 20 minutes if you've never done this before.

---

## PART 1: Get Your Anthropic API Key

This is the "password" that lets your app use Claude AI. Without it, the AI chat won't work.

1. Open your browser and go to: **https://console.anthropic.com**

2. Click **"Sign Up"** (or "Log In" if you already have an account)
   - You can sign up with your Google account or email
   - It's free — new accounts get $5 of credit, which is hundreds of demo questions

3. Once logged in, look at the left sidebar and click **"API Keys"**
   - If you don't see a sidebar, look for a gear icon or "Settings"

4. Click the **"Create Key"** button

5. Give it a name like `lafd-demo` (this is just a label for you)

6. **IMPORTANT:** A long string will appear that starts with `sk-ant-...`
   - **Copy this immediately** and paste it somewhere safe (a notes app, text file, etc.)
   - You will NOT be able to see it again after you close this page
   - This is like a password — don't share it publicly

You now have your API key. Keep that tab or note open — you'll need it in Part 3.

---

## PART 2: Upload to GitHub

GitHub is where your project files will live. Vercel will read them from here.

### 2A: Create a GitHub Account (skip if you have one)

1. Go to **https://github.com**
2. Click **"Sign Up"**
3. Follow the steps — pick a username, enter email, create a password
4. Verify your email when they send you one

### 2B: Download and Unzip the Project

1. Download the **lafd-knowledge-base.zip** file I gave you (from the Claude chat)
2. Find it in your Downloads folder
3. **Unzip it:**
   - **Mac:** Double-click the zip file. A folder called `lafd-kb` will appear.
   - **Windows:** Right-click the zip file → "Extract All" → Click "Extract". A folder called `lafd-kb` will appear.

4. Open that folder. You should see these files:
   ```
   lafd-kb/
   ├── api/
   │   └── chat.js
   ├── public/
   │   └── hero.jpg
   ├── src/
   │   ├── main.jsx
   │   └── App.jsx
   ├── index.html
   ├── package.json
   ├── vite.config.js
   ├── vercel.json
   ├── .env.example
   ├── .gitignore
   └── README.md
   ```
   If you see these files, you're good. If you see another `lafd-kb` folder inside, open that one instead.

### 2C: Upload to GitHub (No Command Line Needed)

**This is the easiest way — no terminal/command line required.**

1. Go to **https://github.com/new** (you must be logged in)

2. Fill in:
   - **Repository name:** `lafd-knowledge-base`
   - **Description:** (optional) `LAFD AI Knowledge Base Demo`
   - **Public** or **Private** — either works. Private means only you (and Vercel) can see the code.
   - **Do NOT** check "Add a README file" (we already have one)
   - **Do NOT** check "Add .gitignore" (we already have one)

3. Click **"Create repository"**

4. You'll land on a page that says "Quick setup" — **ignore all the command line stuff**

5. Look for a link that says **"uploading an existing file"** — click that
   - It's in the text that says "...or upload an existing file"

6. Now you need to **drag and drop ALL the files from the `lafd-kb` folder** into the upload area:
   - Open your `lafd-kb` folder in a file explorer window
   - Select EVERYTHING inside it (Ctrl+A on Windows, Cmd+A on Mac)
   - Drag all the selected files and folders into the GitHub upload area
   - **Make sure you drag the CONTENTS of the folder, not the folder itself**

7. Wait for all files to upload (you should see the file names appear)

8. Scroll down and click the green **"Commit changes"** button

9. You should now see your files listed on the GitHub page. Confirm you see:
   - `api/` folder
   - `public/` folder
   - `src/` folder
   - `index.html`
   - `package.json`
   - etc.

**If something looks wrong:** If all your files ended up inside a subfolder, or if files are missing, you can delete the repo (Settings → scroll to bottom → Delete this repository) and start over. No harm done.

---

## PART 3: Deploy on Vercel (This Puts It on the Internet)

1. Go to **https://vercel.com**

2. Click **"Sign Up"** → Choose **"Continue with GitHub"**
   - This connects your GitHub account to Vercel
   - Click "Authorize" when it asks for permission

3. Once logged in, you'll see a dashboard. Click **"Add New..."** → **"Project"**

4. You'll see a list of your GitHub repositories. Find **`lafd-knowledge-base`** and click **"Import"**
   - If you don't see it, click "Adjust GitHub App Permissions" and make sure Vercel has access

5. You'll see a "Configure Project" screen. Here's what to do:
   - **Project Name:** Leave as-is or change to something like `lafd-kb`
   - **Framework Preset:** It should auto-detect **"Vite"**. If not, select Vite from the dropdown.
   - **Root Directory:** Leave blank (it should say `./`)
   - **Build Command:** Should say `npm run build` — leave it
   - **Output Directory:** Should say `dist` — leave it

6. **THIS IS THE IMPORTANT PART.** Expand **"Environment Variables"** (click the section to open it)

7. You'll see two input fields: **"Name"** and **"Value"**
   - In the **Name** field, type exactly: `ANTHROPIC_API_KEY`
   - In the **Value** field, paste your API key from Part 1 (the `sk-ant-...` string)
   - Click **"Add"**

8. Double-check: You should see `ANTHROPIC_API_KEY` listed with a hidden value (shown as dots)

9. Click the big **"Deploy"** button

10. **Wait about 60-90 seconds.** You'll see a build log running. This is normal.

11. When it's done, you'll see **"Congratulations!"** and a preview of your site

12. Click **"Continue to Dashboard"**

13. At the top of the dashboard, you'll see your live URL. It'll look something like:
    ```
    https://lafd-kb.vercel.app
    ```
    **This is your live app. Anyone with this link can use it.**

---

## PART 4: Test It

1. Click your Vercel URL to open the app

2. You should see:
   - The LAFD header with the gold shield
   - Your hero image of firefighters
   - The "Est. February 1, 1886" text
   - Three tabs: Ask AI, Browse, Heritage

3. Click one of the sample questions like **"How often do fire pumps need testing?"**
   - Then click the **ASK** button
   - Wait a few seconds — you should get an answer with policy citations

4. Try the **Browse** tab — you should see all 18 policies listed

5. Try the **Heritage** tab — you should see the LAFD history section

**If the AI gives an error:** Go back to your Vercel dashboard → Settings → Environment Variables, and make sure `ANTHROPIC_API_KEY` is there and correct. If you update it, click "Redeploy" from the Deployments tab.

---

## Sharing the Link

Once it's working, you can share your URL with anyone:
- Text it
- Email it
- Put it in a presentation
- Open it on a phone (it's mobile-friendly)

No one needs to install anything. It just works in a browser.

---

## How Much Does This Cost?

- **Vercel hosting:** Free (their free tier covers demo usage easily)
- **GitHub:** Free
- **Anthropic API:** ~$0.01-0.03 per question asked. Your $5 free credit covers roughly 200-500 questions.
- **Total for a demo/pitch:** $0

If you start getting hundreds of users per day, you'd need to add billing to your Anthropic account, but for pitching the concept, the free credit is plenty.

---

## Troubleshooting

**"I can't see the api/ folder on GitHub"**
→ You may have uploaded the `lafd-kb` folder itself instead of its contents. The `api/` folder needs to be at the root level, not inside another folder.

**"Vercel build failed"**
→ Check that `package.json` is at the root of your repo (not inside a subfolder). Also confirm the Framework Preset is set to "Vite."

**"AI returns an error about API key"**
→ Go to Vercel dashboard → your project → Settings → Environment Variables. Make sure `ANTHROPIC_API_KEY` is spelled exactly right and the value starts with `sk-ant-`.

**"Site loads but AI doesn't respond"**
→ Your Anthropic account may have run out of credit. Go to console.anthropic.com → Billing to check.

**"I messed everything up and want to start over"**
→ That's fine!
- Delete the Vercel project: Dashboard → project → Settings → scroll to bottom → Delete
- Delete the GitHub repo: Repo page → Settings → scroll to bottom → Delete this repository
- Start fresh from Part 2