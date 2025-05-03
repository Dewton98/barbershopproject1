
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SectionWindow from './SectionWindow';

const HaircutServiceSection: React.FC = () => {
  return (
    <SectionWindow 
      id="haircut" 
      title="Haircut Services"
      backgroundImage="/lovable-uploads/20ede269-17f1-4946-9e73-4ea8585d27a4.png"
    >
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
    </SectionWindow>
  );
};

export default HaircutServiceSection;
