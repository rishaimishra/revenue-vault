"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogPostSchema, BlogPostInput } from "@/lib/validations";
import { 
  ArrowLeft, Save, Globe, Eye, HelpCircle, AlertCircle, 
  Sparkles, CheckCircle2, RefreshCw, BookOpen, FileText 
} from "lucide-react";
import Link from "next/link";

interface BlogFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    published: boolean;
  };
}

export const BlogForm = ({ initialData }: BlogFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      coverImage: initialData?.coverImage || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords || "",
      published: initialData?.published || false,
    },
  });

  const titleVal = watch("title");
  const slugVal = watch("slug");
  const metaDescVal = watch("metaDescription") || "";

  // Handy auto slug generator from Title
  const generateSlug = () => {
    if (!titleVal) return;
    const computedSlug = titleVal
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setValue("slug", computedSlug, { shouldValidate: true });
  };

  const onSubmit = async (data: BlogPostInput) => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const endpoint = initialData 
        ? `/api/admin/blog/${initialData.id}` 
        : "/api/admin/blog";
      
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save blog post");
      }

      alert(initialData ? "Post updated successfully!" : "Post created successfully!");
      router.push("/admin/blog");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 select-none">
      {/* Top Banner Navigation & Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-200/50 shadow-xs relative overflow-hidden">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to List
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {errorMsg && (
            <span className="text-rose-600 text-xs font-semibold bg-rose-50 border border-rose-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 max-w-xs truncate">
              <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
            </span>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-black px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-indigo-500/10 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Article
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side (8/12): Main Article Content Editor */}
        <div className="lg:col-span-8 bg-white border border-slate-200/50 p-8 rounded-[2.5rem] shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3 select-none">
            <BookOpen className="w-5 h-5 text-indigo-500" /> Content Editor
          </h2>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Article Title</label>
            <input
              type="text"
              placeholder="e.g. 5 SaaS Metrics Buyers Care About Most"
              {...register("title")}
              className={`w-full bg-slate-50/50 border rounded-2xl px-4 py-3.5 text-sm outline-none transition-all ${
                errors.title 
                  ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/5 bg-rose-50/10" 
                  : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
              }`}
            />
            {errors.title && (
              <p className="text-rose-500 text-xs font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.title.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Custom URL Path (Slug)
              </label>
              <button
                type="button"
                onClick={generateSlug}
                className="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100/40 cursor-pointer"
              >
                Auto Generate
              </button>
            </div>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden px-4">
              <span className="text-slate-400 text-xs select-none border-r border-slate-200 pr-3 font-mono">
                /blog/
              </span>
              <input
                type="text"
                placeholder="5-saas-metrics-buyers-care-about-most"
                {...register("slug")}
                className="flex-1 bg-transparent border-0 outline-none px-3 py-3.5 text-sm text-slate-800 font-mono"
              />
            </div>
            {errors.slug && (
              <p className="text-rose-500 text-xs font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.slug.message}
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Short Summary (Excerpt)</label>
              <span title="A brief, engaging summary used for card list items and SEO meta tags.">
                <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="e.g. Learn which core financial and engagement metrics buyers analyze when bidding on SaaS digital businesses, from churn rates to LTV/CAC ratios."
              {...register("excerpt")}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Body Content (Markdown Supported)</label>
            <textarea
              rows={15}
              placeholder="Write your beautiful article content here... Supporting standard headings like ## Heading 2 and ### Heading 3, quotes like > blockquotes, lists like - item, and simple line splits."
              {...register("content")}
              className={`w-full bg-slate-50/50 border rounded-[2rem] px-5 py-4 text-sm outline-none transition-all ${
                errors.content 
                  ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/5" 
                  : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
              }`}
            />
            {errors.content && (
              <p className="text-rose-500 text-xs font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.content.message}
              </p>
            )}
          </div>
        </div>

        {/* Right Side (4/12): SEO parameters & Status */}
        <div className="lg:col-span-4 space-y-8">
          {/* Status & Options card */}
          <div className="bg-white border border-slate-200/50 p-6 rounded-[2rem] shadow-sm space-y-6">
            <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
              <Eye className="w-5 h-5 text-indigo-500" /> Visibility Status
            </h3>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-0.5">
                <span className="block text-xs font-black text-slate-800">Publish Immediately</span>
                <span className="text-[10px] text-slate-400 font-bold">Make article live on public feed</span>
              </div>
              <input
                type="checkbox"
                id="published"
                {...register("published")}
                className="h-5 w-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Search Engine Optimization card */}
          <div className="bg-white border border-slate-200/50 p-6 rounded-[2.5rem] shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-500" /> SEO Optimization
              </h3>
              <Sparkles className="w-4 h-4 text-amber-500 stroke-[2] animate-pulse" />
            </div>

            {/* Cover Image URL */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Cover Image URL</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/... or relative path"
                {...register("coverImage")}
                className={`w-full bg-slate-50/50 border rounded-2xl px-4 py-3 text-xs outline-none transition-all ${
                  errors.coverImage 
                    ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/5" 
                    : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
                }`}
              />
              {errors.coverImage && (
                <p className="text-rose-500 text-[10px] font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.coverImage.message}
                </p>
              )}
            </div>

            {/* Meta Title */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Meta Title</label>
                {titleVal && (
                  <span className="text-[9px] text-slate-400 font-bold">
                    Title length: {titleVal.length} chars
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="If different than Article Title"
                {...register("metaTitle")}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Meta Description</label>
                <span className={`text-[9px] font-bold ${
                  metaDescVal.length >= 120 && metaDescVal.length <= 160 
                    ? "text-emerald-600" 
                    : "text-amber-500"
                }`}>
                  {metaDescVal.length}/160 chars (ideal: 120-160)
                </span>
              </div>
              <textarea
                rows={4}
                placeholder="Google search summary card snippet..."
                {...register("metaDescription")}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none"
              />
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Keywords & Tags (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="Success Stories, SaaS, Valuation"
                {...register("metaKeywords")}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
              />
              <span className="block text-[9px] text-slate-400 font-bold leading-normal pt-1">
                Tip: The first tag is utilized as the primary badge in card listing grids!
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
