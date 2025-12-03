# Quick Vercel Deployment Guide

## 🚀 Fast Track (5 Minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/phone-reserve.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Select your repository
4. Click **"Import"**

### 3. Add Environment Variables

In the Vercel project settings, add these:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/phone-reserve
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-password-no-spaces
STATS_EMAIL=iswdesignteam@gmail.com
CRON_SECRET=generate-a-random-32-char-string
```

**Important**: 
- Remove spaces from Gmail App Password
- Generate CRON_SECRET: Use `openssl rand -base64 32` or [random.org](https://www.random.org/strings/)

### 4. Deploy

Click **"Deploy"** and wait 2-3 minutes.

### 5. Configure MongoDB Atlas

- Go to MongoDB Atlas → **Network Access**
- Click **"Add IP Address"** → **"Allow Access from Anywhere"**
- This allows Vercel to connect

### 6. Set Up Cron Jobs (Choose One)

#### Option A: External Cron (Free)
1. Sign up at [cron-job.org](https://cron-job.org) (free)
2. Create new cron job:
   - **URL**: `https://your-project.vercel.app/api/cron/send-stats`
   - **Schedule**: Every 2 hours
   - **Headers**: `Authorization: Bearer YOUR_CRON_SECRET`

#### Option B: Vercel Cron (Pro Plan - $20/month)
- Already configured in `vercel.json`
- Works automatically with Vercel Pro

### 7. Test

Visit `https://your-project.vercel.app` and test the form!

---

**That's it!** Your app is live! 🎉

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

