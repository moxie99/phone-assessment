# Vercel Deployment Guide

Complete step-by-step guide to deploy the Phone Number Reservation System to Vercel.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ A GitHub account
- ✅ A Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ MongoDB Atlas account (or MongoDB database)
- ✅ Gmail account with App Password

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Initialize Git** (if not already done):
   ```bash
   git init
   ```

2. **Create a `.gitignore` file** (if not exists):
   ```bash
   # Make sure .env.local is in .gitignore
   ```

3. **Stage all files**:
   ```bash
   git add .
   ```

4. **Commit your code**:
   ```bash
   git commit -m "Initial commit - Phone Reservation System"
   ```

### Step 2: Push to GitHub

1. **Create a new repository on GitHub**:
   - Go to [GitHub](https://github.com/new)
   - Name your repository (e.g., `phone-reserve`)
   - Choose Public or Private
   - **Don't** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Connect and push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/phone-reserve.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your GitHub username.

### Step 3: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. **Sign in to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Select your GitHub repository (`phone-reserve`)
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables**:
   Click "Environment Variables" and add:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/phone-reserve
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-char-app-password
   STATS_EMAIL=iswdesignteam@gmail.com
   CRON_SECRET=your-secret-key-here-make-it-long-and-random
   ```

   **Important Notes**:
   - For `GMAIL_APP_PASSWORD`: Remove spaces if your app password has them (e.g., `xxxx xxxx xxxx xxxx` → `xxxxxxxxxxxxxxxx`)
   - For `CRON_SECRET`: Generate a strong random string (you can use: `openssl rand -base64 32` or an online generator)
   - Make sure to add these for **Production**, **Preview**, and **Development** environments

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

#### Option B: Via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Add Environment Variables**:
   ```bash
   vercel env add MONGODB_URI
   vercel env add GMAIL_USER
   vercel env add GMAIL_APP_PASSWORD
   vercel env add STATS_EMAIL
   vercel env add CRON_SECRET
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Step 4: Configure MongoDB Atlas

1. **Whitelist Vercel IPs**:
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add Vercel's IP ranges)
   - This allows Vercel to connect to your database

2. **Verify Connection String**:
   - Make sure your `MONGODB_URI` in Vercel matches your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/phone-reserve`

### Step 5: Configure Vercel Cron Jobs

The `vercel.json` file is already configured for automatic cron jobs. Vercel will automatically:

- Call `/api/cron/send-stats` every 2 hours
- Include the `Authorization: Bearer {CRON_SECRET}` header (you need to update the code)

**However**, Vercel Cron requires a Pro plan. For free tier, use an external cron service:

#### Option A: Use External Cron Service (Free)

1. **Sign up for a cron service**:
   - [cron-job.org](https://cron-job.org) (free)
   - [EasyCron](https://www.easycron.com) (free tier available)
   - [Cronitor](https://cronitor.io) (free tier available)

2. **Configure the cron job**:
   - **URL**: `https://your-project-name.vercel.app/api/cron/send-stats`
   - **Schedule**: Every 2 hours (`0 */2 * * *`)
   - **Method**: GET
   - **Headers**: 
     ```
     Authorization: Bearer YOUR_CRON_SECRET
     ```

3. **Test the cron job**:
   - Use the "Test" or "Run Now" feature
   - Check your email (`iswdesignteam@gmail.com`) for the stats email

#### Option B: Update Code for Vercel Cron (Pro Plan)

If you have Vercel Pro, update the cron endpoint to work with Vercel's cron headers:

The `vercel.json` file is already set up. Vercel will automatically add authentication headers.

### Step 6: Verify Deployment

1. **Test the Application**:
   - Visit your Vercel URL: `https://your-project-name.vercel.app`
   - Fill out the form and submit
   - Check if verification email is received

2. **Test API Endpoints**:
   ```bash
   # Test stats endpoint
   curl https://your-project-name.vercel.app/api/stats
   
   # Test manual stats email
   curl https://your-project-name.vercel.app/api/send-stats-now
   ```

3. **Check Logs**:
   - Go to Vercel Dashboard → Your Project → Logs
   - Check for any errors or warnings

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)

