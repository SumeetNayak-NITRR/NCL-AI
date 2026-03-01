import { motion, useScroll, useSpring } from 'framer-motion'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import ParticleBackground from '../components/landing/ParticleBackground'
import GlowCard from '../components/common/GlowCard'
import TournamentMetrics from '../components/landing/TournamentMetrics'
import { Trophy, Star, Medal, Crown, Timer, Activity } from 'lucide-react'
import SEO from '../components/common/SEO'
import { tournaments } from '../data/tournamentData'
import { legends } from '../data/hallOfFameData'
import { User } from 'lucide-react'
import HallOfFameModal from '../components/achievements/HallOfFameModal'
import { useState } from 'react'

const Achievements = () => {
    const [selectedAlum, setSelectedAlum] = useState(null)

    const achievements = [

        {
            id: 6,
            title: "SAMAR",
            year: "2026",
            category: "trophy",
            description: "Undefeated tournament run, securing the championship trophy in home ground"
        },
        {
            id: 5,
            title: "Inter-NIT Runner Up",
            year: "2025",
            category: "trophy",
            description: "Securing the runner up trophy at NIT Jamshedpur."
        },
        {
            id: 4,
            title: "Fair Play Award",
            year: "2025",
            category: "milestone",
            description: "Recognized for exemplary sportsmanship and conduct throughout the season 2nd time in a row in Sapre tournament."
        },
        {
            id: 3,
            title: "Inter-NIT Champions",
            year: "2024",
            category: "trophy",
            description: "Undefeated tournament run, securing the championship trophy against NIT Rourkela."
        },
        {
            id: 2,
            title: "Fair Play Award",
            year: "2024",
            category: "milestone",
            description: "Recognized for exemplary sportsmanship and conduct throughout the season."
        },
        {
            id: 1,
            title: "Colossus",
            year: "2023",
            category: "trophy",
            description: "Victory in the prestigious HNLU inter-college tournament."
        }
    ]

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="min-h-screen">
            <SEO
                title="Hall of Fame"
                description="Celebrate the history and glory of NITRR FC. View trophies, awards, and milestones."
            />
            <Navigation />

            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-laser-blue origin-left z-50"
                style={{ scaleX }}
            />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <ParticleBackground />
                <div className="max-w-7xl mx-auto border-b border-white/10 pb-12 relative z-10">
                    <h1 className="text-[18vw] leading-none font-bebas text-white/5 absolute top-0 right-0 -z-10 select-none pointer-events-none text-right">
                        GLORY
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-end">
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-sm font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-4">
                                    Hall of Fame
                                </h2>
                                <h1 className="text-6xl md:text-8xl font-bebas text-white uppercase tracking-tighter leading-[0.9] mix-blend-difference">
                                    HISTORY <span className="text-outline-active">WRITE</span> <br />
                                    IN GOLD
                                </h1>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Live Stats Section */}
            <div className="relative z-10 -mt-20 mb-20">
                <TournamentMetrics />
            </div>

            {/* Timeline Section */}
            <section className="pb-20 px-6 relative">
                {/* Subtle background glow for timeline */}
                <div className="absolute top-0 left-1/4 w-1/2 h-full bg-laser-blue/5 blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="relative border-l border-white/10 ml-4 md:ml-12 pl-8 md:pl-16 space-y-24 py-12">
                        {/* Timeline Line - Animated Filler (Visual only, simple version) */}
                        <div className="absolute left-4 md:left-12 top-0 bottom-0 w-[1px] bg-laser-blue/20 origin-top transform scale-y-0 animate-scroll-fill"></div>

                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }} // Triggers a bit earlier
                                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                                className="relative group"
                            >
                                {/* Timeline Dot - Pulsing Animation */}
                                <motion.div
                                    className="absolute -left-[41px] md:-left-[73px] top-8 w-3 h-3 bg-background border border-white/50 rounded-full group-hover:bg-laser-blue group-hover:border-laser-blue transition-colors duration-500 shadow-[0_0_0_4px_#050505]"
                                    whileInView={{ scale: [1, 1.2, 1], boxShadow: ["0 0 0 4px #050505", "0 0 10px rgba(0,34,255,0.5)", "0 0 0 4px #050505"] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                                ></motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                    <div className="md:col-span-3 pt-2">
                                        <span className="text-6xl font-bebas text-white/50 group-hover:text-white transition-colors duration-500 block transform group-hover:-translate-y-1">
                                            {achievement.year}
                                        </span>
                                    </div>
                                    <div className="md:col-span-9">
                                        <GlowCard className="p-8 group-hover:-translate-y-1 transition-transform duration-500" glowColor={achievement.category === 'trophy' ? '#ffd700' : '#39ff14'}>
                                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                                <div className={`p-2 border border-white/10 rounded-full bg-black/20 ${achievement.category === 'trophy' ? 'text-gold' : 'text-laser-blue'}`}>
                                                    {achievement.category === 'trophy' ? <Trophy size={20} /> : <Medal size={20} />}
                                                </div>
                                                <span className="text-xs font-rajdhani uppercase tracking-[0.2em] text-white/60">
                                                    {achievement.category}
                                                </span>
                                            </div>
                                            <h3 className="text-3xl font-bebas text-white uppercase mb-2 tracking-wide relative z-10 group-hover:text-laser-blue transition-colors">
                                                {achievement.title}
                                            </h3>
                                            <p className="text-white/60 font-inter text-sm leading-relaxed max-w-2xl relative z-10">
                                                {achievement.description}
                                            </p>
                                        </GlowCard>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hall of Fame Section */}
            <section className="py-20 px-6 bg-gradient-to-b from-black/20 to-transparent border-y border-white/5 relative">
                <div className="absolute inset-0 bg-gold/5 blur-[100px] opacity-20 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold mb-6">
                            <Crown size={14} />
                            <span className="text-xs font-rajdhani uppercase tracking-widest">Legends</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bebas text-white uppercase tracking-tight mb-4">
                            Hall of <span className="text-gold">Fame</span>
                        </h2>
                        <p className="text-white/60 font-inter max-w-2xl mx-auto">
                            Honoring the exceptional players who have left an indelible mark on the history of NITRR football across all tournaments.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {legends.map((alum, idx) => (
                            <GlowCard
                                key={alum.id || idx}
                                className="group relative p-6 cursor-pointer hover:border-gold/50 transition-colors"
                                glowColor={alum.card_variant === 'gold' ? '#ffd700' : '#39ff14'}
                                onClick={() => setSelectedAlum(alum)}
                            >
                                <div className="flex items-center gap-5">
                                    {/* Avatar */}
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-black/20 border border-white/10 shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                                        {alum.photo_url ? (
                                            <img src={alum.photo_url} alt={alum.name} className="w-full h-full object-cover" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20 font-bebas text-xl bg-gradient-to-br from-white/5 to-transparent">
                                                {alum.name.charAt(0)}
                                            </div>
                                        )}
                                        {alum.card_variant === 'gold' && (
                                            <div className="absolute inset-0 border-2 border-gold/50 rounded-full"></div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xl text-white font-bebas uppercase tracking-wide truncate group-hover:text-gold transition-colors">
                                            {alum.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-rajdhani uppercase tracking-wider border border-white/5">
                                                {alum.year}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-laser-blue font-rajdhani uppercase tracking-wider">
                                            <span className="w-1.5 h-1.5 bg-laser-blue rounded-full"></span>
                                            <span className="truncate">{alum.legacy || 'Legend'}</span>
                                        </div>
                                    </div>

                                    {/* Trophy Icon */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                                            <Trophy size={14} className="text-gold" />
                                        </div>
                                    </div>
                                </div>
                            </GlowCard>
                        ))}
                    </div>
                </div>
            </section>

            <HallOfFameModal
                alum={selectedAlum}
                onClose={() => setSelectedAlum(null)}
            />

            <Footer />
        </div >
    )
}

export default Achievements
