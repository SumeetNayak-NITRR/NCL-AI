import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import FullScheduleModal from './FullScheduleModal'

/* ---------------------------------------------------------------
   UpcomingMatches — a sleek sideways-scrolling list of 
   upcoming fixtures for the Landing/NCL page, fetched dynamically.
--------------------------------------------------------------- */

const UpcomingMatches = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUpcoming = async () => {
            setLoading(true)
            // Fetch the upcoming matches, or recently completed if no scheduled matches exist
            const { data, error } = await supabase
                .from('matches')
                .select('*')
                .order('date', { ascending: true })
                .limit(4) // Fetch a handful for the carousel

            if (!error && data) {
                // Prioritize scheduled matches, but keep completed if needed to fill the list
                const sorted = data.sort((a, b) => {
                    if (a.status === 'Scheduled' && b.status !== 'Scheduled') return -1;
                    if (a.status !== 'Scheduled' && b.status === 'Scheduled') return 1;
                    return 0; // maintain date ascending order
                })
                setMatches(sorted)
            }
            setLoading(false)
        }

        fetchUpcoming()
    }, [])

    return (
        <section className="py-24 px-6 bg-void-black relative border-y border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-2">
                            The Fixtures
                        </h2>
                        <h1 className="text-4xl md:text-6xl font-bebas text-white uppercase tracking-tighter leading-none">
                            Upcoming <span className="text-outline-active">Matches</span>
                        </h1>
                    </motion.div>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 md:mx-0 md:px-0 gap-6 hide-scrollbar">
                    {loading ? (
                        // Skeleton Loaders
                        [1, 2, 3].map((i) => (
                            <div key={`skeleton-${i}`} className="bg-white/5 border border-white/10 p-6 min-w-[85vw] md:min-w-[400px] snap-center shrink-0 relative overflow-hidden animate-pulse">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex gap-2">
                                        <div className="h-6 w-16 bg-white/10 rounded-sm"></div>
                                        <div className="h-6 w-20 bg-white/10 rounded-sm"></div>
                                    </div>
                                    <div className="h-4 w-24 bg-white/10 rounded"></div>
                                </div>
                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
                                    <div className="h-8 w-24 bg-white/10 rounded"></div>
                                    <div className="h-4 w-6 bg-white/5 rounded"></div>
                                    <div className="h-8 w-24 bg-white/10 rounded"></div>
                                </div>
                                <div className="mt-8 h-4 w-32 bg-white/5 rounded"></div>
                            </div>
                        ))
                    ) : matches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center bg-white/5 rounded-xl border border-white/5 border-dashed min-w-[85vw] md:min-w-[400px]">
                            <p className="text-white/50 font-rajdhani uppercase tracking-widest text-lg">No Matches Scheduled</p>
                        </div>
                    ) : (
                        matches.map((match, i) => (
                            <motion.div
                                key={match.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/10 p-6 min-w-[85vw] md:min-w-[400px] snap-center shrink-0 relative overflow-hidden group hover:border-laser-blue/50 transition-colors"
                            >
                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-laser-blue/0 via-transparent to-laser-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex gap-2">
                                        <span className="text-xs font-rajdhani text-laser-blue tracking-[0.2em] uppercase bg-laser-blue/10 px-3 py-1 rounded-sm">
                                            {match.status}
                                        </span>
                                        {match.category && (
                                            <span className="text-xs font-rajdhani text-white/70 tracking-[0.2em] uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-sm">
                                                {match.category}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-4 text-white/50 text-xs font-inter uppercase tracking-wide">
                                        <span className="flex items-center gap-1.5 cursor-default hover:text-white transition-colors" title={new Date(match.date).toLocaleDateString()}>
                                            <Calendar size={14} />
                                            {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        {match.status === 'Scheduled' && (
                                            <span className="flex items-center gap-1.5 text-white/90 cursor-default">
                                                <Clock size={14} className="text-laser-blue" />
                                                {new Date(match.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                    <span className="font-bebas text-3xl text-white tracking-widest uppercase truncate w-2/5">
                                        {match.team1}
                                    </span>

                                    {match.status === 'Scheduled' ? (
                                        <span className="font-rajdhani text-sm text-white/30 tracking-[0.2em]">VS</span>
                                    ) : (
                                        <span className="font-bebas text-2xl bg-black/50 px-3 py-1 rounded border border-white/10 text-white shrink-0 whitespace-nowrap">
                                            {match.home_score} - {match.away_score}
                                        </span>
                                    )}

                                    <span className="font-bebas text-3xl text-white tracking-widest uppercase text-right truncate w-2/5">
                                        {match.team2}
                                    </span>
                                </div>

                                {/* Location Footer */}
                                <div className="mt-8 flex items-center gap-2 text-white/40 text-xs font-rajdhani uppercase tracking-[0.1em]">
                                    <MapPin size={12} className="text-laser-blue/70" />
                                    {match.venue || 'NIT Raipur Football Ground'}
                                </div>
                            </motion.div>
                        ))
                    )}

                    {/* "View All" Modal Trigger */}
                    <div
                        onClick={() => setIsModalOpen(true)}
                        className="bg-transparent border border-white/5 border-dashed p-6 min-w-[40vw] md:min-w-[200px] snap-center shrink-0 flex items-center justify-center cursor-pointer hover:border-laser-blue/50 hover:bg-white/5 transition-all text-white/50 hover:text-white font-rajdhani uppercase tracking-[0.3em] text-sm group"
                    >
                        <span className="group-active:scale-95 transition-transform">Full Schedule →</span>
                    </div>
                </div>
            </div>

            <FullScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    )
}

export default UpcomingMatches
