"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface BlogDeleteButtonProps {
  postId: string;
}

export const BlogDeleteButton = ({ postId }: BlogDeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this blog post? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete post");
      }

      alert("Blog post deleted successfully!");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "An error occurred while deleting the post.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete Post"
      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
};
