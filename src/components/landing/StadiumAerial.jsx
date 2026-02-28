import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/* ---------------------------------------------------------------
   ImageShowcase  –  smooth, GPU-friendly horizontal scroll strip
   Replaces the old floodlight component that caused jank due to
   many blur()-filtered animated divs.
--------------------------------------------------------------- */

const showcaseImages = [
    {
        src: '/memories/champions-2023.webp',
        label: 'Inter-NIT Champions',
        year: '2024',
    },
    {
        src: '/memories/runner-up-2022.webp',
        label: 'The Great Run',
        year: '2025',
    },
    {
        src: '/memories/new-beginnings-2024.webp',
        label: 'New Beginnings',
        year: '2026',
    },
    {
        src: '/memories/samar-2026.webp',
        label: 'SAMAR',
        year: '2026',
    },
    // Repeat so the strip feels long & cinematic
    {
        src: '/memories/champions-2023.webp',
        label: 'Inter-NIT Champions',
        year: '2024',
    },
    {
        src: '/memories/runner-up-2022.webp',
        label: 'The Great Run',
        year: '2025',
    },
]

const StadiumAerial = () => {
    const containerRef = useRef(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    })

    // Translate the strip horizontally as user scrolls — pure transform, zero filter cost
    const stripX = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])

    return (
        <section
            ref={containerRef}
            className="relative py-24 bg-void-black overflow-hidden"
        >
            {/* ── Section heading ── */}
            <motion.div
                className="text-center mb-14 px-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="text-xs md:text-sm font-rajdhani tracking-[0.5em] text-laser-blue uppercase">
                    Our Unforgettable Moments
                </span>
                <h2 className="text-5xl md:text-8xl font-bebas text-white uppercase tracking-tighter leading-[0.9] mt-2">
                    THE{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-laser-blue via-white to-laser-blue">
                        JOURNEY
                    </span>
                </h2>
            </motion.div>

            {/* ── Scrolling image strip ── */}
            <div className="overflow-hidden">
                <motion.div
                    className="flex gap-4 md:gap-6 pl-6 md:pl-12"
                    style={{ x: stripX }}
                >
                    {showcaseImages.map((img, i) => (
                        <ShowcaseCard key={i} img={img} index={i} />
                    ))}
                </motion.div>
            </div>

            {/* Subtle edge fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-void-black to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-void-black to-transparent z-10" />
        </section>
    )
}

const ShowcaseCard = ({ img, index }) => {
    return (
        <motion.div
            className="relative flex-none w-[75vw] md:w-[38vw] aspect-video overflow-hidden rounded-sm border border-white/10 group cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02 }}
        >
            {/* Image */}
            <img
                src={img.src}
                alt={img.label}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover brightness-100 group-hover:brightness-[1.15] group-hover:scale-105 transition-all duration-700 ease-out"
            />

            {/* Bottom gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <p className="text-laser-blue font-bebas text-xl md:text-2xl tracking-widest">
                    {img.year}
                </p>
                <h3 className="text-white font-bebas text-2xl md:text-4xl uppercase leading-tight">
                    {img.label}
                </h3>
            </div>

            {/* Hover border glow */}
            <div className="absolute inset-0 border border-laser-blue/0 group-hover:border-laser-blue/40 transition-all duration-500 rounded-sm" />
        </motion.div>
    )
}

export default StadiumAerial
