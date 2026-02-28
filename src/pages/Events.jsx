import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import GlowCard from '../components/common/GlowCard'
import { Calendar, MapPin, ArrowUpRight, Clock, Trophy, Shield } from 'lucide-react'
import { fetchWithCache } from '../lib/cache'
import { supabase } from '../lib/supabase'
import SEO from '../components/common/SEO'
import TournamentModal from '../components/events/TournamentModal'
import { tournaments } from '../data/tournamentData'
import UpcomingMatches from '../components/ncl/UpcomingMatches'

const Events = () => {
    const [completedMatches, setCompletedMatches] = useState([])
    const [nextMatch, setNextMatch] = useState(null)
    const [selectedTournament, setSelectedTournament] = useState(null)
    const [timeLeft, setTimeLeft] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let timer

        const loadData = async () => {
            setLoading(true)

            try {
                // 1. Fetch Next Match (Cached for 1 min as it's time sensitive)
                const nextMatchData = await fetchWithCache('next_match', async () => {
                    const { data } = await supabase
                        .from('matches')
                        .select('*')
                        .eq('status', 'Scheduled')
                        .order('date', { ascending: true })
                        .limit(1)
                        .maybeSingle()
                    return data
                }, 1) // 1 minute cache

                if (nextMatchData) {
                    setNextMatch(nextMatchData)
                    calculateTimeLeft(nextMatchData.date)
                    timer = setInterval(() => calculateTimeLeft(nextMatchData.date), 1000 * 60)
                }

                // 2. Fetch Recent Results (Cached for 5 mins)
                const recentMatchesData = await fetchWithCache('recent_matches', async () => {
                    const { data } = await supabase
                        .from('matches')
                        .select('*')
                        .neq('status', 'Scheduled') // Get Live and Completed
                        .order('date', { ascending: false })
                        .limit(10)
                    return data
                }, 5) // 5 minutes cache

                if (recentMatchesData) {
                    setCompletedMatches(recentMatchesData)
                }
            } catch (error) {
                console.error("Error loading events:", error)
            } finally {
                setLoading(false)
            }
        }

        loadData()

        return () => {
            if (timer) clearInterval(timer)
        }
    }, [])

    const calculateTimeLeft = (dateString) => {
        const diff = new Date(dateString) - new Date()
        if (diff <= 0) {
            setTimeLeft('Match Starting Soon')
            return
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        setTimeLeft(`${days}d : ${hours}h : ${minutes}m`)
    }

    // Static Annual Events removed in favor of dynamic import

    return (
        <div className="min-h-screen bg-background text-white">
            <SEO
                title="Matches & Events"
                description="Stay updated with the latest NCL match schedule, tournament events, and community gatherings."
            />
            <Navigation />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-background via-black/50 to-background border-b border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                        <div>
                            <h2 className="text-sm font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-4">
                                Season 2025-26
                            </h2>
                            <h1 className="text-6xl md:text-8xl font-bebas text-white uppercase tracking-tighter leading-[0.9]">
                                MATCH <br />
                                <span className="text-outline-active">CENTER</span>
                            </h1>
                        </div>
                        <div className="md:text-right">
                            {/* Next Event Countdown */}
                            <div className="inline-block text-left bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm min-w-[300px] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-laser-blue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center gap-2 mb-2 text-laser-blue relative z-10">
                                    <Clock size={16} />
                                    <span className="text-xs font-rajdhani uppercase tracking-widest">Next Encounter</span>
                                </div>
                                {nextMatch ? (
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bebas uppercase text-white mb-1">
                                            {nextMatch.team1} <span className="text-white/40">vs</span> {nextMatch.team2}
                                        </h3>
                                        <div className="text-white/60 text-lg font-mono mb-2 tracking-widest">{timeLeft}</div>
                                        <div className="text-xs text-white/40 uppercase tracking-wider font-rajdhani flex items-center gap-2">
                                            <MapPin size={12} /> {nextMatch.venue}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bebas uppercase text-white/50 mb-1">No Upcoming Matches</h3>
                                        <div className="text-white/30 text-xs font-mono">Check back later</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Upcoming Matches — Full Fixtures Row */}
            <UpcomingMatches />

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Section 1: Annual Tournaments (Left Column - Larger) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Trophy className="text-gold" size={24} />
                        <h2 className="text-3xl font-oswald text-white uppercase">Annual Tournaments</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tournaments.map((event) => (
                            <GlowCard
                                key={event.id}
                                className="group relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 cursor-pointer"
                                onClick={() => setSelectedTournament(event)}
                            >
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover filter grayscale brightness-50 contrast-125 transition-all duration-700
                                             group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 group-hover:scale-110 group-hover:rotate-1"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <div className="bg-laser-blue/20 backdrop-blur-md px-2 py-0.5 rounded inline-block mb-2 border border-laser-blue/30">
                                        <span className="text-[10px] font-rajdhani text-laser-blue uppercase tracking-widest">
                                            {event.period}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bebas text-white uppercase leading-none mb-2 text-shadow-sm">
                                        {event.title}
                                    </h3>
                                    <p className="text-white/70 text-xs font-inter leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                                        {event.description}
                                    </p>
                                </div>
                            </GlowCard>
                        ))}
                    </div>
                </div>

                <TournamentModal
                    tournament={selectedTournament}
                    onClose={() => setSelectedTournament(null)}
                />

                {/* Section 2: Match Results Sidebar (Right Column - Compact) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="text-laser-blue" size={24} />
                            <h2 className="text-3xl font-oswald text-white uppercase">Recent Results</h2>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
                            <div className="divide-y divide-white/5">
                                {loading ? (
                                    <div className="p-8 text-center text-white/30 font-rajdhani animate-pulse">Loading results...</div>
                                ) : completedMatches.length === 0 ? (
                                    <div className="p-8 text-center text-white/30 font-rajdhani">No matches played yet.</div>
                                ) : (
                                    completedMatches.map(match => (
                                        <div key={match.id} className="p-4 hover:bg-white/5 transition-colors group">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-rajdhani text-white/40 uppercase tracking-wider border border-white/10 px-1.5 rounded">
                                                    {match.category}
                                                </span>
                                                <span className="text-[10px] font-mono text-white/30">
                                                    {new Date(match.date).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center gap-4">
                                                <div className={`flex-1 text-right font-oswald uppercase ${match.home_score > match.away_score && match.status === 'Completed' ? 'text-gold' : 'text-white'}`}>
                                                    {match.team1}
                                                </div>
                                                <div className="bg-black/50 px-3 py-1 rounded border border-white/10 font-bebas text-xl text-white whitespace-nowrap">
                                                    {match.home_score} - {match.away_score}
                                                </div>
                                                <div className={`flex-1 text-left font-oswald uppercase ${match.away_score > match.home_score && match.status === 'Completed' ? 'text-gold' : 'text-white'}`}>
                                                    {match.team2}
                                                </div>
                                            </div>

                                            {match.status !== 'Completed' && (
                                                <div className="text-center mt-2">
                                                    <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded animate-pulse uppercase font-bold tracking-wider">
                                                        LIVE
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {completedMatches.length > 0 && (
                                <div className="p-3 bg-black/20 text-center border-t border-white/5">
                                    <button className="text-xs text-laser-blue font-rajdhani uppercase tracking-widest hover:text-white transition-colors">
                                        View Full Schedule →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    )
}

export default Events
