import { motion } from 'framer-motion'
import { Users, Gavel, Trophy } from 'lucide-react'

const features = [
    { icon: Users, title: "6 Teams", desc: "Elite Squads" },
    { icon: Gavel, title: "Live Auction", desc: "Strategic Bidding" },
    { icon: Trophy, title: "The Glory", desc: "One Champion" },
]

const Overview = () => {
    return (
        <section className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                        className="flex flex-col items-center text-center p-8 border border-white/10 rounded-xl bg-white/5 hover:border-gold/50 transition-colors"
                    >
                        <feature.icon className="w-16 h-16 text-neon mb-6" />
                        <h3 className="text-3xl font-oswald text-white mb-2">{feature.title}</h3>
                        <p className="text-white/60 font-light tracking-wide">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Overview
