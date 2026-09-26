# Vercel Deployment Guide for Igloo AI

This application is 100% pre-configured and optimized for 1-click zero-configuration deployment on **Vercel**.

---

## 🚀 Steps to Deploy on Vercel:

### 1. Push to GitHub
Upload or push this codebase repository to your GitHub / GitLab / Bitbucket account:
```bash
git init
git add .
git commit -m "Deploy Igloo AI"
git branch -M main
git remote add origin https://github.com/your-username/igloo-ai.git
git push -u origin main
```

---

### 2. Import into Vercel
1. Go to **[https://vercel.com/new](https://vercel.com/new)**.
2. Select your repository `igloo-ai` and click **Import**.
3. **Build & Output Settings** (Auto-detected):
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

---

### 3. Set Environment Variables (Required for Gemini AI Live):
Because `.env` files are ignored by Git for security, you MUST add your Gemini API Key in Vercel:
1. In your Vercel Project, go to **Settings** > **Environment Variables**.
2. Add a new variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `YOUR_GOOGLE_AI_STUDIO_GEMINI_API_KEY`
   - **Environments:** Check *Production*, *Preview*, and *Development*.
3. Click **Save**.
4. Go to **Deployments** > click the `...` menu on your latest deployment > click **Redeploy** (or simply git push a new commit) to activate the key on your live site!

*(Note: If no API Key is set in Vercel, the application safely uses its instant offline Knowledge Base engine without crashing).*

---

### 4. Click "Deploy"
Click the **Deploy** button. Within 30 seconds, your application will be live at:
`https://your-app-name.vercel.app`
