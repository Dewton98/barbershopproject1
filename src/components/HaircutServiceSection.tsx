
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const HaircutServiceSection: React.FC = () => {
  return (
    <div 
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 mb-8 relative overflow-hidden"
      style={{
        backgroundImage: 'url("/lovable-uploads/20ede269-17f1-4946-9e73-4ea8585d27a4.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
          Haircut Services
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="service-card bg-white/10 border-white/10 text-white">
            <CardContent className="p-5">
              <h3 className="text-xl font-semibold mb-2">Haircut</h3>
              <p className="mb-1 text-gray-200">Professional cut and style</p>
              <p className="text-callGreen font-semibold mt-2">KES 3,900</p>
            </CardContent>
          </Card>
          
          <Card className="service-card bg-white/10 border-white/10 text-white">
            <CardContent className="p-5">
              <h3 className="text-xl font-semibold mb-2">Beard Trim</h3>
              <p className="mb-1 text-gray-200">Shape and style your beard</p>
              <p className="text-callGreen font-semibold mt-2">KES 2,600</p>
            </CardContent>
          </Card>
          
          <Card className="service-card bg-white/10 border-white/10 text-white">
            <CardContent className="p-5">
              <h3 className="text-xl font-semibold mb-2">Hot Shave</h3>
              <p className="mb-1 text-gray-200">Traditional hot towel shave</p>
              <p className="text-callGreen font-semibold mt-2">KES 3,250</p>
            </CardContent>
          </Card>
          
          <Card className="service-card bg-white/10 border-white/10 text-white">
            <CardContent className="p-5">
              <h3 className="text-xl font-semibold mb-2">Hair & Beard Combo</h3>
              <p className="mb-1 text-gray-200">Complete grooming package</p>
              <p className="text-callGreen font-semibold mt-2">KES 5,850</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HaircutServiceSection;
