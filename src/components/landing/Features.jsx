import { motion } from 'framer-motion'
import { Trophy, Users, Zap, Target, Award, TrendingUp } from 'lucide-react'

const FeatureCard = ({ icon: Icon, title, description, index }) => {
    return (
        <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-laser-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

            <div className="relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-laser-blue/50 transition-all duration-500 overflow-hidden">
                {/* Animated corner accent */}
                <motion.div
                    className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-laser-blue/30 to-transparent"
                    initial={{ scale: 0, rotate: 0 }}
                    whileInView={{ scale: 1, rotate: 45 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                ></motion.div>

                {/* Icon */}
                <motion.div
                    className="mb-6 relative z-10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-laser-blue to-laser-blue/50 flex items-center justify-center shadow-[0_0_30px_rgba(0,34,255,0.5)]">
                        <Icon className="text-white" size={28} />
                    </div>
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bebas text-white uppercase tracking-wider mb-3 relative z-10">
                    {title}
                </h3>
                <p className="text-white/70 font-inter leading-relaxed relative z-10">
                    {description}
                </p>

                {/* Hover line effect */}
                <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-laser-blue to-transparent"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                ></motion.div>
            </div>
        </motion.div>
    )
}

const Features = () => {
    const features = [
        {
            icon: Trophy,
            title: "Elite Competition",
            description: "Compete against the best teams in high-stakes tournaments with professional-grade organization and officiating."
        },
        {
            icon: Users,
            title: "Team Building",
            description: "Draft, manage, and develop your squad. Build chemistry and tactics that lead to championship glory."
        },
        {
            icon: Zap,
            title: "Live Auctions",
            description: "Experience the thrill of real-time player auctions. Strategic bidding meets competitive team building."
        },
        {
            icon: Target,
            title: "Skill Development",
            description: "Access training programs, tactical workshops, and performance analytics to elevate your game."
        },
        {
            icon: Award,
            title: "Recognition",
            description: "Earn accolades, showcase your achievements, and build your legacy in the NCL hall of fame."
        },
        {
            icon: TrendingUp,
            title: "Growth Platform",
            description: "Connect with scouts, coaches, and opportunities to take your football career to the next level."
        }
    ]

    return (
        <section className="py-32 px-6 bg-gradient-to-b from-void-black via-background to-void-black relative overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(0,34,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(0,34,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            {/* Glowing orbs */}
            <motion.div
                className="absolute top-20 left-10 w-96 h-96 rounded-full bg-laser-blue/10 blur-[100px]"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity }}
            ></motion.div>
            <motion.div
                className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-laser-blue/10 blur-[100px]"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.5, 0.3, 0.5]
                }}
                transition={{ duration: 8, repeat: Infinity }}
            ></motion.div>

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
                        Why Join NCL
                    </motion.h2>
                    <h1 className="text-5xl md:text-8xl font-bebas text-white uppercase tracking-tighter leading-[0.9]">
                        MORE THAN JUST <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-laser-blue via-white to-laser-blue">
                            A TOURNAMENT
                        </span>
                    </h1>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} index={index} />
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    className="mt-20 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <a
                        href="/register"
                        className="group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-laser-blue to-laser-blue/80 text-white font-bebas text-2xl tracking-wider uppercase relative overflow-hidden shadow-[0_0_40px_rgba(0,34,255,0.5)] hover:shadow-[0_0_60px_rgba(0,34,255,0.8)] transition-all duration-300"
                    >
                        <span className="relative z-10">Start Your Journey</span>
                        <motion.div
                            className="absolute inset-0 bg-white"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6 }}
                            style={{ opacity: 0.1 }}
                        ></motion.div>
                    </a>
                </motion.div>
            </div>
        </section>
    )
}

export default Features
