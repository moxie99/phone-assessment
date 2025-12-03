# Phone Number Reservation System

A modern, secure phone number reservation system built for Quickteller Business campaign. This application allows users to reserve their mobile numbers with email verification, duplicate prevention, and automated statistics reporting.

## 🎯 Project Overview

This is a full-stack Next.js application that enables users to reserve phone numbers through a sleek, modern web interface. The system includes email verification to prevent impersonation, MongoDB for data persistence, and automated email notifications with statistics.

## ✨ Features

### User Features
- **Modern, Responsive UI**: Sleek design with glassmorphism effects, smooth animations, and mobile-first approach
- **Form Validation**: Real-time validation with clear error messages
- **Email Verification**: 6-digit verification code sent to user's Gmail account
- **Photo Upload**: Secure photo upload with 1MB size limit and preview
- **Country Selection**: Comprehensive list of countries with Nigeria as default
- **Duplicate Prevention**: Automatic detection and prevention of duplicate reservations

### Security Features
- **Email Verification**: Cryptographically secure 6-digit codes
- **Rate Limiting**: Protection against brute force attacks (5 attempts = 30-minute lock)
- **IP Tracking**: Monitors verification attempts per IP address
- **Gmail-Only Restriction**: Only Gmail accounts are permitted
- **Unique Constraints**: Database-level unique indexes on email and phone number
- **Code Expiration**: Verification codes expire after 24 hours
- **Information Disclosure Prevention**: Generic error messages to prevent email enumeration

### Admin Features
- **Automated Statistics**: Email reports sent every 2 hours to `iswdesignteam@gmail.com`
- **Real-time Stats**: API endpoint to fetch current statistics
- **Manual Triggers**: Endpoint to manually send stats emails for testing

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Lucide React** - Icon library
- **Averta Font** - Custom typography

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database with Mongoose ODM
- **Node.js** - Runtime environment

### Email & Scheduling
- **Nodemailer** - Email sending with Gmail SMTP
- **node-cron** - Scheduled task execution

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** or **pnpm**
- **MongoDB** database (local or MongoDB Atlas account)
- **Gmail account** with App Password enabled

## 🚀 Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd phone-reserve
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/phone-reserve
   
   # Gmail SMTP Configuration
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   
   # Stats Email Recipient
   STATS_EMAIL=iswdesignteam@gmail.com
   
   # Cron Secret (for securing cron endpoint)
   CRON_SECRET=your-secret-key-here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

### MongoDB Setup

#### Option 1: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string and update `MONGODB_URI` in `.env.local`
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/phone-reserve
   ```

#### Option 2: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/phone-reserve
   ```

### Gmail SMTP Setup

1. **Enable 2-Step Verification**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app
   - Select your device
   - Click "Generate"
   - Copy the 16-character password

