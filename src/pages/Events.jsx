import { motion } from 'framer-motion'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react'

const Events = () => {
    const events = [

        {
            id: 1,
            title: "Inter-NIT Tournament",
            description: "Representing NITRR across India, competing with the best teams.",
            date: "2025-08-20",
            location: "NIT JAMSHEDPUR",
            image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800"
        },

        {
            id: 2,
            title: "GENERAL CHAMPIONSHIP",
            description: "Intensive training sessions to prepare for the upcoming season.",
            date: "2025-07-01",
            location: "NITRR Sports Complex",
            image: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?auto=format&fit=crop&q=80&w=800"
        },

        {
            id: 3,
            title: "SAMAR",
            description: "Intensive training sessions to prepare for the upcoming season.",
            date: "2025-07-01",
            location: "NITRR Sports Complex",
            image: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?auto=format&fit=crop&q=80&w=800"
        },

        {
            id: 4,
            title: "NCL",
            description: "The ultimate showdown. NITRR FC claimed victory in a thrilling final match.",
            date: "2025-12-15",
            location: "NITRR Main Ground",
            image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800"
        },

        {
            id: 5,
            title: "INTERCOLLEGES",
            description: "Current squad vs Alumni - a celebration of NITRR FC legacy.",
            date: "2024-11-10",
            location: "NITRR Main Ground",
            image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 6,
            title: "Freshers Welcome",
            description: "Introducing new talent to the NITRR FC family.",
            date: "2024-08-01",
            location: "NITRR Main Ground",
            image: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=800"
        },
    ]

    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto border-b border-white/10 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                        <div>
                            <h2 className="text-sm font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-4">
                                Gallery & Updates
                            </h2>
                            <h1 className="text-6xl md:text-8xl font-bebas text-white uppercase tracking-tighter leading-[0.9] mix-blend-difference">
                                CAPTURED <br />
                                <span className="text-outline-active">MOMENTS</span>
                            </h1>
                        </div>
                        <div className="md:text-right">
                            <p className="text-white/60 font-inter text-sm md:text-base leading-relaxed max-w-md ml-auto">
                                Witness the journey. From intense training sessions to championship victories, every moment defines our legacy.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Masonry Grid */}
            <section className="pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.8 }}
                                className="group relative aspect-[4/5] overflow-hidden bg-white/5 border border-white/5"
                            >
                                {/* Image Background */}
                                <div className="absolute inset-0">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-background/80 group-hover:bg-background/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transpose to-transparent"></div>
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-white/10 backdrop-blur-md px-3 py-1 border border-white/10">
                                            <span className="text-xs font-rajdhani text-white uppercase tracking-widest">
                                                {new Date(event.date).getFullYear()}
                                            </span>
                                        </div>
                                        <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                            <ArrowUpRight size={20} />
                                        </div>
                                    </div>

                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-3xl font-bebas text-white uppercase leading-none mb-4 group-hover:text-laser-blue transition-colors">
                                            {event.title}
                                        </h3>
                                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                                            <p className="text-white/70 text-sm font-inter leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                                {event.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs font-rajdhani text-white/60 uppercase tracking-widest border-t border-white/10 pt-4 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12} />
                                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={12} />
                                                    <span>{event.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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

export default Events
