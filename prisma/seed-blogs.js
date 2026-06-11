const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding blog posts...");

  // 1. Fetch or create the administrator user
  let admin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (!admin) {
    console.log("Admin user not found. Creating a default administrator...");
    admin = await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "System Administrator",
        role: "ADMIN",
        isVerified: true,
        isOnboarded: true,
      },
    });
  }

  // 2. Clear out any existing blog posts to avoid slug conflicts during seeding
  await prisma.blogPost.deleteMany({});
  console.log("Cleared existing blog posts.");

  // 3. Define the seeded blog posts list
  const blogPostsData = [
    {
      title: "How to Value Your SaaS Startup: The Definitive Valuation Guide",
      slug: "how-to-value-your-saas-startup",
      excerpt: "Learn which core financial and engagement metrics buyers analyze when bidding on SaaS digital businesses, from churn rates to LTV/CAC ratios.",
      coverImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
      metaTitle: "How to Value Your SaaS Startup: 2026 Valuation Guide",
      metaDescription: "The ultimate guide to SaaS startup valuations. Understand revenue multiples, EBITDA, churn, growth, and how to negotiate the best price for your software business.",
      metaKeywords: "Acquisition Guides, SaaS, Valuation, Revenue Multiples",
      published: true,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      authorId: admin.id,
      content: `## The Evolution of SaaS Valuations

Valuing a Software-as-a-Service (SaaS) startup is both an art and a science. Unlike traditional bricks-and-mortar operations, SaaS businesses generate highly predictable, recurring revenue streams. Consequently, buyers analyze a unique subset of leverage metrics to compute their bidding multiple.

In this guide, we will break down the exact formulas used by institutional buyers and individual micro-investors on RevenueVault.

---

## 1. The Core Valuation Formulas

Historically, most SaaS businesses are valued as a multiple of their **S.D.E. (Seller's Discretionary Earnings)** or **ARR (Annual Recurring Revenue)**.

> **Seller's Discretionary Earnings (SDE)**
> SDE = Net Profit + Seller's Salary + Non-recurring Expenses + Owner's Benefits
> 
> *Best for: Startups generating under $1M in annual revenue, where operations are tightly linked to the founder.*

> **Annual Recurring Revenue (ARR)**
> ARR = Monthly Recurring Revenue (MRR) * 12
> 
> *Best for: Fast-growing startups generating over $1M ARR with institutionalized operations.*

---

## 2. Key Multipliers That Influence Bids

When buyers evaluate your listed SaaS, they do not just look at gross revenues. They audit structural multipliers:

### A. Net Revenue Churn
The rate at which you lose revenue from canceling clients.
- **Good:** Under 1% monthly churn.
- **Red Flag:** Above 3% monthly churn. High churn means buyers must spend massive amounts of cash on customer acquisition just to stay flat.

### B. LTV to CAC Ratio
Customer Lifetime Value (LTV) divided by Customer Acquisition Cost (CAC).
- An ideal ratio is **3:1** or higher. It proves that the business operates a highly profitable sales pipeline.

### C. Founder Dependency
If the codebase requires 40 hours of your personal developer time per week, buyers will drastically discount the multiple because of "transition friction". Documenting your operations reduces dependency and boosts multiples!`,
    },
    {
      title: "From Zero to $5M Acquisition: The Success Story of MailMerge.co",
      slug: "success-story-mailmerge-co",
      excerpt: "Read the exclusive interview with Marcus Vance, the bootstrapped solo-founder who grew his micro-SaaS to $1.2M ARR and exited on RevenueVault.",
      coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      metaTitle: "SOLO EXIT: How MailMerge.co Sold for $5,000,000",
      metaDescription: "An inspiring success story of Marcus Vance. Learn how he bootstrapped a simple cold email utility to $1.2M ARR and secured a cash-out exit on RevenueVault.",
      metaKeywords: "Success Stories, Bootstrapping, SaaS, Micro-SaaS, Exit",
      published: true,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      authorId: admin.id,
      content: `## The Power of Focus

MailMerge.co started as a simple sidebar extension designed to help recruiters personalize email campaigns. 36 months later, the solo-founder Marcus Vance walked away with a life-changing $5,000,000 cash exit on RevenueVault.

Here is how he did it, completely bootstrapped, without a single dollar of venture capital.

---

## The Birth of MailMerge.co

"I was working as an account executive and spent 2 hours every morning copying email addresses into spreadsheets," Marcus explains. "I built a rudimentary script that did it in 5 seconds. I realized my colleagues wanted it. That was day zero."

Marcus launched a basic paid version at $9/month. Within 60 days, he was making $3,000 in monthly recurring revenue.

---

## Scaling Through Simplicity

While other tools expanded into massive, complicated marketing platforms, Marcus kept MailMerge focused on one specific job: doing small mail-merges flawlessly.

- **Developer Headcount:** 1 (Marcus himself).
- **Customer Support:** Managed via automated Zendesk macros and custom docs.
- **Operating Margin:** An astronomical **88%**.

By keeping overhead extremely low, Marcus maximized his SDE (Seller's Discretionary Earnings). When buyers looked at his financials, they were blown away by the profit margin.

---

## Listing and Exiting on RevenueVault

When Marcus reached $100k in monthly revenue, he decided to cash out. He listed MailMerge.co anonymously on RevenueVault.

Within 48 hours, he received **12 access requests** from high-trust verified buyers.

> "The anonymous listing feature saved me," Marcus says. "My competitors didn't know I was selling, my clients didn't panic, and I could negotiate safely behind the vault."
> 
> A private equity firm acquired the SaaS for a clean 4.1x ARR multiple, closing the deal in just 28 days via our secure verified listing flow.`,
    },
    {
      title: "Top 5 Red Flags Buyers Look for During M&A Due Diligence",
      slug: "top-5-red-flags-buyers-look-for",
      excerpt: "Avoid deal breakers! Vetted acquisition specialists share the top five compliance and codebase issues that tank startup sales during due diligence.",
      coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      metaTitle: "M&A Guide: Top 5 Diligence Red Flags to Avoid",
      metaDescription: "Don't let diligence kill your sale. Discover the five fatal red flags buyers look for, including customer concentration, messy cap tables, and legal liabilities.",
      metaKeywords: "Expert Tips, Due Diligence, M&A, Deal Structuring",
      published: true,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      authorId: admin.id,
      content: `## Don't Let Diligence Kill Your Sale

You found a buyer, agreed on an asking price, and signed an L.O.I. (Letter of Intent). But the hardest part is yet to come: **Due Diligence**.

Over 40% of agreed-upon acquisitions fall through during the diligence audit phase. In this article, our platform vetted transaction compliance officers outline the top 5 red flags that ruin deals, and how you can fix them.

---

## 1. High Customer Concentration Risk

If your startup makes $50,000/month, but one enterprise client contributes $35,000 of that revenue, you have a major customer concentration issue.

- **The Buyer's Panic:** If that single client cancels tomorrow, 70% of the acquired business's value vanishes.
- **The Solution:** Try to diversify your account profiles. No single client should represent more than **15%** of your total ARR.

---

## 2. Messy or Unvetted Code Repositories

Institutional buyers will hire developer audits to scan your GitHub repository for open-source license violations (like copy-pasting GPL code into proprietary software) or hardcoded secrets.

- **The Solution:** Run an automated security linter before listing. Ensure all packages are up-to-date and dependencies are well-documented.

---

## 3. High Churn and "Spike" Revenues

Buyers will pull cohort retention logs from Stripe or Razorpay. If your revenue grew due to a massive, non-recurring lifetime deal (LTD) promo, but your monthly churn is 8%, the growth is artificial.

- **The Solution:** Focus on consistent, sustainable month-over-month growth rather than high-velocity promotions that bring in unstable clients.

---

## 4. IP Ownership Disputes

Who wrote the software? If you hired freelancers on Upwork or Fiverr but never had them sign explicit **IP Assignment Agreements**, you legally do not own your codebase.

- **The Solution:** Ensure every past contractor signs an Intellectual Property Assignment. Buyers will require this in the final Asset Purchase Agreement (APA).`,
    },
  ];

  // 4. Create blog posts in the database
  for (const postData of blogPostsData) {
    const post = await prisma.blogPost.create({
      data: postData,
    });
    console.log(`Successfully seeded post: "${post.title}" with slug "/blog/${post.slug}"`);
  }

  console.log("Blog seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
