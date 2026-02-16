import { motion } from 'framer-motion'
import { useState } from 'react'

const CaptainCard = ({ team, index, isActive, onActivate }) => {
    return (
        <motion.div
            className={`relative h-[80vh] md:h-screen cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] border-r border-white/10 last:border-r-0 ${isActive ? 'flex-[4] md:flex-[3]' : 'flex-1 hover:flex-[1.5] brightness-75 hover:brightness-100'
                }`}
            onClick={onActivate}
            onMouseEnter={onActivate}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            {/* Background Image / Gradient */}
            <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-1000 ${isActive ? 'scale-110' : 'scale-100 grayscale'}`}
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), ${team.bgPattern}`,
                    backgroundColor: team.color
                }}
            />

            {/* Overlay Gradient for depth */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90`} />

            {/* Character/Captain Image Silhouette */}
            <div className="absolute inset-x-0 bottom-0 h-4/5 flex items-end justify-center overflow-hidden pointer-events-none">
                <motion.img
                    src={team.image}
                    alt={team.captain}
                    loading="lazy"
                    className={`h-full w-auto object-cover object-bottom filter drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-700 ${isActive ? 'scale-105 saturate-100' : 'scale-100 saturate-0 opacity-80'}`}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                />
            </div>

            {/* Element Effects (Particles/Fog) */}
            <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40">
                <div className="w-full h-full bg-noise opacity-20"></div>
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-20 pointer-events-none">

                {/* Vertical Text (When Inactive) */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap transition-opacity duration-500 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="text-4xl md:text-6xl font-bebas tracking-widest text-white/40 drop-shadow-md uppercase">
                        #{index + 1}
                    </span>
                </div>

                {/* Main Text Content */}
                <motion.div
                    initial={false}
                    animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 20,
                        display: isActive ? 'block' : 'none'
                    }}
                    transition={{ duration: 0.5 }}
                >
                    <h3 className="text-xs md:text-sm font-rajdhani uppercase tracking-[0.3em] text-white/80 mb-2">
                        {team.role}
                    </h3>
                    <h2 className="text-3xl md:text-7xl font-bebas uppercase text-white leading-[0.85] mb-2 drop-shadow-lg">
                        {team.captain}
                    </h2>
                    <h1
                        className="text-xl md:text-3xl font-rajdhani font-bold uppercase tracking-widest mb-6"
                        style={{ color: team.accentColor }}
                    >
                        {team.name}
                    </h1>

                    {/* Stats Grid */}

                </motion.div>
            </div>

            {/* Hover Glow */}
            <div className={`absolute inset-0 border-[0.5px] border-white/0 transition-all duration-300 pointer-events-none ${isActive ? 'border-white/10 bg-white/5' : ''}`} />
        </motion.div>
    )
}

const CaptainsShowcase = () => {
    const [activeIndex, setActiveIndex] = useState(0)

    const teams = [
        {
            id: 1,
            name: "Inferno Strikers",
            captain: "Sanjeev Bhoi",
            role: "Captain",
            color: "#4a0404",
            accentColor: "#f87171",
            bgPattern: "radial-gradient(circle at 50% 50%, #7f1d1d, #450a0a)",
            image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 2,
            name: "Aqua Marines",
            captain: "AYUSH SINGH",
            role: "Captain",
            color: "#0c4a6e",
            accentColor: "#38bdf8",
            bgPattern: "radial-gradient(circle at 50% 50%, #0369a1, #0c4a6e)",
            image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 3,
            name: "Thunder Bolts",
            captain: "PIYUSH GUPTA",
            role: "Captain",
            color: "#422006",
            accentColor: "#facc15",
            bgPattern: "radial-gradient(circle at 50% 50%, #ca8a04, #422006)",
            image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 4,
            name: "Terra Titans",
            captain: "ABHYUDAYA",
            role: "Captain",
            color: "#052e16",
            accentColor: "#4ade80",
            bgPattern: "radial-gradient(circle at 50% 50%, #15803d, #052e16)",
            image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 5,
            name: "Void Walkers",
            captain: "COMING SOON",
            role: "Captain",
            color: "#2e1065",
            accentColor: "#a78bfa",
            bgPattern: "radial-gradient(circle at 50% 50%, #6b21a8, #2e1065)",
            image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 6,
            name: "Sky Gliders",
            captain: "COMING SOON",
            role: "Captain",
            color: "#164e63",
            accentColor: "#22d3ee",
            bgPattern: "radial-gradient(circle at 50% 50%, #0891b2, #164e63)",
            image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=600"
        }
    ]

    return (
        <section className="bg-black py-0 relative overflow-hidden">
            <div className="flex flex-col md:flex-row h-[120vh] md:h-screen w-full">
                {teams.map((team, index) => (
                    <CaptainCard
                        key={team.id}
                        index={index}
                        team={team}
                        isActive={activeIndex === index}
                        onActivate={() => setActiveIndex(index)}
                    />
                ))}
            </div>
        </section>
    )
}

export default CaptainsShowcase

/*<div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4 max-w-md">
                        <div>
                            <div className="text-xs text-white/50 uppercase tracking-wider">PWR</div>
                            <div className="text-xl font-bebas text-white">96</div>
                        </div>
                        <div>
                            <div className="text-xs text-white/50 uppercase tracking-wider">IQ</div>
                            <div className="text-xl font-bebas text-white">88</div>
                        </div>
                        <div>
                            <div className="text-xs text-white/50 uppercase tracking-wider">EXP</div>
                            <div className="text-xl font-bebas text-white">LVL.5</div>
                        </div>
                    </div>
*/