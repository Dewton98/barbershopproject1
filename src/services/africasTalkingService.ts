
// Africa's Talking SMS Service
// This is a client-side implementation for demo purposes

interface SMSResponse {
  success: boolean;
  message: string;
}

export const sendSMS = async (
  phoneNumber: string, 
  message: string
): Promise<SMSResponse> => {
  console.log(`Sending SMS to ${phoneNumber}: ${message}`);
  
  try {
    // This is a mock implementation
    // In a real application, you would call an API endpoint that uses Africa's Talking API
    // The API call should be done on the server side to protect your API credentials
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll always return success
    return {
      success: true,
      message: "SMS sent successfully"
    };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return {
      success: false,
      message: "Failed to send SMS"
    };
  }
};

export const formatAppointmentReminderMessage = (
  service: string,
  date: string,
  time: string
): string => {
  return `REMINDER: Your appointment for ${service} is scheduled for ${date} at ${time}. Thank you for choosing Premium Barber Shop.`;
};
