import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User } from 'lucide-react'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import AbstractPlayerCard from '../components/common/AbstractPlayerCard'
import PlayerCardBase from '../components/common/PlayerCardBase'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { supabase } from '../lib/supabase'
import SEO from '../components/common/SEO'

const InstaPlayerRow = ({ player }) => {
    const average = Math.round((player.pace + player.shooting + player.passing + player.dribbling + player.defending + player.physical) / 6)

    return (
        <div className="flex items-center gap-4 p-4 border border-white/10 rounded-xl bg-black/40 hover:bg-white/5 active:bg-white/10 transition-colors w-full cursor-pointer">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-laser-blue/50 flex-shrink-0 bg-dark-navy relative">
                {player.photo_url ? (
                    <img
                        src={player.photo_url}
                        alt={player.name}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/30">
                        <User size={24} />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="font-bebas text-2xl text-white truncate leading-none mb-1">
                        {player.name}
                    </h3>
                    {(player.is_captain || player.is_vice_captain) && (
                        <span className="font-rajdhani text-[10px] uppercase font-bold text-black bg-yellow-500 px-1 rounded-sm leading-tight">
                            {player.is_captain ? 'CPT' : 'VC'}
                        </span>
                    )}
                </div>
                <p className="font-rajdhani text-xs text-white/60 uppercase tracking-widest truncate">
                    {player.position} {player.branch && `• ${player.branch}`} {player.year && `• ${player.year}`}
                </p>
            </div>

            <div className="flex flex-col items-center justify-center flex-shrink-0 w-12 opacity-80">
                <div className="font-bebas text-2xl text-laser-blue leading-none">
                    {average}
                </div>
                <div className="font-rajdhani text-[10px] text-white/40 uppercase tracking-wider">OVR</div>
            </div>
        </div>
    )
}

const Team = () => {
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('Main Squad')
    const [selectedPlayer, setSelectedPlayer] = useState(null)

    const positions = ['Alumni', 'Main Squad', 'All', 'ST', 'CF', 'LW', 'RW', 'LM', 'RM', 'CAM', 'CM', 'CDM', 'LB', 'RB', 'CB', 'GK']

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
        const isAlumni = p.status === 'Alumni' || p.year === 'Alumni'

        if (filter === 'Alumni') return isAlumni

        // Exclude Alumni from other filters (Squad, Positions, etc.)
        if (isAlumni) return false

        if (filter === 'All') return true
        if (filter === 'Main Squad') return p.is_main_team
        return p.position === filter
    })



    // Detect if we are on a mobile device
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen relative">
            <SEO
                title="Roster"
                description="Meet the elite players of NITRR FC. View the main squad, alumni, and player stats."
            />
            <Navigation />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: isMobile ? 0 : 50 }}
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
                        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-x-8 sm:gap-y-16 px-2 sm:px-0">
                            {filteredPlayers.map((player, index) => (
                                <motion.div
                                    key={player.id}
                                    initial={{ opacity: 0, y: isMobile ? 0 : 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: isMobile ? "200px" : "0px" }}
                                    transition={{ delay: isMobile ? 0 : index * 0.1, duration: isMobile ? 0.3 : 0.8 }}
                                    onClick={() => setSelectedPlayer(player)}
                                    className="cursor-pointer hover:scale-[1.02] sm:hover:scale-105 transition-transform duration-300 w-full sm:max-w-none flex justify-center"
                                    layoutId={`card-${player.id}`}
                                >
                                    {isMobile ? (
                                        <InstaPlayerRow player={player} />
                                    ) : (
                                        <AbstractPlayerCard player={player} showStats={false} showRating={true} />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Modal Overlay */}
            <AnimatePresence>
                {selectedPlayer && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPlayer(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
                        >
                            <motion.div
                                layoutId={`card-${selectedPlayer.id}`}
                                className="relative"
                                onClick={(e) => e.stopPropagation()}
                            >

                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedPlayer(null)}
                                    className="absolute -top-12 right-0 md:-right-12 text-white/50 hover:text-white transition-colors p-2 z-[70]"
                                >
                                    <X size={32} />
                                </button>

                                {/* High-Fidelity Card */}
                                <div className="relative z-[65] scale-90 md:scale-100 origin-center">
                                    <PlayerCardBase player={selectedPlayer} animated={true} />
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    )
}

export default Team
