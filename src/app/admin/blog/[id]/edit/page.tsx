import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/BlogForm";
import { FileText } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditBlogPage({ params }: Props) {
  const { id: postId } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const post = await prisma.blogPost.findUnique({
    where: { id: postId },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Decorative glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-200/50 shadow-xs relative overflow-hidden select-none">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-md shadow-indigo-100">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest leading-none bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/30">
              Content Desk
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Edit Article
            </h1>
          </div>
        </div>
      </div>

      {/* Blog form */}
      <BlogForm initialData={post} />
    </div>
  );
}