1. **Add Domain in Vercel**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables** (if needed):
   - If you change domains, update any hardcoded URLs

### Monitoring

1. **Vercel Analytics** (Pro feature):
   - Enable in Project Settings → Analytics

2. **Error Tracking**:
   - Consider adding Sentry or similar service
   - Monitor Vercel logs for errors

## 🐛 Troubleshooting

### Build Fails

**Error**: `Module not found` or `Build failed`
- ✅ Check that all dependencies are in `package.json`
- ✅ Verify Node.js version (should be 18+)
- ✅ Check build logs in Vercel dashboard

**Error**: `Environment variable not found`
- ✅ Verify all environment variables are set in Vercel
- ✅ Check variable names match exactly (case-sensitive)
- ✅ Redeploy after adding variables

### Database Connection Issues

**Error**: `MongoServerError: bad auth`
- ✅ Verify MongoDB username and password are correct
- ✅ Check database user has proper permissions
- ✅ Ensure connection string format is correct

**Error**: `MongoNetworkError`
- ✅ Check MongoDB Atlas Network Access
- ✅ Whitelist `0.0.0.0/0` for testing (or Vercel IPs)
- ✅ Verify cluster is running

### Email Not Sending

**Error**: `Invalid login` or `Authentication failed`
- ✅ Verify Gmail App Password is correct (16 characters, no spaces)
- ✅ Check 2-Step Verification is enabled
- ✅ Ensure `GMAIL_USER` matches the account with app password

**No emails received**:
- ✅ Check spam folder
- ✅ Test with `/api/test-email` endpoint
- ✅ Verify email addresses are correct

### Cron Jobs Not Running

**Vercel Cron not working**:
- ✅ Check if you have Vercel Pro plan (required for cron)
- ✅ Verify `vercel.json` is in root directory
- ✅ Check cron logs in Vercel dashboard

**External cron not working**:
- ✅ Verify URL is correct and accessible
- ✅ Check `CRON_SECRET` matches in both places
- ✅ Test endpoint manually with Postman/curl
- ✅ Check cron service logs

### Application Errors

**500 Internal Server Error**:
- ✅ Check Vercel function logs
- ✅ Verify all environment variables are set
- ✅ Check MongoDB connection
- ✅ Review API route error handling

**Form submission fails**:
- ✅ Check browser console for errors
- ✅ Verify API routes are accessible
- ✅ Check CORS settings (should be fine with Next.js)

## 📊 Environment Variables Checklist

Before deploying, ensure you have:

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `GMAIL_USER` - Gmail address for sending emails
- [ ] `GMAIL_APP_PASSWORD` - Gmail App Password (16 chars, no spaces)
- [ ] `STATS_EMAIL` - Email to receive stats (default: iswdesignteam@gmail.com)
- [ ] `CRON_SECRET` - Secret key for securing cron endpoint

## 🔐 Security Best Practices

1. **Never commit `.env.local`**:
   - Already in `.gitignore`
   - Always use Vercel environment variables

2. **Use Strong Secrets**:
   - Generate strong `CRON_SECRET` (32+ characters)
   - Use unique MongoDB passwords

3. **Limit Database Access**:
   - Use specific database user (not admin)
   - Restrict IP access when possible

4. **Monitor Logs**:
   - Regularly check Vercel logs for errors
   - Monitor failed authentication attempts

## 📈 Scaling Considerations

- **Vercel Free Tier**: 
  - 100GB bandwidth/month
  - Serverless functions with execution limits
  - Suitable for small to medium traffic

- **Vercel Pro Tier** ($20/month):
  - Unlimited bandwidth
  - Built-in cron jobs
  - Better performance
  - Recommended for production

## 🎉 Success!

Once deployed, your application will be:
- ✅ Live at `https://your-project-name.vercel.app`
- ✅ Automatically deploying on every git push
- ✅ Sending stats emails every 2 hours
- ✅ Handling phone number reservations
- ✅ Verifying users via email

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Happy Deploying! 🚀**

