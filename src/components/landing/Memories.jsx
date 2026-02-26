import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

/* ---------------------------------------------------------------
   Memories — Two-part section:

   Part 1: "THE JOURNEY" — Centered scroll-driven carousel.
   • 3 landscape cards visible at once, edges of next/prev peeking in
   • Big gaps between cards
   • Scrolling centers each card one by one
   • Center card shows title + description info below it
   • Just a teaser entrance — compact scroll depth

   Part 2: College Life mosaic — the full intra-campus archive.
--------------------------------------------------------------- */

const memories = [
    {
        src: '/memories/champions-2023.jpg',
        year: '2024',
        title: 'Inter-NIT Champions',
        description: 'A historic victory against top contenders. Unmatched resilience and tactical brilliance — the trophy was finally ours.',
    },
    {
        src: '/memories/runner-up-2022.jpg',
        year: '2025',
        title: 'The Great Run',
        description: 'Fighting against the odds, we secured Runner-Up. A moment of true character that the campus will never forget.',
    },
    {
        src: '/memories/new-beginnings-2024.jpg',
        year: '2026',
        title: 'New Beginnings',
        description: 'Setting the foundation for the future of NITRR football. A fresh chapter written by the next generation.',
    },
    {
        src: '/memories/samar-2026.jpeg',
        year: '2026',
        title: 'SAMAR',
        description: 'Undefeated. Unbroken. Championship secured on home turf in front of the entire campus.',
    },
]

const collegeMoments = [
    { src: '/memories/champions-2023.jpg', label: 'Inter-Branch Clash', sublabel: 'CSE vs ECE · 2025', size: 'large' },
    { src: '/memories/runner-up-2022.jpg', label: 'Opening Ceremony', sublabel: 'NCL Season III', size: 'small' },
    { src: '/memories/samar-2026.jpeg', label: 'SAMAR 2026', sublabel: 'Cultural + Sports Fest', size: 'small' },
    { src: '/memories/new-beginnings-2024.jpg', label: 'Victory Lap', sublabel: 'Campus celebrations', size: 'medium' },
    { src: '/memories/champions-2023.jpg', label: 'Dribble Wars', sublabel: 'Intra-Hostel Edition', size: 'medium' },
    { src: '/memories/runner-up-2022.jpg', label: 'Spirit of NIT', sublabel: 'Bonding beyond the game', size: 'small' },
    { src: '/memories/samar-2026.jpeg', label: 'Night Practice', sublabel: 'Under the flood-lights', size: 'small' },
    { src: '/memories/new-beginnings-2024.jpg', label: 'Award Night', sublabel: 'Season II Ceremony', size: 'large' },
]

// ── Design constants (in vw) ──
// Card width: 56vw, gap: 5vw.
// 3 cards span 56+5+56+5+56 = 178vw — so left/right cards are cut off.
// Center card starts at: 50vw - 56/2 = 22vw from strip left.
// Strip x to center card[i]:  22 - (i * 61)  vw
const CARD_W = 56   // vw
const GAP = 5    // vw
const STEP = CARD_W + GAP  // 61vw per card
// When strip x = X_FOR(i), card[i] is horizontally centered in viewport
const xForCard = (i) => `${22 - i * STEP}vw`

