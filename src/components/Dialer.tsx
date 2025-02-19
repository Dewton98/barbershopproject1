
import React, { useState } from 'react';
import { Phone, X, Mic, MicOff } from 'lucide-react';

const Dialer = () => {
  const [number, setNumber] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isInCall, setIsInCall] = useState(false);

  const handleNumberPress = (digit: string) => {
    if (!isInCall) {
      setNumber(prev => prev + digit);
    }
  };

  const handleDelete = () => {
    setNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (number) {
      setIsInCall(true);
      // Here we would integrate with a VoIP service
      console.log('Making call to:', number);
    }
  };

  const handleEndCall = () => {
    setIsInCall(false);
    // Here we would end the VoIP call
    console.log('Ending call');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      <div className="text-center">
        <input
          type="text"
          value={number}
          readOnly
          className="w-full text-4xl font-light text-center bg-transparent focus:outline-none"
          placeholder="Enter number"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleNumberPress(digit.toString())}
            className="aspect-square rounded-full bg-softGray hover:bg-gray-200 transition-colors duration-200 text-2xl font-light"
          >
            {digit}
          </button>
        ))}
      </div>

      <div className="flex justify-center items-center space-x-6">
        <button
          onClick={isInCall ? handleEndCall : handleCall}
          className={`p-4 rounded-full transition-all duration-300 ${
            isInCall
              ? 'bg-callRed hover:bg-red-400'
              : 'bg-callGreen hover:bg-green-400'
          }`}
        >
          <Phone className="w-8 h-8 text-white" />
        </button>

        {isInCall && (
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-all duration-300 ${
              isMuted ? 'bg-gray-600' : 'bg-gray-400'
            }`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>
        )}

        {!isInCall && number && (
          <button
            onClick={handleDelete}
            className="p-4 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        )}
      </div>

      {isInCall && (
        <div className="text-center animate-pulse text-sm text-gray-600">
          Using data bundle • Good connection
        </div>
      )}
    </div>
  );
};

export default Dialer;
