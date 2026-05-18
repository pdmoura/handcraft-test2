'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({  images, title  }) {
  // Find the primary image or default to the first image
  const defaultImage = images.find((img) => img.isPrimary) || images[0];
  const [selectedImage, setSelectedImage] = useState(defaultImage);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-card relative group">
        <Image
          src={selectedImage?.url || '/images/placeholder-product.jpg'}
          alt={title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                img.id === selectedImage?.id
                  ? 'border-cta opacity-100'
                  : 'border-transparent hover:border-border opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.url}
                alt={`Thumbnail for ${title}`}
                fill
                sizes="80px"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
