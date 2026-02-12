import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-2xl">
                {/* 404 Text */}
                <h1 className="text-9xl font-oswald text-gold mb-4 tracking-wider">404</h1>
                <h2 className="text-4xl font-oswald text-white mb-6 uppercase">Page Not Found</h2>
                <p className="text-white/60 text-lg mb-12">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-6 py-3 bg-gold text-black font-oswald uppercase rounded-lg hover:bg-gold/80 transition-colors"
                    >
                        <Home size={20} />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-oswald uppercase rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFound
