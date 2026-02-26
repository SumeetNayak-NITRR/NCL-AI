import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ---------------------------------------------------------------
   StadiumZoom — Cinematic scroll-driven stadium aerial reveal.

   Behaviour:
   • Stadium starts at scale 1, zooms to 1.4 over the full scroll
   • "VAMOS NITRR FC" text is visible at rest and whispers away
     very early (fully gone by 25% scroll progress)
   • Subtitle "Scroll to witness…" vanishes even sooner (15%)
   • Whole image fades to black at the very bottom of the section
--------------------------------------------------------------- */

const StadiumZoom = () => {
    const containerRef = useRef(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    })

    // ── Image ─────────────────────────────────────────────────
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.45])
    const imageOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0])

    // Dark overlay deepens slightly as you zoom in
    const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.35, 0.65])

    // ── Text — whispers away early ─────────────────────────────
    // Subtitle: gone by 15%
    const subOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
    const subY = useTransform(scrollYProgress, [0, 0.15], [0, -12])

    // Main title: rises and fades by 25%
    const titleOpacity = useTransform(scrollYProgress, [0, 0.05, 0.25], [0, 1, 0])
    const titleY = useTransform(scrollYProgress, [0, 0.25], [20, -30])
    const titleScale = useTransform(scrollYProgress, [0, 0.25], [0.97, 1.04])

    // Label above title: same cadence as subtitle
    const labelOpacity = useTransform(scrollYProgress, [0, 0.05, 0.18], [0, 1, 0])

    return (
        <section
            ref={containerRef}
            className="relative h-screen overflow-hidden bg-void-black"
        >
            {/* Stadium image — zooms in on scroll */}
            <motion.div
                className="absolute inset-0"
                style={{ scale, opacity: imageOpacity }}
            >
                <img
                    src="/showcase/stadium-aerialct.webp"
                    alt="Stadium Aerial View"
                    className="w-full h-full object-cover"
                />
                {/* Darkening overlay */}
                <motion.div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: overlayOpacity }}
                />
            </motion.div>

            {/* ── Text overlay — whispers as you scroll ── */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-none">

                {/* Small label */}
                <motion.p
                    className="text-[10px] font-rajdhani tracking-[0.7em] text-laser-blue uppercase mb-5"
                    style={{ opacity: labelOpacity, y: subY }}
                >
                    NIT Raipur Football Club
                </motion.p>

                {/* BIG TITLE — whispers away on scroll */}
                <motion.h2
                    className="text-[14vw] md:text-[11vw] font-bebas text-white uppercase tracking-tighter leading-none"
                    style={{
                        opacity: titleOpacity,
                        y: titleY,
                        scale: titleScale,
                    }}
                >
                    Vamos{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-laser-blue via-white to-laser-blue">
                        NITRR FC
                    </span>
                </motion.h2>

                {/* Scroll hint — first to go */}
                <motion.p
                    className="text-white/30 font-rajdhani text-xs mt-6 tracking-[0.5em] uppercase"
                    style={{ opacity: subOpacity, y: subY }}
                >
                    Scroll to witness the journey
                </motion.p>
            </div>

            {/* Bottom vignette into next section */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-void-black to-transparent z-20 pointer-events-none" />
        </section>
    )
}

export default StadiumZoom
