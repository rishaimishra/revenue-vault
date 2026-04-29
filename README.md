# RevenueVault | Anonymous Startup Marketplace

RevenueVault is a secure, anonymous marketplace designed for founders to sell their startups and for investors to acquire digital assets with verified financial data.

## 🚀 MVP Features

### 👤 User System
- **Authentication**: Secure login via Google or Email (NextAuth.js).
- **Role Selection**: Dedicated onboarding flow for **Buyers** and **Sellers**.
- **Profile Management**: Manage account details, track subscription status, and switch roles.

### 🏪 Listings Marketplace
- **Anonymous Listings**: Sellers can list startups while hiding sensitive identity details.
- **Key Metrics**: Every listing includes verified Annual Revenue, Profit, and Asking Price.
- **Discovery**: Advanced search and category-based filtering (SaaS, E-commerce, Agency, etc.).
- **Bookmarks**: Save interesting deals to your personal watchlist.

### 💬 Messaging & Communication
- **Access Control**: Buyers must "Request Access" to see sensitive details and start a conversation.
- **Approved Chat**: Seller-approved messaging to prevent spam and protect privacy.
- **Deal Flow**: Integrated status tracking within the conversation.
- **File Sharing**: Securely share financial reports and pitch decks (MVP placeholder).

### 🤝 Deal Management
- **Status Lifecycle**: Track deals from *Interested* → *Accepted* → *In Progress* → *Closed*.
- **Dashboards**: Dedicated dashboards for Buyers and Sellers to manage active deals.

### 🛡️ Trust & Verification
- **Admin Approval**: Every listing is reviewed by an admin before being published.
- **Trust Badges**: Verified badges for users with a proven track record.
- **Reporting**: Community-driven flag system to report suspicious listings.

### 💳 Monetization
- **Featured Listings**: Boost visibility for $29.00 (Simulated flow).
- **Subscription Model**: Monthly tiers (Basic, Pro, Enterprise) for advanced tools.

### 👨‍💼 Admin Panel
- **Listing Management**: Centralized queue to approve or reject pending startups.
- **User Verification**: Tools to manually verify high-trust buyers and sellers.
- **Platform Analytics**: Real-time stats on users, listings, and active deals.

---

## 🛠 Tech Stack
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Hosted on [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚦 Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file with your credentials:
   ```env
   DATABASE_URL="your-postgresql-url"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```
4. **Sync the Database**:
   ```bash
   npx prisma db push
   ```
5. **Launch the Platform**:
   ```bash
   npm run dev
   ```

---

## 🔑 Creating an Admin User

To access the Admin Panel, you need a user with the `ADMIN` role. Since the onboarding flow only offers Buyer and Seller roles, you can promote your first user via **Prisma Studio**:

1. Run `npx prisma studio`.
2. Locate your user record in the `User` table.
3. Change the `role` field from `BUYER` or `SELLER` to `ADMIN`.
4. Save the changes.
5. You can now access `/admin` while logged in with that account.

---

## 📖 Development Commands
- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npx prisma studio`: Open the visual database editor.
- `npx prisma generate`: Update Prisma Client after schema changes.
