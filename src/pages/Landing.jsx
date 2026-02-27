import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { ReactLenis } from 'lenis/react'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import Memories from '../components/landing/Memories'
import ParticleBackground from '../components/landing/ParticleBackground'
import StadiumAerial from '../components/landing/StadiumAerial'
import StadiumZoom from '../components/landing/StadiumZoom'
import SEO from '../components/common/SEO'

const Landing = () => {
    const { scrollYProgress } = useScroll()

    // Parallax & scale effects for the Hero section
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.5])
    const bgOpacity = useTransform(scrollYProgress, [0, 0.2], [0.05, 0])
    const contentY = useTransform(scrollYProgress, [0, 1], [0, 300])
    const contentOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
            <div className="min-h-screen">
                <SEO
                    title="Home"
                    description="Welcome to NCL Tournament Manager. The league platform for NIT Raipur."
                />
                <Navigation />

                {/* Hero Section: Editorial / Kinetic */}
                <section className="relative min-h-[100dvh] flex flex-col justify-center items-center overflow-hidden px-6">

                    {/* Particle Background Effect */}
                    <ParticleBackground />

                    {/* Giant Background Typography */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                        style={{ scale: bgScale, opacity: bgOpacity }}
                    >
                        <h1 className="text-[25vw] font-bebas text-white leading-none tracking-tighter mix-blend-screen animate-pulse text-center w-full px-4">
                            NITRR..
                        </h1>
                    </motion.div>

                    {/* Foreground Content */}
                    <motion.div
                        className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-end"
                        style={{ y: contentY, opacity: contentOpacity }}
                    >

                        {/* Left Column: Vertical Text */}
                        <div className="hidden md:flex flex-col justify-between h-[60vh] col-span-1 border-l border-white/10 pl-6">
                            <div className="text-vertical text-xs font-rajdhani tracking-[0.3em] text-white/60 uppercase">
                                NATIONAL INSTITUTE OF TECHNOLOGY RAIPUR  • Est. 2023
                            </div>
                            <div className="text-vertical text-xs font-rajdhani tracking-[0.3em] text-laser-blue uppercase animate-pulse">
                                Scroll to Explore
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-span-12 md:col-span-10 text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h2 className="text-sm md:text-base font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-4">
                                    The League
                                </h2>
                                <h1 className="text-5xl md:text-9xl font-bebas text-white leading-[0.85] tracking-tighter mb-8 mix-blend-difference">
                                    BEYOND <br />
                                    THE <span className="text-outline-active">LIMITS</span>
                                </h1>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-12 pr-6 sm:pr-0">
                                    <Link to="/register" className="group relative px-6 sm:px-8 py-4 bg-off-white text-black font-bold uppercase tracking-widest overflow-hidden text-center w-full sm:w-auto">
                                        <span className="relative z-10 group-hover:text-off-white transition-colors duration-300">Join the NCL_2026</span>
                                        <div className="absolute inset-0 bg-laser-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                    </Link>
                                    <Link to="/about" className="px-6 sm:px-8 py-4 border border-white/20 text-white font-rajdhani uppercase tracking-widest hover:bg-white/5 transition-all text-center w-full sm:w-auto">
                                        Discover More
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                    </motion.div>
                </section>

                {/* Mouse Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <div className="w-[30px] h-[50px] rounded-full border-2 border-white/30 flex justify-center p-2 box-border">
                        <motion.div
                            className="w-1 h-2 bg-white rounded-full mb-1"
                            animate={{
                                y: [0, 15, 0],
                                opacity: [1, 0, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                    <span className="text-[10px] font-rajdhani uppercase tracking-[0.2em] text-white/50">Scroll</span>
                </motion.div>




                {/* Stadium aerial scroll-zoom — cinematic reveal */}
                <StadiumZoom />

                {/* THE JOURNEY photo strip */}
                <StadiumAerial />

                {/* Memories / Life at NITRR */}
                <Memories />

                <Footer />
            </div>
        </ReactLenis>
    )
}

export default Landing
