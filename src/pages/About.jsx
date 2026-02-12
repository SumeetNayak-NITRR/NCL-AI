import { motion } from 'framer-motion'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import { Award, Users, Target, Shield, Zap } from 'lucide-react'

const About = () => {
    const stats = [
        { label: "Founded", value: "2023" },
        { label: "Players", value: "120+" },
        { label: "Matches", value: "69+" },
        { label: "Trophies", value: "6+" }
    ]

    const values = [
        {
            icon: <Zap size={24} />,
            title: "Intensity",
            description: "We play with absolute focus and unwavering energy."
        },
        {
            icon: <Target size={24} />,
            title: "Discipline",
            description: "Every move, every action, calculated to perfection."
        },
        {
            icon: <Shield size={24} />,
            title: "Unity",
            description: "Individual brilliance, collective dominance."
        }
    ]

    return (
        <div className="min-h-screen pt-20 px-6">
            <Navigation />
            <div className="max-w-7xl mx-auto">
                {/* Hero Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="mb-24 pt-12 md:pt-24 border-b border-white/5 pb-12 relative"
                >
                    <h1 className="text-[12vw] leading-none font-bebas text-white opacity-5 select-none absolute top-0 left-0 -z-10 pointer-events-none">
                        AGENCY
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                        <div>
                            <h2 className="text-sm font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-4">
                                Who We Are
                            </h2>
                            <h1 className="text-5xl md:text-7xl font-bebas text-white leading-[0.9] tracking-tighter">
                                FORGING <br />
                                <span className="text-outline-active">LEGENDS</span>
                            </h1>
                        </div>
                        <p className="text-white/60 font-inter text-sm md:text-base leading-relaxed max-w-md">
                            NITRR FC isn't just a football club. It's a high-performance ecosystem designed to cultivate elite talent. We combine technical precision with raw athletic power.
                        </p>
                    </div>
                </motion.div>

                {/* Kinetic Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-32 border-t border-l border-white/10">
                    {stats.map((stat, index) => (
                        <div key={index} className="border-r border-b border-white/10 p-8 md:p-12 hover:bg-white/5 transition-colors group">
                            <h3 className="text-4xl md:text-6xl font-bebas text-white group-hover:text-laser-blue transition-colors">
                                {stat.value}
                            </h3>
                            <p className="text-xs font-rajdhani uppercase tracking-[0.3em] text-white/60 mt-2">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Philosophy Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white/5 p-8 border border-white/5 hover:border-laser-blue/30 transition-all duration-500 group"
                        >
                            <div className="mb-6 text-white/50 group-hover:text-laser-blue transition-colors">
                                {value.icon}
                            </div>
                            <h3 className="text-2xl font-bebas text-white mb-4 tracking-wide group-hover:translate-x-2 transition-transform">
                                {value.title}
                            </h3>
                            <p className="text-white/50 text-sm font-inter leading-relaxed">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default About
