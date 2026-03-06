import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import AbstractPlayerCard from '../components/common/AbstractPlayerCard'
import PlayerCardBase from '../components/common/PlayerCardBase'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { supabase } from '../lib/supabase'
import SEO from '../components/common/SEO'

const Team = () => {
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('Main Squad')
    const [selectedPlayer, setSelectedPlayer] = useState(null)

    // Dynamically scale the 400px card to always fit the screen with 16px padding on each side
    const getCardScale = useCallback(() => Math.min(1, (window.innerWidth - 32) / 400), [])
    const [cardScale, setCardScale] = useState(getCardScale)
    useEffect(() => {
        const onResize = () => setCardScale(getCardScale())
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [getCardScale])

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

    // Helper to get glow color based on variant
    const getGlowColor = (player) => {
        let variant = 'standard'
        if (player.card_variant) variant = player.card_variant
        else if (player.status === 'Alumni' || player.year === 'Alumni') variant = 'standard'
        else if (player.photo_url && player.photo_url.includes('?')) {
            try {
                const params = new URLSearchParams(player.photo_url.split('?')[1])
                variant = params.get('variant') || 'standard'
            } catch (e) { }
        }

        switch (variant) {
            case 'gold': return 'rgba(255, 215, 0, 0.6)'
            case 'silver': return 'rgba(192, 192, 192, 0.6)'
            case 'neon': return 'rgba(57, 255, 20, 0.6)'
            case 'brown': return 'rgba(84, 70, 43, 0.6)'
            default: return 'rgba(0, 212, 255, 0.6)'
        }
    }

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
                                    onClick={() => setSelectedPlayer(player)}
                                    className="cursor-pointer hover:scale-105 transition-transform duration-300"
                                >
                                    <AbstractPlayerCard player={player} showStats={false} showRating={true} />
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
                            {/* Outer wrapper sized to the visually-scaled card so flex centering works */}
                            <div
                                style={{
                                    width: `${400 * cardScale}px`,
                                    height: `${600 * cardScale}px`,
                                    position: 'relative',
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedPlayer(null)}
                                    className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors p-2 z-[70] touch-manipulation"
                                >
                                    <X size={32} />
                                </button>

                                {/* Card scaled from top-left to match wrapper dimensions */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: cardScale }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                                    style={{ transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}
                                >
                                    <PlayerCardBase player={selectedPlayer} animated={true} />
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    )
}

export default Team
