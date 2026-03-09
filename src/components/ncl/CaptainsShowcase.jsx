import { useState, useRef, useEffect } from 'react'

/* ---------------------------------------------------------------
   CaptainsShowcase — responsive accordion.

   Desktop (≥768px): horizontal panels, hover to expand.
   Mobile (<768px):  vertical stack, tap to expand.

   All transitions: Framer Motion.
--------------------------------------------------------------- */
import { motion, AnimatePresence } from 'framer-motion'

const teams = [
    {
        id: 1, name: 'TEAM NAME', captain: 'SANJIV BHOI', role: 'Captain',
        color: '#7f1d1d', accentColor: '#fca5a5',
        image: '/assests/captain/sanjiv.webp', photoX: '50%', photoY: '10%',
    },
    {
        id: 2, name: 'TEAM NAME', captain: 'AYUSH SINGH', role: 'Captain',
        color: '#0c4a6e', accentColor: '#7dd3fc',
        image: '/assests/captain/ayush.webp', photoX: '50%', photoY: '10%',
    },
    {
        id: 3, name: 'HARAMBALL FC', captain: 'PIYUSH GUPTA', role: 'Captain',
        color: '#713f12', accentColor: '#fde047',
        image: '/assests/captain/piyush.webp', photoX: '50%', photoY: '10%',
    },
    {
        id: 4, name: 'VETERAN STRIKERS', captain: 'ABHYUDAYA Choudhary', role: 'Captain',
        color: '#14532d', accentColor: '#86efac',
        image: '/assests/captain/abhyudaya2.jpeg', photoX: '50%', photoY: '10%',
    },
    {
        id: 5, name: 'FC BIHARCELONA', captain: 'Siddharth JHA', role: 'Captain',
        color: '#3b0764', accentColor: '#d8b4fe',
        image: '/assests/captain/sid.jpeg', photoX: '50%', photoY: '10%',
    },
    {
        id: 6, name: 'TEAM NAME', captain: 'JUGAL MEHTA', role: 'Captain',
        color: '#164e63', accentColor: '#67e8f9',
        image: '/assests/captain/jugal.webp', photoX: '50%', photoY: '10%',
    },
]

// ── Desktop card (horizontal accordion) ──────────────────────
const DesktopCard = ({ t, i, isActive, enter, leave, setActive }) => (
    <div
        onMouseEnter={() => enter(i)}
        onMouseLeave={leave}
        onClick={() => setActive(i)}
        style={{
            flex: isActive ? '2.5 0 0%' : '1 0 0%',
            transition: 'flex 0.5s cubic-bezier(0.4,0,0.2,1)',
            willChange: 'flex',
            backgroundColor: t.color,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
    >
        {/* Top color bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '96px', backgroundColor: t.color, zIndex: 30 }} />

        {/* Side borders (active only) */}
        {['left', 'right'].map(side => (
            <div key={side} style={{
                position: 'absolute', top: '96px', bottom: 0, [side]: 0,
                width: '8px', backgroundColor: t.color, zIndex: 30,
                opacity: isActive ? 0.9 : 0,
                transition: 'opacity 0.4s ease',
            }} />
        ))}

        {/* Photo */}
        <img src={t.image} alt={t.captain} decoding="async"
            style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: `${t.photoX} ${t.photoY}`,
                opacity: isActive ? 0.9 : 0.5,
                filter: isActive ? 'none' : 'grayscale(70%)',
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
                transition: 'opacity 0.4s ease, transform 0.5s ease',
                willChange: 'transform, opacity',
            }}
        />

        {/* Bottom gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.15) 45%, transparent 70%)' }} />

        {/* Inactive: vertical number */}
        <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%) rotate(-90deg)',
            whiteSpace: 'nowrap', pointerEvents: 'none',
            opacity: isActive ? 0 : 1, transition: 'opacity 0.3s ease',
        }}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '3.5rem', letterSpacing: '0.15em', color: 'white', textShadow: `0 0 24px ${t.accentColor}80`, opacity: 0.5 }}>
                #{String(i + 1)}
            </span>
        </div>

        {/* Active bottom text */}
        <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 2.5rem',
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.35s ease 0.08s, transform 0.4s ease 0.08s',
            pointerEvents: 'none',
        }}>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>
                {t.role}
            </p>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 4vw, 4.5rem)', textTransform: 'uppercase', color: '#fff', lineHeight: 0.9, marginBottom: '0.5rem' }}>
                {t.captain}
            </h2>
            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: t.accentColor, textShadow: `0 0 16px ${t.accentColor}70` }}>
                {t.name}
            </h3>
        </div>

        {/* Accent glow border */}
        <div style={{ position: 'absolute', inset: 0, boxShadow: isActive ? `inset 0 0 0 1px ${t.accentColor}30` : 'none', transition: 'box-shadow 0.4s ease', pointerEvents: 'none' }} />
    </div>
)

