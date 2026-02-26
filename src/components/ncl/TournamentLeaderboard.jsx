import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LoadingSpinner from '../common/LoadingSpinner'
import { supabase } from '../../lib/supabase'
import { Trophy, Footprints, Shield } from 'lucide-react'

const TournamentLeaderboard = () => {
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('players')
            .select('*')
            .order('goals', { ascending: false })

        if (error) console.error('Error fetching stats:', error)
        else setPlayers(data || [])
        setLoading(false)
    }

    // Helper to get top players
    const getTopScorers = () => [...players].sort((a, b) => b.goals - a.goals || b.assists - a.assists).slice(0, 10).filter(p => p.goals > 0)
    const getTopAssists = () => [...players].sort((a, b) => b.assists - a.assists || b.goals - a.goals).slice(0, 10).filter(p => p.assists > 0)
    const getTopCleanSheets = () => [...players].sort((a, b) => b.clean_sheets - a.clean_sheets).slice(0, 10).filter(p => p.clean_sheets > 0)

    const StatCard = ({ title, icon: Icon, color, data, valueKey, label }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm flex flex-col h-full"
        >
            <div className={`p-6 border-b border-white/5 bg-gradient-to-r from-${color}/10 to-transparent flex items-center gap-4`}>
                <div className={`p-3 rounded-full bg-${color}/20 text-${color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bebas uppercase text-white tracking-wide">{title}</h3>
                    <p className="text-xs font-rajdhani uppercase text-white/40 tracking-wider">{label}</p>
                </div>
            </div>

            <div className="flex-1 p-0">
                {loading ? (
                    <div className="h-40 flex items-center justify-center">
                        <LoadingSpinner size="sm" color={color} />
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-white/20 font-rajdhani uppercase tracking-widest text-sm">
                        No stats recorded yet
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {data.map((player, index) => (
                            <div key={player.id} className="flex items-center p-4 hover:bg-white/5 transition-colors group">
                                <div className={`w-8 h-8 flex items-center justify-center font-bebas text-lg ${index < 3 ? `text-${color}` : 'text-white/20'}`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-black rounded-full overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors">
                                        {player.photo_url ? (
                                            <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/10 text-xs">?</div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-oswald text-white uppercase text-sm tracking-wide group-hover:text-gold transition-colors">{player.name}</div>
                                        <div className="text-[10px] text-white/40 font-rajdhani uppercase">{player.position} • {player.year}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-bebas text-2xl text-${color} drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]`}>
                                        {player[valueKey]}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )

    return (
        <section className="py-24 px-6 relative z-10" id="leaderboard">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-4">
                            Tournament Stats
                        </h2>
                        <h1 className="text-5xl md:text-7xl font-bebas text-white uppercase tracking-tighter leading-[0.85] mix-blend-difference">
                            LEADER<span className="text-outline-active">BOARDS</span>
                        </h1>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <StatCard
                        title="Golden Boot"
                        icon={Trophy}
                        color="gold"
                        data={getTopScorers()}
                        valueKey="goals"
                        label="Top Goal Scorer"
                    />

                    <StatCard
                        title="Playmaker"
                        icon={Footprints}
                        color="neon"
                        data={getTopAssists()}
                        valueKey="assists"
                        label="Most Assists"
                    />

                    <StatCard
                        title="Golden Glove"
                        icon={Shield}
                        color="laser-blue"
                        data={getTopCleanSheets()}
                        valueKey="clean_sheets"
                        label="Most Clean Sheets"
                    />
                </div>
            </div>
        </section>
    )
}

export default TournamentLeaderboard
