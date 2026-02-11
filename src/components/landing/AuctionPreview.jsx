import { motion } from 'framer-motion'
import { useRef } from 'react'

const AuctionPreview = () => {
    return (
        <section className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gold/5 radial-gradient" />

            <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
            >
                {/* Placeholder Player Card */}
                <div className="w-[300px] h-[450px] bg-gradient-to-br from-gray-800 to-black border-2 border-gold rounded-xl shadow-[0_0_50px_rgba(250,221,120,0.3)] flex flex-col items-center justify-center relative">
                    <div className="text-gold font-oswald text-2xl absolute top-4">FIFA 25</div>
                    <div className="w-32 h-32 bg-gray-700 rounded-full mb-4 animate-pulse" />
                    <h3 className="text-white font-oswald text-3xl">Unknown</h3>
                    <p className="text-white/60">Striker</p>

                    {/* SOLD Stamp Animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 3, rotate: -20 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: -15 }}
                        transition={{ delay: 1, duration: 0.3, type: "spring", bounce: 0.5 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-neon text-neon font-oswald text-5xl font-bold px-4 py-2 uppercase tracking-widest opacity-0 transform -rotate-12"
                    >
                        SOLD
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}

export default AuctionPreview
