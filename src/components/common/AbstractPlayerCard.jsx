import React from 'react'
import { motion } from 'framer-motion'
import { User, Activity, Zap } from 'lucide-react'

const AbstractPlayerCard = ({ player }) => {
    // Parse variant from player object or URL params
    const getVariant = () => {
        if (player.card_variant) return player.card_variant
        if (player.status === 'Alumni') return 'gold' // Legacy support

        if (player.photo_url && player.photo_url.includes('?')) {
            try {
                const params = new URLSearchParams(player.photo_url.split('?')[1])
                const v = params.get('variant')
                if (v) return v
            } catch (e) { }
        }
        return 'standard'
    }

    const variant = getVariant()

    // Calculate average rating
    const average = Math.round((player.pace + player.shooting + player.passing + player.dribbling + player.defending + player.physical) / 6)

    // Variant Styles
    const styles = {
        standard: {
            border: 'border-white/5 hover:border-white/20',
            bg: '',
            text: 'text-white/10 group-hover:text-white/20',
            accent: 'text-laser-blue',
            glow: ''
        },
        gold: {
            border: 'border-gold/40 hover:border-gold',
            bg: 'bg-gold/5',
            text: 'text-gold/10 group-hover:text-gold/20',
            accent: 'text-gold',
            glow: 'shadow-[0_0_15px_rgba(255,215,0,0.1)]'
        },
        silver: {
            border: 'border-gray-400/40 hover:border-gray-300',
            bg: 'bg-white/5',
            text: 'text-gray-400/10 group-hover:text-gray-300/20',
            accent: 'text-gray-300',
            glow: 'shadow-[0_0_15px_rgba(192,192,192,0.1)]'
        },
        neon: {
            border: 'border-neon/40 hover:border-neon',
            bg: 'bg-neon/5',
            text: 'text-neon/10 group-hover:text-neon/20',
            accent: 'text-neon',
            glow: 'shadow-[0_0_15px_rgba(57,255,20,0.1)]'
        }
    }

    const currentStyle = styles[variant] || styles.standard

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className={`group relative w-full aspect-[3/4] overflow-hidden bg-background transition-all duration-500 ${currentStyle.border} ${currentStyle.glow}`}
        >
            {/* Background Texture */}
            <div className={`absolute inset-0 bg-noise opacity-[0.05] group-hover:opacity-[0.1] transition-opacity ${currentStyle.bg}`}></div>

            {/* Giant Number Background */}
            <div className={`absolute -top-10 -right-10 text-[120px] font-bebas select-none leading-none transition-colors duration-500 ${currentStyle.text}`}>
                {average}
            </div>

            {/* Status Indicator */}
            <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${player.status === 'Sold' ? 'bg-signal-red animate-pulse' :
                player.status === 'Ready' ? 'bg-laser-blue' :
                    variant === 'gold' ? 'bg-gold shadow-[0_0_10px_gold]' : 'bg-concrete'
                }`}></div>

            {/* Player Image - Cutout Style */}
            <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
                {player.photo_url ? (
                    <img
                        src={player.photo_url}
                        alt={player.name}
                        style={(() => {
                            let scale = player.image_scale;
                            let x = player.image_x;
                            let y = player.image_y;

                            // Fallback to URL params if not in player object
                            if ((scale === undefined || x === undefined || y === undefined) && player.photo_url) {
                                try {
                                    if (player.photo_url.includes('?')) {
                                        const params = new URLSearchParams(player.photo_url.split('?')[1]);
                                        if (scale === undefined) scale = parseFloat(params.get('scale'));
                                        if (x === undefined) x = parseInt(params.get('x'));
                                        if (y === undefined) y = parseInt(params.get('y'));
                                    }
                                } catch (e) { }
                            }

                            return {
                                transform: `scale(${scale || 1}) translate(${x || 0}px, ${y || 0}px)`
                            }
                        })()}
                        className="w-[90%] h-[80%] object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-[80%] flex items-center justify-center bg-white/5">
                        <User size={64} className="text-white/40" />
                    </div>
                )}
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-bebas text-3xl text-white uppercase tracking-tighter leading-none mb-1 mix-blend-difference">
                        {player.name}
                    </h3>
                    <p className="font-rajdhani text-xs tracking-[0.2em] text-laser-blue uppercase mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {player.position} • {player.year}
                    </p>

                    {/* Minimal Stats Grid */}
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
                </div>
            </div>

            {/* Sold Overlay */}
            {player.status === 'Sold' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-inter font-bold text-signal-red tracking-widest border border-signal-red px-4 py-2 uppercase text-xs rotate-[-15deg]">
                        Sold Out
                    </span>
                </div>
            )}
        </motion.div>
    )
}

export default AbstractPlayerCard
