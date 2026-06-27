# QuickShow - Movie Ticket Booking Platform

QuickShow is a full-stack, modern movie ticket booking platform built with the MERN stack (MongoDB, Express, React, Node.js). It features a beautiful, dynamic user interface, secure authentication, real-time ticket booking, and a complete admin dashboard for managing theater showtimes.

## Features

### 🎬 For Users
- **Browse Movies:** View now-playing movies, complete with high-quality posters, plots, actor lists, and runtimes (Powered by the **OMDb API**).
- **Secure Authentication:** Sign up and log in safely using **Clerk**.
- **Interactive Seat Selection:** Choose your exact seats using a visual theater seat layout. Avoid double-bookings with real-time seat availability checks.
- **Secure Payments:** Purchase tickets securely using **Stripe Checkout**.
- **My Bookings & Favorites:** Track your upcoming movie tickets and save favorite movies to your profile.
- **Automated Emails:** Receive PDF ticket confirmations straight to your inbox via **Nodemailer** and **Inngest** background jobs.

### 🛡️ For Admins
- **Role-based Access:** Secure admin dashboard protected by Clerk Metadata roles.
- **Show Management:** Automatically fetch trending movies and schedule them for specific dates, times, and ticket prices.
- **Analytics Dashboard:** View total revenue, total users, active shows, and recent bookings at a glance.

## Tech Stack

- **Frontend:** React.js, Vite, TailwindCSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** Clerk
- **Payments:** Stripe
- **Background Jobs:** Inngest
- **External APIs:** OMDb API (Movie Data)
- **Email Delivery:** Nodemailer

## Environment Variables (.env)

To run this project locally, you will need to set up the following environment variables:

**`client/.env`**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASE_URL=http://localhost:5000
```

**`server/.env`**
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# APIs
OMDB_API_KEY=your_omdb_api_key

# Authentication (Clerk)
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Payments (Stripe)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Background Jobs (Inngest)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Emails
SENDER_EMAIL=your_email@gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Security
ALLOWED_ORIGINS=http://localhost:5173,https://your-production-url.com
```

## Running Locally

1. **Install Dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

2. **Start the Development Servers**
   ```bash
   # In the server terminal
   npm run server

   # In the client terminal
   npm run dev
   ```

3. **Stripe Webhooks (Local Testing)**
   To test payments locally, run the Stripe CLI to forward events to your local server:
   ```bash
   stripe listen --forward-to localhost:5000/api/stripe
   ```

## Admin Setup
To access the `/admin` dashboard, you must grant your user account Admin privileges. 
1. Create a normal account on the frontend.
2. Go to your Clerk Dashboard -> Users -> Select your account.
3. Under **Private Metadata**, add `{"role": "admin"}`.
4. Refresh the application to access the Admin panel.
