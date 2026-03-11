import React from 'react'
import { motion } from 'framer-motion'
import { User, Activity, Zap } from 'lucide-react'

const AbstractPlayerCard = ({ player, showStats = true, showRating = true }) => {
    // Variant Logic
    const getVariant = () => {
        if (player.card_variant) return player.card_variant
        if (player.status === 'Alumni' || player.year === 'Alumni') return 'standard'

        if (player.photo_url && player.photo_url.includes('?')) {
            try {
                const params = new URLSearchParams(player.photo_url.split('?')[1])
                return params.get('variant') || 'standard'
            } catch { /* ignore */ }
        }
        return 'standard'
    }

    const variant = getVariant()

    // Calculate average rating
    const average = Math.round((player.pace + player.shooting + player.passing + player.dribbling + player.defending + player.physical) / 6)

    const currentStyle = ((v) => {
        switch (v) {
            case 'gold': return {
                border: 'border-gold/60',
                glow: 'shadow-[0_0_40px_rgba(255,215,0,0.2)]',
                text: 'text-gold',
                bg: 'bg-gradient-to-b from-black via-black to-gold/20'
            }
            case 'silver': return {
                border: 'border-gray-300/60',
                glow: 'shadow-[0_0_40px_rgba(192,192,192,0.2)]',
                text: 'text-gray-300',
                bg: 'bg-gradient-to-b from-black via-black to-gray-300/20'
            }
            case 'neon': return {
                border: 'border-neon/60',
                glow: 'shadow-[0_0_40px_rgba(57,255,20,0.2)]',
                text: 'text-neon',
                bg: 'bg-gradient-to-b from-black via-black to-neon/20'
            }
            default: return {
                border: 'border-electric-blue/30',
                glow: 'shadow-[0_0_40px_rgba(0,212,255,0.2)]',
                text: 'text-electric-blue',
                bg: 'bg-gradient-to-b from-dark-navy via-dark-blue to-black'
            }
        }
    })(variant)

    return (
        <motion.div

            className={`group relative w-full aspect-[3/4] overflow-hidden bg-background transition-all duration-500 ${currentStyle.border} ${currentStyle.glow}`}
        >
            {/* Background Texture */}
            <div className={`absolute inset-0 opacity-[0.4] group-hover:opacity-[0.6] transition-opacity ${currentStyle.bg}`}></div>

            {/* Giant Number Background - Controlled by showRating */}
            {showRating && (
                <div className={`absolute -top-10 -right-10 text-[120px] font-bebas select-none leading-none transition-colors duration-500 ${currentStyle.text}`}>
                    {average}
                </div>
            )}

            {/* Status Indicator */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {player.is_captain && (
                    <div className="bg-yellow-500 text-black font-bebas text-sm px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-lg">
                        CPT
                    </div>
                )}
                {player.is_vice_captain && (
                    <div className="bg-gray-300 text-black font-bebas text-sm px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-lg">
                        VC
                    </div>
                )}
            </div>

            {/* Player Image */}
            <div className="absolute inset-0 flex items-end justify-center z-0 overflow-hidden">
                {player.photo_url ? (
                    <img
                        src={player.photo_url}
                        alt={player.name}
                        className="h-[95%] w-auto object-contain drop-shadow-xl transition-all duration-700 filter grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110"
                        style={{
                            transform: `scale(${player.image_scale || 1}) translate(${player.image_x || 0}px, ${player.image_y || 0}px)`,
                            transformOrigin: 'bottom center'
                        }}
                        loading="lazy"
                    />
                ) : (
                    <User className="w-1/2 h-1/2 text-white/5 mb-10" />
                )}
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-bebas text-3xl text-white uppercase tracking-tighter leading-none mb-1 drop-shadow-md">
                        {player.name}
                    </h3>
                    <p className="font-rajdhani text-xs tracking-[0.2em] text-laser-blue uppercase mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {player.position}
                        {player.branch && ` • ${player.branch}`}
                        {player.year && ` • ${player.year}`}
                    </p>

                    {/* Minimal Stats Grid - Only if stats enabled */}
                    {showStats && (
                        <div className="grid grid-cols-3 gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 border-t border-white/10 pt-4">
                            <div className="text-center">
                                <span className="block text-xs font-rajdhani text-white/60">PAC</span>
                                <span className="block font-bebas text-white">{player.pace}</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-xs font-rajdhani text-white/60">SHO</span>
                                <span className="block font-bebas text-white">{player.shooting}</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-xs font-rajdhani text-white/60">PAS</span>
                                <span className="block font-bebas text-white">{player.passing}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sold Overlay */}
            {
                player.status === 'Sold' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="font-inter font-bold text-signal-red tracking-widest border border-signal-red px-4 py-2 uppercase text-xs rotate-[-15deg]">
                            Sold Out
                        </span>
                    </div>
                )
            }
            {/* Interaction Overlay - Darkens card until interaction */}
            <div className="absolute inset-0 bg-black/60 group-hover:bg-transparent group-active:bg-transparent transition-colors duration-500 z-30 pointer-events-none"></div>

        </motion.div>
    )
}

export default AbstractPlayerCard

