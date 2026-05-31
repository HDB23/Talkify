# Talkify (Unmute-with-Bolo) Vercel Production Deployment Guide

This guide provides a detailed, step-by-step checklist and instructions to successfully transition the **Talkify** Next.js application from a local testing/sandbox state to a secure, highly-scalable, production-ready deployment on **Vercel** with a **Neon Serverless PostgreSQL** database, **Clerk Authentication**, and **Razorpay Payments**.

---

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step 1: Next.js Middleware Activation (Critical Router Fix)](#step-1-nextjs-middleware-activation-critical-router-fix)
3. [Step 2: Database Setup & Migration (Neon & Drizzle)](#step-2-database-setup--migration-neon--drizzle)
4. [Step 3: Clerk Authentication Transition (Test to Live)](#step-3-clerk-authentication-transition-test-to-live)
5. [Step 4: Razorpay Payment Gateway Live Transition](#step-4-razorpay-payment-gateway-live-transition)
6. [Step 5: Production Security Patches & Hardening](#step-5-production-security-patches--hardening)
7. [Step 6: Setting Up Vercel Deployment](#step-6-setting-up-vercel-deployment)
8. [Step 7: Production Seeding & Verification](#step-7-production-seeding--verification)

---

## 1. Prerequisites

Before beginning the deployment, ensure you have active accounts and admin dashboard access for:
- [Vercel](https://vercel.com/) (For web hosting and serverless function deployment)
- [Neon Console](https://neon.tech/) (For the serverless PostgreSQL database)
- [Clerk Dashboard](https://dashboard.clerk.com/) (For user authentication & session management)
- [Razorpay Dashboard](https://dashboard.razorpay.com/) (For processing live subscription payments)

---

## Step 1: Next.js Middleware Activation (Critical Router Fix)

In your local testing environment, the application's Clerk auth protection file is named `proxy.ts`. 

> [!IMPORTANT]
> Next.js and Vercel's serverless edge router will **only** auto-detect and run route interceptor middleware if the file is located in the root of the project and named **exactly** `middleware.ts` (or `middleware.js`).

### Action Required:
Rename the file in your root workspace:
- **Rename**: `proxy.ts` ➡️ `middleware.ts`

This ensures that Clerk intercepts private routes (e.g. `/shop`, `/quests`, `/learn`, `/leaderboard`, `/settings/*`) and enforces authentication redirects in production.

---

## Step 2: Database Setup & Migration (Neon & Drizzle)

Talkify uses Drizzle ORM configured with the Neon Serverless driver (`@neondatabase/serverless`) which uses HTTP fetch request routing. This is optimal for Vercel Serverless Functions as it avoids socket exhaustion.

### Steps:
1. Log into your **Neon Console** and create a new project (e.g., `Talkify-Prod`).
2. Copy the **PostgreSQL Connection String** from the Neon dashboard.
3. Keep the string format as:
   ```env
   DATABASE_URL="postgresql://<username>:<password>@<host>/neondb?sslmode=require"
   ```
4. Note that you do not need to manually create tables; Drizzle will push the schema directly in [Step 7](#step-7-production-seeding--verification).

---

## Step 3: Clerk Authentication Transition (Test to Live)

### Steps:
1. In your Clerk Dashboard, select your Talkify application and toggle it from **Development** to **Production** mode (or create a new Production application).
2. Copy your Production API keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (begins with `pk_live_...`)
   - `CLERK_SECRET_KEY` (begins with `sk_live_...`)
3. **Configure Allowed Redirects** in the Clerk Production Dashboard:
   - Add your production Vercel domain (e.g., `https://your-app.vercel.app`) as an allowed origin.
   - Configure sign-in and sign-up paths to match the paths defined in your Next.js application (default is `/`).

---

## Step 4: Razorpay Payment Gateway Live Transition

To accept actual currency payments from users, you must transition your payment integrations from Razorpay's sandbox/test mode to live production mode.

### 1. Swap Live Keys
1. In your Razorpay Dashboard, toggle the switch from **Test Mode** to **Live Mode**.
2. Go to **Account & Settings** ➡️ **API Keys** and generate a new set of live API keys.
3. Update the keys:
   - `NEXT_PUBLIC_RAZORPAY_API_KEY` (live key begins with `rzp_live_...`)
   - `RAZORPAY_SECRET_KEY` (live secret key)

### 2. Configure Live Subscription Plans
1. In the Razorpay Live Dashboard, navigate to **Subscriptions** ➡️ **Plans** and create three distinct subscription plans:
   - 1 Month Premium Plan
   - 2 Month Premium Plan
   - 3 Month Premium Plan
2. Set the appropriate price, billing interval, and currency for each.
3. Once created, copy the generated Live Plan IDs (starting with `plan_...`).
4. Update the environment variables:
   - `RAZORPAY_PLAN_1MONTH="plan_LIVExxxxxxxx1"`
   - `RAZORPAY_PLAN_2MONTH="plan_LIVExxxxxxxx2"`
   - `RAZORPAY_PLAN_3MONTH="plan_LIVExxxxxxxx3"`

### 3. Create Live Webhook Endpoint
1. Go to your Razorpay Dashboard ➡️ **Settings** ➡️ **Webhooks** ➡️ **Add New Webhook**.
2. Configure the following parameters:
   - **Webhook URL**: `https://your-production-domain.vercel.app/api/webhooks/razorpay`
   - **Secret**: Create a strong, random password (e.g., a 32-character string). Copy this secret.
   - **Active Events**: Select `subscription.charged` and `payment.captured`.
3. Set your copied webhook secret as:
   - `RAZORPAY_TEST_WEBHOOK_SECRET="your-copied-webhook-secret"`
   *(Note: You can rename this environment variable in production, but if you do, remember to update it in `app/api/webhooks/razorpay/route.ts` accordingly).*

---

## Step 5: Production Security Patches & Hardening

During sandbox development, certain signature-verification bypasses were put in place so checkout functions could be mocked locally. **You must secure these before deploying to production.**

### 1. Enable Client-Side Payment Verification
In [actions/user-subscription.ts](file:///d:/Talkify/unmute-with-bolo/actions/user-subscription.ts), client-side activation checks if `process.env.RAZORPAY_API_SECRET` is set before verifying the signature:
```typescript
if (process.env.RAZORPAY_API_SECRET) {
  // Verifies signature...
}
```
* **Production Action**: Ensure you set `RAZORPAY_API_SECRET` in your Vercel environment variables, mapping it to your live Razorpay secret key (`RAZORPAY_SECRET_KEY`), or change the code to use the existing `RAZORPAY_SECRET_KEY` variable:
```typescript
if (process.env.RAZORPAY_SECRET_KEY) {
  const crypto = await import("crypto");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(razorpayPaymentId + "|" + razorpaySubscriptionId)
    .digest("hex");
  
  if (expectedSignature !== razorpaySignature) {
    throw new Error("Invalid signature");
  }
}
```

### 2. Enforce Webhook Signature Checks
In [app/api/webhooks/razorpay/route.ts](file:///d:/Talkify/unmute-with-bolo/app/api/webhooks/razorpay/route.ts), signature checks are bypassed if `RAZORPAY_TEST_WEBHOOK_SECRET` is not set:
```typescript
if (
  expectedSignature !== signature &&
  process.env.RAZORPAY_TEST_WEBHOOK_SECRET
) {
  return new NextResponse("Invalid signature", { status: 400 });
}
```
* **Production Action**: You **MUST** define `RAZORPAY_TEST_WEBHOOK_SECRET` in your Vercel Environment Variables. If left blank, anyone can send fake HTTP POST queries to your webhook endpoint to activate premium perks for free.

---

## Step 6: Setting Up Vercel Deployment

### 1. Import Code to GitHub
Ensure all workspace files (including the renamed `middleware.ts`) are committed and pushed to a remote GitHub repository.

### 2. Configure Vercel Project
1. Log into Vercel and click **Add New** ➡️ **Project**.
2. Select your imported Talkify repository.
3. In **Build & Development Settings**, keep all default configurations (Vercel automatically detects Next.js framework configuration).
4. Expand the **Environment Variables** section.

### 3. Add Production Environment Variables
Add the following keys exactly as listed, matching their live production values:

| Key | Description | Type / Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk live publishable key | `pk_live_...` |
| `CLERK_SECRET_KEY` | Clerk live secret key | `sk_live_...` |
| `DATABASE_URL` | Neon production database connection string | `postgresql://...` |
| `NEXT_PUBLIC_APP_URL` | Your deployment Vercel URL (without trailing slash) | `https://talkify.vercel.app` |
| `NEXT_PUBLIC_RAZORPAY_API_KEY` | Razorpay live API key | `rzp_live_...` |
| `RAZORPAY_SECRET_KEY` | Razorpay live secret key | `GEmZGjb...` |
| `RAZORPAY_API_SECRET` | Razorpay secret key (for client verification) | Set same as `RAZORPAY_SECRET_KEY` |
| `RAZORPAY_TEST_WEBHOOK_SECRET` | Secret configured in Razorpay Webhook settings | `your-webhook-secret` |
| `RAZORPAY_PLAN_1MONTH` | Live plan ID for 1 Month | `plan_...` |
| `RAZORPAY_PLAN_2MONTH` | Live plan ID for 2 Months | `plan_...` |
| `RAZORPAY_PLAN_3MONTH` | Live plan ID for 3 Months | `plan_...` |
| `BOT_ID` | Botpress Chatbot Bot ID | `bp_...` |
| `CLIENT_ID` | Botpress Chatbot Client ID | `bp_...` |
| `ADMIN_ID_1` | Admin Clerk user ID for admin dashboard access | `user_...` |

Click **Deploy** and wait for Vercel to compile, bundle, and launch the serverless deployment.

---

## Step 7: Production Seeding & Verification

Once Vercel reports a successful build and the site is live, you must migrate the database schema and seed the initial course contents (English, Hindi, Gujarati, Marathi lessons, questions, and options) into your live Neon database.

### 1. Push Database Schema
Run the migration script locally using terminal commands. Since your local `.env` points to the local database, you can temporarily override the connection or run this on a deployment pipeline. The easiest way is to run the push command locally:

1. Update your local `.env` `DATABASE_URL` to temporarily point to your **Neon Production connection string**.
2. Run the Drizzle schema sync command in your terminal:
   ```bash
   npm run db:push
   ```
3. Verify in your Neon Console that all tables (`courses`, `lessons`, `challenges`, `user_subscription`, etc.) were successfully created.

### 2. Seed Default Course Content
With the schema created, populate the tables with courses and lesson assets:
1. Execute the production database seeding script:
   ```bash
   npm run db:prod
   ```
2. Verify that console reports `Seeding database ⚠️` followed by `Seeding finished ✅`.
3. Revert your local `.env` `DATABASE_URL` back to your local development database if you wish to continue local sandbox operations.

### 3. Verify Active Site
1. Access your live Vercel domain URL.
2. Sign in using Clerk.
3. Access the `/learn` page and ensure lessons are rendered correctly from the newly seeded database.
4. Purchase a subscription plan to test client-side activation and webhook entitlement flow!
