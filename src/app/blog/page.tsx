import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, BookOpen, Clock, Calendar, ArrowRight, Rss, Sparkles } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";

export const revalidate = 60; // Revalidate every minute

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string }>;
}) {
  const { query, category } = await searchParams;

  // Build filter conditions
  const whereClause: any = {
    published: true,
  };

  if (query) {
    whereClause.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { content: { contains: query, mode: "insensitive" } },
      { excerpt: { contains: query, mode: "insensitive" } },
    ];
  }

  if (category) {
    whereClause.metaKeywords = {
      contains: category,
      mode: "insensitive",
    };
  }

  // Fetch published blog posts
  const posts = await prisma.blogPost.findMany({
    where: whereClause,
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  // Calculate distinct categories from metaKeywords of all published posts
  const allPublishedPosts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { metaKeywords: true },
  });

  const categoriesSet = new Set<string>();
  allPublishedPosts.forEach((post) => {
    if (post.metaKeywords) {
      post.metaKeywords.split(",").forEach((keyword) => {
        const trimmed = keyword.trim();
        if (trimmed.length > 0 && trimmed.length < 20) {
          categoriesSet.add(trimmed);
        }
      });
    }
  });

  // Fallback default categories if none in DB
  const defaultCategories = ["Success Stories", "Acquisition Guides", "Market Insights", "Expert Tips"];
  const categoriesList = categoriesSet.size > 0 ? Array.from(categoriesSet) : defaultCategories;

  // Simple helper to estimate read time
  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 pb-20 relative">
      {/* Decorative premium background glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-blue-500/3 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Header Area */}
      <div className="container mx-auto px-6 max-w-6xl pt-16 md:pt-24 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 border border-indigo-100/50 rounded-full mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-700 leading-none">
            RevenueVault Journal
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
          Insights on Buying & Selling <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Digital Startup Assets
          </span>
        </h1>
        
        <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed mb-12">
          Your blueprint to SaaS acquisitions, digital business valuation methodologies, success stories, and deep platform deal intelligence.
        </p>

        {/* Unified Search & Dynamic Filter Component */}
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200/60 p-2 rounded-2xl shadow-xl shadow-slate-100/50 flex flex-col md:flex-row gap-2 mb-16">
          <form id="search-form" method="GET" action="/blog" className="flex-1 flex items-center px-3 relative">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              name="query"
              defaultValue={query || ""}
              placeholder="Search guides, acquisitions, success stories..."
              className="w-full bg-transparent border-0 outline-0 px-3 py-3 text-sm text-slate-800 placeholder-slate-400"
            />
            {category && <input type="hidden" name="category" value={category} />}
          </form>
          
          <div className="flex gap-2">
            <Link
              href="/blog"
              className="px-5 py-3 text-slate-600 hover:text-slate-900 font-semibold text-xs rounded-xl flex items-center justify-center transition-colors hover:bg-slate-50"
            >
              Clear
            </Link>
            <button
              type="submit"
              form="search-form"
              className="bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-slate-900/10 active:scale-95"
            >
              Search Journal
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="container mx-auto px-6 max-w-6xl mb-12 border-b border-slate-200/50 pb-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href={query ? `/blog?query=${query}` : "/blog"}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all border ${
              !category
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            All Articles
          </Link>
          
          {categoriesList.map((cat) => {
            const isCatActive = category?.toLowerCase() === cat.toLowerCase();
            const linkHref = query
              ? `/blog?query=${query}&category=${cat}`
              : `/blog?category=${cat}`;

            return (
              <Link
                key={cat}
                href={linkHref}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all border ${
                  isCatActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="container mx-auto px-6 max-w-6xl">
        {posts.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-md border border-dashed border-slate-200/80 rounded-3xl p-16 text-center space-y-4 max-w-md mx-auto shadow-sm">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-500 border border-indigo-100/50 shadow-xs">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <p className="text-slate-800 font-extrabold text-sm">No Articles Found</p>
              <p className="text-slate-400 text-xs mt-1">
                We couldn&apos;t find any blog posts matching your current filters. Try adjusting your search query.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const readTime = getReadTime(post.content);
              const tagArray = post.metaKeywords ? post.metaKeywords.split(",") : ["Acquisitions"];
              const categoryBadge = tagArray[0]?.trim();

              return (
                <article
                  key={post.id}
                  className="bg-white border border-slate-200/50 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col h-full group"
                >
                  {/* Card Cover Image */}
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden shrink-0">
                    <SafeImage
                      src={post.coverImage || "/blog-fallback.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-indigo-700 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-100/50 shadow-xs">
                      {categoryBadge}
                    </span>
                  </Link>

                  {/* Card Content */}
                  <div className="p-7 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Meta information */}
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 stroke-[2]" />
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 stroke-[2]" />
                          {readTime} min read
                        </span>
                      </div>

                      {/* Post Title */}
                      <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      {/* Post Excerpt */}
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                        {post.excerpt || post.content.replace(/[#*`]/g, "").slice(0, 150) + "..."}
                      </p>
                    </div>

                    {/* Bottom Author & CTA Row */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6 shrink-0">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-600 uppercase">
                          {post.author.name?.[0] || "A"}
                        </div>
                        <span className="text-xs font-black text-slate-700 truncate w-24">
                          {post.author.name || "Staff Admin"}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-black text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1 transition-all"
                      >
                        Read Article <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
