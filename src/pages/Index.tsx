
import React, { useState } from 'react';
import Dialer from '../components/Dialer';
import CallHistory from '../components/CallHistory';
import { Phone, Clock } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dialer' | 'history'>('dialer');

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto">
        {/* Content */}
        <div className="mt-6">
          {activeTab === 'dialer' ? <Dialer /> : <CallHistory />}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="max-w-md mx-auto flex justify-around">
            <button
              onClick={() => setActiveTab('dialer')}
              className={`flex flex-col items-center py-4 px-6 transition-colors duration-200 ${
                activeTab === 'dialer'
                  ? 'text-callGreen'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Phone className="w-6 h-6" />
              <span className="text-sm mt-1">Dialer</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center py-4 px-6 transition-colors duration-200 ${
                activeTab === 'history'
                  ? 'text-callGreen'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock className="w-6 h-6" />
              <span className="text-sm mt-1">History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