// ── Mobile carousel (swipe / dot nav) ────────────────────────
// Perf: only transform:translateX is animated — fully GPU-composited,
// zero layout cost. No height animation, no willChange on multiple nodes.
const MobileCarousel = ({ activeIdx, setActiveIdx }) => {
    const touchX = useRef(null)
    const autoTimer = useRef(null)
    const total = teams.length

    const go = (idx) => {
        const next = (idx + total) % total
        setActiveIdx(next)
    }

    // Auto-advance every 4 s
    const resetAuto = () => {
        clearInterval(autoTimer.current)
        autoTimer.current = setInterval(() => setActiveIdx(p => (p + 1) % total), 4000)
    }

    useEffect(() => {
        resetAuto()
        return () => clearInterval(autoTimer.current)
    }, []) // eslint-disable-line

    const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
    const onTouchEnd = (e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (Math.abs(dx) < 40) return          // ignore tiny taps
        resetAuto()
        go(dx < 0 ? activeIdx + 1 : activeIdx - 1)
    }

    const t = teams[activeIdx]

    return (
        <section
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{
                position: 'relative',
                width: '100%',
                height: '100svh',
                overflow: 'hidden',
                backgroundColor: '#000',
                userSelect: 'none',
                WebkitUserSelect: 'none',
            }}
        >
            {/* 🔴 PRELOAD ALL IMAGES: This guarantees instant slide transitions */}
            <div style={{ display: 'none' }}>
                {teams.map(team => (
                    <img key={team.id} src={team.image} alt="preload logger" loading="eager" decoding="sync" />
                ))}
            </div>

            {/* Single card view with crossfade transition */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: t.color,
                    }}
                >
                    {/* Photo */}
                    <img
                        src={t.image}
                        alt={t.captain}
                        loading="eager"
                        decoding="sync"
                        style={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover',
                            objectPosition: `${t.photoX} ${t.photoY}`,
                            opacity: 0.85,
                        }}
                    />

                    {/* Bottom gradient */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.1) 50%, transparent 75%)',
                        pointerEvents: 'none',
                    }} />

                    {/* Top gradient (subtle) */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 30%)',
                        pointerEvents: 'none',
                    }} />

                    {/* Accent bar — bottom left */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0,
                        width: '4px', height: '55%',
                        background: `linear-gradient(to top, ${t.accentColor}, transparent)`,
                    }} />

                    {/* Ghost number — top right */}
                    <div style={{
                        position: 'absolute', top: '22px', right: '20px',
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '4rem',
                        color: 'white',
                        opacity: 0.12,
                        lineHeight: 1,
                        pointerEvents: 'none',
                    }}>
                        #{String(t.id).padStart(2, '0')}
                    </div>

                    {/* Caption */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '0 24px 88px',
                    }}>
                        <p style={{
                            fontFamily: 'Rajdhani, sans-serif',
                            fontSize: '0.65rem',
                            letterSpacing: '0.4em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.55)',
                            marginBottom: '6px',
                        }}>
                            {t.role}
                        </p>
                        <h2 style={{
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: 'clamp(3rem, 12vw, 5rem)',
                            textTransform: 'uppercase',
                            color: '#fff',
                            lineHeight: 0.9,
                            marginBottom: '10px',
                        }}>
                            {t.captain}
                        </h2>
                        <p style={{
                            fontFamily: 'Rajdhani, sans-serif',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.25em',
                            color: t.accentColor,
                            textShadow: `0 0 16px ${t.accentColor}80`,
                        }}>
                            {t.name}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* ── Dot indicators + arrow nav ── */}
            <div style={{
                position: 'absolute', bottom: '32px', left: 0, right: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '10px',
                padding: '0 16px',
            }}>
                {/* Prev arrow */}
                <button
                    onClick={() => { resetAuto(); go(activeIdx - 1) }}
                    style={{
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#fff', fontSize: '1rem',
                        flexShrink: 0,
                    }}
                    aria-label="Previous captain"
                >
                    ‹
                </button>

                {/* Dots */}
                {teams.map((_, di) => (
                    <button
                        key={di}
                        onClick={() => { resetAuto(); setActiveIdx(di) }}
                        style={{
                            width: di === activeIdx ? '24px' : '7px',
                            height: '7px',
                            borderRadius: '4px',
                            backgroundColor: di === activeIdx ? t.accentColor : 'rgba(255,255,255,0.3)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'width 0.3s ease, background-color 0.3s ease',
                            boxShadow: di === activeIdx ? `0 0 8px ${t.accentColor}80` : 'none',
                        }}
                        aria-label={`Go to captain ${di + 1}`}
                    />
                ))}

                {/* Next arrow */}
                <button
                    onClick={() => { resetAuto(); go(activeIdx + 1) }}
                    style={{
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#fff', fontSize: '1rem',
                        flexShrink: 0,
                    }}
                    aria-label="Next captain"
                >
                    ›
                </button>
            </div>
        </section>
    )
}

// ── Main export ───────────────────────────────────────────────
const CaptainsShowcase = () => {
    const [active, setActive] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const timer = useRef(null)

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)')
        const update = () => setIsMobile(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    const enter = (i) => { clearTimeout(timer.current); timer.current = setTimeout(() => setActive(i), 100) }
    const leave = () => clearTimeout(timer.current)

    if (isMobile) {
        return <MobileCarousel activeIdx={active} setActiveIdx={setActive} />
    }

    return (
        <section className="bg-black overflow-hidden">
            <div className="flex" style={{ height: '100svh' }}>
                {teams.map((t, i) => (
                    <DesktopCard
                        key={t.id} t={t} i={i}
                        isActive={active === i}
                        enter={enter} leave={leave} setActive={setActive}
                    />
                ))}
            </div>
        </section>
    )
}

export default CaptainsShowcase