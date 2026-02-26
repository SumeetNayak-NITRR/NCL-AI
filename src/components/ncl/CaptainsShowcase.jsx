import { useState, useRef } from 'react'

/* ---------------------------------------------------------------
   CaptainsShowcase — smooth accordion panel for 6 captain cards.

   Performance fixes vs old version:
   • Removed grayscale() CSS filter from background div (was running
     a 1-second GPU-composited transition on every hover)
   • Removed grayscale-[50%] + transition-all on the <img> — was
     fighting with Framer Motion animate at the same time
   • Dropped motion.div / motion.img for the card wrapper; the flex
     accordion uses a plain CSS transition which the browser can
     handle natively without React re-renders driving it
   • Image scale handled via simple CSS class swap, not animate prop
--------------------------------------------------------------- */

const CaptainCard = ({ team, index, isActive, onClick, onMouseEnter, onMouseLeave }) => {
    return (
        <div
            className={`relative cursor-pointer overflow-hidden border-r border-white/10 last:border-r-0
                h-[calc(100%/6)] md:h-full
                ${isActive ? 'flex-[4] md:flex-[3]' : 'flex-[1]'}`}
            style={{
                transition: 'flex 0.55s cubic-bezier(0.25, 0.1, 0.25, 1)',
            }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* ── Colour gradient backdrop (no filter animation) ── */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.85)), ${team.bgPattern}`,
                    backgroundColor: team.color,
                }}
            />

            {/* ── Captain photo ── */}
            <div className="absolute inset-x-0 bottom-0 h-4/5 flex items-end justify-center overflow-hidden pointer-events-none">
                <img
                    src={team.image}
                    alt={team.captain}
                    loading="lazy"
                    className={`h-full w-auto object-cover object-bottom will-change-transform
                        ${isActive ? 'opacity-100 scale-105' : 'opacity-50 scale-100'}`}
                    style={{ transition: 'opacity 0.4s ease, transform 0.55s cubic-bezier(0.25, 0.1, 0.25, 1)' }}
                />
            </div>

            {/* ── Bottom gradient vignette ── */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

            {/* ── Inactive: rotated number label ── */}
            <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap pointer-events-none
                    ${isActive ? 'opacity-0' : 'opacity-100'}`}
                style={{ transition: 'opacity 0.35s ease' }}
            >
                <span className="text-4xl md:text-6xl font-bebas tracking-widest text-white/30 uppercase">
                    #{index + 1}
                </span>
            </div>

            {/* ── Active: name / role text ── */}
            <div
                className={`absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 pointer-events-none
                    ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transition: 'opacity 0.4s ease, transform 0.4s ease' }}
            >
                <p className="text-xs md:text-sm font-rajdhani uppercase tracking-[0.3em] text-white/70 mb-1">
                    {team.role}
                </p>
                <h2 className="text-3xl md:text-6xl font-bebas uppercase text-white leading-[0.85] mb-1 drop-shadow-lg">
                    {team.captain}
                </h2>
                <h3
                    className="text-base md:text-2xl font-rajdhani font-bold uppercase tracking-widest"
                    style={{ color: team.accentColor }}
                >
                    {team.name}
                </h3>
            </div>

            {/* ── Active: accent border glow ── */}
            <div
                className={`absolute inset-0 pointer-events-none border border-white/0
                    ${isActive ? 'border-white/10' : ''}`}
                style={{ transition: 'border-color 0.3s ease' }}
            />
        </div>
    )
}

const CaptainsShowcase = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const hoverTimeoutRef = useRef(null)

    const handleMouseEnter = (index) => {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = setTimeout(() => setActiveIndex(index), 120)
    }

    const handleMouseLeave = () => {
        clearTimeout(hoverTimeoutRef.current)
    }

    const handleClick = (index) => {
        clearTimeout(hoverTimeoutRef.current)
        setActiveIndex(index)
    }

    const teams = [
        {
            id: 1,
            name: "TEAM NAME",
            captain: "SANJIV BHOI",
            role: "Captain",
            color: "#4a0404",
            accentColor: "#f87171",
            bgPattern: "radial-gradient(circle at 50% 50%, #7f1d1d, #450a0a)",
            image: "assests/captain/sanjiv.jpg"
        },
        {
            id: 2,
            name: "TEAM NAME",
            captain: "AYUSH SINGH",
            role: "Captain",
            color: "#0c4a6e",
            accentColor: "#38bdf8",
            bgPattern: "radial-gradient(circle at 50% 50%, #0369a1, #0c4a6e)",
            image: "assests/captain/ayush.jpg"
        },
        {
            id: 3,
            name: "TEAM NAME",
            captain: "PIYUSH GUPTA",
            role: "Captain",
            color: "#422006",
            accentColor: "#facc15",
            bgPattern: "radial-gradient(circle at 50% 50%, #ca8a04, #422006)",
            image: "assests/captain/piyush.jpg"
        },
        {
            id: 4,
            name: "TEAM NAME",
            captain: "ABHYUDAYA",
            role: "Captain",
            color: "#052e16",
            accentColor: "#4ade80",
            bgPattern: "radial-gradient(circle at 50% 50%, #15803d, #052e16)",
            image: "assests/captain/abhyudaya.jpg"
        },
        {
            id: 5,
            name: "TEAM NAME",
            captain: "Siddharth JHA",
            role: "Captain",
            color: "#2e1065",
            accentColor: "#a78bfa",
            bgPattern: "radial-gradient(circle at 50% 50%, #6b21a8, #2e1065)",
            image: "assests/captain/jha.jpg"
        },
        {
            id: 6,
            name: "TEAM NAME",
            captain: "JUGAL MEHTA",
            role: "Captain",
            color: "#164e63",
            accentColor: "#22d3ee",
            bgPattern: "radial-gradient(circle at 50% 50%, #0891b2, #164e63)",
            image: "assests/captain/jugal.jpg"
        }
    ]

    return (
        <section className="bg-black py-0 relative overflow-hidden">
            <div className="flex flex-col md:flex-row h-[120vh] md:h-screen w-full">
                {teams.map((team, index) => (
                    <CaptainCard
                        key={team.id}
                        index={index}
                        team={team}
                        isActive={activeIndex === index}
                        onClick={() => handleClick(index)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}
            </div>
        </section>
    )
}

export default CaptainsShowcase