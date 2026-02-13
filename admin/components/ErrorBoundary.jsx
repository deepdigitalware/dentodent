import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Could integrate logging here
    console.error('ErrorBoundary caught', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">An unexpected error occurred. Please try reloading the page.</p>
            <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => window.location.reload()}>Reload</button>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}