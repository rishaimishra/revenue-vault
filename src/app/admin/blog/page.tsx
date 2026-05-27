import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Edit3, Trash2, Calendar, FileText, ArrowUpRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { BlogDeleteButton } from "@/components/admin/BlogDeleteButton";

export default async function AdminBlogPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all posts (both published and drafts)
  const posts = await prisma.blogPost.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-200/50 shadow-xs relative overflow-hidden select-none">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-md shadow-indigo-100">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest leading-none bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/30">
              Content Engine
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Blog Manager
            </h1>
          </div>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Blog Post
        </Link>
      </div>

      {/* Main Table Content */}
      <div className="bg-white border border-slate-200/50 rounded-[2.5rem] overflow-hidden shadow-sm">
        {posts.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-400 border border-indigo-100/50">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <p className="text-slate-800 font-extrabold text-sm">No Blog Posts Yet</p>
              <p className="text-slate-400 text-xs mt-1">
                You haven&apos;t written any blog posts yet. Click the button above to write your first SEO-optimized article!
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                  <th className="py-4.5 px-6">Post Details</th>
                  <th className="py-4.5 px-6">SEO Path (Slug)</th>
                  <th className="py-4.5 px-6">Status</th>
                  <th className="py-4.5 px-6">Author & Date</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6 max-w-xs sm:max-w-md">
                      <div className="space-y-1">
                        <Link
                          href={post.published ? `/blog/${post.slug}` : "#"}
                          target={post.published ? "_blank" : "_self"}
                          className={`font-black text-slate-800 flex items-center gap-1.5 ${
                            post.published ? "hover:text-indigo-600" : "cursor-default"
                          }`}
                        >
                          {post.title}
                          {post.published && (
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100 shrink-0" />
                          )}
                        </Link>
                        {post.excerpt && (
                          <p className="text-xs text-slate-400 line-clamp-1">{post.excerpt}</p>
                        )}
                        {post.metaKeywords && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {post.metaKeywords.split(",").slice(0, 3).map((keyword, idx) => (
                              <span key={idx} className="text-[8px] font-bold text-slate-500 bg-slate-50 border border-slate-200/40 px-1.5 py-0.5 rounded">
                                #{keyword.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-500">
                      /{post.slug}
                    </td>
                    <td className="py-4 px-6 select-none">
                      {post.published ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 border border-emerald-100 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 border border-amber-100 rounded-md">
                          <AlertCircle className="w-3 h-3 text-amber-600" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-600">{post.author.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-300" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right select-none">
                      <div className="flex justify-end items-center gap-1">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          title="Edit Post"
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent rounded-xl transition-all cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        
                        <BlogDeleteButton postId={post.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
