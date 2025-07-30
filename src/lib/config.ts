// Application configuration
export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || "Premium Barber Shop",
    barberPhone: import.meta.env.VITE_BARBER_PHONE || "+254700000000",
  },
  
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  },
  
  africasTalking: {
    username: import.meta.env.VITE_AFRICAS_TALKING_USERNAME || "sandbox",
    apiKey: import.meta.env.VITE_AFRICAS_TALKING_API_KEY || "",
    environment: import.meta.env.VITE_AFRICAS_TALKING_ENVIRONMENT || "sandbox",
    demoMode: import.meta.env.VITE_SMS_DEMO_MODE === "true",
    apiUrl: "https://api.africastalking.com/version1/messaging",
  },
  
  services: {
    'Haircut': { price: 3900, duration: 45, category: 'haircut' },
    'Beard Trim': { price: 2600, duration: 30, category: 'haircut' },
    'Hot Shave': { price: 3250, duration: 35, category: 'haircut' },
    'Hair & Beard Combo': { price: 5850, duration: 75, category: 'haircut' },
    'Head Massage': { price: 3250, duration: 30, category: 'massage' },
    'Face Massage': { price: 2600, duration: 25, category: 'massage' },
    'Shoulder & Back': { price: 4550, duration: 45, category: 'massage' },
    'Premium Package': { price: 7800, duration: 120, category: 'premium' },
  },
  
  businessHours: {
    open: '09:00',
    close: '18:00',
    timeSlots: [
      '09:00', '10:00', '11:00', '12:00', 
      '14:00', '15:00', '16:00', '17:00'
    ],
    closedDays: [], // 0 = Sunday, 1 = Monday, etc.
    bufferTime: 15, // minutes between appointments
  }
};

// Validation function to ensure required environment variables are set
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!config.supabase.url) {
    errors.push("VITE_SUPABASE_URL is required");
  }
  
  if (!config.supabase.anonKey) {
    errors.push("VITE_SUPABASE_ANON_KEY is required");
  }
  
  if (!config.africasTalking.demoMode && !config.africasTalking.apiKey) {
    errors.push("VITE_AFRICAS_TALKING_API_KEY is required when demo mode is disabled");
  }
  
  if (errors.length > 0) {
    console.warn("Configuration warnings:", errors);
  }
  
  return errors.length === 0;
};

// Initialize configuration validation
validateConfig();