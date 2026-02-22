import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { CARD_LAYOUT_DEFAULTS } from '../../config/cardLayout'

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
    const variant = useMemo(() => {
        if (player.card_variant) return player.card_variant
        if (player.status === 'Alumni' || player.year === 'Alumni') return 'standard'

        if (player.photo_url && player.photo_url.includes('?')) {
            try {
                const params = new URLSearchParams(player.photo_url.split('?')[1])
                return params.get('variant') || 'standard'
            } catch (e) { }
        }
        return 'standard'
    }, [player.card_variant, player.status, player.year, player.photo_url])

    const getVariantStyles = (v) => {
        switch (v) {
            case 'gold': return {
                border: 'border-gold/60',
                shadow: 'shadow-[0_0_40px_rgba(255,215,0,0.2)]',
                accent: 'text-[#3E2723]', // Darker Bronze/Brown for better contrast and tone
                statsLabel: 'text-[#5D4037]', // Slightly lighter brown for labels
                bgGradient: 'bg-gradient-to-b from-white via-[#FDF5E6] to-[#FFD700]/20', // Cleaner marble-esque gold
                nameGradient: 'from-transparent via-transparent to-transparent',
                textColor: '#3E2723',
                textGlow: 'none'
            }
            case 'silver': return {
                border: 'border-gray-300/60',
                shadow: 'shadow-[0_0_40px_rgba(192,192,192,0.2)]',
                accent: 'text-gray-900', // Dark text
                statsLabel: 'text-gray-700', // Darker gray for labels
                bgGradient: 'bg-gradient-to-b from-white via-gray-100 to-gray-300/20', // Light background
                nameGradient: 'from-transparent via-transparent to-transparent',
                textColor: '#1a1a1a', // Almost black
                textGlow: 'none' // No glow for dark text
            }
            case 'brown': return {
                border: 'border-[#54462B]/60',
                shadow: 'shadow-[0_0_40px_rgba(84,70,43,0.2)]',
                accent: 'text-[#54462B]',
                statsLabel: 'text-[#54462B]/80',
                bgGradient: 'bg-gradient-to-b from-white via-[#FDF5E6] to-[#54462B]/10',
                nameGradient: 'from-transparent via-transparent to-transparent',
                textColor: '#54462B', // The requested color
                textGlow: 'none'
            }
            case 'neon': return {
                border: 'border-neon/60',
                shadow: 'shadow-[0_0_40px_rgba(57,255,20,0.2)]',
                accent: 'text-neon',
                statsLabel: 'text-neon/80',
                bgGradient: 'bg-gradient-to-b from-black via-black to-neon/20',
                nameGradient: 'from-transparent via-transparent to-transparent',
                textColor: '#ffffff',
                textGlow: 'text-glow'
            }
            default: return { // Standard
                border: 'border-electric-blue/30',
                shadow: 'shadow-[0_0_40px_rgba(0,212,255,0.2)]',
                accent: 'text-white', // Consistent white
                statsLabel: 'text-electric-blue/80',
                bgGradient: 'bg-gradient-to-b from-dark-navy via-dark-blue to-black',
                nameGradient: 'from-transparent via-transparent to-transparent',
                textColor: '#ffffff',
                textGlow: 'text-glow'
            }
        }
    }

    const variantStyle = getVariantStyles(variant)

    // Font Color Override Logic
    const appliedFontColor = useMemo(() => {
        const getHexFromColorName = (colorName) => {
            switch (colorName) {
                case 'laser-blue': return '#00d4ff'
                case 'neon': return '#39ff14'
                case 'gold': return '#FFD700'
                case 'black': return '#000000'
                case 'white': return '#ffffff'
                default: return variantStyle.textColor // unknown color, fallback 
            }
        }

        // Explicit selection from editor
        if (player.font_color) {
            return getHexFromColorName(player.font_color)
        }

        // URL Persistence
        if (player.photo_url && player.photo_url.includes('?')) {
            try {
                const params = new URLSearchParams(player.photo_url.split('?')[1])
                if (params.get('font_color')) {
                    return getHexFromColorName(params.get('font_color'))
                }
            } catch (e) { }
        }

        // Fallback to variant default
        return variantStyle.textColor
    }, [player.font_color, player.photo_url, variantStyle.textColor])

    // Helper to get card background based on year
    const getCardStyle = (year) => {
        const y = String(year) // Case sensitive matching for 'Alumni', 'M.Tech'

        if (y.includes('1')) return { bg: '/cards/year1.png', isCustom: true }
        if (y.includes('2')) return { bg: '/cards/year2.png', isCustom: true }
        if (y.includes('3')) return { bg: '/cards/year3.png', isCustom: true }
        if (y.includes('4')) return { bg: '/cards/year4.png', isCustom: true }
        if (y.includes('5')) return { bg: '/cards/year5.png', isCustom: true }
        if (y.includes('Alumni')) return { bg: '/cards/Alumni.png', isCustom: true }
        if (y.includes('M.Tech') || y.includes('Masters')) return { bg: '/cards/year5.png', isCustom: true }
        if (y.includes('PhD')) return { bg: '/cards/year5.png', isCustom: true }

        return { isCustom: false }
    }

    const cardStyle = player ? getCardStyle(player.year) : { isCustom: false }

    // Image positioning logic
    const imageStyle = useMemo(() => {
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
    }, [player.image_scale, player.image_x, player.image_y, player.photo_url])

    // Layout positioning logic
    const layout = useMemo(() => {
        let currentLayout = {
            name_x: CARD_LAYOUT_DEFAULTS.NAME_X,
            name_y: CARD_LAYOUT_DEFAULTS.NAME_Y,
            name_size: CARD_LAYOUT_DEFAULTS.NAME_SIZE,
            stats_x: CARD_LAYOUT_DEFAULTS.STATS_X,
            stats_y: CARD_LAYOUT_DEFAULTS.STATS_Y,
            rating_x: CARD_LAYOUT_DEFAULTS.RATING_X,
            rating_y: CARD_LAYOUT_DEFAULTS.RATING_Y,
            position_x: CARD_LAYOUT_DEFAULTS.POSITION_X,
            position_y: CARD_LAYOUT_DEFAULTS.POSITION_Y,
            position_size: CARD_LAYOUT_DEFAULTS.POSITION_SIZE,
            branch_x: CARD_LAYOUT_DEFAULTS.BRANCH_X,
            branch_y: CARD_LAYOUT_DEFAULTS.BRANCH_Y,
            branch_size: CARD_LAYOUT_DEFAULTS.BRANCH_SIZE,
        };

        // 1. Parse from URL (Persistence source)
        if (player.photo_url && player.photo_url.includes('?')) {
            try {
                const p = new URLSearchParams(player.photo_url.split('?')[1]);
                if (p.get('name_x')) currentLayout.name_x = parseInt(p.get('name_x'));
                if (p.get('name_y')) currentLayout.name_y = parseInt(p.get('name_y'));
                if (p.get('name_size')) currentLayout.name_size = parseInt(p.get('name_size'));
                if (p.get('stats_x')) currentLayout.stats_x = parseInt(p.get('stats_x'));
                if (p.get('stats_y')) currentLayout.stats_y = parseInt(p.get('stats_y'));
                if (p.get('rating_x')) currentLayout.rating_x = parseInt(p.get('rating_x'));
                if (p.get('rating_y')) currentLayout.rating_y = parseInt(p.get('rating_y'));
                if (p.get('position_x')) currentLayout.position_x = parseInt(p.get('position_x'));
                if (p.get('position_y')) currentLayout.position_y = parseInt(p.get('position_y'));
                if (p.get('position_size')) currentLayout.position_size = parseInt(p.get('position_size'));
                if (p.get('branch_x')) currentLayout.branch_x = parseInt(p.get('branch_x'));
                if (p.get('branch_y')) currentLayout.branch_y = parseInt(p.get('branch_y'));
                if (p.get('branch_size')) currentLayout.branch_size = parseInt(p.get('branch_size'));
            } catch (e) { }
        }

        // 2. Override with direct props (Edit Mode source)
        if (player.name_x !== undefined) currentLayout.name_x = player.name_x;
        if (player.name_y !== undefined) currentLayout.name_y = player.name_y;
        if (player.name_size !== undefined) currentLayout.name_size = player.name_size;
        if (player.stats_x !== undefined) currentLayout.stats_x = player.stats_x;
        if (player.stats_y !== undefined) currentLayout.stats_y = player.stats_y;
        if (player.rating_x !== undefined) currentLayout.rating_x = player.rating_x;
        if (player.rating_y !== undefined) currentLayout.rating_y = player.rating_y;
        if (player.position_x !== undefined) currentLayout.position_x = player.position_x;
        if (player.position_y !== undefined) currentLayout.position_y = player.position_y;
        if (player.position_size !== undefined) currentLayout.position_size = player.position_size;
        if (player.branch_x !== undefined) currentLayout.branch_x = player.branch_x;
        if (player.branch_y !== undefined) currentLayout.branch_y = player.branch_y;
        if (player.branch_size !== undefined) currentLayout.branch_size = player.branch_size;

        return currentLayout;
    }, [
        player.photo_url, player.name_x, player.name_y, player.name_size,
        player.stats_x, player.stats_y, player.rating_x, player.rating_y,
        player.position_x, player.position_y, player.position_size,
        player.branch_x, player.branch_y, player.branch_size
    ])

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
                player-card-mobile
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

            {/* 1. RATING (Top Left) */}
            <Item
                style={{
                    position: 'absolute',
                    top: '50px',
                    left: '40px',
                    width: '100px',
                    textAlign: 'center',
                    zIndex: 20,
                    transform: `translate(${layout.rating_x}px, ${layout.rating_y}px)`
                }}
                initial={animated ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={animated ? { delay: 0.2 } : { duration: 0 }}
            >
                <div
                    className={`font-bebas font-bold leading-none ${variantStyle.textGlow} ${variantStyle.accent}`}
                    style={{
                        fontSize: '68px',
                        lineHeight: '0.9',
                        color: appliedFontColor,
                        textShadow: (variant === 'gold' || variant === 'brown' || variant === 'silver') ? 'none' : '0 4px 12px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.6)'
                    }}
                >
                    {average}
                </div>
            </Item>

            {/* 2. POSITION (Below Rating) */}
            <Item
                style={{
                    position: 'absolute',
                    top: '115px', // Approx below rating
                    left: '40px',
                    width: '100px',
                    textAlign: 'center',
                    zIndex: 20,
                    transform: `translate(${layout.position_x}px, ${layout.position_y}px)`
                }}
                initial={animated ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={animated ? { delay: 0.25 } : { duration: 0 }}
            >
                <div
                    className={`font-bebas font-semibold ${variantStyle.accent}`}
                    style={{
                        fontSize: `${layout.position_size}px`,
                        color: appliedFontColor,
                        lineHeight: 1,
                        textShadow: (variant === 'gold' || variant === 'brown' || variant === 'silver') ? 'none' : '0 4px 12px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.6)'
                    }}
                >
                    {player.position}
                </div>
            </Item>

            {/* 3. BRANCH (Below Position) */}
            {player.branch && (
                <Item
                    style={{
                        position: 'absolute',
                        top: '145px', // Approx below position
                        left: '40px',
                        width: '100px',
                        textAlign: 'center',
                        zIndex: 20,
                        transform: `translate(${layout.branch_x}px, ${layout.branch_y}px)`
                    }}
                    initial={animated ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={animated ? { delay: 0.3 } : { duration: 0 }}
                >
                    <div
                        className={`font-bebas font-medium ${variantStyle.accent}`}
                        style={{
                            fontSize: `${layout.branch_size}px`, color: appliedFontColor,
                            textShadow: (variant === 'gold' || variant === 'brown' || variant === 'silver') ? 'none' : '0 4px 12px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.6)'
                        }}
                    >
                        {player.branch}
                    </div>
                </Item>
            )}

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
                    loading="lazy"
                    className={`max-w-none max-h-none object-contain drop-shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-700 ${animated ? 'scale-105' : ''}`}
                    style={{
                        height: '100%',
                        width: 'auto',
                        ...imageStyle
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
                    textAlign: 'center',
                    transform: `translate(${layout.name_x}px, ${layout.name_y}px)`
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
                    className={`font-bebas font-bold uppercase tracking-wide ${variantStyle.textGlow}`}
                    style={{
                        fontSize: `${layout.name_size}px`,
                        lineHeight: '1',
                        margin: 0,
                        padding: '0 10px',
                        textShadow: (variant === 'gold' || variant === 'brown' || variant === 'silver') ? 'none' : '0 4px 12px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.6)',
                        color: appliedFontColor
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
                    left: '50%', // Center horizontally
                    transform: `translate(calc(-50% + ${layout.stats_x}px), ${layout.stats_y}px)`, // Combine centering with offset
                    width: 'auto', // Allow width to fit content + padding
                    zIndex: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Lighter and more transparent
                    borderRadius: '12px', // Rounded corners
                    padding: '8px 12px', // Padding around content
                    backdropFilter: 'blur(2px)', // Reduced blur for lighter feel
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', // Softer shadow
                    border: '1px solid rgba(255, 255, 255, 0.1)' // Subtle border for definition
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
                            className={`font-rajdhani font-bold uppercase tracking-wider ${variantStyle.statsLabel}`}
                            style={{ fontSize: '15px', lineHeight: '1', marginBottom: '4px', color: appliedFontColor }}
                        >
                            {stat.l}
                        </div>
                        <div
                            className="font-bold font-bebas"
                            style={{ fontSize: '32px', lineHeight: '1', color: appliedFontColor }}
                        >
                            {stat.v}
                        </div>
                    </div>
                ))}
            </Item>

            {/* 5. SOLD BADGE */}
            {
                showSoldBadge && player.status === 'Sold' && (
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
                )
            }

        </div >
    )
}

export default PlayerCardBase
