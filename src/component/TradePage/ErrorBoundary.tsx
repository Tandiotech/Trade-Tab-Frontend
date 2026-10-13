import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * ErrorBoundary - Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of the component tree that crashed.
 */
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
    // Log the error to console and any error reporting service
    console.error('TradePage ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4'>
          <div className='bg-slate-800 rounded-xl border border-slate-700 p-8 max-w-md w-full text-center'>
            <div className='text-6xl mb-4'>⚠️</div>
            <h2 className='text-xl font-semibold text-white mb-2'>Something went wrong</h2>
            <p className='text-slate-400 mb-6'>
              The Trade Page encountered an unexpected error. Please try refreshing the page.
            </p>

            <div className='space-y-3'>
              <button
                onClick={this.handleRetry}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200'
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className='w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200'
              >
                Refresh Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mt-6 text-left'>
                <summary className='text-slate-400 cursor-pointer text-sm'>
                  Error Details (Development)
                </summary>
                <div className='mt-2 p-3 bg-slate-900 rounded-lg text-xs text-red-400 font-mono overflow-auto max-h-32'>
                  <div className='mb-2'>
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div className='mb-2'>
                    <strong>Stack:</strong>
                    <pre className='whitespace-pre-wrap mt-1'>{this.state.error.stack}</pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className='whitespace-pre-wrap mt-1'>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, errorInfo?: any) => {
    console.error('TradePage Error:', error, errorInfo);

    // You can add error reporting service calls here
    // Example: reportError(error, errorInfo);
  }, []);

  return { handleError };
};

// Higher-order component for error handling
const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

// Trade-specific error boundary with custom fallback
export const TradePageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Log trade-specific errors
    console.error('TradePage Error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // You can send this to your error reporting service
    // Example: sendErrorReport(error, errorInfo, 'TradePage');
  };

  const fallback = (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4'>
      <div className='bg-slate-800 rounded-xl border border-slate-700 p-8 max-w-lg w-full text-center'>
        <div className='text-6xl mb-4'>📊</div>
        <h2 className='text-xl font-semibold text-white mb-2'>Trading Dashboard Error</h2>
        <p className='text-slate-400 mb-6'>
          We're having trouble loading your trading data. This might be due to a network issue or a
          temporary service problem.
        </p>

        <div className='space-y-3'>
          <button
            onClick={() => window.location.reload()}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200'
          >
            Reload Dashboard
          </button>

          <button
            onClick={() => window.history.back()}
            className='w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200'
          >
            Go Back
          </button>
        </div>

        <div className='mt-6 text-sm text-slate-500'>
          If the problem persists, please contact support.
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};
