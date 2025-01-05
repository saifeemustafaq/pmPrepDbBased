import React from 'react';
import * as analytics from '../lib/analytics';

interface Props {
  children: React.ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    analytics.trackError(
      'React Error',
      error.message,
      this.props.componentName
    );
    
    // Log to console for debugging
    console.error('Error caught by boundary:', {
      error,
      errorInfo,
      component: this.props.componentName
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <h2 className="text-red-800 font-semibold mb-2">Something went wrong</h2>
          <p className="text-red-600 text-sm">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            onClick={() => {
              analytics.trackUIInteraction('error_boundary', 'retry');
              this.setState({ hasError: false, error: undefined });
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 