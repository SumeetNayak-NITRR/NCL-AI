import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, MapPin, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'

/* ---------------------------------------------------------------
   FullScheduleModal — Fetches and displays all matches 
   (Scheduled, Live, Completed) grouped or filtered.
--------------------------------------------------------------- */

const FullScheduleModal = ({ isOpen, onClose }) => {
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('All') // 'All', 'Scheduled', 'Completed', 'Groups'
    const [groupStandings, setGroupStandings] = useState({ A: [], B: [] })

    // Helper to calculate standings from matches dynamically based on Match Category
    const calculateStandings = (allMatches) => {
        const teams = {}
        const groupNames = new Set()

        // 1. Identify groups and initialize teams based on matches tagged with "Group X"
        allMatches.forEach(m => {
            if (!m.team1 || !m.team2 || !m.category) return;

            // If the category starts with "Group ", e.g., "Group A", "Group B"
            if (m.category.toLowerCase().startsWith('group ')) {
                const groupName = m.category.split(' ')[1]?.toUpperCase() || 'A';
                groupNames.add(groupName);

                if (!teams[m.team1]) teams[m.team1] = { name: m.team1, group: groupName, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }
                if (!teams[m.team2]) teams[m.team2] = { name: m.team2, group: groupName, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }
            }
        })

        // 2. Process completed match results
        allMatches.forEach(m => {
            if (m.status === 'Completed' && m.home_score !== null && m.away_score !== null) {
                const t1 = teams[m.team1];
                const t2 = teams[m.team2];

                // Only calculate points if both teams are established in a group structure
                if (t1 && t2) {
                    t1.p += 1; t2.p += 1;
                    t1.gf += m.home_score; t1.ga += m.away_score;
                    t2.gf += m.away_score; t2.ga += m.home_score;

                    t1.gd = t1.gf - t1.ga;
                    t2.gd = t2.gf - t2.ga;

                    if (m.home_score > m.away_score) {
                        t1.w += 1; t1.pts += 3;
                        t2.l += 1;
                    } else if (m.home_score < m.away_score) {
                        t2.w += 1; t2.pts += 3;
                        t1.l += 1;
                    } else {
                        t1.d += 1; t2.d += 1;
                        t1.pts += 1; t2.pts += 1;
                    }
                }
            }
        });

        // 3. Format into the final arrays per group, sorted by Points then Goal Difference
        const standings = {};
        [...groupNames].sort().forEach(g => {
            standings[g] = Object.values(teams)
                .filter(t => t.group === g)
                .sort((a, b) => b.pts - a.pts || b.gd - a.gd);
        });

        // Provide empty A/B as fallback if no data exists yet to keep UI from crashing
        if (Object.keys(standings).length === 0) {
            return { A: [], B: [] };
        }

        return standings;
    }

    useEffect(() => {
        if (!isOpen) return

        const fetchAllMatches = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('matches')
                .select('*')
                .order('date', { ascending: true })

            if (!error && data) {
                setMatches(data)
                setGroupStandings(calculateStandings(data))
            }
            setLoading(false)
        }

        fetchAllMatches()
    }, [isOpen])

    const filteredMatches = matches.filter(match => {
        if (filter === 'All') return true
        if (filter === 'Scheduled') return match.status === 'Scheduled'
        if (filter === 'Completed') return match.status === 'Completed' || match.status === 'Live'
        return true
    })

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-0 md:m-auto md:h-[85vh] md:w-full md:max-w-5xl bg-[#0a0a0a] border border-white/10 shadow-2xl z-[101] flex flex-col rounded-xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 md:p-8 flex justify-between items-start border-b border-white/10 bg-black/50">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-bebas text-white tracking-widest uppercase mb-1">
                                    Full <span className="text-laser-blue">Schedule</span>
                                </h2>
                                <p className="text-white/50 font-rajdhani text-sm uppercase tracking-[0.2em]">
                                    NCL Season 2025-26
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2 p-6 border-b border-white/5 overflow-x-auto hide-scrollbar">
                            {['All', 'Scheduled', 'Completed', 'Groups'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-sm font-rajdhani text-sm uppercase tracking-widest whitespace-nowrap transition-colors ${filter === f
                                        ? 'bg-laser-blue text-white'
                                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {f === 'Groups' ? 'Group Standings' : `${f} Matches`}
                                </button>
                            ))}
                        </div>

                        {/* Content (Scrollable) */}
                        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-gradient-to-b from-[#0a0a0a] to-black">
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-lg animate-pulse">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="w-16 h-4 bg-white/10 rounded"></div>
                                                <div className="w-12 h-4 bg-white/10 rounded"></div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="w-24 h-6 bg-white/10 rounded"></div>
                                                <div className="w-16 h-8 bg-white/5 rounded"></div>
                                                <div className="w-24 h-6 bg-white/10 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filter === 'Groups' ? (
                                <div className="space-y-12">
                                    {/* Group Tables Render */}
                                    {Object.keys(groupStandings).length === 0 ? (
                                        <div className="flex flex-col items-center justify-center p-12 text-center bg-white/5 rounded-xl border border-white/5 border-dashed">
                                            <p className="text-white/50 font-rajdhani uppercase tracking-widest text-lg">No Group Data Available</p>
                                            <p className="text-white/30 text-sm mt-2">Groups will appear here once matches are scheduled with a "Group" category.</p>
                                        </div>
                                    ) : (
                                        Object.keys(groupStandings).map(groupName => (
                                            <div key={groupName} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                                <div className="bg-gradient-to-r from-laser-blue/20 to-transparent border-b border-white/10 p-4">
                                                    <h3 className="font-bebas text-3xl text-white tracking-widest uppercase">
                                                        Group {groupName}
                                                    </h3>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left font-rajdhani whitespace-nowrap">
                                                        <thead className="text-white/50 text-xs uppercase tracking-widest border-b border-white/10 bg-black/40">
                                                            <tr>
                                                                <th className="p-4 pl-6 font-normal w-12 text-center">#</th>
                                                                <th className="p-4 font-normal w-full">Club</th>
                                                                <th className="p-4 font-normal text-center w-12" title="Matches Played">MP</th>
                                                                <th className="p-4 font-normal text-center w-12" title="Won">W</th>
                                                                <th className="p-4 font-normal text-center w-12" title="Drawn">D</th>
                                                                <th className="p-4 font-normal text-center w-12" title="Lost">L</th>
                                                                <th className="p-4 font-normal text-center w-12 text-white/30" title="Goals For">GF</th>
                                                                <th className="p-4 font-normal text-center w-12 text-white/30" title="Goals Against">GA</th>
                                                                <th className="p-4 font-normal text-center w-16" title="Goal Difference">GD</th>
                                                                <th className="p-4 pr-6 font-bold text-laser-blue text-center w-16 text-sm" title="Points">Pts</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-white/5 text-sm md:text-base">
                                                            {groupStandings[groupName].map((team, index) => (
                                                                <tr key={team.name} className={`hover:bg-white/5 transition-colors group ${index < 2 ? 'bg-laser-blue/5' : ''}`}>
                                                                    <td className="p-4 pl-6 flex items-center gap-3">
                                                                        <span className={`text-xs font-bold ${index < 2 ? 'text-laser-blue' : 'text-white/50'}`}>
                                                                            {index + 1}
                                                                        </span>
                                                                        {index < 2 && <div className="w-1 h-5 bg-laser-blue rounded-full"></div>}
                                                                    </td>
                                                                    <td className="p-4 font-oswald text-white uppercase tracking-wide group-hover:text-gold transition-colors">{team.name}</td>
                                                                    <td className="p-4 text-center text-white/90 font-mono text-sm">{team.p}</td>
                                                                    <td className="p-4 text-center text-white/70 font-mono text-sm">{team.w}</td>
                                                                    <td className="p-4 text-center text-white/70 font-mono text-sm">{team.d}</td>
                                                                    <td className="p-4 text-center text-white/70 font-mono text-sm">{team.l}</td>
                                                                    <td className="p-4 text-center text-white/30 font-mono text-xs">{team.gf}</td>
                                                                    <td className="p-4 text-center text-white/30 font-mono text-xs">{team.ga}</td>
                                                                    <td className="p-4 text-center text-white/70 font-mono text-sm">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                                                                    <td className="p-4 pr-6 text-center font-bold text-laser-blue text-xl font-bebas">{team.pts}</td>
                                                                </tr>
                                                            ))}
                                                            {groupStandings[groupName].length === 0 && (
                                                                <tr>
                                                                    <td colSpan="10" className="p-8 text-center text-white/30 uppercase tracking-widest">
                                                                        No data for Group {groupName} yet
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : filteredMatches.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-center bg-white/5 rounded-xl border border-white/5 border-dashed">
                                    <Search className="text-white/20 mb-4" size={32} />
                                    <p className="text-white/50 font-rajdhani uppercase tracking-widest">No Matches Found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredMatches.map(match => (
                                        <div key={match.id} className="bg-white/5 border border-white/10 p-5 rounded-lg hover:border-laser-blue/30 transition-colors group">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex gap-2">
                                                    <span className="text-[10px] font-rajdhani text-laser-blue uppercase tracking-widest bg-laser-blue/10 px-2 py-0.5 rounded">
                                                        {match.category || 'Match'}
                                                    </span>
                                                    {match.status === 'Scheduled' && (
                                                        <span className="text-[10px] font-rajdhani text-white/50 border border-white/10 uppercase tracking-widest px-2 py-0.5 rounded">
                                                            {new Date(match.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    )}
                                                </div>

                                                {match.status === 'Completed' ? (
                                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase font-bold tracking-widest text-white/70">
                                                        FT
                                                    </span>
                                                ) : match.status === 'Live' ? (
                                                    <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded animate-pulse uppercase font-bold tracking-widest">
                                                        LIVE
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[10px] text-white/50 uppercase font-rajdhani tracking-widest">
                                                        <Clock size={10} /> {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                                <span className={`font-bebas text-xl md:text-2xl truncate min-w-0 flex-1 ${match.status === 'Completed' && match.home_score > match.away_score ? 'text-gold' : 'text-white'}`}>
                                                    {match.team1}
                                                </span>

                                                {match.status === 'Scheduled' ? (
                                                    <span className="font-rajdhani text-xs text-white/30 tracking-widest px-2 shrink-0">VS</span>
                                                ) : (
                                                    <span className="font-bebas text-xl md:text-2xl bg-black/50 px-3 py-1 rounded border border-white/10 text-white shrink-0 whitespace-nowrap">
                                                        {match.home_score} - {match.away_score}
                                                    </span>
                                                )}

                                                <span className={`font-bebas text-xl md:text-2xl text-right truncate min-w-0 flex-1 ${match.status === 'Completed' && match.away_score > match.home_score ? 'text-gold' : 'text-white'}`}>
                                                    {match.team2}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default FullScheduleModal
