import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Calendar, MapPin, ChevronRight, User } from 'lucide-react'
import PlayerCard from '../common/PlayerCard'

const TournamentModal = ({ tournament, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview')

    if (!tournament) return null

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'history', label: 'History' }
    ]

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-6xl bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with Hero Image */}
                    <div className="relative h-64 md:h-80 shrink-0">
                        <img
                            src={tournament.image}
                            alt={`${tournament.title} Poster`}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white/10 rounded-full transition-colors backdrop-blur-md border border-white/10 z-20 group"
                        >
                            <X className="text-white/60 group-hover:text-white transition-colors" />
                        </button>

                        <div className="absolute bottom-0 left-0 p-8 w-full z-10 hidden md:block">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-laser-blue/20 backdrop-blur-md px-3 py-1 rounded border border-laser-blue/30 text-laser-blue text-xs font-rajdhani uppercase tracking-widest">
                                    {tournament.period}
                                </span>
                                <div className="flex items-center gap-1 text-white/60 text-xs font-rajdhani uppercase tracking-wider">
                                    <MapPin size={12} />
                                    <span>{tournament.location}</span>
                                </div>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-bebas text-white uppercase leading-none text-shadow-lg">
                                {tournament.title}
                            </h2>
                        </div>
                    </div>

                    {/* Mobile Header (Visible only on small screens) */}
                    <div className="p-6 md:hidden bg-black/20 border-b border-white/5">
                        <h2 className="text-3xl font-bebas text-white uppercase leading-none mb-2">
                            {tournament.title}
                        </h2>
                        <div className="flex items-center gap-2 text-white/40 text-xs font-rajdhani uppercase">
                            <span>{tournament.period}</span>
                            <span>•</span>
                            <span>{tournament.location}</span>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-white/10 bg-black/20 shrink-0 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 md:px-8 py-4 text-xs md:text-sm font-oswald uppercase tracking-widest transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-laser-blue"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-3xl"
                            >
                                <h3 className="text-2xl font-oswald text-white uppercase mb-4">About the Tournament</h3>
                                <p className="text-white/70 text-base md:text-lg leading-relaxed font-inter mb-8">
                                    {tournament.description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                                        <Trophy className="text-gold mb-3" size={24} />
                                        <h4 className="text-xs text-white/40 font-rajdhani uppercase tracking-wider mb-1">Format</h4>
                                        <p className="text-white font-oswald uppercase text-sm">Knockout / League</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                                        <Calendar className="text-laser-blue mb-3" size={24} />
                                        <h4 className="text-xs text-white/40 font-rajdhani uppercase tracking-wider mb-1">Next Edition</h4>
                                        <p className="text-white font-oswald uppercase text-sm">{tournament.period} 2026</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                                        <User className="text-neon mb-3" size={24} />
                                        <h4 className="text-xs text-white/40 font-rajdhani uppercase tracking-wider mb-1">Participation</h4>
                                        <p className="text-white font-oswald uppercase text-sm">Open to All</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* History Tab */}
                        {activeTab === 'history' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full space-y-12"
                            >
                                {/* Timeline Section */}
                                <div>
                                    <h3 className="text-xl font-oswald text-white/40 uppercase mb-6 tracking-widest pl-1 border-l-2 border-laser-blue">Tournament Timeline</h3>
                                    {tournament.history && tournament.history.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {tournament.history.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="group relative h-48 md:h-64 rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-gold/50 transition-colors"
                                                >
                                                    {/* Background Image */}
                                                    <div className="absolute inset-0">
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.team}
                                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black"></div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <span className="text-4xl md:text-6xl font-bebas text-white/10 group-hover:text-gold/20 transition-colors absolute top-4 right-4 pointer-events-none">
                                                                {item.year}
                                                            </span>
                                                            <span className="bg-gold/20 text-gold border border-gold/30 px-2 py-0.5 rounded text-[10px] font-rajdhani uppercase tracking-widest backdrop-blur-md">
                                                                {item.result || 'Winner'}
                                                            </span>
                                                        </div>

                                                        <h4 className="text-2xl md:text-3xl font-bebas text-white uppercase text-shadow-md mb-1 relative z-10">
                                                            {item.team}
                                                        </h4>

                                                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white/60 text-xs md:text-sm font-rajdhani uppercase tracking-wide relative z-10">
                                                            {item.captain && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-laser-blue rounded-full"></span>
                                                                    <span>C: {item.captain}</span>
                                                                </div>
                                                            )}
                                                            {item.stats && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-neon rounded-full"></span>
                                                                    <span>{item.stats}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 text-white/30 text-center border border-dashed border-white/10 rounded-xl">
                                            <Trophy size={32} className="mb-2 opacity-50" />
                                            <p className="font-rajdhani uppercase tracking-widest text-sm">History records unavailable</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default TournamentModal
