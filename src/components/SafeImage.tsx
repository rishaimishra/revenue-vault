"use client";

import { ImgHTMLAttributes } from "react";

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const SafeImage = ({
  src,
  alt,
  fallbackSrc = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><rect width='100%25' height='100%25' fill='%236366f1'/><circle cx='400' cy='225' r='100' fill='%234f46e5' opacity='0.5'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='sans-serif' font-size='24' font-weight='bold'>RevenueVault Journal</text></svg>",
  className,
  ...props
}: SafeImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.onerror = null; // Prevent infinite fallback loops
        e.currentTarget.src = fallbackSrc;
      }}
      {...props}
    />
  );
};
