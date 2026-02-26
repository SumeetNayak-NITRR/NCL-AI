import { useState, useRef, useEffect } from 'react'

/* ---------------------------------------------------------------
   CaptainsShowcase — responsive accordion.

   Desktop (≥768px): horizontal panels, hover to expand.
   Mobile (<768px):  vertical stack, tap to expand.

   All transitions: pure CSS — zero framer-motion, fully composited.
--------------------------------------------------------------- */

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
        id: 3, name: 'TEAM NAME', captain: 'PIYUSH GUPTA', role: 'Captain',
        color: '#713f12', accentColor: '#fde047',
        image: '/assests/captain/piyush.webp', photoX: '50%', photoY: '10%',
    },
    {
        id: 4, name: 'TEAM NAME', captain: 'ABHYUDAYA', role: 'Captain',
        color: '#14532d', accentColor: '#86efac',
        image: '/assests/captain/abhyudaya.webp', photoX: '50%', photoY: '10%',
    },
    {
        id: 5, name: 'TEAM NAME', captain: 'Siddharth JHA', role: 'Captain',
        color: '#3b0764', accentColor: '#d8b4fe',
        image: '/assests/captain/jha.webp', photoX: '50%', photoY: '10%',
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
        <img src={t.image} alt={t.captain} loading="eager" decoding="async"
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

// ── Mobile card (vertical accordion) ─────────────────────────
const MobileCard = ({ t, i, isActive, setActive }) => {
    const INACTIVE_H = 110   // px — height of collapsed row
    const ACTIVE_H = '95vw' // expanded — tall portrait frame

    return (
        <div
            onClick={() => setActive(isActive ? -1 : i)}
            style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: t.color,
                borderBottom: '1px solid rgba(0,0,0,0.35)',
                height: isActive ? ACTIVE_H : `${INACTIVE_H}px`,
                minHeight: isActive ? '300px' : `${INACTIVE_H}px`,
                transition: 'height 0.45s cubic-bezier(0.4,0,0.2,1)',
                willChange: 'height',
            }}
        >
            {/* ── Framed photo (active) — inset so team color shows as border ── */}
            <img
                src={t.image}
                alt={t.captain}
                loading="eager"
                decoding="async"
                style={{
                    position: 'absolute',
                    top: '90px',        // team color shows above
                    left: '50px',       // team color shows on left
                    right: '50px',      // team color shows on right
                    bottom: 0,
                    width: 'calc(100% - 100px)',
                    height: 'calc(100% - 90px)',
                    objectFit: 'cover',
                    objectPosition: `${t.photoX} ${t.photoY}`,
                    opacity: isActive ? 0.9 : 0,
                    transition: 'opacity 0.4s ease',
                    borderRadius: '2px 2px 0 0',
                }}
            />

            {/* ── Inactive: larger centered portrait + big ghost number ── */}
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isActive ? 0 : 1,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
            }}>
                {/* Portrait photo */}
                <div style={{
                    position: 'relative',
                    width: '110px',
                    height: '100%',
                    overflow: 'hidden',
                    flexShrink: 0,
                }}>
                    <img
                        src={t.image}
                        alt=""
                        loading="eager"
                        decoding="async"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: `${t.photoX} ${t.photoY}`,
                            filter: 'grayscale(30%)',
                        }}
                    />
                    {/* Team color tint over the inactive photo */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: `${t.color}90`,
                    }} />
                    {/* Big ghost number centered over photo */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: '2rem',
                            letterSpacing: '0.05em',
                            color: 'white',
                            opacity: 0.5,
                            textShadow: `0 0 20px ${t.accentColor}`,
                            lineHeight: 1,
                        }}>
                            #{String(i + 1)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom gradient (active state) */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.4s ease',
            }} />

            {/* Left accent bar */}
            <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px',
                backgroundColor: t.accentColor,
                opacity: isActive ? 1 : 0.5,
                transition: 'opacity 0.35s ease',
            }} />

            {/* Bottom caption (active) */}
            <div style={{
                position: 'absolute', bottom: 0, left: '16px', right: '16px',
                paddingBottom: '18px',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.35s ease 0.1s, transform 0.4s ease 0.1s',
                pointerEvents: 'none',
            }}>
                <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: '4px' }}>
                    {t.role}
                </p>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.2rem', textTransform: 'uppercase', color: '#fff', lineHeight: 0.95, marginBottom: '6px' }}>
                    {t.captain}
                </h2>
                <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: t.accentColor, textShadow: `0 0 12px ${t.accentColor}70` }}>
                    {t.name}
                </p>
            </div>
        </div>
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
        return (
            <section style={{ backgroundColor: '#000', overflow: 'hidden' }}>
                {teams.map((t, i) => (
                    <MobileCard key={t.id} t={t} i={i} isActive={active === i} setActive={setActive} />
                ))}
            </section>
        )
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