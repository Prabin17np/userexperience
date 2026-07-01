'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Props {
  images: string[];
  name: string;
}

export const ProductGallery: React.FC<Props> = ({ images, name }) => {
  const safeImages = images?.length ? images : ['/placeholder.jpg'];

  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const displayImages =
    safeImages.length < 4
      ? Array.from({ length: 4 }, (_, i) => safeImages[i % safeImages.length])
      : safeImages;

  return (
    <div className="flex gap-4 items-start relative z-0">

      {/* THUMBNAILS */}
      <div className="flex flex-col gap-3 flex-shrink-0">
        {displayImages.slice(0, 4).map((src, i) => {
          const isActive = active === (i % safeImages.length);

          return (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => {
                setActive(i % safeImages.length);
                setZoomed(false);
              }}
              className="relative w-[72px] h-[72px] rounded-xl overflow-hidden border border-gray-200 transition-transform duration-200 hover:scale-[1.05]"
            >
              <Image
                src={src}
                alt={`${name} ${i + 1}`}
                fill
                sizes="72px"
                className="object-cover"
              />

              {/* hover shade only */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition" />

              {/* active border */}
              {isActive && (
                <div className="absolute inset-0 border-2 border-black pointer-events-none rounded-xl" />
              )}
            </button>
          );
        })}
      </div>

      {/* MAIN IMAGE */}
      <div
        className="relative flex-1 aspect-square rounded-[20px] overflow-hidden border border-black z-0"
        onClick={() => setZoomed((z) => !z)}
      >
        <Image
          src={safeImages[active]}
          alt={name}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          className={`object-cover transition-transform duration-500 ${
            zoomed ? 'scale-105' : 'scale-100'
          }`}
          priority
        />

        <div className="absolute bottom-3 right-3 bg-black/30 text-white rounded-md px-2.5 py-1 text-[0.7rem] pointer-events-none">
          Click to zoom
        </div>
      </div>
    </div>
  );
};