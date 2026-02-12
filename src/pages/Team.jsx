import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import AbstractPlayerCard from '../components/common/AbstractPlayerCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { supabase } from '../lib/supabase'

const Team = () => {
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('Main Squad')

    const positions = ['Alumni', 'Main Squad', 'All', 'ST', 'CM', 'CDM', 'Winger', 'Fullback', 'CB', 'GK']

    useEffect(() => {
        fetchPlayers()
    }, [])

    const fetchPlayers = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('players')
                .select('*')
                .or('status.eq.Ready,status.eq.Alumni') // Show Ready and Alumni players
                .order('created_at', { ascending: false })

            if (error) throw error
            setPlayers(data || [])
        } catch (error) {
            console.error('Error fetching players:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredPlayers = players.filter(p => {
        if (filter === 'Alumni') return p.status === 'Alumni'

        // Exclude Alumni from other filters (Squad, Positions, etc.)
        if (p.status === 'Alumni') return false

        if (filter === 'All') return true
        if (filter === 'Main Squad') return p.is_main_team
        return p.position === filter
    })

    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative border-l border-white/10 pl-8 md:pl-16 py-8"
                    >
                        <h1 className="text-[15vw] leading-none font-bebas text-white/5 absolute -top-20 -left-10 select-none pointer-events-none">
                            ROSTER
                        </h1>
                        <h2 className="text-sm font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-4 relative z-10">
                            Active Squad
                        </h2>
                        <h1 className="text-6xl md:text-8xl font-bebas text-white uppercase tracking-tighter leading-[0.9] relative z-10 mix-blend-difference">
                            THE <span className="text-outline-active">ELITE</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Filter & Grid */}
            <section className="pb-20 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Minimal Filters */}
                    <div className="flex flex-wrap gap-8 mb-16 border-b border-white/10 pb-4">
                        {positions.map(pos => (
                            <button
                                key={pos}
                                onClick={() => setFilter(pos)}
                                className={`text-sm font-rajdhani uppercase tracking-[0.2em] transition-all relative group ${filter === pos ? 'text-white' : 'text-white/60 hover:text-white'
                                    }`}
                            >
                                {pos}
                                <span className={`absolute -bottom-4 left-0 w-full h-[1px] bg-laser-blue transition-transform duration-300 origin-left ${filter === pos ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                    }`}></span>
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-6">
                            <LoadingSpinner size="xl" color="laser-blue" />
                            <p className="text-xs font-rajdhani tracking-[0.2em] uppercase text-white/60">Loading Roster...</p>
                        </div>
                    ) : filteredPlayers.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center border border-white/5 bg-white/5">
                            <p className="text-4xl font-bebas text-white/50 uppercase">No Players Found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                            {filteredPlayers.map((player, index) => (
                                <motion.div
                                    key={player.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.8 }}
                                >
                                    <AbstractPlayerCard player={player} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Team
