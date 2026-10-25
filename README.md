# The Daily Brief — Real Automated Digital Newspaper & Editorial Platform

An elegant, lightweight, modern digital newspaper and automated news aggregation platform. Built with a focus on editorial typography, source transparency, real RSS wire collection, and editorial review workflow.

---

## Key Highlights

- **Editorial Broadside Design**: Broadside double-rule masthead, Playfair Display and Newsreader serif typography, drop caps, and warm newsprint color system with dark mode.
- **Automated Wire Ingestion Engine**: Extensible RSS/Atom adapter system fetching from real authorized publishers (*The Hindu*, *BBC News*, *TechCrunch*, *Phys.org*, *NPR*).
- **URL Canonicalization & Deduplication**: Strips tracking query parameters (`utm_*`, `fbclid`, etc.) and eliminates duplicate stories across feeds.
- **Editorial Review Workflow**: All newly ingested wire stories enter a human-in-the-loop review queue (`pending` status). Only `approved` articles are published to the public front page.
- **Admin Portal (`/admin`)**:
  - Secure JWT-based authentication with `bcryptjs`.
  - Overview metrics (pending review count, published dispatches, active sources, last sync time).
  - Review queue with quick "Approve & Publish", "Reject", and inline metadata editor.
  - News wire feed manager with live "Test Feed" parsing and URL validation.
  - Audit logs tracking items found, new saved, duplicates skipped, and errors.
  - Manual collection trigger with real-time feedback.
- **Zero-Dependency Built-in SQLite**: Powered by Node 22/24's native `node:sqlite` for local zero-config persistence, with standard SQL migrations for PostgreSQL / Supabase deployment.

---

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Default variables:
```ini
PORT=3001
NODE_ENV=development
DATABASE_URL=data/newspaper.db
ADMIN_USERNAME=editor
ADMIN_PASSWORD=DailyBrief2026!
JWT_SECRET=super-secret-daily-brief-jwt-key-2026-secure
CRON_SECRET=daily-brief-cron-secret-key-998877
AUTO_COLLECT_MINUTES=30
```

### 3. Run Locally

Start the backend server (Express + SQLite + Ingestion Scheduler):
```bash
npm run server
```

In a second terminal, start the Vite frontend:
```bash
npm run dev
```

Open:
- **Public Broadsheet**: `http://localhost:5173/`
- **Editorial Admin Portal**: `http://localhost:5173/#admin` (or click **Admin** in the masthead utility bar)

Default admin credentials:
- **Username**: `editor`
- **Password**: `DailyBrief2026!`

---

## Automated Scheduling & Cron Endpoints

### Background Daemon
When `AUTO_COLLECT_MINUTES` is greater than 0, the server automatically executes a scheduled wire collection cycle every *N* minutes in the background, utilizing an execution lock to prevent overlapping runs.

### External Cron Webhook
For cloud deployments (Vercel Cron, GitHub Actions, AWS EventBridge, EasyCron), trigger collection via:

```bash
curl -X POST http://localhost:3001/api/cron/collect \
  -H "Authorization: Bearer daily-brief-cron-secret-key-998877"
```

---

## Database Architecture & Migrations

The database schema is defined in `server/db/migrations.sql`.

### Tables
1. **`categories`**: Editorial desks (India, World, Politics, Business, Technology, Science, Sports, Entertainment).
2. **`sources`**: Authorized news feed configurations (BBC, The Hindu, TechCrunch, etc.) with enabled state, sync timestamps, and error counts.
3. **`articles`**: Dispatches with `status` (`pending`, `approved`, `rejected`, `archived`), canonical URL, permitted summary, and attribution.
4. **`collection_logs`**: Execution audit records with counts of items found, saved, duplicates skipped, and diagnostic messages.
5. **`users`**: Administrator accounts with bcrypt password hashes.

### Supabase / PostgreSQL Support & Setup Instructions

The complete PostgreSQL production schema with **Row Level Security (RLS)** is located at:
`server/db/supabase_schema.sql`

#### Setup in Supabase Dashboard:
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase project dashboard.
3. Paste the contents of `server/db/supabase_schema.sql` and click **Run**.
4. Retrieve your API credentials from **Project Settings -> API**:
   - `Project URL`
   - `anon public` key
   - `service_role` key (confidential backend key)
5. Add the keys to your `.env` file:
   ```ini
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

#### Database Architecture & Security Features:
- **`profiles` Table**: Automatically populated by a Postgres trigger (`on_auth_user_created`) when a reader logs in via Google OAuth, LinkedIn, or Email Magic Link. Role defaults strictly to `reader` and is protected by a trigger preventing unauthorized elevation to `admin`.
- **`bookmarks` Table**: Readers can query and mutate **only** their own bookmarks through strict RLS policies (`auth.uid() = user_id`).
- **`articles` Table**: Public visitors can only view articles where `status = 'approved'`. Drafts, pending wire dispatches, and rejected articles are hidden by RLS unless authenticated as an administrator.
- **`collection_logs` Table**: Accessible strictly to editors and the backend service role.

---

## Copyright, Licensing & Editorial Integrity

- **Source Transparency**: Every published dispatch attributes its original publisher and includes a direct hyperlink to the original source.
- **Permitted Excerpts**: Only concise summary snippets (under 300 characters) are ingested. Full-text scraping and paywall bypassing are strictly prohibited.
- **Human Verification**: Breaking and sensitive wire items require human editor approval before reaching public readers.
