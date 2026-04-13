import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-xl border border-rose-100">
            <h2 className="text-2xl font-bold text-rose-600 mb-4">Algo salió mal</h2>
            <p className="text-slate-600 mb-6">
              La aplicación encontró un error inesperado. Por favor, intenta recargar la página.
            </p>
            <div className="bg-rose-50 p-4 rounded-2xl mb-6 overflow-auto max-h-40">
              <code className="text-xs text-rose-700">
                {this.state.error?.toString()}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-[#004990] text-white rounded-2xl font-bold hover:bg-[#003d7a] transition-all"
            >
              Recargar Aplicación
            </button>
          </div>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}