// ─────────────────────────────────────────────────────────────
//  Part 1 — THE JOURNEY  centered carousel
// ─────────────────────────────────────────────────────────────
const Memories = () => {
    const sectionRef = useRef(null)
    const [activeIdx, setActiveIdx] = useState(0)

    const CARD_COUNT = memories.length
    const SECTION_H = CARD_COUNT * 120  // vh — 120vh per card, total 480vh

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end end'],
    })

    // Smooth continuous x — strip slides from card[0] centered → card[N-1] centered
    const stripX = useTransform(
        scrollYProgress,
        [0, 1],
        [xForCard(0), xForCard(CARD_COUNT - 1)]
    )

    // Track which card is "centered" for the info panel
    useMotionValueEvent(scrollYProgress, 'change', (v) => {
        const rawIdx = v * (CARD_COUNT - 1)
        setActiveIdx(Math.round(rawIdx))
    })

    // Heading fades out as scroll starts
    const headingOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
    const headingY = useTransform(scrollYProgress, [0, 0.12], [0, -28])

    return (
        <>
            <section
                ref={sectionRef}
                style={{ height: `${SECTION_H}vh` }}
                className="relative bg-[#080808]"
            >
                <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

                    {/* ─ Heading ─ */}
                    <motion.div
                        className="text-center flex-none mb-8 px-6"
                        style={{ opacity: headingOpacity, y: headingY }}
                    >
                        <p className="text-[10px] font-rajdhani tracking-[0.6em] text-laser-blue uppercase mb-2">
                            The Journey
                        </p>
                        <h2 className="text-5xl md:text-7xl font-bebas text-white uppercase tracking-tighter leading-none">
                            Representing{' '}
                            <span className="text-outline-active">NITRR</span>
                        </h2>
                    </motion.div>

                    {/* ─ Card strip — overflow visible so edges peek ─ */}
                    <div className="relative flex-none overflow-visible" style={{ height: '46vh' }}>
                        <motion.div
                            className="absolute top-0 h-full flex items-center"
                            style={{
                                x: stripX,
                                gap: `${GAP}vw`,
                                left: 0,
                            }}
                        >
                            {memories.map((mem, i) => {
                                const dist = Math.abs(i - activeIdx)
                                const isCenter = dist === 0
                                const isAdjacent = dist === 1

                                return (
                                    <div
                                        key={i}
                                        className="relative flex-none overflow-hidden"
                                        style={{
                                            width: `${CARD_W}vw`,
                                            height: isCenter ? '46vh' : isAdjacent ? '40vh' : '35vh',
                                            borderRadius: '6px',
                                            transition: 'height 0.6s cubic-bezier(0.25,0.1,0.25,1), opacity 0.5s ease',
                                            opacity: isCenter ? 1 : isAdjacent ? 0.65 : 0.35,
                                        }}
                                    >
                                        {/* Photo */}
                                        <img
                                            src={mem.src}
                                            alt={mem.title}
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-cover"
                                            style={{
                                                transform: isCenter ? 'scale(1.04)' : 'scale(1)',
                                                filter: isCenter ? 'brightness(0.85)' : 'brightness(0.55)',
                                                transition: 'transform 0.6s ease, filter 0.5s ease',
                                            }}
                                        />

                                        {/* Bottom vignette */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                        {/* Frame counter — top left */}
                                        <div className="absolute top-4 left-4 font-mono text-[9px] text-white/30 tracking-widest">
                                            {String(i + 1).padStart(2, '0')} / {String(CARD_COUNT).padStart(2, '0')}
                                        </div>

                                        {/* Center card blue left accent */}
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-[3px] bg-laser-blue"
                                            style={{
                                                transform: isCenter ? 'scaleY(1)' : 'scaleY(0)',
                                                transformOrigin: 'bottom',
                                                transition: 'transform 0.5s ease',
                                            }}
                                        />
                                    </div>
                                )
                            })}
                        </motion.div>
                    </div>

                    {/* ─ Info panel — always shows center card info ─ */}
                    <div className="flex-none h-[14vh] flex flex-col items-center justify-center px-6 mt-4">
                        {memories.map((mem, i) => (
                            <div
                                key={i}
                                className="absolute text-center"
                                style={{
                                    opacity: activeIdx === i ? 1 : 0,
                                    transform: activeIdx === i ? 'translateY(0)' : 'translateY(10px)',
                                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                                    pointerEvents: activeIdx === i ? 'auto' : 'none',
                                }}
                            >
                                <p className="text-laser-blue font-bebas text-lg tracking-[0.4em] mb-1">
                                    {mem.year}
                                </p>
                                <h3 className="text-white font-bebas text-3xl md:text-5xl uppercase leading-tight tracking-wide mb-2">
                                    {mem.title}
                                </h3>
                                <p className="text-white/50 font-rajdhani text-sm max-w-md leading-relaxed">
                                    {mem.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Dot indicators */}
                    <div className="flex-none flex items-center justify-center gap-2 mt-2">
                        {memories.map((_, i) => (
                            <div
                                key={i}
                                className="rounded-full bg-white transition-all duration-400"
                                style={{
                                    width: activeIdx === i ? '20px' : '5px',
                                    height: '5px',
                                    opacity: activeIdx === i ? 1 : 0.25,
                                }}
                            />
                        ))}
                    </div>

                    {/* Scroll hint — visible only at very start */}
                    <motion.div
                        className="flex-none flex items-center justify-center gap-2 mt-4"
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                    >
                        <div className="w-5 h-px bg-white/20" />
                        <span className="text-[9px] font-rajdhani uppercase tracking-[0.4em] text-white/25">
                            Scroll to explore
                        </span>
                        <div className="w-5 h-px bg-white/20" />
                    </motion.div>

                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                        <motion.div
                            className="h-full bg-laser-blue"
                            style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
                        />
                    </div>
                </div>
            </section>

            {/* Part 2 — College Life Mosaic */}
            <CollegeMoments />
        </>
    )
}

// ─────────────────────────────────────────────────────────────
//  Part 2 — College Life Mosaic
// ─────────────────────────────────────────────────────────────
const CollegeMoments = () => (
    <section className="py-32 px-6 bg-gradient-to-b from-[#080808] to-void-black relative overflow-hidden">
        <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '32px 32px',
            }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="text-xs font-rajdhani tracking-[0.5em] text-laser-blue uppercase">
                    Beyond the Tournament
                </span>
                <h2 className="text-5xl md:text-8xl font-bebas text-white uppercase tracking-tighter leading-[0.9] mt-2">
                    LIFE AT{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-laser-blue to-white">
                        NITRR
                    </span>
                </h2>
                <p className="text-white/40 font-rajdhani text-sm md:text-base mt-3 max-w-lg leading-relaxed">
                    Inter-branch battles, cultural fests, late-night practise sessions —
                    the unfiltered moments that define our college football culture.
                </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {collegeMoments.map((moment, i) => (
                    <MosaicCard key={i} moment={moment} index={i} />
                ))}
            </div>

            <motion.div
                className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div>
                    <p className="text-white/50 font-rajdhani text-sm uppercase tracking-widest">
                        Have a moment to share?
                    </p>
                    <h4 className="text-white font-bebas text-2xl md:text-3xl mt-1 tracking-wide">
                        YOUR MEMORY COULD LIVE HERE
                    </h4>
                </div>
                <motion.a
                    href="mailto:ncl@nitrr.ac.in"
                    className="group relative px-8 py-3 border border-laser-blue/50 text-laser-blue font-rajdhani uppercase tracking-widest text-sm overflow-hidden hover:text-white transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="relative z-10">Submit a Memory</span>
                    <div className="absolute inset-0 bg-laser-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </motion.a>
            </motion.div>
        </div>
    </section>
)

const sizeClasses = {
    large: 'col-span-2 row-span-2',
    medium: 'col-span-1 row-span-2',
    small: 'col-span-1 row-span-1',
}

const MosaicCard = ({ moment, index }) => (
    <motion.div
        className={`relative overflow-hidden group cursor-pointer ${sizeClasses[moment.size]}`}
        style={{ minHeight: moment.size === 'small' ? '160px' : '320px' }}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.02 }}
    >
        <img
            src={moment.src}
            alt={moment.label}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover brightness-70
                       group-hover:brightness-90 group-hover:scale-105
                       transition-all duration-600 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-laser-blue/0 group-hover:bg-laser-blue/8 transition-colors duration-400" />
        <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/50 backdrop-blur-sm border border-white/10">
            <span className="text-[9px] font-rajdhani uppercase tracking-widest text-white/55">
                {moment.sublabel}
            </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            <h4 className={`font-bebas uppercase tracking-wide text-white leading-tight
                ${moment.size === 'large' ? 'text-3xl md:text-4xl' : moment.size === 'medium' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                {moment.label}
            </h4>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-laser-blue scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400" />
    </motion.div>
)

export default Memories
