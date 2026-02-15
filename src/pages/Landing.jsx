import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import Memories from '../components/landing/Memories'
import ParticleBackground from '../components/landing/ParticleBackground'
import StadiumAerial from '../components/landing/StadiumAerial'

const Landing = () => {
    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Hero Section: Editorial / Kinetic */}
            <section className="relative min-h-[100dvh] flex flex-col justify-center items-center overflow-hidden px-6">

                {/* Particle Background Effect */}
                <ParticleBackground />

                {/* Giant Background Typography */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <h1 className="text-[25vw] font-bebas text-white/5 leading-none tracking-tighter animate-pulse">
                        NITRR..
                    </h1>
                </div>

                {/* Foreground Content */}
                <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-end">

                    {/* Left Column: Vertical Text */}
                    <div className="hidden md:flex flex-col justify-between h-[60vh] col-span-1 border-l border-white/10 pl-6">
                        <div className="text-vertical text-xs font-rajdhani tracking-[0.3em] text-white/60 uppercase">
                            NATIONAL INSTITUTE OF TECHNOLOGY RAIPUR  • Est. 2023
                        </div>
                        <div className="text-vertical text-xs font-rajdhani tracking-[0.3em] text-dark-blue uppercase animate-pulse">
                            Scroll to Explore
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-12 md:col-span-10 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h2 className="text-sm md:text-base font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-4">
                                The Official League
                            </h2>
                            <h1 className="text-5xl md:text-9xl font-bebas text-white leading-[0.85] tracking-tighter mb-8 mix-blend-difference">
                                BEYOND <br />
                                THE <span className="text-outline-active">LIMITS</span>
                            </h1>

                            <div className="flex flex-col md:flex-row gap-6 mt-12">
                                <Link to="/register" className="group relative px-8 py-4 bg-off-white text-black font-bold uppercase tracking-widest overflow-hidden">
                                    <span className="relative z-10 group-hover:text-off-white transition-colors duration-300">Join the NITRR_FC</span>
                                    <div className="absolute inset-0 bg-laser-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                </Link>
                                <Link to="/about" className="px-8 py-4 border border-white/20 text-white font-rajdhani uppercase tracking-widest hover:bg-white/5 transition-all">
                                    Discover More
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                </div>
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

            {/* Stadium Aerial Scroll Animation - Cinematic Showcase */}
            <StadiumAerial />

            {/* Memories Timeline */}
            <Memories />

            <Footer />
        </div>
    )
}

export default Landing
