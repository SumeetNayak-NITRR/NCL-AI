import React from 'react'
import { motion } from 'framer-motion'

/**
 * PlayerCard - Reusable FIFA-style player card component
 * Can be used in Team page, Admin previews, etc.
 * 
 * @param {Object} player - Player data object
 * @param {boolean} showSoldBadge - Optional sold badge for admin view
 * @param {string} size - Card size: 'small', 'medium', 'large' (default: 'medium')
 */
const PlayerCard = ({ player, showSoldBadge = false, size = 'medium' }) => {
    if (!player) {
        return (
            <div className="flex items-center justify-center text-white/20 font-oswald text-2xl p-8">
                No player data
            </div>
        )
    }

    const average = Math.round((player.pace + player.shooting + player.passing + player.dribbling + player.defending + player.physical) / 6)

    // Size configurations
    const sizeConfig = {
        small: {
            container: 'max-w-xs',
            rating: { top: '1.5rem', left: '1.5rem', fontSize: '2.5rem', positionSize: '1rem' },
            photo: { height: '65%', topPadding: '0rem' },
            name: { fontSize: '1.5rem', bottom: '4rem' },
            stats: { labelSize: '0.75rem', valueSize: '1.25rem', gap: '0.25rem', bottom: '1.5rem' }
        },
        medium: {
            container: 'max-w-md',
            rating: { top: '3rem', left: '3rem', fontSize: '4rem', positionSize: '1.5rem' },
            photo: { height: '70%', topPadding: '-1rem' },
            name: { fontSize: '3rem', bottom: '6.5rem' },
            stats: { labelSize: '1rem', valueSize: '1.875rem', gap: '0.5rem', bottom: '3rem' }
        },
        large: {
            container: 'max-w-lg',
            rating: { top: '4rem', left: '4rem', fontSize: '5rem', positionSize: '2rem' },
            photo: { height: '72%', topPadding: '-1.5rem' },
            name: { fontSize: '4rem', bottom: '8rem' },
            stats: { labelSize: '1.25rem', valueSize: '2.25rem', gap: '0.75rem', bottom: '4rem' }
        }
    }

    const CONFIG = sizeConfig[size] || sizeConfig.medium

    // Helper to extract variant from URL if not in props
    const getVariant = () => {
        if (player.card_variant) return player.card_variant
        if (player.status === 'Alumni') return 'gold'

        if (player.photo_url && player.photo_url.includes('?')) {
            try {
                const params = new URLSearchParams(player.photo_url.split('?')[1])
                return params.get('variant') || 'standard'
            } catch (e) { }
        }
        return 'standard'
    }

    const variant = getVariant()

    const getVariantStyles = (v) => {
        switch (v) {
            case 'gold': return {
                border: 'border-gold/60',
                shadow: 'shadow-[0_0_40px_rgba(255,215,0,0.2)]',
                accent: 'text-gold',
                statsLabel: 'text-gold/80',
                bgGradient: 'bg-gradient-to-b from-black via-black to-gold/20',
                nameGradient: 'from-black via-gold/10 to-transparent'
            }
            case 'silver': return {
                border: 'border-gray-300/60',
                shadow: 'shadow-[0_0_40px_rgba(192,192,192,0.2)]',
                accent: 'text-gray-300',
                statsLabel: 'text-gray-300/80',
                bgGradient: 'bg-gradient-to-b from-black via-black to-gray-300/20',
                nameGradient: 'from-black via-gray-300/10 to-transparent'
            }
            case 'neon': return {
                border: 'border-neon/60',
                shadow: 'shadow-[0_0_40px_rgba(57,255,20,0.2)]',
                accent: 'text-neon',
                statsLabel: 'text-neon/80',
                bgGradient: 'bg-gradient-to-b from-black via-black to-neon/20',
                nameGradient: 'from-black via-neon/10 to-transparent'
            }
            default: return {
                border: 'border-electric-blue/30',
                shadow: 'shadow-[0_0_40px_rgba(0,212,255,0.2)]',
                accent: 'text-electric-blue',
                statsLabel: 'text-electric-blue/80',
                bgGradient: 'bg-gradient-to-b from-dark-navy via-dark-blue to-black',
                nameGradient: 'from-black via-dark-blue/40 to-transparent'
            }
        }
    }

    const variantStyle = getVariantStyles(variant)

    // Helper to get card background based on year (overrides variant background if custom image exists)
    const getCardStyle = (year) => {
        const y = String(year).toLowerCase()
        if (y.includes('1')) return { bg: '/cards/year1.png', isCustom: true }
        if (y.includes('2')) return { bg: '/cards/year2.png', isCustom: true }
        return { isCustom: false }
    }

    const cardStyle = player ? getCardStyle(player.year) : { isCustom: false }

    return (
        <div className="relative z-10 w-full flex justify-center">
            <motion.div
                className={`relative ${CONFIG.container} w-full`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
            >
                <div
                    className={`relative w-full aspect-[3/4.2] rounded-2xl overflow-hidden transition-all duration-300 card-hover ${cardStyle.isCustom
                        ? `bg-cover bg-center bg-no-repeat ${variantStyle.shadow}`
                        : `${variantStyle.bgGradient} border-2 ${variantStyle.border} ${variantStyle.shadow}`
                        }`}
                    style={cardStyle.isCustom ? { backgroundImage: `url(${cardStyle.bg})` } : {}}
                >
                    {/* Animated gradient overlay */}
                    {!cardStyle.isCustom && (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/50 opacity-50" />
                    )}

                    {/* Card Content */}
                    <div className="h-full w-full relative flex flex-col">

                        {/* Rating and Position - Top Left with glow */}
                        <motion.div
                            className="absolute z-20"
                            style={{ top: CONFIG.rating.top, left: CONFIG.rating.left }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="text-white font-bebas text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                                <div className={`font-bold leading-none text-glow ${variantStyle.accent}`} style={{ fontSize: CONFIG.rating.fontSize }}>
                                    {average}
                                </div>
                                <div className={`font-semibold mt-1 ${variantStyle.accent}`} style={{ fontSize: CONFIG.rating.positionSize }}>
                                    {player.position}
                                </div>
                            </div>
                        </motion.div>

                        {/* Player Photo with subtle animation */}
                        <motion.div
                            className="absolute"
                            style={{ top: CONFIG.photo.topPadding, left: 0, right: 0, height: CONFIG.photo.height }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                        >
                            <div className="relative w-full h-full flex items-start justify-center">
                                <img
                                    src={player.photo_url}
                                    alt={player.name}
                                    className="max-w-full max-h-full object-contain drop-shadow-[0_0_30px_rgba(0,212,255,0.3)]"
                                    style={(() => {
                                        // Parse positioning params
                                        let scale = player.image_scale;
                                        let x = player.image_x;
                                        let y = player.image_y;

                                        if ((scale === undefined || x === undefined || y === undefined) && player.photo_url) {
                                            if (player.photo_url.includes('?')) {
                                                try {
                                                    const params = new URLSearchParams(player.photo_url.split('?')[1]);
                                                    if (scale === undefined) scale = parseFloat(params.get('scale'));
                                                    if (x === undefined) x = parseInt(params.get('x'));
                                                    if (y === undefined) y = parseInt(params.get('y'));
                                                } catch (e) { }
                                            }
                                        }

                                        return {
                                            aspectRatio: 'auto',
                                            transform: `scale(${scale || 1}) translate(${x || 0}px, ${y || 0}px)`
                                        }
                                    })()}
                                />
                            </div>
                        </motion.div>

                        {/* Player Name with electric blue accent */}
                        <motion.div
                            className="absolute left-0 right-0 z-20"
                            style={{ bottom: CONFIG.name.bottom }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {/* Gradient background with blue tint */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${variantStyle.nameGradient}`} style={{ height: '90px', bottom: '-10px' }}></div>

                            {/* Name text with glow */}
                            <h2 className="relative text-white font-bebas font-bold text-center uppercase tracking-wide text-glow pb-3" style={{ fontSize: CONFIG.name.fontSize }}>
                                {player.name}
                            </h2>
                        </motion.div>

                        {/* Stats Row with electric blue accents */}
                        <motion.div
                            className="absolute left-0 right-0 z-20 px-4"
                            style={{ bottom: CONFIG.stats.bottom }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex justify-center items-center text-white" style={{ gap: CONFIG.stats.gap }}>
                                {[
                                    { l: 'PAC', v: player.pace },
                                    { l: 'SHO', v: player.shooting },
                                    { l: 'PAS', v: player.passing },
                                    { l: 'DRI', v: player.dribbling },
                                    { l: 'DEF', v: player.defending },
                                    { l: 'PHY', v: player.physical }
                                ].map((stat, i) => (
                                    <div key={i} className="flex flex-col items-center" style={{ minWidth: '40px' }}>
                                        <div className={`font-rajdhani uppercase tracking-wider ${variantStyle.statsLabel}`} style={{ fontSize: CONFIG.stats.labelSize }}>{stat.l}</div>
                                        <div className="font-bold font-bebas drop-shadow-lg" style={{ fontSize: CONFIG.stats.valueSize }}>{stat.v}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Sold Badge (for admin view) */}
                        {showSoldBadge && player.status === 'Sold' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 2, rotate: -30 }}
                                animate={{ opacity: 1, scale: 1, rotate: -15 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                            >
                                <div className="border-8 border-red-600 text-red-600 font-oswald text-6xl font-bold px-6 py-3 uppercase tracking-widest opacity-90 mix-blend-screen transform -rotate-12 border-double bg-black/20 backdrop-blur-sm">
                                    SOLD
                                </div>
                            </motion.div>
                        )}

                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default PlayerCard
