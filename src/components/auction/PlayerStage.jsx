import React from 'react'
import { motion } from 'framer-motion'

const PlayerStage = ({ player, isSold }) => {
    // ========================================
    // 🎨 CUSTOMIZATION CONFIG - EDIT HERE!
    // ========================================
    const CONFIG = {
        // Rating & Position (Top-Left)
        rating: {
            top: '3rem',        // Distance from top (try: '1rem', '2rem', '3rem')
            left: '3rem',       // Distance from left
            fontSize: '4rem',   // Rating number size (try: '3rem', '5rem', '6rem')
            positionSize: '1.5rem' // Position text size (try: '1rem', '2rem')
        },

        // Player Photo
        photo: {
            width: '100%',        // Full width to avoid horizontal stretching
            height: '70%',        // Height for vertical space
            topPadding: '-1rem'    // Slight negative to lift photo up
        },

        // Player Name
        name: {
            fontSize: '3rem',     // Name text size (try: '2.5rem', '3.5rem', '4rem')
            bottomMargin: '1rem' // Space below name - reduced
        },

        // Stats Row
        stats: {
            labelSize: '1rem', // Stat label size (PAC, SHO, etc.)
            valueSize: '1.875rem', // Stat value size (87, 82, etc.)
            gap: '0.5rem',        // Space between stats (try: '0.25rem', '1rem')
            minWidth: '40px'      // Minimum width per stat column
        },

        // Bottom Section
        bottom: {
            padding: '0.75rem'     // Minimal padding - brings name/stats way up
        }
    }

    if (!player) {
        return (
            <div className="flex-1 flex items-center justify-center text-white/20 font-oswald text-4xl">
                Waiting for next player...
            </div>
        )
    }

    const average = Math.round((player.pace + player.shooting + player.passing + player.dribbling + player.defending + player.physical) / 6)

    // Helper to get card background based on year
    const getCardStyle = (year) => {
        const y = String(year).toLowerCase()
        if (y.includes('1')) return { bg: '/cards/year1.png', isCustom: true }
        if (y.includes('2')) return { bg: '/cards/year2.png', isCustom: true }
        return { isCustom: false }
    }

    const cardStyle = player ? getCardStyle(player.year) : { isCustom: false }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full transform scale-75" />

            <div className="relative z-10 w-full max-w-md">
                <div
                    className={`relative w-full aspect-[3/4.2] rounded-2xl shadow-[0_0_60px_rgba(250,221,120,0.2)] overflow-hidden transition-all duration-300 ${cardStyle.isCustom ? 'bg-cover bg-center bg-no-repeat' : 'bg-gradient-to-b from-gray-800 to-black border-2 border-gold/50'}`}
                    style={cardStyle.isCustom ? { backgroundImage: `url(${cardStyle.bg})` } : {}}
                >
                    {/* Card Content */}
                    <div className="h-full w-full relative flex flex-col">

                        {/* Rating and Position - Top Left */}
                        <div className="absolute z-20" style={{ top: CONFIG.rating.top, left: CONFIG.rating.left }}>
                            <div className="text-white font-oswald text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                <div className="font-bold leading-none" style={{ fontSize: CONFIG.rating.fontSize }}>{average}</div>
                                <div className="font-semibold mt-1" style={{ fontSize: CONFIG.rating.positionSize }}>{player.position}</div>
                            </div>
                        </div>

                        {/* Player Photo - Positioned at top */}
                        <div className="absolute" style={{ top: CONFIG.photo.topPadding, left: 0, right: 0, height: CONFIG.photo.height }}>
                            <div className="relative w-full h-full flex items-start justify-center">
                                <img
                                    src={player.photo_url}
                                    alt={player.name}
                                    className="max-w-full max-h-full object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                    style={{ aspectRatio: 'auto' }}
                                />
                            </div>
                        </div>

                        {/* Player Name - Above stats container */}
                        <div className="absolute left-0 right-0 z-20" style={{ bottom: '6.5rem' }}>
                            {/* Gradient background for name readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" style={{ height: '90px', bottom: '-10px' }}></div>

                            {/* Name text */}
                            <h2 className="relative text-white font-oswald font-bold text-center uppercase tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] pb-3" style={{ fontSize: CONFIG.name.fontSize }}>
                                {player.name}
                            </h2>
                        </div>

                        {/* Stats - Below name at fixed position */}
                        <div className="absolute left-0 right-0 z-20 px-4" style={{ bottom: '3rem' }}>
                            {/* Stats - Single Horizontal Row */}
                            <div className="flex justify-center items-center text-white" style={{ gap: CONFIG.stats.gap }}>
                                <div className="flex flex-col items-center" style={{ minWidth: CONFIG.stats.minWidth }}>
                                    <div className="font-oswald uppercase tracking-wider opacity-90" style={{ fontSize: CONFIG.stats.labelSize }}>PAC</div>
                                    <div className="font-bold font-oswald drop-shadow-lg" style={{ fontSize: CONFIG.stats.valueSize }}>{player.pace}</div>
                                </div>
                                <div className="flex flex-col items-center" style={{ minWidth: CONFIG.stats.minWidth }}>
                                    <div className="font-oswald uppercase tracking-wider opacity-90" style={{ fontSize: CONFIG.stats.labelSize }}>SHO</div>
                                    <div className="font-bold font-oswald drop-shadow-lg" style={{ fontSize: CONFIG.stats.valueSize }}>{player.shooting}</div>
                                </div>
                                <div className="flex flex-col items-center" style={{ minWidth: CONFIG.stats.minWidth }}>
                                    <div className="font-oswald uppercase tracking-wider opacity-90" style={{ fontSize: CONFIG.stats.labelSize }}>PAS</div>
                                    <div className="font-bold font-oswald drop-shadow-lg" style={{ fontSize: CONFIG.stats.valueSize }}>{player.passing}</div>
                                </div>
                                <div className="flex flex-col items-center" style={{ minWidth: CONFIG.stats.minWidth }}>
                                    <div className="font-oswald uppercase tracking-wider opacity-90" style={{ fontSize: CONFIG.stats.labelSize }}>DRI</div>
                                    <div className="font-bold font-oswald drop-shadow-lg" style={{ fontSize: CONFIG.stats.valueSize }}>{player.dribbling}</div>
                                </div>
                                <div className="flex flex-col items-center" style={{ minWidth: CONFIG.stats.minWidth }}>
                                    <div className="font-oswald uppercase tracking-wider opacity-90" style={{ fontSize: CONFIG.stats.labelSize }}>DEF</div>
                                    <div className="font-bold font-oswald drop-shadow-lg" style={{ fontSize: CONFIG.stats.valueSize }}>{player.defending}</div>
                                </div>
                                <div className="flex flex-col items-center" style={{ minWidth: CONFIG.stats.minWidth }}>
                                    <div className="font-oswald uppercase tracking-wider opacity-90" style={{ fontSize: CONFIG.stats.labelSize }}>PHY</div>
                                    <div className="font-bold font-oswald drop-shadow-lg" style={{ fontSize: CONFIG.stats.valueSize }}>{player.physical}</div>
                                </div>
                            </div>
                        </div>

                        {/* Sold Stamp */}
                        {isSold && (
                            <motion.div
                                initial={{ opacity: 0, scale: 2, rotate: -30 }}
                                animate={{ opacity: 1, scale: 1, rotate: -15 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                            >
                                <div className="border-8 border-red-600 text-red-600 font-oswald text-8xl font-bold px-8 py-4 uppercase tracking-widest opacity-90 mix-blend-screen transform -rotate-12 border-double bg-black/20 backdrop-blur-sm">
                                    SOLD
                                </div>
                            </motion.div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlayerStage
