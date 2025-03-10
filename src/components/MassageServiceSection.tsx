import React from 'react';

const MassageServiceSection: React.FC = () => {
  return (
    <div 
      className="relative rounded-xl p-6 md:p-8 mb-8 overflow-hidden"
      style={{
        backgroundImage: 'url("/lovable-uploads/47cdeea6-6c24-478e-8060-1d6a792a27f2.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Massage Services
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-gray-200">
            <h3 className="text-xl font-semibold mb-2">Head Massage</h3>
            <p className="mb-1">Relaxing scalp and neck massage</p>
            <p className="mb-2 text-sm text-gray-300">Duration: 20 minutes</p>
            <p className="text-callGreen">KES 3,250</p>
          </div>
          <div className="text-gray-200">
            <h3 className="text-xl font-semibold mb-2">Face Massage</h3>
            <p className="mb-1">Rejuvenating facial massage</p>
            <p className="mb-2 text-sm text-gray-300">Duration: 15 minutes</p>
            <p className="text-callGreen">KES 2,600</p>
          </div>
          <div className="text-gray-200">
            <h3 className="text-xl font-semibold mb-2">Shoulder & Back</h3>
            <p className="mb-1">Stress-relieving upper body massage</p>
            <p className="mb-2 text-sm text-gray-300">Duration: 30 minutes</p>
            <p className="text-callGreen">KES 4,550</p>
          </div>
          <div className="text-gray-200">
            <h3 className="text-xl font-semibold mb-2">Premium Package</h3>
            <p className="mb-1">Complete relaxation treatment</p>
            <p className="mb-2 text-sm text-gray-300">Duration: 45 minutes</p>
            <p className="text-callGreen">KES 7,800</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MassageServiceSection;
