import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, MapPin, Search, Download, CircleDot } from 'lucide-react'
import html2canvas from 'html2canvas'
import { supabase } from '../../lib/supabase'

/* ---------------------------------------------------------------
   TeamLogo Helper - dynamically resolves team logo or shows initial
--------------------------------------------------------------- */
const TeamLogo = ({ teamName, align }) => {
    const [error, setError] = useState(false);
    const initials = teamName ? teamName.substring(0, 2).toUpperCase() : '??';
    return (
        <div className={`relative flex-none w-8 h-8 md:w-12 md:h-12 ${align === 'right' ? 'ml-3 md:ml-4' : 'mr-3 md:mr-4'} flex items-center justify-center`}>
            {!error ? (
                <img
                    src={`/teams/${teamName}.png`}
                    alt={teamName}
                    className="w-full h-full object-contain drop-shadow-lg"
                    onError={() => setError(true)}
                />
            ) : (
                <div className="w-full h-full rounded-full bg-white/5 border border-white/20 flex items-center justify-center font-bebas text-sm md:text-base text-white/50 shadow-inner">
                    {initials}
                </div>
            )}
        </div>
    );
};

/* ---------------------------------------------------------------
   FullScheduleModal — Fetches and displays all matches 
--------------------------------------------------------------- */

