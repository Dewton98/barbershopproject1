import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  title?: string;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback(
    (
      error: unknown,
      options: ErrorHandlerOptions = {}
    ) => {
      const {
        showToast = true,
        logToConsole = true,
        title = "Error",
        fallbackMessage = "An unexpected error occurred. Please try again."
      } = options;

      // Extract error message
      let errorMessage = fallbackMessage;
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String((error as any).message);
      }

      // Log to console in development
      if (logToConsole && process.env.NODE_ENV === 'development') {
        console.error('Error caught by handler:', error);
      }

      // Show toast notification
      if (showToast) {
        toast({
          title,
          description: errorMessage,
          variant: "destructive",
        });
      }

      return errorMessage;
    },
    [toast]
  );

  const handleAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      options: ErrorHandlerOptions & { onError?: (error: unknown) => void } = {}
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error, options);
        options.onError?.(error);
        return null;
      }
    },
    [handleError]
  );

  const createErrorHandler = useCallback(
    (options: ErrorHandlerOptions = {}) => {
      return (error: unknown) => handleError(error, options);
    },
    [handleError]
  );

  return {
    handleError,
    handleAsyncError,
    createErrorHandler,
  };
};

// Specific error handlers for common scenarios
export const useNetworkErrorHandler = () => {
  const { handleError } = useErrorHandler();

  return useCallback(
    (error: unknown) => {
      let title = "Network Error";
      let message = "Please check your internet connection and try again.";

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          message = "Unable to connect to our servers. Please check your internet connection.";
        } else if (error.message.includes('timeout')) {
          message = "The request timed out. Please try again.";
        } else {
          message = error.message;
        }
      }

      return handleError(error, { title, fallbackMessage: message });
    },
    [handleError]
  );
};

export const useSupabaseErrorHandler = () => {
  const { handleError } = useErrorHandler();

  return useCallback(
    (error: unknown) => {
      let title = "Database Error";
      let message = "There was a problem with the database. Please try again.";

      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = String((error as any).message);
        
        if (errorMessage.includes('duplicate key')) {
          title = "Duplicate Entry";
          message = "This entry already exists.";
        } else if (errorMessage.includes('foreign key')) {
          title = "Invalid Reference";
          message = "The referenced item does not exist.";
        } else if (errorMessage.includes('permission')) {
          title = "Permission Denied";
          message = "You don't have permission to perform this action.";
        } else {
          message = errorMessage;
        }
      }

      return handleError(error, { title, fallbackMessage: message });
    },
    [handleError]
  );
};