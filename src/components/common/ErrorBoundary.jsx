import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse border border-red-500/50">
                        <AlertTriangle size={40} className="text-red-500" />
                    </div>
                    <h1 className="text-4xl font-oswald text-white mb-2 uppercase">System Malfunction</h1>
                    <p className="text-white/50 font-rajdhani mb-8 max-w-md">
                        An unexpected error has occurred. The system has paused to prevent data corruption.
                    </p>
                    <div className="bg-white/5 p-4 rounded-lg font-mono text-xs text-red-400 mb-8 max-w-lg overflow-auto border border-white/10">
                        {this.state.error && this.state.error.toString()}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold font-oswald uppercase rounded hover:bg-white/90 transition-all"
                    >
                        <RefreshCw size={18} /> Reboot System
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
