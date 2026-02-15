import React from 'react'
import { motion } from 'framer-motion'

/**
 * PlayerCardBase - The single source of truth for Player Card layout.
 * Fixed dimensions: 400px x 600px.
 * Uses absolute pixel positioning for everything.
 * NO external scaling or percentage-based positioning allowed internally.
 */
const PlayerCardBase = ({ player, showSoldBadge = false, animated = false }) => {
    if (!player) return null

    // Fixed Dimensions
    const CARD_WIDTH = 400
    const CARD_HEIGHT = 600

    // Component Wrapper (Motion or Div)
    const Wrapper = animated ? motion.div : 'div'
    const Item = animated ? motion.div : 'div'

    // Calculate average rating
    const average = Math.round((player.pace + player.shooting + player.passing + player.dribbling + player.defending + player.physical) / 6)

    // Variant Logic
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

    // Helper to get card background based on year
    const getCardStyle = (year) => {
        const y = String(year).toLowerCase()
        if (y.includes('1')) return { bg: '/cards/year1.png', isCustom: true }
        if (y.includes('2')) return { bg: '/cards/year2.png', isCustom: true }
        return { isCustom: false }
    }

    const cardStyle = player ? getCardStyle(player.year) : { isCustom: false }

    // Image positioning logic
    const getImageStyle = () => {
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
            transform: `scale(${scale || 1}) translate(${x || 0}px, ${y || 0}px)`,
            transformOrigin: '50% 100%' // Pivot from bottom center
        }
    }

    return (
        <div
            style={{
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
                position: 'relative',
                borderRadius: '24px',
                backgroundImage: cardStyle.isCustom ? `url(${cardStyle.bg})` : undefined
            }}
            className={`
                overflow-hidden
                ${cardStyle.isCustom
                    ? `bg-cover bg-center bg-no-repeat`
                    : `${variantStyle.bgGradient} border-[3px] ${variantStyle.border}`
                }
                box-border
                mx-auto
                select-none
                shadow-2xl
            `}
        >
            {/* Main Background/Overlay */}
            {!cardStyle.isCustom && (
                <div
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    className="bg-gradient-to-br from-white/5 via-transparent to-black/50 opacity-50 pointer-events-none"
                />
            )}

            {/* --- LAYOUT CONTENT --- */}

            {/* 1. RATING & POSITION (Top Left) */}
            <Item
                style={{
                    position: 'absolute',
                    top: '50px',
                    left: '40px',
                    width: '100px',
                    textAlign: 'center',
                    zIndex: 20
                }}
                initial={animated ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={animated ? { delay: 0.2 } : { duration: 0 }}
            >
                <div
                    className={`font-bebas font-bold leading-none text-glow ${variantStyle.accent}`}
                    style={{ fontSize: '68px', lineHeight: '0.9', color: '#ffffff' }}
                >
                    {average}
                </div>
                <div
                    className={`font-bebas font-semibold ${variantStyle.accent}`}
                    style={{ fontSize: '24px', marginTop: '4px', color: '#ffffff' }}
                >
                    {player.position}
                </div>
            </Item>

            {/* 2. PLAYER PHOTO */}
            <Item
                style={{
                    position: 'absolute',
                    top: '40px',
                    left: '0px',
                    width: '400px',
                    height: '460px', // Extending down to cover name area logic
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                }}
                initial={animated ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={animated ? { delay: 0.1, duration: 0.5 } : { duration: 0 }}
            >
                <img
                    src={player.photo_url}
                    alt={player.name}
                    crossOrigin="anonymous"
                    className="max-w-none max-h-none object-contain drop-shadow-[0_0_30px_rgba(0,212,255,0.3)]"
                    style={{
                        height: '100%',
                        width: 'auto',
                        ...getImageStyle()
                    }}
                />
            </Item>

            {/* 3. NAME SECTION (Bottom Area) */}
            <Item
                style={{
                    position: 'absolute',
                    top: '438px',
                    left: 0,
                    width: '400px',
                    zIndex: 20,
                    textAlign: 'center'
                }}
                initial={animated ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={animated ? { delay: 0.3 } : { duration: 0 }}
            >
                {/* Gradient background behind name for readability */}
                <div
                    className={`absolute inset-0 bg-gradient-to-t ${variantStyle.nameGradient}`}
                    style={{ height: '140px', bottom: '-30px', zIndex: -1 }}
                ></div>

                <h2
                    className="font-bebas font-bold uppercase tracking-wide text-glow"
                    style={{
                        fontSize: '52px',
                        lineHeight: '1',
                        margin: 0,
                        padding: '0 10px',
                        textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                        color: '#ffffff'
                    }}
                >
                    {player.name}
                </h2>
            </Item>

            {/* 4. STATS ROW */}
            <Item
                style={{
                    position: 'absolute',
                    top: '510px',
                    left: 0,
                    width: '400px',
                    zIndex: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px'
                }}
                initial={animated ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={animated ? { delay: 0.4 } : { duration: 0 }}
            >
                {[
                    { l: 'PAC', v: player.pace },
                    { l: 'SHO', v: player.shooting },
                    { l: 'PAS', v: player.passing },
                    { l: 'DRI', v: player.dribbling },
                    { l: 'DEF', v: player.defending },
                    { l: 'PHY', v: player.physical }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center" style={{ width: '45px' }}>
                        <div
                            className={`font-rajdhani uppercase tracking-wider ${variantStyle.statsLabel}`}
                            style={{ fontSize: '15px', lineHeight: '1', marginBottom: '4px', color: '#ffffff' }}
                        >
                            {stat.l}
                        </div>
                        <div
                            className="font-bold font-bebas drop-shadow-lg"
                            style={{ fontSize: '32px', lineHeight: '1', color: '#ffffff' }}
                        >
                            {stat.v}
                        </div>
                    </div>
                ))}
            </Item>

            {/* 5. SOLD BADGE */}
            {showSoldBadge && player.status === 'Sold' && (
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(-15deg)',
                        zIndex: 30,
                        pointerEvents: 'none'
                    }}
                    initial={animated ? { opacity: 0, scale: 2, rotate: -30 } : { opacity: 1, scale: 1, rotate: -15 }}
                    animate={{ opacity: 1, scale: 1, rotate: -15 }}
                >
                    <div className="border-8 border-red-600 text-red-600 font-oswald text-6xl font-bold px-6 py-3 uppercase tracking-widest opacity-90 mix-blend-screen border-double bg-black/20 backdrop-blur-sm">
                        SOLD
                    </div>
                </motion.div>
            )}

        </div>
    )
}

export default PlayerCardBase
