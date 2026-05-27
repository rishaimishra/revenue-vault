import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, Clock, ArrowLeft, Share2, Link2, ChevronRight, User, BookOpen, Star } from "lucide-react";
import { BlogShareButtons } from "@/components/BlogShareButtons";
import { SafeImage } from "@/components/SafeImage";

export const revalidate = 60; // Revalidate every minute

interface Props {
  params: Promise<{ slug: string }>;
}

// 1. Dynamic generateMetadata() for top-tier search engine indexing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    return {
      title: "Article Not Found | RevenueVault Journal",
    };
  }

  const title = post.metaTitle || `${post.title} | RevenueVault Journal`;
  const description = post.metaDescription || post.excerpt || "RevenueVault Journal digital startup acquisitions guides.";
  const keywords = post.metaKeywords || "startup, saas acquisition, buy startup, valuation";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://revenuevault.com/blog/${slug}`,
      images: [
        {
          url: post.coverImage || "https://revenuevault.com/blog-fallback.jpg",
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.coverImage || "https://revenuevault.com/blog-fallback.jpg"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          role: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Calculate read time
  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const readTime = getReadTime(post.content);

  // Injected JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.coverImage || "https://revenuevault.com/blog-fallback.jpg",
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name || "RevenueVault Editor",
    },
    "publisher": {
      "@type": "Organization",
      "name": "RevenueVault",
      "logo": {
        "@type": "ImageObject",
        "url": "https://revenuevault.com/logo_reve.png",
      },
    },
    "description": post.metaDescription || post.excerpt || post.title,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://revenuevault.com/blog/${post.slug}`,
    },
  };

  // Generate other related posts
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <article className="min-h-screen bg-slate-50/20 pb-24 relative font-sans">
      {/* JSON-LD Injected Tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Decorative backdrop glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[600px] left-10 w-[400px] h-[400px] bg-purple-500/3 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Breadcrumb & Navigation Header */}
      <div className="container mx-auto px-6 max-w-4xl pt-8 md:pt-12">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8 select-none">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href="/blog" className="hover:text-indigo-600 transition-colors">Journal</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-400 truncate max-w-xs">{post.title}</span>
        </nav>

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-600 hover:text-indigo-600 transition-colors bg-white px-3.5 py-2 border border-slate-200/60 rounded-full shadow-xs active:scale-95 duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
        </Link>
      </div>

      {/* Hero Header Section */}
      <header className="container mx-auto px-6 max-w-4xl pt-8 pb-10 text-left">
        {post.metaKeywords && (
          <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-md">
            {post.metaKeywords.split(",")[0]?.trim()}
          </span>
        )}

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mt-6 mb-6">
          {post.title}
        </h1>

        <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed mb-8 border-l-4 border-l-indigo-500 pl-4 py-1 bg-slate-50/50 pr-4 rounded-r-xl">
          {post.excerpt || "Insights and expert guidelines for marketplace buyers and sellers."}
        </p>

        {/* Meta details & Author info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-200/60 mt-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-indigo-600/10">
              {post.author.name?.[0] || "A"}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-800 leading-none">
                {post.author.name || "Staff Admin"}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                {post.author.role === "ADMIN" ? "RevenueVault Editor" : "Verified Writer"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 stroke-[1.8]" />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="h-1 w-1 bg-slate-300 rounded-full" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 stroke-[1.8]" />
              {readTime} min read
            </span>
          </div>
        </div>
      </header>

      {/* Feature Cover Image */}
      <div className="container mx-auto px-6 max-w-4xl mb-12 select-none">
        <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden border border-slate-200/50 shadow-lg shadow-slate-100">
          <SafeImage
            src={post.coverImage || "/blog-fallback.jpg"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Social Share (Sidebar) */}
          <div className="lg:col-span-2 flex lg:flex-col lg:items-center gap-3 shrink-0 h-fit lg:sticky lg:top-28">
            <span className="hidden lg:block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Share</span>
            <BlogShareButtons postTitle={post.title} slug={post.slug} />
          </div>

          {/* Center Column: Blog Body content */}
          <div className="lg:col-span-10 space-y-8">
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-[15px] sm:text-base font-medium space-y-6">
              {/* Formatted body paragraph renderer */}
              {post.content.split("\n\n").map((para, i) => {
                const trimmed = para.trim();
                if (trimmed.startsWith("###")) {
                  return (
                    <h3 key={i} className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-4">
                      {trimmed.replace("###", "").trim()}
                    </h3>
                  );
                } else if (trimmed.startsWith("##")) {
                  return (
                    <h2 key={i} className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-6 border-b border-slate-100 pb-2">
                      {trimmed.replace("##", "").trim()}
                    </h2>
                  );
                } else if (trimmed.startsWith("#")) {
                  return (
                    <h2 key={i} className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-6">
                      {trimmed.replace("#", "").trim()}
                    </h2>
                  );
                } else if (trimmed.startsWith(">")) {
                  return (
                    <blockquote key={i} className="border-l-4 border-l-indigo-600 bg-indigo-50/50 p-5 rounded-r-2xl italic font-semibold text-slate-800 my-6">
                      {trimmed.replace(">", "").trim()}
                    </blockquote>
                  );
                } else if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
                  const items = trimmed.split("\n").map(li => li.replace(/^[-*]\s*/, ""));
                  return (
                    <ul key={i} className="list-disc pl-6 space-y-2 text-slate-600">
                      {items.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="whitespace-pre-line leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Premium CTA box for Buyers / Sellers */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 p-8 rounded-[2.5rem] shadow-xl text-white mt-16 relative overflow-hidden select-none border border-indigo-900/50">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl" />
              
              <div className="relative space-y-4 max-w-xl">
                <span className="text-[9px] font-black tracking-widest text-indigo-300 uppercase leading-none bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full w-fit block">
                  Build Generational Wealth
                </span>
                
                <h3 className="text-2xl font-black tracking-tight leading-snug">
                  Acquire a Cash-Flowing Startup or List Yours Anonymously
                </h3>
                
                <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                  Join thousands of vetted investors and verified founders buying and selling digital businesses with transparent, secure operations.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/onboarding"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Open Vetted Account
                  </Link>
                  <Link
                    href="/marketplace"
                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-3 rounded-xl border border-white/10 transition-all active:scale-95"
                  >
                    Explore Deals
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Articles Section */}
            {relatedPosts.length > 0 && (
              <div className="pt-16 border-t border-slate-200/60 mt-16 space-y-8 select-none">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <BookOpen className="w-5.5 h-5.5 text-indigo-500" /> Recommended Reading
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((rPost) => (
                    <article key={rPost.id} className="bg-white border border-slate-200/50 rounded-3xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col h-full justify-between group">
                      <div className="space-y-3">
                        <Link href={`/blog/${rPost.slug}`} className="block aspect-video rounded-2xl overflow-hidden mb-1 border border-slate-100">
                          <SafeImage
                            src={rPost.coverImage || "/blog-fallback.jpg"}
                            alt={rPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        <h4 className="font-extrabold text-slate-800 text-sm leading-snug group-hover:text-indigo-600 line-clamp-2">
                          <Link href={`/blog/${rPost.slug}`}>{rPost.title}</Link>
                        </h4>
                      </div>
                      <Link
                        href={`/blog/${rPost.slug}`}
                        className="text-[11px] font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-4"
                      >
                        Read Post <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </article>
  );
}
