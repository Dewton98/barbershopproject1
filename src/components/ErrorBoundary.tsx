import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console and potentially to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Here you could send the error to an error reporting service
    // Example: errorReportingService.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or use provided fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-6">
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
              <p className="text-gray-300">
                We're sorry for the inconvenience. The application encountered an unexpected error.
              </p>
            </div>

            <Alert className="bg-red-900/50 border-red-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-red-200">Error Details</AlertTitle>
              <AlertDescription className="text-red-300 text-sm mt-2">
                {this.state.error?.message || 'An unknown error occurred'}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button 
                onClick={this.handleReset}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              
              <Button 
                onClick={this.handleReload}
                variant="outline" 
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <Home className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4 p-4 bg-gray-800 rounded-lg">
                <summary className="text-white cursor-pointer">
                  Developer Information (Dev Mode Only)
                </summary>
                <pre className="text-xs text-gray-300 mt-2 overflow-auto max-h-32">
                  {this.state.error?.stack}
                  {'\n\nComponent Stack:'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;