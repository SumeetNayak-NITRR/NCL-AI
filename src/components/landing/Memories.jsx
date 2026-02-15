import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Trophy, Medal, Star } from 'lucide-react'

// HIGHLY VISIBLE Football Particle Component
// Kinetic Particle Component - Abstract & Premium
const KineticParticle = ({ delay = 0, duration = 20 }) => {
    return (
        <motion.div
            className="absolute opacity-0 pointer-events-none"
            style={{
                width: Math.random() > 0.5 ? '3px' : '2px',
                height: Math.random() > 0.5 ? '3px' : '50px', // Mix of dots and vertical light streaks
            }}
            initial={{
                x: Math.random() * 100 + '%',
                y: -100,
                opacity: 0
            }}
            animate={{
                y: ['-10vh', '110vh'],
                opacity: [0, 0.4, 0], // Subtle fade in/out
            }}
            transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                ease: "linear"
            }}
        >
            <div className={`w-full h-full ${Math.random() > 0.5 ? 'bg-laser-blue shadow-[0_0_8px_#0022ff]' : 'bg-white shadow-[0_0_5px_white]'} rounded-full`}></div>
        </motion.div>
    )
}

const MemoryCard = ({ title, year, description, align, imagePlaceholder, index }) => {
    const cardRef = useRef(null)

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    })

    const imageY = useTransform(scrollYProgress, [0, 1], [100, -100])
    const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1]) // Keep scale at 1 at end
    const textY = useTransform(scrollYProgress, [0, 1], [50, -50])
    // CRITICAL FIX: Removed fade-out at the end. [0, 0.3] fades in, then stays at 1.
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

    return (
        <div
            ref={cardRef}
            className={`flex flex-col md:flex-row items-center gap-12 py-24 min-h-screen md:min-h-[80vh] ${align === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'}`}
        >
            <motion.div
                className="flex-1 w-full"
                style={{ y: imageY }} // Removed opacity from style
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-10%" }} // Triggers slightly before full view, stays visible
                transition={{ duration: 0.8 }}
            >
                <motion.div
                    className="relative aspect-video bg-gradient-to-br from-laser-blue/10 via-white/5 to-laser-blue/5 border border-white/20 overflow-hidden group shadow-[0_0_40px_rgba(0,34,255,0.2)]"
                    style={{ scale: imageScale }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 60px rgba(0,34,255,0.4)' }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="absolute inset-0 bg-noise opacity-[0.05]"></div>

                    {/* Actual Image or Placeholder */}
                    {imagePlaceholder.startsWith('/') || imagePlaceholder.startsWith('http') ? (
                        <img
                            src={imagePlaceholder}
                            alt={title}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 contrast-110 group-hover:scale-105 ${index === 2
                                ? 'brightness-130 saturate-110 group-hover:brightness-140 group-hover:saturate-125' // New Beginnings: Balanced
                                : 'brightness-110 saturate-110 group-hover:brightness-125 group-hover:saturate-125' // Others: Standard vibrant
                                }`}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-rajdhani uppercase text-white/50 tracking-widest text-sm">{imagePlaceholder}</span>
                        </div>
                    )}

                    {/* NO Dark Overlay - Let images shine! */}

                    {/* Animated border on hover */}
                    <div className="absolute inset-0 border-2 border-laser-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,34,255,0)] group-hover:shadow-[inset_0_0_60px_rgba(0,34,255,0.4)] transition-all duration-700"></div>
                </motion.div>
            </motion.div>

            <motion.div
                className="flex-1 text-center md:text-left"
                style={{ y: textY }} // Removed opacity from style
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <motion.span
                    className="text-laser-blue font-bebas text-3xl md:text-5xl tracking-wider mb-4 block drop-shadow-[0_0_20px_rgba(0,34,255,0.8)]"
                    initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {year}
                </motion.span>

                <motion.h3
                    className="text-4xl md:text-7xl font-bebas text-white uppercase leading-[0.9] mb-6 drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]"
                    initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {title}
                </motion.h3>

                <motion.p
                    className="text-white/90 font-inter leading-relaxed max-w-md mx-auto md:mx-0 text-base md:text-lg"
                    initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {description}
                </motion.p>
            </motion.div>
        </div>
    )
}

const Memories = () => {
    const sectionRef = useRef(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    })

    const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200])
    const lineScale = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1])

    const memories = [
        {
            title: "Inter-NIT Champions",
            year: "2024",
            description: "A historic victory against top contenders. The squad showed unmatched resilience and tactical brilliance to bring the trophy home.",
            align: "left",
            imagePlaceholder: "/memories/champions-2023.jpg"
        },
        {
            title: "The Great Run",
            year: "2025",
            description: "Fighting against the odds, we secured the Runner-Up position. A moment of true character.",
            align: "right",
            imagePlaceholder: "/memories/runner-up-2022.jpg"
        },
        {
            title: "New Beginnings",
            year: "2026",
            description: "Setting the foundation for the future of NITRR football.",
            align: "left",
            imagePlaceholder: "/memories/new-beginnings-2024.jpg"
        },
        {
            title: "SAMAR",
            year: "2026",
            description: "Undefeated tournament run, securing the championship trophy in home ground",
            align: "right",
            imagePlaceholder: "/memories/samar-2026.jpg"
        }
    ]

    return (
        <section ref={sectionRef} className="py-32 px-6 pb-48 bg-background relative overflow-hidden">
            {/* Light gradient at bottom to prevent footer darkness */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background to-transparent pointer-events-none z-20"></div>
            {/* Kinetic Energy Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-60">
                {[...Array(30)].map((_, i) => (
                    <KineticParticle
                        key={i}
                        delay={i * 0.3}
                        duration={5 + Math.random() * 10}
                    />
                ))}
            </div>

            {/* Background Elements with Parallax */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ y: backgroundY }}
            >
                <div className="absolute top-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full border border-white/5 opacity-20 animate-drift"></div>
                <div className="absolute bottom-[20%] left-[-10%] w-[30vw] h-[30vw] rounded-full border border-laser-blue/5 opacity-10 animate-drift" style={{ animationDirection: 'reverse' }}></div>

                {/* Additional animated circles */}
                <motion.div
                    className="absolute top-[40%] left-[20%] w-[20vw] h-[20vw] rounded-full border border-laser-blue/10"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    className="text-center mb-32"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-sm font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-4">
                        Our Legacy
                    </h2>
                    <h1 className="text-6xl md:text-8xl font-bebas text-white uppercase tracking-tighter mix-blend-difference">
                        UNFORGETTABLE <span className="text-outline-active">ERAS</span>
                    </h1>
                </motion.div>

                <div className="relative">
                    {/* Center Line with Scroll Progress - LASER BEAM EFFECT */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block">
                        {/* Base Track (Faint) */}
                        <div className="absolute inset-0 bg-white/10"></div>

                        {/* Laser Beam (Glowing Blue) */}
                        <motion.div
                            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-transparent via-laser-blue to-laser-blue shadow-[0_0_15px_rgba(0,34,255,0.8)] origin-top"
                            style={{
                                height: "100%",
                                scaleY: lineScale,
                                opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1])
                            }}
                        >
                            {/* Leading Spark (At the tip) */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_20px_4px_rgba(0,34,255,1)] z-20"></div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-laser-blue/30 rounded-full blur-md z-10"></div>
                        </motion.div>
                    </div>

                    {memories.map((memory, index) => (
                        <MemoryCard
                            key={index}
                            {...memory}
                            index={index}
                        />
                    ))}

                    {/* "To Be Continued" Section - Adds vertical space */}
                    <ToBeContinued />
                </div>
            </div>
        </section>
    )
}

const ToBeContinued = () => {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    })

    const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1])
    const glow = useTransform(scrollYProgress, [0, 1], ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 30px rgba(255,255,255,0.8)"])
    const color = useTransform(scrollYProgress, [0, 1], ["rgba(255,255,255,0.1)", "rgba(255,255,255,1)"])

    return (
        <motion.div
            ref={ref}
            className="py-32 flex flex-col items-center justify-center text-center"
            style={{ opacity }}
        >
            {/* Connection Point from Laser */}
            <div className="relative h-24 w-px mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-white/10"></div>
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-laser-blue via-laser-blue to-transparent shadow-[0_0_15px_rgba(0,34,255,0.5)]"
                    style={{
                        y: useTransform(scrollYProgress, [0, 1], ["-100%", "0%"])
                    }}
                ></motion.div>
            </div>

            <span className="font-rajdhani uppercase tracking-[0.5em] text-laser-blue text-sm mb-2">The Legacy Continues</span>
            <motion.h3
                className="text-4xl md:text-6xl font-bebas uppercase tracking-widest transition-all duration-300"
                style={{
                    color: color,
                    textShadow: glow
                }}
            >
                TO BE CONTINUED...
            </motion.h3>
        </motion.div>
    )
}

export default Memories
