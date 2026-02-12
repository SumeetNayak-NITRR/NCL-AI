import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const CountUpNumber = ({ end, duration = 2, suffix = "" }) => {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (!isInView) return

        let startTime
        let animationFrame

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(easeOutQuart * end))

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
            } else {
                setCount(end)
            }
        }

        animationFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrame)
    }, [isInView, end, duration])

    return (
        <span ref={ref} className="tabular-nums">
            {count}{suffix}
        </span>
    )
}

const StatCard = ({ value, suffix, label, index }) => {
    return (
        <motion.div
            className="relative group"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            {/* Glowing background */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-laser-blue/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                animate={{
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
            ></motion.div>

            <div className="relative p-10 bg-white/5 backdrop-blur-md border border-white/20 group-hover:border-laser-blue/50 transition-all duration-500">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-laser-blue"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-laser-blue"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-laser-blue"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-laser-blue"></div>

                {/* Number */}
                <motion.div
                    className="text-6xl md:text-7xl font-bebas text-transparent bg-clip-text bg-gradient-to-br from-white via-laser-blue to-white mb-4"
                    animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    style={{ backgroundSize: '200% 200%' }}
                >
                    <CountUpNumber end={value} suffix={suffix} />
                </motion.div>

                {/* Label */}
                <div className="text-sm md:text-base font-rajdhani uppercase tracking-[0.3em] text-white/70">
                    {label}
                </div>

                {/* Animated underline */}
                <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-laser-blue to-transparent"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                ></motion.div>
            </div>
        </motion.div>
    )
}

const LiveStats = () => {
    const stats = [
        { value: 30, suffix: "+", label: "Active Players" },
        { value: 6, suffix: "+", label: "Teams Formed" },
        { value: 50, suffix: "+", label: "Matches Played" },
        { value: 3, suffix: "", label: "Championships" }
    ]

    return (
        <section className="py-32 px-6 bg-void-black relative overflow-hidden">
            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-20">
                <motion.div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(0,34,255,0.3) 2px, transparent 2px),
                            linear-gradient(90deg, rgba(0,34,255,0.3) 2px, transparent 2px)
                        `,
                        backgroundSize: '100px 100px'
                    }}
                    animate={{
                        backgroundPosition: ['0px 0px', '100px 100px'],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                ></motion.div>
            </div>

            {/* Radial gradient overlays */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                <motion.div
                    className="absolute top-0 left-0 w-96 h-96 rounded-full bg-laser-blue/20 blur-[120px]"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                ></motion.div>
                <motion.div
                    className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-laser-blue/20 blur-[120px]"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                        scale: [1.2, 1, 1.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                ></motion.div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h2
                        className="text-sm font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-4"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        By The Numbers
                    </motion.h2>
                    <h1 className="text-5xl md:text-8xl font-bebas text-white uppercase tracking-tighter leading-[0.9]">
                        GROWING <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-laser-blue to-white">
                            STRONGER
                        </span>
                    </h1>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} index={index} />
                    ))}
                </div>

                {/* Bottom accent */}
                <motion.div
                    className="mt-20 flex justify-center"
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    <div className="h-px w-64 bg-gradient-to-r from-transparent via-laser-blue to-transparent"></div>
                </motion.div>
            </div>
        </section>
    )
}

export default LiveStats
