import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component Error:", error);
    console.error("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Check for specific Redux Provider error
      if (this.state.error?.message?.includes("react-redux context value")) {
        return (
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
            <p className="text-red-500">Redux Provider not found. Please ensure the app is wrapped in a Redux Provider.</p>
          </div>
        );
      }
      
      // Generic error UI
      return (
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
          <p className="text-red-500">Something went wrong. Please try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
