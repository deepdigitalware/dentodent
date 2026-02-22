import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    try {
      console.log('Admin ErrorBoundary getDerivedStateFromError', error && error.message ? error.message : String(error));
    } catch {}
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    try {
      console.error('Admin ErrorBoundary caught', error, info);
      this.setState({ info });
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-2xl text-center px-4">
            <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred. Please take a screenshot of the error details below and share it.
            </p>
            {this.state.error && (
              <div className="mt-4 p-4 bg-gray-900 text-left rounded-lg text-sm text-red-100 overflow-x-auto max-h-64">
                <div className="font-semibold mb-2">Error:</div>
                <pre className="whitespace-pre-wrap break-words">
                  {this.state.error.message || String(this.state.error)}
                </pre>
                {this.state.info && this.state.info.componentStack && (
                  <>
                    <div className="font-semibold mt-3 mb-1">Component stack:</div>
                    <pre className="whitespace-pre-wrap break-words text-xs text-gray-300">
                      {this.state.info.componentStack}
                    </pre>
                  </>
                )}
              </div>
            )}
            <button
              className="mt-6 px-4 py-2 rounded bg-blue-600 text-white"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
