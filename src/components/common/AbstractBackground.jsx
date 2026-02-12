import React from 'react'

const AbstractBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
            {/* Noise Texture Overlay */}
            <div className="bg-noise opacity-[0.03]"></div>

            {/* Geometric Grind Lines */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'radial-gradient(#444 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>

            {/* Kinetic Void Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full border border-white/5 animate-drift opacity-20 blur-3xl"></div>
            <div className="absolute top-[20%] right-[-20%] w-[50vw] h-[50vw] rounded-full border border-electric-blue/5 animate-drift opacity-10 blur-2xl" style={{ animationDirection: 'reverse', animationDuration: '30s' }}></div>

            {/* Floating Editorial Lines */}
            <div className="absolute top-0 left-[10%] h-full w-[1px] bg-white/5 hidden md:block"></div>
            <div className="absolute top-0 right-[10%] h-full w-[1px] bg-white/5 hidden md:block"></div>
            <div className="absolute top-[15%] left-0 w-full h-[1px] bg-white/5 hidden md:block"></div>
            <div className="absolute bottom-[15%] left-0 w-full h-[1px] bg-white/5 hidden md:block"></div>

            {/* Accent Orbs */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-electric-blue rounded-full animate-pulse shadow-[0_0_20px_#00d4ff]"></div>
            <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>

            {/* Gradient Voids */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/50 to-background opacity-80"></div>
        </div>
    )
}

export default AbstractBackground
