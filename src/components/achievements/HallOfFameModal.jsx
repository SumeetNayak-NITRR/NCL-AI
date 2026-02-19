import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Briefcase, MapPin, Quote, User } from 'lucide-react'

const HallOfFameModal = ({ alum, onClose }) => {
    if (!alum) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative w-full max-w-4xl bg-[#0a0a0a] border border-gold/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors border border-white/5"
                    >
                        <X size={20} />
                    </button>

                    {/* Left Side: Image & Key Info */}
                    <div className="w-full md:w-2/5 relative h-64 md:h-auto bg-gradient-to-b from-gray-900 to-black">
                        {alum.photo_url ? (
                            <img
                                src={alum.photo_url}
                                alt={alum.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-80"
                            />
                        ) : (
                            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-white/5">
                                <User size={64} className="text-white/20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>

                        {/* Overlay Content */}
                        <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/20 text-[10px] font-rajdhani uppercase tracking-widest">
                                    {alum.year}
                                </span>
                                <span className="text-white/60 text-xs font-rajdhani uppercase tracking-wider">
                                    {alum.position || 'Player'}
                                </span>
                            </div>
                            <h2 className="text-4xl font-bebas text-white uppercase leading-none mb-1">
                                {alum.name}
                            </h2>
                            <div className="text-gold font-oswald uppercase tracking-wide text-sm flex items-center gap-2">
                                <Trophy size={14} />
                                {alum.legacy}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Detailed Bio */}
                    <div className="w-full md:w-3/5 p-8 md:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <div className="space-y-8">

                            {/* Brief Bio */}
                            <div>
                                <h3 className="text-sm font-rajdhani text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <User size={14} /> About
                                </h3>
                                <p className="text-white/80 font-inter leading-relaxed text-sm md:text-base">
                                    {alum.bio ? alum.bio : "A legendary figure in NITRR football history, known for their dedication and exceptional skill on the field."}
                                </p>
                            </div>

                            {/* Current Work */}
                            {alum.current_work && (
                                <div className="bg-white/5 border border-white/5 rounded-xl p-5">
                                    <h3 className="text-sm font-rajdhani text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Briefcase size={14} /> Current Role
                                    </h3>
                                    <p className="text-laser-blue font-oswald uppercase tracking-wide">
                                        {alum.current_work}
                                    </p>
                                </div>
                            )}

                            {/* Key Contributions */}
                            {alum.contribution && (
                                <div>
                                    <h3 className="text-sm font-rajdhani text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Quote size={14} /> Key Contribution
                                    </h3>
                                    <blockquote className="border-l-2 border-gold/30 pl-4 py-1 italic text-white/70 font-inter text-sm">
                                        "{alum.contribution}"
                                    </blockquote>
                                </div>
                            )}

                            {/* Stats / Trivia (Placeholder for now) */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div>
                                    <div className="text-xs text-white/30 uppercase font-rajdhani tracking-wider">Matches</div>
                                    <div className="text-xl font-bebas text-white">25+</div>
                                </div>
                                <div>
                                    <div className="text-xs text-white/30 uppercase font-rajdhani tracking-wider">Goals/Ast</div>
                                    <div className="text-xl font-bebas text-white">12</div>
                                </div>
                            </div>

                        </div>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default HallOfFameModal