3. **Update `.env.local`**:
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ```

### Averta Font Setup

1. **Purchase Averta Font** (if not already owned):
   - Visit [Fontfabric - Averta](https://www.fontfabric.com/fonts/averta/)
   - Purchase the font family

2. **Convert to Web Fonts**:
   - Convert OTF/TTF files to WOFF2 format
   - Use tools like [CloudConvert](https://cloudconvert.com/) or [Font Squirrel](https://www.fontsquirrel.com/tools/webfont-generator)

3. **Add Font Files**:
   - Place WOFF2 files in `public/fonts/` directory:
     - `Averta-Regular.woff2`
     - `Averta-Semibold.woff2`
     - `Averta-Bold.woff2`
     - `Averta-ExtraBold.woff2`

4. **Enable Font Loading**:
   - Open `app/globals.css`
   - Uncomment the `@font-face` declarations (remove `/*` and `*/`)
   - Restart the development server

**Note**: The application will use system fonts as fallback until Averta font files are added.

## 📡 API Endpoints

### Public Endpoints

#### `POST /api/reserve`
Submit a phone number reservation.

**Request Body** (FormData):
- `firstName` (string, required)
- `lastName` (string, required)
- `email` (string, required, must be Gmail)
- `phoneNumber` (string, required)
- `country` (string, required)
- `photo` (File, required, max 1MB)

**Response**:
```json
{
  "success": true,
  "message": "Reservation created. Please check your email for verification code.",
  "reservationId": "..."
}
```

#### `POST /api/verify`
Verify a reservation with the code sent via email.

**Request Body**:
```json
{
  "email": "user@gmail.com",
  "verificationCode": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Phone number reservation verified successfully!",
  "reservation": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "country": "Nigeria"
  }
}
```

#### `GET /api/stats`
Get current statistics (no authentication required).

**Response**:
```json
{
  "success": true,
  "stats": {
    "totalReservations": 100,
    "verifiedReservations": 85,
    "unverifiedReservations": 15,
    "reservationsLast2Hours": 5,
    "topCountries": [
      { "country": "Nigeria", "count": 45 },
      { "country": "United States", "count": 20 }
    ]
  }
}
```

### Admin/Testing Endpoints

#### `GET /api/send-stats-now`
Manually trigger stats email (for testing).

**Response**:
```json
{
  "success": true,
  "message": "Stats email sent successfully",
  "sentTo": "iswdesignteam@gmail.com",
  "stats": { ... }
}
```

#### `POST /api/test-email`
Test email configuration.

**Request Body**:
```json
{
  "type": "verification" | "stats",
  "email": "test@gmail.com",
  "firstName": "Test" // optional, for verification type
}
```

#### `GET /api/cron/init`
Initialize cron job (called automatically on page load).

#### `GET /api/cron/send-stats`
Cron endpoint for external cron services (requires `CRON_SECRET`).

**Headers**:
```
Authorization: Bearer {CRON_SECRET}
```

## 🔒 Security Features

### Impersonation Prevention
- ✅ **Email Verification**: 6-digit cryptographically secure codes
- ✅ **Code Expiration**: Codes expire after 24 hours
- ✅ **Rate Limiting**: Account locked after 5 failed attempts for 30 minutes
- ✅ **IP Tracking**: Monitors attempts per IP address
- ✅ **Gmail-Only**: Restricts to Gmail accounts only
- ✅ **Duplicate Prevention**: Unique constraints on email and phone number
- ✅ **Information Disclosure Prevention**: Generic error messages

### Database Security
- ✅ **Unique Indexes**: Prevents duplicate email and phone number entries
- ✅ **Input Validation**: Server-side validation for all inputs
- ✅ **Data Sanitization**: Email normalization (lowercase, trim)

## 📊 Database Schema

### PhoneReservation Model
```typescript
{
  firstName: string
  lastName: string
  email: string (unique, indexed)
  phoneNumber: string (unique, indexed)
  country: string
  photoUrl: string
  photoFileName: string
  verificationCode: string
  isVerified: boolean (indexed)
  verifiedAt: Date
  createdAt: Date
  updatedAt: Date
}
```

### VerificationAttempt Model
```typescript
{
  email: string (indexed)
  ipAddress: string (indexed)
  attempts: number
  lastAttempt: Date
  lockedUntil: Date
  createdAt: Date (TTL: 24 hours)
  updatedAt: Date
}
```

## 🎨 Design System

### Brand Colors
- **Primary Blue**: `#479FC8`
- **White**: `#FFFFFF`
- **Dark Blue**: `#00425F`

### Typography
- **Font Family**: Averta (with system font fallbacks)
- **Weights**: Regular (400), Semibold (600), Bold (700), ExtraBold (800)

### Design Features
- Glassmorphism effects with backdrop blur
- Smooth animations and transitions
- Responsive design (mobile, tablet, desktop)
- Modern gradient backgrounds
- Floating background elements
- Elegant hover effects

## 📁 Project Structure

