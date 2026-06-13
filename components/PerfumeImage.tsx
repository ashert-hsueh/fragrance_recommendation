"use client";

import Image from "next/image";
import { useState } from "react";

interface PerfumeImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

export default function PerfumeImage({
  src,
  alt,
  className,
  sizes,
}: PerfumeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        aria-label={`${alt} 图片暂不可用`}
        className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 text-center text-gray-400"
        role="img"
      >
        <div className="relative h-14 w-8 rounded-b-lg rounded-t-sm border-2 border-gray-300 bg-white shadow-sm">
          <div className="absolute -top-4 left-1/2 h-4 w-4 -translate-x-1/2 rounded-t-sm border-2 border-b-0 border-gray-300 bg-white" />
          <div className="absolute left-1/2 top-5 h-5 w-5 -translate-x-1/2 rounded-full border border-gray-200" />
        </div>
        <span className="mt-3 text-xs font-medium">暂无图片</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      unoptimized
      onError={() => setHasError(true)}
    />
  );
}
