import { motion } from 'framer-motion'

/* ---------------------------------------------------------------
   HypeTicker — a marquee-style hype bar with NCL stats.
   Pure CSS animation via @keyframes (no JS scroll events).
--------------------------------------------------------------- */

const stats = [
    { value: '6', label: 'Teams' },
    { value: '6', label: 'Captains' },
    { value: '60+', label: 'Players' },
    { value: '1', label: 'Trophy' },
    { value: '∞', label: 'Rivalry' },
    { value: 'NCL', label: 'Season 2K26' },
]

// Separator between items
const Dot = () => (
    <span style={{
        display: 'inline-block',
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        backgroundColor: '#0022ff',
        margin: '0 32px',
        verticalAlign: 'middle',
        flexShrink: 0,
    }} />
)

const TickerItem = ({ stat }) => (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px', whiteSpace: 'nowrap', flexShrink: 0 }}>
        <span style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(1rem, 2vw, 1.4rem)',
            color: '#ffffff',
            letterSpacing: '0.05em',
        }}>
            {stat.value}
        </span>
        <span style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)',
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
        }}>
            {stat.label}
        </span>
    </span>
)

const HypeTicker = () => {
    // Double the array so the seamless loop works
    const doubled = [...stats, ...stats, ...stats]

    return (
        <div style={{
            backgroundColor: '#000',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
            padding: '14px 0',
            position: 'relative',
        }}>
            {/* Left + right edge fades */}
            <div style={{
                position: 'absolute', inset: '0 auto 0 0',
                width: '80px',
                background: 'linear-gradient(to right, #000, transparent)',
                zIndex: 2, pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', inset: '0 0 0 auto',
                width: '80px',
                background: 'linear-gradient(to left, #000, transparent)',
                zIndex: 2, pointerEvents: 'none',
            }} />

            {/* Scrolling track */}
            <motion.div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    width: 'max-content',
                }}
                animate={{ x: ['0%', '-33.33%'] }}
                transition={{
                    duration: 28,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatType: 'loop',
                }}
            >
                {doubled.map((stat, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                        <TickerItem stat={stat} />
                        <Dot />
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

export default HypeTicker
