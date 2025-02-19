
import React, { useState } from 'react';
import { Phone, X, Mic, MicOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Dialer = () => {
  const [number, setNumber] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleNumberPress = (digit: string) => {
    if (!isInCall) {
      setNumber(prev => prev + digit);
    }
  };

  const handleDelete = () => {
    setNumber(prev => prev.slice(0, -1));
  };

  const handleCall = async () => {
    if (!number) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      // Here we would integrate with a VoIP service
      // For now, we'll simulate the connection process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Info",
        description: "This is a demo app. To make real calls, a VoIP service needs to be integrated.",
      });
      
      setIsInCall(true);
      console.log('Making call to:', number);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to establish call. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEndCall = () => {
    setIsInCall(false);
    // Here we would end the VoIP call
    toast({
      title: "Call Ended",
      description: `Call with ${number} has ended`,
    });
    console.log('Ending call');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Unmuted" : "Muted",
      description: `Microphone ${isMuted ? "unmuted" : "muted"}`,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      <div className="text-center">
        <input
          type="text"
          value={number}
          readOnly
          className="w-full text-4xl font-light text-center bg-transparent focus:outline-none text-white"
          placeholder="Enter number"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleNumberPress(digit.toString())}
            className="aspect-square rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-2xl font-light text-white"
          >
            {digit}
          </button>
        ))}
      </div>

      <div className="flex justify-center items-center space-x-6">
        <button
          onClick={isInCall ? handleEndCall : handleCall}
          disabled={isConnecting}
          className={`p-4 rounded-full transition-all duration-300 ${
            isInCall
              ? 'bg-callRed hover:bg-red-400'
              : 'bg-callGreen hover:bg-green-400'
          } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Phone className={`w-8 h-8 text-white ${isConnecting ? 'animate-pulse' : ''}`} />
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
            className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {isInCall && (
        <div className="text-center animate-pulse text-sm text-white">
          Using data bundle • Good connection
        </div>
      )}
      
      {isConnecting && (
        <div className="text-center animate-pulse text-sm text-white">
          Connecting...
        </div>
      )}
    </div>
  );
};

export default Dialer;
