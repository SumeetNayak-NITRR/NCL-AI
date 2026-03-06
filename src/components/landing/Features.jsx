import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Users, Zap, Target, Award, TrendingUp } from 'lucide-react'

const FeatureCard = ({ icon: Icon, title, description, index }) => {
    return (
        <motion.div
            className="relative group h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            {/* Static card — no backdrop-blur (mobile GPU killer) */}
            <div className="relative p-8 bg-white/5 border border-white/10 h-full flex flex-col overflow-hidden">
                {/* Static corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-laser-blue/20 to-transparent rotate-45" />

                {/* Icon */}
                <div className="mb-6 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-laser-blue to-laser-blue/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,34,255,0.4)]">
                        <Icon className="text-white" size={28} />
                    </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bebas text-white uppercase tracking-wider mb-3 relative z-10">
                    {title}
                </h3>
                <p className="text-white/70 font-inter leading-relaxed relative z-10 flex-grow">
                    {description}
                </p>

                {/* Static bottom accent line */}
                <div className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-gradient-to-r from-laser-blue to-transparent" />
            </div>
        </motion.div>
    )
}

const Features = () => {
    const features = [
        {
            icon: Trophy,
            title: "Elite Competition",
            description: "Compete against the best teams formed by the best players."
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
            description: "Play against the best players and improve your skills."
        },
        {
            icon: Award,
            title: "Recognition",
            description: "Showcase your skills, earn recognition and build your legacy in the NCL."
        },
        {
            icon: TrendingUp,
            title: "Growth Platform",
            description: "Connect with seniors and batchmates which gives opportunities to take your football career to the next level."
        }
    ]

    return (
        <section className="py-32 px-6 bg-gradient-to-b from-void-black via-background to-void-black relative overflow-hidden">
            {/* Static grid background — no animation */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(0,34,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(0,34,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            {/* Static glow orbs — CSS-only, no JS animation */}
            <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-laser-blue/8 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-laser-blue/8 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Static label — removed Infinity opacity pulse */}
                    <h2 className="text-sm font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-4">
                        Why Join NCL
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-bebas text-white uppercase tracking-tighter leading-[0.9]">
                        MORE THAN JUST <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-laser-blue via-white to-laser-blue">
                            A TOURNAMENT
                        </span>
                    </h1>
                </motion.div>

                {/* Features Swipe — 1 full page per card on mobile, Grid on desktop */}
                <div className="flex overflow-x-auto md:overflow-visible snap-x snap-mandatory snap-always pb-8 -mx-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-8 hide-scrollbar">
                    {features.map((feature, index) => (
                        <div key={index} className="w-screen px-6 shrink-0 snap-center md:w-auto md:px-0 flex flex-col justify-center">
                            <div className="min-h-[40vh] md:min-h-0 h-full w-full">
                                <FeatureCard {...feature} index={index} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    className="mt-20 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-laser-blue to-laser-blue/80 text-white font-bebas text-2xl tracking-wider uppercase shadow-[0_0_30px_rgba(0,34,255,0.4)] transition-opacity duration-300 hover:opacity-90 touch-manipulation"
                    >
                        Start Your Journey
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

export default Features
