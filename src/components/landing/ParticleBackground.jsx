import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const FloatingParticle = ({ delay, duration, x, y, size }) => {
    return (
        <motion.div
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            style={{
                width: size,
                height: size,
                left: `${x}%`,
                top: `${y}%`,
                willChange: 'transform, opacity'
            }}
            animate={{
                y: [0, -100, 0],
                x: [0, 50, 0],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
            }}
            transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    )
}

const ParticleBackground = () => {
    const containerRef = useRef(null)
    const [particleCount, setParticleCount] = useState(15) // Default lower count

    useEffect(() => {
        // Increase particles only on larger screens
        if (typeof window !== 'undefined' && window.innerWidth > 768) {
            setParticleCount(30)
        }
    }, [])

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const y1 = useTransform(scrollYProgress, [0, 1], [0, 300])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 500])
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])

    // Generate random particles
    const particles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 6,
    }))

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating Particles */}
            <motion.div style={{ opacity }}>
                {particles.map((particle) => (
                    <FloatingParticle key={particle.id} {...particle} />
                ))}
            </motion.div>

            {/* Large Geometric Shapes with Parallax */}
            <motion.div
                className="absolute top-[20%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full border border-laser-blue/10 blur-3xl"
                style={{ y: y1, opacity, willChange: 'transform' }}
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            <motion.div
                className="absolute bottom-[10%] left-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full border border-white/5 blur-2xl"
                style={{ y: y2, opacity, willChange: 'transform' }}
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [360, 180, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Grid Lines with Scroll Effect */}
            <motion.div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                    y: y1,
                    willChange: 'transform'
                }}
            />

            {/* Laser Lines */}
            <motion.div
                className="absolute top-[30%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-laser-blue/20 to-transparent"
                style={{ y: y1, opacity, willChange: 'transform, opacity' }}
                animate={{
                    scaleX: [0.5, 1, 0.5],
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="absolute top-[70%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
                style={{ y: y2, opacity, willChange: 'transform, opacity' }}
                animate={{
                    scaleX: [0.5, 1, 0.5],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />

            {/* Glowing Orbs - Reduced size for mobile */}
            <motion.div
                className="absolute top-[15%] left-[20%] w-2 md:w-3 h-2 md:h-3 bg-laser-blue rounded-full shadow-[0_0_20px_#0022ff] md:shadow-[0_0_30px_#0022ff]"
                style={{ willChange: 'transform, opacity' }}
                animate={{
                    y: [0, -50, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="absolute top-[60%] right-[15%] w-1.5 md:w-2 h-1.5 md:h-2 bg-white rounded-full shadow-[0_0_15px_#fff] md:shadow-[0_0_20px_#fff]"
                style={{ willChange: 'transform, opacity' }}
                animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            />

            <motion.div
                className="absolute bottom-[20%] left-[70%] w-1.5 md:w-2 h-1.5 md:h-2 bg-laser-blue rounded-full shadow-[0_0_15px_#0022ff] md:shadow-[0_0_25px_#0022ff]"
                style={{ willChange: 'transform, opacity' }}
                animate={{
                    y: [0, -40, 0],
                    opacity: [0.2, 0.9, 0.2],
                    scale: [0.6, 1.1, 0.6],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3
                }}
            />
        </div>
    )
}

export default ParticleBackground
