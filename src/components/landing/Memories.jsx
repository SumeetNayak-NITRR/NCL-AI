import { motion } from 'framer-motion'

/* ---------------------------------------------------------------
   Memories — Three-part section

   Part 1: StadiumAerial showcase (cinematic horizontal strip)
   Part 2: Journey cards — simple 4-card horizontal strip
           with year + title. No sticky scroll mechanics.
   Part 3: "LIFE AT NITRR" — mosaic grid of college-life moments.
--------------------------------------------------------------- */


const collegeMoments = [
    // Top Row: 1 large (2x2), 1 medium (1x2), 2 smalls (1x1 each piled vertically)
    { src: '/memories/champions-2023.webp', label: 'All India Inter NIT Champions', sublabel: '2024', size: 'large' },
    { src: '/memories/NITA-2026.jpg', label: 'NIT A', sublabel: 'samar 2026', size: 'medium' },
    { src: '/memories/samar-IB26.jpeg', label: 'Samar2k26 Inter-Branch Champions', sublabel: 'META+CIVIL+MCA', size: 'medium' },
    { src: '/memories/award.webp', label: 'Award Night', sublabel: 'Season Ceremony', size: 'small' },
    { src: '/memories/moments.webp', label: 'Moments', sublabel: 'Memories', size: 'small' },
    { src: '/memories/samar-2026.webp', label: 'SAMAR 2026', sublabel: 'Sports Fest', size: 'large' },

    { src: '/memories/friendly.jpeg', label: 'Friendly Match', sublabel: 'At Bhilai', size: 'small' },
    { src: '/memories/awardin.webp', label: 'AWArd ceremony', sublabel: 'NIT Jamshedpur', size: 'small' },
    // Bottom Row: 1 large (2x2), 1 medium (1x2), 2 smalls (1x1 each piled vertically)
    { src: '/memories/runner-up-2022.webp', label: 'All India Inter NIT Runner Up', sublabel: '2025', size: 'large' },
    { src: '/memories/commondo.jpeg', label: 'THE commandos', sublabel: 'Engine', size: 'medium' },
    { src: '/memories/og.jpeg', label: 'The OGs', sublabel: 'experienced ones', size: 'medium' },
]



// ─────────────────────────────────────────────────────────────
//  Part 3 — LIFE AT NITRR  (college life mosaic)
// ─────────────────────────────────────────────────────────────
const sizeClasses = {
    large: 'col-span-2 row-span-2',
    medium: 'col-span-1 row-span-2',
    small: 'col-span-1 row-span-1',
}

const MosaicCard = ({ moment, index }) => (
    <motion.div
        className={`relative overflow-hidden group cursor-pointer ${sizeClasses[moment.size]}`}
        style={{ minHeight: moment.size === 'small' ? '160px' : '320px' }}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.02 }}
    >
        <img
            src={moment.src}
            alt={moment.label}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover brightness-70
                       group-hover:brightness-90 group-hover:scale-105
                       transition-all duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-laser-blue/0 group-hover:bg-laser-blue/8 transition-colors duration-400" />

        <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/50 border border-white/10">
            <span className="text-[9px] font-rajdhani uppercase tracking-widest text-white/50">
                {moment.sublabel}
            </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            <h4 className={`font-bebas uppercase tracking-wide text-white leading-tight
                ${moment.size === 'large' ? 'text-3xl md:text-4xl'
                    : moment.size === 'medium' ? 'text-2xl md:text-3xl'
                        : 'text-xl  md:text-2xl'}`}>
                {moment.label}
            </h4>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-laser-blue
                        scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400" />
    </motion.div>
)

const CollegeLife = () => (
    <section className="py-32 px-6 bg-gradient-to-b from-background to-void-black relative overflow-hidden">
        <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '32px 32px',
            }}
        />
        <div className="max-w-7xl mx-auto relative z-10">

            <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="text-xs font-rajdhani tracking-[0.5em] text-laser-blue uppercase">
                    Beyond the Tournament
                </span>
                <h2 className="text-5xl md:text-8xl font-bebas text-white uppercase tracking-tighter leading-[0.9] mt-2">
                    Moments of{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-laser-blue to-white">
                        NITRR FC
                    </span>
                </h2>
                <p className="text-white/40 font-rajdhani text-sm md:text-base mt-3 max-w-lg leading-relaxed">
                    Inter-branch battles, Sports fests,Early morning practise sessions —
                    the unfiltered moments that define our college football culture.
                </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {collegeMoments.map((moment, i) => (
                    <MosaicCard key={i} moment={moment} index={i} />
                ))}
            </div>

            <motion.div
                className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6
                           border-t border-white/10 pt-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div>
                    <p className="text-white/50 font-rajdhani text-sm uppercase tracking-widest">
                        Have a moment to share?
                    </p>
                    <h4 className="text-white font-bebas text-2xl md:text-3xl mt-1 tracking-wide">
                        YOUR MEMORY COULD LIVE HERE
                    </h4>
                </div>
                <motion.a
                    href="https://mail.google.com/mail/?view=cm&to=sumeet1928@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative px-8 py-3 border border-laser-blue/50 text-laser-blue
                               font-rajdhani uppercase tracking-widest text-sm overflow-hidden
                               hover:text-white transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="relative z-10">Submit a Memory</span>
                    <div className="absolute inset-0 bg-laser-blue scale-x-0 group-hover:scale-x-100
                                    transition-transform duration-300 origin-left" />
                </motion.a>
            </motion.div>
        </div>
    </section>
)

// ─────────────────────────────────────────────────────────────
//  Default export — all three parts together
// ─────────────────────────────────────────────────────────────
const Memories = () => <CollegeLife />

export default Memories
