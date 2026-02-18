import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchWithCache, clearCache } from '../lib/cache'
import { supabase } from '../lib/supabase'
import EditPlayerModal from '../components/admin/EditPlayerModal'
import EditMatchModal from '../components/admin/EditMatchModal'
import MatchResultModal from '../components/admin/MatchResultModal'
import PlayerCardPreview from '../components/admin/PlayerCardPreview'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { Lock, Search, Filter, RefreshCw, Eye, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'
import { ALLOWED_ADMIN_EMAILS } from '../config/admin'
import { toast } from 'sonner'

const Admin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [session, setSession] = useState(null)
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState('All')
    const [search, setSearch] = useState('')
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const [selectedCardPlayer, setSelectedCardPlayer] = useState(null)
    const [authError, setAuthError] = useState(null)
    const [matches, setMatches] = useState([])
    const [selectedMatch, setSelectedMatch] = useState(null)
    const [activeTab, setActiveTab] = useState('players') // 'players' or 'matches'

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                if (!ALLOWED_ADMIN_EMAILS.includes(session.user.email)) {
                    toast.error("Unauthorized access. Admin privileges required.")
                    supabase.auth.signOut()
                    return
                }
                setSession(session)
                // Initial load with cache
                fetchPlayers()
                fetchMatches()
            }
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                if (!ALLOWED_ADMIN_EMAILS.includes(session.user.email)) {
                    toast.error("Unauthorized access. Admin privileges required.")
                    supabase.auth.signOut()
                    setSession(null)
                    return
                }
                setSession(session)
                fetchPlayers()
                fetchMatches()
            } else {
                setSession(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const fetchPlayers = async (forceRefresh = false) => {
        setLoading(true)
        if (forceRefresh) clearCache('admin_players')

        try {
            const data = await fetchWithCache('admin_players', async () => {
                const { data, error } = await supabase
                    .from('players')
                    .select('*')
                    .order('created_at', { ascending: false })
                if (error) throw error
                return data || []
            }, 2) // Cache for 2 minutes

            setPlayers(data)
        } catch (error) {
            console.error('Error fetching players:', error)
        }
        setLoading(false)
    }

    const fetchMatches = async (forceRefresh = false) => {
        if (forceRefresh) clearCache('admin_matches')

        try {
            const data = await fetchWithCache('admin_matches', async () => {
                const { data, error } = await supabase
                    .from('matches')
                    .select('*')
                    .order('date', { ascending: true })
                if (error) throw error
                return data || []
            }, 2) // Cache for 2 minutes

            setMatches(data)
        } catch (error) {
            console.error('Error fetching matches:', error)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setAuthError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (!error && !ALLOWED_ADMIN_EMAILS.includes(email)) {
            toast.error("Unauthorized access. Admin privileges required.")
            await supabase.auth.signOut()
            setLoading(false)
            return
        }

        if (error) {
            setAuthError(error.message)
            toast.error(error.message)
        }
        setLoading(false)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    const handleManualRefresh = () => {
        fetchPlayers(true)
        fetchMatches(true)
    }

    const filteredPlayers = players.filter(p => {
        const matchesFilter = filter === 'All' || p.status === filter
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
            case 'Ready': return 'text-neon bg-neon/10 border-neon/20'
            case 'Sold': return 'text-red-500 bg-red-500/10 border-red-500/20'
            default: return 'text-gray-500'
        }
    }

    if (!session) {
        return (
            <div className="h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background Effect */}
                <div className="absolute inset-0 bg-gradient-radial from-dark-blue/20 via-transparent to-transparent opacity-50 pointer-events-none" />

                <div className="bg-white/5 p-8 rounded-xl border border-white/10 w-full max-w-md text-center backdrop-blur-md relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/30 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                        <Lock className="w-8 h-8 text-gold" />
                    </div>

                    <h1 className="text-3xl font-oswald text-white mb-2">Admin Portal</h1>
                    <p className="text-white/40 text-sm font-rajdhani mb-8 tracking-wider uppercase">Authorized Personnel Only</p>

                    {authError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded mb-4 text-sm font-rajdhani">
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1 text-left">
                            <label className="text-xs text-white/40 font-rajdhani uppercase tracking-wider ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@nitrrfc.com"
                                className="w-full bg-black/50 border border-white/10 p-3 rounded text-white focus:border-gold outline-none transition-colors font-rajdhani"
                                required
                            />
                        </div>

                        <div className="space-y-1 text-left">
                            <label className="text-xs text-white/40 font-rajdhani uppercase tracking-wider ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-black/50 border border-white/10 p-3 rounded text-white focus:border-gold outline-none transition-colors font-rajdhani"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold text-black font-oswald font-bold uppercase py-3 rounded hover:bg-gold/80 shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] transition-all border border-gold/50 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? <LoadingSpinner size="sm" color="black" /> : 'Access Database'}
                        </button>

                        <Link to="/" className="block text-white/40 text-xs hover:text-white mt-6 transition-colors font-rajdhani tracking-widest uppercase">
                            ← Return to Public Site
                        </Link>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-white p-6 relative">
            <SEO
                title="Admin Dashboard"
                description="Restricted access. NITRR FC Administration."
                name="NITRR FC Admin"
            />
            {/* Persistent background pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/10 pb-6 gap-4">
                    <div>
                        <h1 className="text-4xl font-oswald text-gold">Admin Dashboard</h1>
                        <p className="text-white/40 text-sm font-rajdhani tracking-wider uppercase mt-1">
                            Session Active • {session.user.email}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        {activeTab === 'players' ? (
                            <button
                                onClick={() => setSelectedPlayer({
                                    name: '',
                                    year: '1st',
                                    position: 'ST',
                                    pace: 50, shooting: 50, passing: 50, dribbling: 50, defending: 50, physical: 50,
                                    status: 'Alumni',
                                    is_main_team: false,
                                    photo_url: ''
                                })}
                                className="px-6 py-2 bg-gold text-black font-oswald uppercase rounded hover:bg-gold/80 transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] font-bold tracking-wide"
                            >
                                + New Player
                            </button>
                        ) : (
                            <button
                                onClick={() => setSelectedMatch({})}
                                className="px-6 py-2 bg-laser-blue text-black font-oswald uppercase rounded hover:bg-laser-blue/80 transition-all shadow-[0_0_15px_rgba(0,0,255,0.3)] hover:shadow-[0_0_25px_rgba(0,0,255,0.5)] font-bold tracking-wide"
                            >
                                + Schedule Match
                            </button>
                        )}
                        <button onClick={handleManualRefresh} className="p-2 bg-white/5 rounded hover:bg-white/10 text-white border border-white/10 transition-colors" title="Force Refresh Data">
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 border border-red-500/30 text-red-500/80 hover:text-red-500 hover:bg-red-500/10 rounded font-oswald uppercase transition-all flex items-center gap-2"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('players')}
                        className={`pb-3 px-4 font-oswald uppercase tracking-wider transition-colors relative ${activeTab === 'players' ? 'text-gold' : 'text-white/40 hover:text-white'}`}
                    >
                        Players
                        {activeTab === 'players' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-gold rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('matches')}
                        className={`pb-3 px-4 font-oswald uppercase tracking-wider transition-colors relative ${activeTab === 'matches' ? 'text-laser-blue' : 'text-white/40 hover:text-white'}`}
                    >
                        Matches
                        {activeTab === 'matches' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-laser-blue rounded-t-full" />}
                    </button>
                </div>

                {/* Content Area */}
                {activeTab === 'players' ? (
                    <>
                        {/* Player Controls */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search database..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:border-neon outline-none text-white font-rajdhani tracking-wide transition-all focus:bg-black/60"
                                />
                            </div>
                            <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-white/10 overflow-x-auto">
                                {['All', 'Pending', 'Ready', 'Sold', 'Alumni'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFilter(s)}
                                        className={`px-4 py-2 rounded font-oswald uppercase transition-all whitespace-nowrap ${filter === s ? 'bg-white/10 text-white border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Players Table */}
                        <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-white/40 font-oswald uppercase text-xs tracking-widest border-b border-white/5">
                                        <tr>
                                            <th className="p-4 pl-6">Player Profile</th>
                                            <th className="p-4">Year / Season</th>
                                            <th className="p-4">Position</th>
                                            <th className="p-4">OVR</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 pr-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {loading ? (
                                            <tr><td colSpan="6" className="p-12">
                                                <div className="flex flex-col items-center gap-4">
                                                    <LoadingSpinner size="lg" color="laser-blue" />
                                                    <span className="text-white/30 text-xs font-rajdhani uppercase tracking-widest animate-pulse">Syncing Database...</span>
                                                </div>
                                            </td></tr>
                                        ) : filteredPlayers.length === 0 ? (
                                            <tr><td colSpan="6" className="p-12 text-center text-white/30 font-rajdhani">No players matching your criteria.</td></tr>
                                        ) : (
                                            filteredPlayers.map(player => (
                                                <tr key={player.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="p-4 pl-6 flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-black rounded-lg overflow-hidden border border-white/10 relative group-hover:border-white/30 transition-colors shadow-inner">
                                                            {player.photo_url ? (
                                                                <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-white/10 text-xl font-bebas">?</div>
                                                            )}

                                                            {/* Status indicator dot */}
                                                            <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${player.status === 'Ready' ? 'bg-neon shadow-[0_0_5px_#39ff14]' :
                                                                player.status === 'Sold' ? 'bg-red-500' :
                                                                    'bg-white/20'
                                                                }`}></div>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white group-hover:text-gold transition-colors font-oswald tracking-wide text-lg">{player.name}</div>
                                                            <div className="text-white/30 text-xs font-mono">{player.id.slice(0, 8)}...</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-white/60 font-rajdhani">{player.year}</td>
                                                    <td className="p-4">
                                                        <span className="bg-white/5 px-2 py-1 rounded text-xs font-mono text-white/80 border border-white/5">{player.position}</span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="font-bebas text-xl text-neon drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">
                                                            {Math.round((player.pace + player.shooting + player.passing + player.dribbling + player.defending + player.physical) / 6)}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-oswald uppercase tracking-wider border ${getStatusColor(player.status)}`}>
                                                            {player.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 pr-6 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => setSelectedCardPlayer(player)}
                                                                className="p-2 text-neon hover:bg-neon/10 rounded transition-colors"
                                                                title="Preview Card"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => setSelectedPlayer(player)}
                                                                className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 hover:text-gold rounded text-xs font-oswald uppercase tracking-wider transition-all"
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Matches Table */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-white/30 font-rajdhani uppercase tracking-widest border border-dashed border-white/10 rounded-xl">
                                No matches scheduled
                            </div>
                        ) : (
                            matches.map(match => (
                                <div key={match.id} className="bg-white/5 border border-white/10 p-6 rounded-xl relative group hover:border-laser-blue/50 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-xs font-rajdhani text-laser-blue uppercase tracking-widest border border-laser-blue/20 px-2 py-1 rounded">
                                            {match.category}
                                        </div>
                                        <div className={`text-xs font-bold uppercase px-2 py-1 rounded ${match.status === 'Live' ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white/60'}`}>
                                            {match.status}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex-1 text-center">
                                            <div className="font-bebas text-2xl text-white">{match.team1}</div>
                                        </div>
                                        <div className="px-4 text-white/30 font-bold text-sm">VS</div>
                                        <div className="flex-1 text-center">
                                            <div className="font-bebas text-2xl text-white">{match.team2}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-white/60">
                                            <div className="w-4"><Filter size={14} /></div> {/* Using Filter as Calendar icon placeholder if needed, or import Calendar */}
                                            {new Date(match.date).toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-white/60">
                                            <div className="w-4"><Filter size={14} /></div> {/* Using Filter as MapPin icon placeholder if needed */}
                                            {match.venue}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setSelectedMatch(match)}
                                            className="w-full py-2 border border-white/20 hover:bg-white/5 text-white/80 hover:text-white rounded uppercase font-oswald text-sm tracking-wider transition-colors"
                                        >
                                            Edit Details
                                        </button>
                                        <button
                                            onClick={() => setSelectedMatch({ ...match, mode: 'result' })}
                                            className="w-full py-2 bg-gradient-to-r from-laser-blue/20 to-purple-500/20 hover:from-laser-blue/40 hover:to-purple-500/40 border border-laser-blue/30 text-white rounded uppercase font-oswald text-sm tracking-wider transition-colors"
                                        >
                                            Enter Result
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {selectedPlayer && (
                <EditPlayerModal
                    player={selectedPlayer}
                    onClose={() => setSelectedPlayer(null)}
                    onUpdate={() => fetchPlayers(true)}
                />
            )}

            {selectedCardPlayer && (
                <PlayerCardPreview
                    player={selectedCardPlayer}
                    onClose={() => setSelectedCardPlayer(null)}
                />
            )}

            {selectedMatch && selectedMatch.mode !== 'result' && (
                <EditMatchModal
                    match={selectedMatch}
                    onClose={() => setSelectedMatch(null)}
                    onUpdate={() => fetchMatches(true)}
                />
            )}

            {selectedMatch && selectedMatch.mode === 'result' && (
                <MatchResultModal
                    match={selectedMatch}
                    players={players}
                    onClose={() => setSelectedMatch(null)}
                    onUpdate={() => fetchMatches(true)}
                />
            )}
        </div>
    )
}

export default Admin
