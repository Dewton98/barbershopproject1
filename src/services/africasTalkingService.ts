
// Africa's Talking SMS Service
// This service integrates with Africa's Talking API to send SMS notifications

import { config } from '@/lib/config';

interface SMSResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Get configuration from centralized config
const { africasTalking } = config;

export const sendSMS = async (
  phoneNumber: string, 
  message: string
): Promise<SMSResponse> => {
  console.log(`Sending SMS to ${phoneNumber}: ${message}`);
  
  try {
    // For development/demo purposes, this function can work in two modes:
    // 1. Real API call mode (when deployed with proper credentials)
    // 2. Simulation mode (for local testing without credentials)
    
    // Check if we're in development/demo mode
    const isDemoMode = africasTalking.demoMode;
    
    if (isDemoMode) {
      // Simulate API call for demo purposes
      console.log("SMS DEMO MODE: Simulating API call to Africa's Talking");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: "Demo SMS sent successfully (simulation)",
        data: {
          phoneNumber,
          message,
          timestamp: new Date().toISOString()
        }
      };
    } else {
      // Real API implementation for production use
      // This would use the Africa's Talking API
      const formData = new URLSearchParams();
      formData.append('username', africasTalking.username);
      formData.append('to', phoneNumber);
      formData.append('message', message);
      
      const response = await fetch(africasTalking.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'apiKey': africasTalking.apiKey
        },
        body: formData.toString()
      });
      
      const data = await response.json();
      
      if (data.SMSMessageData && data.SMSMessageData.Recipients && data.SMSMessageData.Recipients[0].status === "Success") {
        return {
          success: true,
          message: "SMS sent successfully",
          data
        };
      } else {
        throw new Error(data.SMSMessageData ? data.SMSMessageData.Message : "Unknown error");
      }
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send SMS"
    };
  }
};

export const formatAppointmentReminderMessage = (
  service: string,
  date: string,
  time: string
): string => {
  return `REMINDER: Your appointment for ${service} is scheduled for ${date} at ${time}. Thank you for choosing ${config.app.name}.`;
};

export const validateKenyanPhoneNumber = (phoneNumber: string): { isValid: boolean; formatted?: string } => {
  // Remove any non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid Kenyan format
  if (/^(?:254|\+254|0)?(7\d{8})$/.test(digitsOnly)) {
    // Format to international format +254XXXXXXXXX
    const numberPart = digitsOnly.match(/^(?:254|\+254|0)?(7\d{8})$/)?.[1];
    if (numberPart) {
      return {
        isValid: true,
        formatted: `+254${numberPart}`
      };
    }
  }
  
  return { isValid: false };
};

export const formatScheduledMessage = (
  type: 'booking' | 'reminder' | 'cancellation',
  bookingDetails: {
    service: string;
    date: string;
    time: string;
    customerName?: string;
  }
): string => {
  const { service, date, time, customerName } = bookingDetails;
  const greeting = customerName ? `Hello ${customerName}` : 'Hello';
  
  switch (type) {
    case 'booking':
      return `${greeting}, your appointment for ${service} has been confirmed for ${date} at ${time}. We look forward to seeing you at ${config.app.name}.`;
    
    case 'reminder':
      return `${greeting}, this is a reminder that your appointment for ${service} is scheduled for tomorrow, ${date} at ${time}. We look forward to seeing you at ${config.app.name}.`;
    
    case 'cancellation':
      return `${greeting}, your appointment for ${service} scheduled on ${date} at ${time} has been cancelled. Please contact us to reschedule.`;
    
    default:
      return `${greeting}, you have an appointment for ${service} on ${date} at ${time} at ${config.app.name}.`;
  }
};
