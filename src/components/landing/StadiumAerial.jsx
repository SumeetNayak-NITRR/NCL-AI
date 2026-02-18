import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const StadiumAerial = () => {
    const containerRef = useRef(null)

    // Track scroll progress through this section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

    // ========================================
    // PHASE 1: DRAMATIC ZOOM IN (0% - 35%)
    // ========================================
    // Aggressive zoom from far aerial view to close-up
    const stadiumScale = useTransform(
        scrollYProgress,
        [0, 0.35, 0.7],
        isMobile ? [1, 1.2, 1.3] : [1, 1.5, 1.8] // Reduced zoom on mobile
    )

    const stadiumY = useTransform(
        scrollYProgress,
        [0, 0.35, 0.7],
        [0, -100, -180] // Pull down effect
    )

    // ========================================
    // PHASE 2: 3D ROTATION (35% - 55%)
    // ========================================
    // Create cinematic 3D rotation effect
    const stadiumRotateX = useTransform(
        scrollYProgress,
        [0.35, 0.55],
        isMobile ? [0, 0] : [0, 8] // Disable 3D tilt on mobile
    )

    const stadiumRotateZ = useTransform(
        scrollYProgress,
        [0.35, 0.55],
        isMobile ? [0, 0] : [0, -3] // Disable rotation on mobile
    )

    // ========================================
    // PHASE 3: DARKNESS BEFORE LIGHT (20% - 50%)
    // ========================================
    // Dramatic darkness before floodlights
    const overlayOpacity = useTransform(
        scrollYProgress,
        [0, 0.2, 0.35, 0.6], // Peak darkness earlier at 35%
        [0.4, 0.7, 0.85, 0.6] // Peak darkness then reduce
    )

    // ========================================
    // PHASE 4: EXPLOSIVE FLOODLIGHT REVEAL (50% - 75%)
    // ========================================
    // Floodlights burst on with intensity
    const floodlightOpacity = useTransform(
        scrollYProgress,
        [0.35, 0.6, 0.8], // Smoother transition over longer scroll
        [0, 0.8, 0.6] // Reduced peak intensity to avoid "flash"
    )

    const floodlightScale = useTransform(
        scrollYProgress,
        [0.35, 0.6, 0.8],
        [0.8, 1.2, 1] // Gentle expansion instead of explosive
    )

    const floodlightBlur = useTransform(
        scrollYProgress,
        [0.35, 0.6, 0.8],
        isMobile ? [50, 30, 40] : [150, 100, 120] // significantly reduced blur on mobile
    )

    // ========================================
    // PHASE 5: FIELD LINES APPEAR (60% - 75%)
    // ========================================
    const midfieldOpacity = useTransform(
        scrollYProgress,
        [0.6, 0.7],
        [0, 1]
    )

    const midfieldScale = useTransform(
        scrollYProgress,
        [0.6, 0.7],
        [0.8, 1]
    )

    // ========================================
    // PHASE 6: CONTENT REVEAL (75% - 100%)
    // ========================================
    const contentOpacity = useTransform(
        scrollYProgress,
        [0.75, 0.88],
        [0, 1]
    )

    const contentY = useTransform(
        scrollYProgress,
        [0.75, 0.88],
        [60, 0]
    )

    const contentScale = useTransform(
        scrollYProgress,
        [0.75, 0.88],
        [0.9, 1]
    )

    return (
        <section
            ref={containerRef}
            className="relative h-[400vh] bg-void-black"
        >
            {/* Sticky viewport container */}
            <div className="sticky top-0 h-[100dvh] overflow-hidden">

                {/* ========================================
                    LAYER 1: Stadium Background with 3D Transform
                    ======================================== */}
                {/* ========================================
                    LAYER 1: Stadium Background with 3D Transform
                    ======================================== */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        scale: stadiumScale,
                        y: stadiumY,
                        rotateX: stadiumRotateX,
                        rotateZ: stadiumRotateZ,
                        transformStyle: 'preserve-3d',
                        perspective: '1000px',
                        willChange: 'transform'
                    }}
                >
                    {/* Stadium aerial image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: 'url(/showcase/stadium-aerialct.png)',
                            filter: 'brightness(0.80) contrast(1.1)',
                        }}
                    />
                </motion.div>

                {/* ========================================
                    LAYER 2: Dynamic Dark Overlay
                    ======================================== */}
                <motion.div
                    className="absolute inset-0 bg-gradient-radial from-void-black/60 via-void-black/80 to-void-black"
                    style={{ opacity: overlayOpacity }}
                />

                {/* ========================================
                    LAYER 3: INTENSE FLOODLIGHT SYSTEM
                    ======================================== */}
                <motion.div
                    className="absolute inset-0 pointer-events-none mix-blend-screen"
                    style={{ opacity: floodlightOpacity, willChange: 'opacity' }}
                >
                    {/* Main center floodlight - most intense */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] rounded-full bg-[#fadd78]"
                        style={{
                            scale: floodlightScale,
                            filter: `blur(${floodlightBlur}px)`,
                            willChange: 'transform, opacity'
                        }}
                        animate={{
                            opacity: [0.6, 0.9, 0.6],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Secondary floodlights - Hidden on mobile for performance */}
                    <motion.div
                        className="hidden md:block absolute top-[5%] left-[15%] w-[500px] h-[500px] rounded-full bg-[#ffd700]"
                        style={{
                            scale: floodlightScale,
                            filter: `blur(${floodlightBlur}px)`,
                            willChange: 'transform, opacity'
                        }}
                        animate={{
                            opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    />

                    <motion.div
                        className="hidden md:block absolute top-[5%] right-[15%] w-[500px] h-[500px] rounded-full bg-[#ffd700]"
                        style={{
                            scale: floodlightScale,
                            filter: `blur(${floodlightBlur}px)`,
                            willChange: 'transform, opacity'
                        }}
                        animate={{
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{ duration: 2.8, repeat: Infinity, delay: 0.8 }}
                    />

                    <motion.div
                        className="hidden md:block absolute bottom-[10%] left-[20%] w-[450px] h-[450px] rounded-full bg-[#fadd78]"
                        style={{
                            scale: floodlightScale,
                            filter: `blur(${floodlightBlur}px)`,
                            willChange: 'transform, opacity'
                        }}
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{ duration: 3.5, repeat: Infinity, delay: 1.2 }}
                    />

                    <motion.div
                        className="hidden md:block absolute bottom-[10%] right-[20%] w-[450px] h-[450px] rounded-full bg-[#fadd78]"
                        style={{
                            scale: floodlightScale,
                            filter: `blur(${floodlightBlur}px)`,
                            willChange: 'transform, opacity'
                        }}
                        animate={{
                            opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{ duration: 3.2, repeat: Infinity, delay: 0.3 }}
                    />

                    {/* Additional accent lights - Hidden on mobile */}
                    <motion.div
                        className="hidden md:block absolute top-[30%] left-[10%] w-[300px] h-[300px] rounded-full bg-white"
                        style={{
                            scale: floodlightScale,
                            filter: `blur(${floodlightBlur}px)`,
                            willChange: 'transform, opacity'
                        }}
                        animate={{
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
                    />

                    <motion.div
                        className="hidden md:block absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full bg-white"
                        style={{
                            scale: floodlightScale,
                            filter: `blur(${floodlightBlur}px)`,
                            willChange: 'transform, opacity'
                        }}
                        animate={{
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{ duration: 3.8, repeat: Infinity, delay: 0.7 }}
                    />
                </motion.div>

                {/* ========================================
                    LAYER 4: Animated Midfield Line & Circle
                    ======================================== */}
                <motion.div
                    className="absolute top-1/2 left-0 right-0"
                    style={{
                        opacity: midfieldOpacity,
                        scale: midfieldScale,
                    }}
                >
                    {/* Horizontal midfield line */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-white to-transparent"
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Center circle - glowing */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-[3px] border-white/50"
                        animate={{
                            borderColor: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.3)'],
                            scale: [1, 1.02, 1]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    />

                    {/* Center dot - pulsing */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.6, 1, 0.6]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </motion.div>

                {/* ========================================
                    LAYER 5: Light Rays/Particles
                    ======================================== */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ opacity: floodlightOpacity }}
                >
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute top-1/2 left-1/2 w-[2px] h-[200px] bg-gradient-to-b from-white/20 to-transparent origin-top"
                            style={{
                                rotate: i * 30,
                                x: '-50%',
                                y: '-100%',
                            }}
                            animate={{
                                opacity: [0, 0.4, 0],
                                scaleY: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </motion.div>

                {/* ========================================
                    LAYER 6: Achievements Content
                    ======================================== */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
                    style={{
                        opacity: contentOpacity,
                        y: contentY,
                        scale: contentScale,
                    }}
                >
                    {/* Heading */}
                    <motion.h2
                        className="text-sm md:text-base font-rajdhani tracking-[0.6em] text-[#fadd78] uppercase mb-4"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Our Legacy
                    </motion.h2>

                    <h1 className="text-6xl md:text-9xl font-bebas text-white uppercase tracking-tighter leading-[0.85] mb-16">
                        BUILT ON <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fadd78] via-white to-[#fadd78] animate-gradient">
                            VICTORIES
                        </span>
                    </h1>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl">
                        {[
                            { value: '15+', label: 'Tournaments' },
                            { value: '200+', label: 'Matches Played' },
                            { value: '8', label: 'Championships' },
                            { value: '50+', label: 'Players' }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="relative p-4 md:p-8 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden group"
                                initial={{ opacity: 0, y: 30 }}
                                style={{
                                    opacity: useTransform(
                                        scrollYProgress,
                                        [0.82 + index * 0.03, 0.92],
                                        [0, 1]
                                    ),
                                    y: useTransform(
                                        scrollYProgress,
                                        [0.82 + index * 0.03, 0.92],
                                        [30, 0]
                                    )
                                }}
                            >
                                {/* Animated background glow */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-[#fadd78]/20 to-transparent opacity-0 group-hover:opacity-100"
                                    transition={{ duration: 0.3 }}
                                />

                                <div className="relative z-10">
                                    <motion.div
                                        className="text-3xl md:text-6xl font-bebas text-[#fadd78] mb-3"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                                    >
                                        {stat.value}
                                    </motion.div>
                                    <div className="text-xs md:text-sm font-rajdhani text-white/70 uppercase tracking-widest">
                                        {stat.label}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Strong vignette effect */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-void-black/30 to-void-black opacity-60" />
            </div>
        </section>
    )
}

export default StadiumAerial
