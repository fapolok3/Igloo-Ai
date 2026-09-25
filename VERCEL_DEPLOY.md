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

### 3. Set Environment Variables (Optional):
Under **Environment Variables** in Vercel settings, add:
- `GEMINI_API_KEY`: *(Your Google AI Gemini API Key)*

*(Note: Even without an API Key, the application automatically runs on its high-performance offline local engine with 100% uptime!)*

---

### 4. Click "Deploy"
Click the **Deploy** button. Within 30 seconds, your application will be live at:
`https://your-app-name.vercel.app`
