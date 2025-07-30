import { useState, useCallback } from 'react';
import { validateKenyanPhoneNumber } from '@/services/africasTalkingService';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
  formattedValues: { [key: string]: any };
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') {
      return null;
    }

    // Length validations
    if (rule.minLength && value.length < rule.minLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be no more than ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return getPatternErrorMessage(name, rule.pattern);
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const getPatternErrorMessage = (fieldName: string, pattern: RegExp): string => {
    // Common pattern error messages
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^(?:\+254|254|0)([17]\d{8})$/;
    
    if (pattern.source === emailPattern.source) {
      return 'Please enter a valid email address';
    }
    
    if (pattern.source === phonePattern.source) {
      return 'Please enter a valid phone number';
    }
    
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} format is invalid`;
  };

  const validateForm = useCallback((formData: { [key: string]: any }): ValidationResult => {
    const newErrors: ValidationErrors = {};
    const formattedValues: { [key: string]: any } = { ...formData };

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    // Special formatting for phone numbers
    if (formData.customerPhone && !newErrors.customerPhone) {
      const phoneValidation = validateKenyanPhoneNumber(formData.customerPhone);
      if (!phoneValidation.isValid) {
        newErrors.customerPhone = 'Please enter a valid Kenyan phone number (07XXXXXXXX or +254XXXXXXXX)';
      } else {
        formattedValues.customerPhone = phoneValidation.formatted;
      }
    }

    setErrors(newErrors);
    
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
      formattedValues
    };
  }, [rules, validateField]);

  const validateSingleField = useCallback((name: string, value: any): boolean => {
    const error = validateField(name, value);
    
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    return !error;
  }, [validateField]);

  const clearFieldError = useCallback((name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const getFieldError = useCallback((name: string): string | undefined => {
    return touched[name] ? errors[name] : undefined;
  }, [errors, touched]);

  const hasFieldError = useCallback((name: string): boolean => {
    return touched[name] && !!errors[name];
  }, [errors, touched]);

  return {
    errors,
    touched,
    validateForm,
    validateSingleField,
    clearFieldError,
    clearAllErrors,
    getFieldError,
    hasFieldError
  };
};

// Predefined validation rules for common fields
export const bookingFormRules: ValidationRules = {
  selectedService: {
    required: true,
    custom: (value) => {
      const validServices = [
        'Haircut', 'Beard Trim', 'Hot Shave', 'Hair & Beard Combo',
        'Head Massage', 'Face Massage', 'Shoulder & Back', 'Premium Package'
      ];
      return validServices.includes(value) ? null : 'Please select a valid service';
    }
  },
  selectedDate: {
    required: true,
    custom: (value) => {
      if (!value) return 'Date is required';
      
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return 'Cannot select a date in the past';
      }
      
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      
      if (selectedDate > maxDate) {
        return 'Bookings can only be made up to 30 days in advance';
      }
      
      return null;
    }
  },
  selectedTime: {
    required: true,
    custom: (value) => {
      const validTimes = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
      return validTimes.includes(value) ? null : 'Please select a valid time slot';
    }
  },
  customerPhone: {
    required: true,
    custom: (value) => {
      if (!value) return 'Phone number is required';
      
      const phoneValidation = validateKenyanPhoneNumber(value);
      return phoneValidation.isValid ? null : 'Please enter a valid Kenyan phone number (07XXXXXXXX or +254XXXXXXXX)';
    }
  }
};

export const authFormRules: ValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    minLength: 6,
    custom: (value) => {
      if (!value) return null;
      
      if (value.length < 6) {
        return 'Password must be at least 6 characters long';
      }
      
      // Check for at least one letter and one number
      const hasLetter = /[a-zA-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      
      if (!hasLetter || !hasNumber) {
        return 'Password must contain at least one letter and one number';
      }
      
      return null;
    }
  },
  confirmPassword: {
    required: true,
    custom: (value, formData) => {
      if (!value) return 'Please confirm your password';
      return value === formData?.password ? null : 'Passwords do not match';
    }
  },
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    custom: (value) => {
      if (!value) return null;
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return 'Name can only contain letters and spaces';
      }
      return null;
    }
  },
  phone: {
    required: false,
    custom: (value) => {
      if (!value) return null; // Optional field
      
      const phoneValidation = validateKenyanPhoneNumber(value);
      return phoneValidation.isValid ? null : 'Please enter a valid Kenyan phone number';
    }
  }
};