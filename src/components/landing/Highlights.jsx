import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const Highlights = () => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const highlights = [
        {
            quote: "NCL transformed how we approach football. The competitive environment and professional organization pushed us to our limits.",
            author: "CRISTIANO RONALDO",
            role: "Team Captain, CHAKKU GANG",
            year: "2024 Champions"
        },
        {
            quote: "The auction system is brilliant. Building a team from scratch and watching them play together is an unforgettable experience.",
            author: "LIONEL MESSI",
            role: "Team Captain, BiharCelona",
            year: "2025 Finalists"
        },
        {
            quote: "Yeh Junior BKl",
            author: "Harsh",
            role: "Midfielder, BiharCelona",
            year: "Top Scorer 2024"
        },
        /*{
            quote: "Show your ground marking skills and take the NCL treat and become part of Khau Gang🤤",
            author: "Sumeet",
            role: "Fullback, Super_Subs",
            year: "Eternity"
        }*/
    ]

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % highlights.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + highlights.length) % highlights.length)
    }

    // Auto-advance every 5 seconds
    useEffect(() => {
        const timer = setInterval(nextSlide, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="py-16 md:py-32 px-6 bg-gradient-to-b from-void-black to-background relative overflow-hidden">
            {/* Static decorative background — no animated particles */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-laser-blue/5 blur-[80px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-laser-blue/5 blur-[80px]" />
            </div>

            {/* Static quote decoration */}
            <div className="absolute top-20 left-10 opacity-5 pointer-events-none">
                <Quote size={200} className="text-laser-blue" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Static label — removed Infinity opacity pulse */}
                    <h2 className="text-sm font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-4">
                        Player Voices
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-bebas text-white uppercase tracking-tighter leading-[0.9]">
                        HEAR FROM <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-laser-blue to-white">
                            THE CHAMPIONS
                        </span>
                    </h1>
                </motion.div>

                {/* Carousel */}
                <div className="relative">
                    {/* Main content area */}
                    <div className="relative min-h-[300px] md:min-h-[400px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                className="w-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="relative p-6 md:p-16 bg-white/5 border border-white/20">
                                    {/* Quote icon */}
                                    <div className="absolute top-8 left-8 opacity-20">
                                        <Quote size={48} className="text-laser-blue" />
                                    </div>

                                    {/* Quote text */}
                                    <p className="text-xl md:text-3xl font-inter text-white/90 leading-relaxed mb-6 md:mb-8 relative z-10 italic">
                                        "{highlights[currentIndex].quote}"
                                    </p>

                                    {/* Author info */}
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-laser-blue to-laser-blue/50 flex items-center justify-center flex-shrink-0">
                                            <span className="text-2xl font-bebas text-white">
                                                {highlights[currentIndex].author.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bebas text-white tracking-wider">
                                                {highlights[currentIndex].author}
                                            </h4>
                                            <p className="text-sm font-rajdhani text-white/60 uppercase tracking-wider">
                                                {highlights[currentIndex].role}
                                            </p>
                                            <p className="text-xs font-rajdhani text-laser-blue uppercase tracking-widest mt-1">
                                                {highlights[currentIndex].year}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Decorative corner */}
                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-laser-blue/20 to-transparent"></div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-center items-center gap-6 mt-12">
                        <button
                            onClick={prevSlide}
                            className="w-14 h-14 rounded-full border-2 border-white/20 hover:border-laser-blue flex items-center justify-center text-white hover:text-laser-blue transition-colors duration-300"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        {/* Dots indicator */}
                        <div className="flex gap-3">
                            {highlights.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'w-12 bg-laser-blue shadow-[0_0_10px_rgba(0,34,255,0.8)]'
                                        : 'w-2 bg-white/30 hover:bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            className="w-14 h-14 rounded-full border-2 border-white/20 hover:border-laser-blue flex items-center justify-center text-white hover:text-laser-blue transition-colors duration-300"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Highlights