const FullScheduleModal = ({ isOpen, onClose }) => {
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('All') // 'All', 'Scheduled', 'Completed', 'Groups'
    const [groupStandings, setGroupStandings] = useState({ A: [], B: [] })
    const [exporting, setExporting] = useState(null)

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

    const exportElementAsPoster = async (elementId, filename, exportingIdentifier) => {
        try {
            setExporting(exportingIdentifier);
            const element = document.getElementById(elementId);
            if (!element) return;

            const canvas = await html2canvas(element, {
                backgroundColor: '#0a0a0a',
                scale: 2,
                logging: false,
                useCORS: true
            });

            const image = canvas.toDataURL('image/jpeg', 0.9);
            const link = document.createElement('a');
            link.href = image;
            link.download = filename;
            link.click();
        } catch (error) {
            console.error('Error generating poster:', error);
        } finally {
            setExporting(null);
        }
    };

    const filteredMatches = matches.filter(match => {
        if (filter === 'All') return true
        if (filter === 'Scheduled') return match.status === 'Scheduled'
        if (filter === 'Completed') return match.status === 'Completed' || match.status === 'Live'
        return true
    })

    const groupedMatches = filteredMatches.reduce((groups, match) => {
        const d = new Date(match.date);

        const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
        const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
        const dateKey = `${dayName}|${shortDate}`;
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(match);
        return groups;
    }, {});

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
                                    NCL Season 26
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
                                            <div key={groupName} id={`poster-${groupName}`} className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                                                <div className="bg-gradient-to-r from-laser-blue/20 to-transparent border-b border-white/10 p-4 flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-bebas text-3xl text-white tracking-widest uppercase mb-0">
                                                            Group {groupName}
                                                        </h3>
                                                        <p className="text-[10px] md:text-xs text-white/50 font-rajdhani uppercase tracking-widest mt-1">NCL Season 2026</p>
                                                    </div>
                                                    <button
                                                        onClick={() => exportElementAsPoster(`poster-${groupName}`, `NCL-Group-${groupName}-Standings.jpg`, `group-${groupName}`)}
                                                        disabled={exporting === `group-${groupName}`}
                                                        data-html2canvas-ignore="true"
                                                        className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 hover:bg-laser-blue text-white rounded transition-colors font-rajdhani text-sm uppercase tracking-widest border border-white/10"
                                                    >
                                                        <Download size={16} />
                                                        <span className="hidden sm:inline">{exporting === `group-${groupName}` ? 'Exporting...' : 'Export Poster'}</span>
                                                        <span className="sm:hidden">{exporting === `group-${groupName}` ? '...' : 'Export'}</span>
                                                    </button>
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
                            ) : Object.keys(groupedMatches).length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-center bg-white/5 rounded-xl border border-white/5 border-dashed">
                                    <Search className="text-white/20 mb-4" size={32} />
                                    <p className="text-white/50 font-rajdhani uppercase tracking-widest">No Matches Found</p>
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    {Object.keys(groupedMatches).map(dateKey => {
                                        const [dayName, shortDate] = dateKey.split('|');
                                        const dateIdStr = shortDate.replace(/[^a-zA-Z0-9]/g, '-');
                                        return (
                                            <div key={dateKey} id={`poster-date-${dateIdStr}`} className="ucl-poster-bg border border-white/10 rounded-xl overflow-hidden shadow-2xl relative p-6 md:p-10 flex flex-col pt-12 md:pt-16">

                                                {/* Actions Header (Ignored in poster export) */}
                                                <div className="flex justify-between items-center z-20 mb-4" data-html2canvas-ignore="true">
                                                    <div className="text-white/40 text-xs font-rajdhani uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/10">
                                                        {filter === 'Completed' ? 'Results Export' : 'Schedule Export'}
                                                    </div>
                                                    <button
                                                        onClick={() => exportElementAsPoster(`poster-date-${dateIdStr}`, `NCL-Matches-${dateIdStr}.jpg`, `date-${dateIdStr}`)}
                                                        disabled={exporting === `date-${dateIdStr}`}
                                                        className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-laser-blue/20 hover:bg-laser-blue text-white rounded transition-all font-rajdhani text-sm uppercase tracking-widest border border-laser-blue/50 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                                                    >
                                                        <Download size={16} />
                                                        <span className="hidden sm:inline">{exporting === `date-${dateIdStr}` ? 'Generating...' : 'Export Poster'}</span>
                                                        <span className="sm:hidden">{exporting === `date-${dateIdStr}` ? '...' : 'Export'}</span>
                                                    </button>
                                                </div>

                                                {/* UCL Style Main Header */}
                                                <div className="text-center z-10 mb-8 mt-2">
                                                    <div className="flex justify-center mb-3">
                                                        <div className="w-12 h-12 border-2 border-white/80 rounded-full flex items-center justify-center backdrop-blur-md relative overflow-hidden">
                                                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-pink-500/20"></div>
                                                            <CircleDot size={24} className="text-white/80 opacity-80" />
                                                        </div>
                                                    </div>
                                                    <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-[0.08em] uppercase italic transform -skew-x-[12deg] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] m-0 mb-3 md:mb-4 leading-none">
                                                        {dayName}
                                                    </h2>
                                                    <p className="text-sm md:text-base text-white/90 font-rajdhani uppercase tracking-[0.3em] font-bold drop-shadow-md">
                                                        {shortDate} {filter === 'Completed' ? 'RESULTS' : 'MATCHES'}
                                                    </p>
                                                </div>

                                                {/* Matches Container Stacked List */}
                                                <div className="rounded-2xl overflow-hidden bg-[#000030]/60 backdrop-blur-md border border-white/10 z-10 relative mt-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                                    <div className="flex flex-col py-4">
                                                        {groupedMatches[dateKey].map((match, idx) => (
                                                            <div key={match.id} className={`flex items-center justify-between px-4 md:px-8 py-4 md:py-5 transition-colors group relative ${idx !== groupedMatches[dateKey].length - 1 ? 'border-b border-white/5' : ''}`}>

                                                                {/* Hover highlight effect */}
                                                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                                                                {/* Team 1 (Left Side, text right aligned) */}
                                                                <div className="flex items-center justify-end flex-1 w-[40%] z-10">
                                                                    <span className="font-rajdhani font-bold text-base md:text-xl text-white text-right break-words line-clamp-2 leading-tight tracking-wider uppercase py-1 min-w-0">
                                                                        {match.team1}
                                                                    </span>
                                                                    <TeamLogo teamName={match.team1} align="right" />
                                                                </div>

                                                                {/* Score / Center Box */}
                                                                <div className="flex-shrink-0 px-2 w-[20%] flex justify-center items-center z-10">
                                                                    {match.status === 'Completed' ? (
                                                                        <span className="font-bebas text-3xl md:text-4xl text-[#00f2fe] font-bold tabular-nums drop-shadow-[0_0_10px_rgba(0,242,254,0.4)]">
                                                                            {match.home_score} - {match.away_score}
                                                                        </span>
                                                                    ) : match.status === 'Live' ? (
                                                                        <span className="text-[10px] md:text-xs bg-red-500/20 text-red-500 px-3 py-1 rounded animate-pulse uppercase font-bold tracking-widest border border-red-500/30">
                                                                            LIVE
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-xs md:text-sm text-white/50 font-rajdhani font-semibold tracking-widest bg-black/40 px-3 py-1.5 rounded-md border border-white/5">
                                                                            {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* Team 2 (Right Side, text left aligned) */}
                                                                <div className="flex items-center justify-start flex-1 w-[40%] z-10">
                                                                    <TeamLogo teamName={match.team2} align="left" />
                                                                    <span className="font-rajdhani font-bold text-base md:text-xl text-white text-left break-words line-clamp-2 leading-tight tracking-wider uppercase py-1 min-w-0">
                                                                        {match.team2}
                                                                    </span>
                                                                </div>

                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Branding Footer */}
                                                <div className="mt-8 mb-2 text-center z-10">
                                                    <p className="text-[10px] md:text-xs text-white/40 font-rajdhani uppercase tracking-[0.4em] drop-shadow-md">
                                                        NCL Season 2026 • nitrrfc.vercel.app
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
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
