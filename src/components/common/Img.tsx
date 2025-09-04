"use client";

import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import { useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";

const imageLoader = ({ src, width }: { src: string; width: number }) => {
  if (width) {
    return src + "?w=" + width;
  }

  return src;
};

type ImgProps = {
  src: string | any;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fit?: "contain" | "cover" | "fill" | "scale-down" | "none";
  showLoading?: boolean;
};

export function Img({
  src,
  alt = "",
  width = 0,
  height = 0,
  className = "",
  priority = true,
  fit = "contain",
  showLoading = true,
}: ImgProps) {
  const [loading, setLoading] = useState(true);
  const handleLoadingComplete = () => {
    setLoading(false);
  };
  return (
    <>
      {loading && showLoading && src && (
        <Skeleton
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100",
          }}
        />
      )}

      {src && (
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          className={className}
          priority={priority}
          style={{ objectFit: fit, display: loading ? "none" : "" }}
          loader={imageLoader}
          onLoadingComplete={handleLoadingComplete}
        />
      )}
    </>
  );
}