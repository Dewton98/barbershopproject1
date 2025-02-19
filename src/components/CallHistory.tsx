
import React from 'react';
import { Phone, PhoneMissed, PhoneIncoming, Clock } from 'lucide-react';

const CallHistory = () => {
  const mockHistory = [
    { number: '+1234567890', type: 'outgoing', duration: '5:23', timestamp: '2 hours ago' },
    { number: '+1987654321', type: 'missed', duration: '', timestamp: 'Yesterday' },
    { number: '+1122334455', type: 'incoming', duration: '2:45', timestamp: 'Yesterday' },
  ];

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'outgoing':
        return <Phone className="w-4 h-4 text-callGreen rotate-90" />;
      case 'incoming':
        return <PhoneIncoming className="w-4 h-4 text-callGreen" />;
      case 'missed':
        return <PhoneMissed className="w-4 h-4 text-callRed" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Calls</h2>
      <div className="space-y-3">
        {mockHistory.map((call, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-softGray hover:bg-gray-200 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              {getCallIcon(call.type)}
              <div>
                <div className="font-medium text-gray-800">{call.number}</div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {call.timestamp}
                </div>
              </div>
            </div>
            {call.duration && (
              <div className="text-sm text-gray-500">{call.duration}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CallHistory;
