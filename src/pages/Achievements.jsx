import { motion } from 'framer-motion'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import ParticleBackground from '../components/landing/ParticleBackground'
import { Trophy, Star, Medal } from 'lucide-react'

const Achievements = () => {
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

    return (
        <div className="min-h-screen">
            <Navigation />

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
                                    HISTORY <span className="text-outline-active">WRIT</span> <br />
                                    IN GOLD
                                </h1>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="pb-20 px-6 relative">
                {/* Subtle background glow for timeline */}
                <div className="absolute top-0 left-1/4 w-1/2 h-full bg-laser-blue/5 blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="relative border-l border-white/10 ml-4 md:ml-12 pl-8 md:pl-16 space-y-24 py-12">
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
                                    className="absolute -left-[41px] md:-left-[73px] top-2 w-3 h-3 bg-background border border-white/50 rounded-full group-hover:bg-laser-blue group-hover:border-laser-blue transition-colors duration-500 shadow-[0_0_0_4px_#050505]"
                                    whileInView={{ scale: [1, 1.2, 1], boxShadow: ["0 0 0 4px #050505", "0 0 10px rgba(0,34,255,0.5)", "0 0 0 4px #050505"] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                                ></motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                    <div className="md:col-span-3">
                                        <span className="text-6xl font-bebas text-white/50 group-hover:text-white transition-colors duration-500 block transform group-hover:-translate-y-1">
                                            {achievement.year}
                                        </span>
                                    </div>
                                    <motion.div
                                        className="md:col-span-9 bg-white/5 hover:bg-white/10 border border-white/5 p-8 transition-all duration-500 group-hover:border-white/20 relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(0,34,255,0.1)]"
                                        whileHover={{ x: 10 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-laser-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        <div className="flex items-center gap-4 mb-4 relative z-10">
                                            <div className="p-2 border border-white/10 rounded-full text-laser-blue bg-black/20">
                                                {achievement.category === 'trophy' ? <Trophy size={20} /> : <Medal size={20} />}
                                            </div>
                                            <span className="text-xs font-rajdhani uppercase tracking-[0.2em] text-white/60">
                                                {achievement.category}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-bebas text-white uppercase mb-2 tracking-wide relative z-10">
                                            {achievement.title}
                                        </h3>
                                        <p className="text-white/60 font-inter text-sm leading-relaxed max-w-2xl relative z-10">
                                            {achievement.description}
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Achievements
