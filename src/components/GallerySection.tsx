
import React from 'react';

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

interface GallerySectionProps {
  galleryImages: GalleryImage[];
}

const GallerySection: React.FC<GallerySectionProps> = ({ galleryImages }) => {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Our Gallery
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {galleryImages.map((image, index) => (
          <div 
            key={index} 
            className="relative overflow-hidden rounded-lg group"
          >
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <p className="text-white p-4 font-medium">{image.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GallerySection;
