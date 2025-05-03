
import React from 'react';

interface SectionWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  backgroundImage?: string;
}

const SectionWindow: React.FC<SectionWindowProps> = ({ 
  id, 
  title, 
  children, 
  backgroundImage 
}) => {
  return (
    <div 
      id={id}
      className="relative rounded-xl p-6 md:p-8 mb-12 overflow-hidden scroll-mt-24"
      style={backgroundImage ? {
        backgroundImage: `url("${backgroundImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {backgroundImage && <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>}
      
      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 font-playfair">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default SectionWindow;