```
phone-reserve/
├── app/
│   ├── api/              # API routes
│   │   ├── reserve/      # Reservation submission
│   │   ├── verify/       # Email verification
│   │   ├── stats/        # Statistics endpoint
│   │   ├── cron/         # Cron job endpoints
│   │   ├── test-email/   # Email testing
│   │   └── send-stats-now/ # Manual stats trigger
│   ├── globals.css       # Global styles and animations
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/
│   ├── phone-reservation-form.tsx  # Main form component
│   ├── cron-initializer.tsx        # Cron job initializer
│   └── ui/               # shadcn UI components
├── lib/
│   ├── mongodb.ts        # Database connection
│   ├── email.ts          # Email service
│   ├── cron.ts           # Scheduled tasks
│   └── utils/            # Utility functions
├── models/
│   ├── PhoneReservation.ts         # Reservation model
│   └── VerificationAttempt.ts      # Rate limiting model
├── public/
│   └── fonts/            # Averta font files (add here)
├── fonts/                # Font setup instructions
├── instrumentation.ts    # Server initialization
└── .env.local           # Environment variables (create this)
```

## 🔄 Scheduled Tasks

### Automated Stats Emails
- **Frequency**: Every 2 hours
- **Recipient**: `iswdesignteam@gmail.com` (configurable via `STATS_EMAIL`)
- **Schedule**: Runs at 00:00, 02:00, 04:00, 06:00, 08:00, 10:00, 12:00, 14:00, 16:00, 18:00, 20:00, 22:00
- **Content**: Total reservations, verified/unverified counts, new reservations (last 2 hours), top 10 countries

### Initialization
The cron job initializes automatically when the server starts via `instrumentation.ts`.

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Configure Cron Jobs**:
   - For Vercel, use Vercel Cron or external cron service
   - Set up to call `/api/cron/send-stats` every 2 hours
   - Include `Authorization: Bearer {CRON_SECRET}` header

### Other Platforms

For other platforms (AWS, DigitalOcean, etc.):
- Ensure Node.js 18+ is available
- Set environment variables
- Use external cron service (cron-job.org, EasyCron) to call `/api/cron/send-stats`
- Or use platform-specific cron solutions

## 🧪 Testing

### Test Email Configuration
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "verification",
    "email": "your-email@gmail.com",
    "firstName": "Test"
  }'
```

### Test Stats Email
```bash
curl http://localhost:3000/api/send-stats-now
```

### Test Verification Flow
1. Submit a reservation via the form
2. Check email for verification code
3. Enter code on verification page
4. Verify success message appears

## 🐛 Troubleshooting

### Email Not Sending
- ✅ Verify Gmail App Password is correct (16 characters, no spaces)
- ✅ Check that 2-Step Verification is enabled
- ✅ Ensure `GMAIL_USER` matches the account with the app password
- ✅ Check spam folder
- ✅ Use `/api/test-email` endpoint to debug

### MongoDB Connection Issues
- ✅ Verify `MONGODB_URI` is correct
- ✅ Check MongoDB service is running (local)
- ✅ Verify network access (MongoDB Atlas - check IP whitelist)
- ✅ Ensure database user has correct permissions

### Cron Job Not Running
- ✅ Check server logs for cron initialization messages
- ✅ Verify server is running 24/7 (for node-cron)
- ✅ For external cron, verify endpoint is accessible
- ✅ Check `CRON_SECRET` matches if using external cron

### Font Not Loading
- ✅ Ensure font files are in `public/fonts/` directory
- ✅ Verify file names match exactly (case-sensitive)
- ✅ Uncomment `@font-face` declarations in `app/globals.css`
- ✅ Restart development server after adding fonts

### Duplicate Index Warning
- ✅ This is resolved - unique indexes are properly configured
- ✅ If you see the warning, restart the server

## 📝 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `GMAIL_USER` | Gmail address for sending emails | Yes | `your-email@gmail.com` |
| `GMAIL_APP_PASSWORD` | Gmail App Password (16 chars) | Yes | `xxxx xxxx xxxx xxxx` |
| `STATS_EMAIL` | Recipient for stats emails | No | `iswdesignteam@gmail.com` |
| `CRON_SECRET` | Secret for securing cron endpoint | No | `your-secret-key` |

## 📄 License

This project is private and proprietary.

## 👥 Contributors

Built for Quickteller Business Campaign by the Group Corporate Communications and Marketing Department.

## 📞 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ using Next.js, MongoDB, and modern web technologies**
