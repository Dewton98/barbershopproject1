
import React from 'react';
import SectionWindow from './SectionWindow';

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
    <SectionWindow
      id="gallery"
      title="Our Gallery"
      backgroundImage="/lovable-uploads/55c43d3b-5b72-4d55-8bc0-e1a16d255981.png"
    >
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
    </SectionWindow>
  );
};

export default GallerySection;
