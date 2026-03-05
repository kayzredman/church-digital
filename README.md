# Elimcity Throneroom Platform

A modern, production-grade church website and CMS platform built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Core Features

- **Responsive Design** - Mobile-first, fully responsive
- **Sermon Library** - Video and audio sermon management
- **Events Calendar** - Create, manage, and register for events
- **Donation System** - Secure payments via Stripe and Paystack
- **Blog & News** - Content management for announcements and devotionals
- **Contact Forms** - Easy communication with church staff
- **Ministry Directory** - Showcase church ministries and leaders

### Admin Features

- **Role-Based Access Control** - Admin, Editor, Contributor roles
- **Media Management** - Cloudinary integration for images and videos
- **Content Management** - Easy drag-and-drop interface
- **Analytics** - Track engagement and donations
- **Email Notifications** - Automated email communications

### Technical Features

- **Authentication** - Supabase Auth with Google OAuth
- **Database** - PostgreSQL via Supabase
- **Real-time** - Real-time data updates
- **Security** - SSL, secure payment processing
- **Performance** - Optimized, fast-loading pages
- **SEO** - Built-in SEO optimization

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe + Paystack
- **Media**: Cloudinary
- **Email**: Resend / SendGrid
- **Notifications**: React Hot Toast
- **State Management**: Zustand (optional)
- **Animations**: Framer Motion (optional)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Stripe account (for payments)
- Paystack account (for mobile money)
- Cloudinary account (for media)
- Resend or SendGrid account (for emails)

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd elimthronerm-site
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
RESEND_API_KEY=your_resend_api_key
SENDGRID_API_KEY=your_sendgrid_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=your_database_url
```

### 3. Database Setup

The platform requires several tables in Supabase. Create them using the SQL below or use the Supabase dashboard.

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Next.js pages and API routes
│   ├── api/           # API endpoints
│   ├── auth/          # Authentication pages
│   └── ...            # Page routes
├── lib/               # Utility functions and integrations
├── context/           # React context for state management
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── styles/            # Global styles
└── utils/             # Utility functions
```

## 🔐 Security & Deployment

- Use strong environment variables
- Enable Supabase RLS policies
- Deploy to Vercel for optimal performance
- Regular security audits
- Implement rate limiting

## 📞 Support & Documentation

For detailed setup, API documentation, and deployment instructions, see the full documentation in the project root.

---

**Project**: Elimcity Throneroom Platform  
**Built with**: Next.js, TypeScript, Tailwind CSS, Supabase  
**Last Updated**: March 5, 2024
