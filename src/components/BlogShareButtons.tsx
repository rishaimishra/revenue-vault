"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";

interface BlogShareButtonsProps {
  postTitle: string;
  slug: string;
}

export const BlogShareButtons = ({ postTitle, slug }: BlogShareButtonsProps) => {
  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return `https://revenuevault.com/blog/${slug}`;
  };

  const handleLinkedInShare = () => {
    const url = getShareUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const handleTwitterShare = () => {
    const url = getShareUrl();
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
        postTitle
      )}`,
      "_blank"
    );
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Article URL copied to clipboard!");
    }
  };

  return (
    <div className="flex lg:flex-col lg:items-center gap-3 select-none">
      <button
        title="Share on LinkedIn"
        onClick={handleLinkedInShare}
        className="p-3 bg-white hover:bg-slate-50 border border-slate-200/60 hover:border-slate-300 text-slate-500 hover:text-indigo-600 rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      </button>

      <button
        title="Share on Twitter"
        onClick={handleTwitterShare}
        className="p-3 bg-white hover:bg-slate-50 border border-slate-200/60 hover:border-slate-300 text-slate-500 hover:text-indigo-600 rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      <button
        title="Copy Link"
        onClick={handleCopyLink}
        className="p-3 bg-white hover:bg-slate-50 border border-slate-200/60 hover:border-slate-300 text-slate-500 hover:text-indigo-600 rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer"
      >
        <Link2 className="w-4 h-4" />
      </button>
    </div>
  );
};
