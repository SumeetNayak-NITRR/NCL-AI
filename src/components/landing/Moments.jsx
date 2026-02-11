import { motion } from 'framer-motion'

const moments = [
    "https://images.unsplash.com/photo-1522778119026-d647f0565c6a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=800"
]

const Moments = () => {
    return (
        <section className="min-h-screen bg-background py-20 px-4 flex flex-col items-center justify-center overflow-hidden">
            <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-5xl md:text-7xl font-oswald text-white mb-16 text-center"
            >
                Our People & <span className="text-neon">Moments</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {moments.map((src, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.6 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="relative aspect-[3/4] overflow-hidden rounded-lg group"
                    >
                        <img
                            src={src}
                            alt={`Moment ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                            <span className="text-gold font-oswald text-xl">Season 2025</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Moments
