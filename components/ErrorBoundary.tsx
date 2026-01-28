import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro não tratado:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
          <div className="p-10 text-center bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-red-100 dark:border-red-900/30">
            <div className="text-6xl mb-4">💥</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Algo inesperado aconteceu</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Nosso sistema de proteção capturou uma falha crítica.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
            >
              Recarregar Sistema
            </button>
          </div>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}

export default ErrorBoundary;