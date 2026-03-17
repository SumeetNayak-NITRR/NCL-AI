import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchWithCache, clearCache } from '../lib/cache'
import { supabase } from '../lib/supabase'
import EditPlayerModal from '../components/admin/EditPlayerModal'
import EditMatchModal from '../components/admin/EditMatchModal'
import MatchResultModal from '../components/admin/MatchResultModal'
import PlayerCardPreview from '../components/admin/PlayerCardPreview'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { Lock, Search, Filter, RefreshCw, Eye, LogOut, ArrowLeft, Info, Download, FileSpreadsheet } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'
import { ALLOWED_ADMIN_EMAILS } from '../config/admin'
import { toast } from 'sonner'
import { exportAuctionPptx } from '../lib/exportAuctionPptx'

const Admin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [session, setSession] = useState(null)
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState('All')
    const [search, setSearch] = useState('')
    const [auctionSearch, setAuctionSearch] = useState('')
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const [selectedCardPlayer, setSelectedCardPlayer] = useState(null)
    const [authError, setAuthError] = useState(null)
    const [matches, setMatches] = useState([])
    const [selectedMatch, setSelectedMatch] = useState(null)
    const [activeTab, setActiveTab] = useState('players') // 'players', 'matches', or 'auction'
    const [exporting, setExporting] = useState(false)

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

    const handleExportPptx = async () => {
        const approvedPlayers = players.filter(p => ['Ready', 'approved', 'Approved'].includes(p.status))
        if (!approvedPlayers.length) {
            toast.error('No approved players to export.')
            return
        }
        setExporting(true)
        toast.info(`Generating slides for ${approvedPlayers.length} players...`)
        try {
            await exportAuctionPptx(approvedPlayers)
            toast.success('NCL_Auction_2025.pptx downloaded!')
        } catch (err) {
            toast.error('Export failed: ' + err.message)
        } finally {
            setExporting(false)
        }
    }

    const handleExportCSV = () => {
        if (!players.length) {
            toast.error('No players to export.')
            return
        }
        const headers = ['Name', 'Year', 'Position', 'Branch', 'Status']
        const rows = players.map(p => [
            '"' + (p.name || '').replace(/"/g, '""') + '"',
            '"' + (p.year || '') + '"',
            '"' + (p.position || '') + '"',
            '"' + (p.branch || '') + '"',
            '"' + (p.status || '') + '"',
        ].join(','))
        const csv = [headers.join(','), ...rows].join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'NCL_Players.csv'
        a.click()
        URL.revokeObjectURL(url)
        toast.success(`NCL_Players.csv downloaded (${players.length} players)`)
    }

    const handleManualRefresh = () => {
        fetchPlayers(true)
        fetchMatches(true)
    }

    const updateAuctionStatus = async (playerId, updates) => {
        try {
            const { error } = await supabase.from('players').update(updates).eq('id', playerId)
            if (error) throw error
            toast.success('Auction updated!')
            fetchPlayers(true) // Refresh state
        } catch (err) {
            toast.error('Failed: ' + err.message)
        }
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

                <div className="bg-black/40 backdrop-blur-xl p-10 rounded-2xl border border-white/10 w-full max-w-md text-center relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-gold/30 shadow-[0_0_30px_rgba(255,215,0,0.15)] relative">
                        <div className="absolute inset-0 rounded-full bg-gold/5 blur-md"></div>
                        <Lock className="w-8 h-8 text-gold relative z-10" />
                    </div>

                    <h1 className="text-4xl font-oswald text-white mb-2 tracking-tight drop-shadow-lg">ADMIN PORTAL</h1>
                    <p className="text-gold text-sm font-rajdhani mb-10 tracking-[0.2em] uppercase font-bold drop-shadow-md">Classified Access Only</p>

                    {authError && (
                        <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm font-rajdhani flex items-center gap-3">
                            <Info size={18} className="flex-shrink-0" />
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2 text-left">
                            <label className="text-xs text-white font-rajdhani uppercase tracking-widest pl-1 font-bold drop-shadow-md">Secure Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@nitrrfc.com"
                                className="w-full bg-black/60 backdrop-blur-md border-[1.5px] border-white/30 p-4 rounded-xl text-white font-bold focus:bg-black/90 focus:border-gold focus:ring-2 focus:ring-gold/50 hover:border-white/50 outline-none transition-all font-rajdhani text-xl placeholder:text-white/40 shadow-inner"
                                required
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-xs text-white font-rajdhani uppercase tracking-widest pl-1 font-bold drop-shadow-md">Passcode</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-black/60 backdrop-blur-md border-[1.5px] border-white/30 p-4 rounded-xl text-white font-bold focus:bg-black/90 focus:border-gold focus:ring-2 focus:ring-gold/50 hover:border-white/50 outline-none transition-all font-rajdhani text-xl placeholder:text-white/40 tracking-[0.2em] shadow-inner"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative overflow-hidden bg-gradient-to-r from-gold via-yellow-300 to-gold text-black font-oswald font-bold uppercase text-xl py-4 rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <div className="absolute inset-0 w-full h-full bg-white/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                                {loading ? <LoadingSpinner size="sm" color="black" /> : 'Welcome Back Admin'}
                            </button>
                        </div>

                        <Link to="/" className="text-white/30 text-xs hover:text-white mt-8 transition-colors font-rajdhani tracking-widest uppercase flex items-center justify-center gap-2 group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Public View
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
                        <h1 className="text-4xl font-oswald text-gold drop-shadow-md">Admin Dashboard</h1>
                        <p className="text-white/80 text-sm font-rajdhani tracking-wider uppercase mt-1 font-bold">
                            Session Active • {session.user.email}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
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
                                className="px-6 py-3 bg-gradient-to-r from-gold via-yellow-400 to-gold text-black font-oswald uppercase rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] font-bold tracking-wide relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                + New Player
                            </button>
                        ) : (
                            <button
                                onClick={() => setSelectedMatch({})}
                                className="px-6 py-3 bg-gradient-to-r from-laser-blue via-cyan-400 to-laser-blue text-black font-oswald uppercase rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_40px_rgba(0,255,255,0.5)] font-bold tracking-wide relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                + Schedule Match
                            </button>
                        )}
                        <button onClick={handleManualRefresh} className="p-3 bg-black/40 backdrop-blur-sm rounded-xl hover:bg-white/10 text-white border border-white/10 hover:border-white/30 transition-all shadow-lg" title="Force Refresh Data">
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                        {activeTab === 'players' && (
                            <button
                                onClick={handleExportPptx}
                                disabled={exporting}
                                className="px-5 py-3 bg-black/40 backdrop-blur-sm border border-white/10 hover:border-gold/50 text-white hover:text-gold rounded-xl font-oswald uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Export Auction PPTX"
                            >
                                <Download size={16} className={exporting ? 'animate-bounce' : ''} />
                                {exporting ? 'Exporting...' : 'Export Slides'}
                            </button>
                        )}
                        <button
                            onClick={handleExportCSV}
                            className="px-5 py-3 bg-black/40 backdrop-blur-sm border border-white/10 hover:border-neon/50 text-white hover:text-neon rounded-xl font-oswald uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
                            title="Export Players as CSV / Google Sheet"
                        >
                            <FileSpreadsheet size={16} />
                            Export Sheet
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-5 py-3 border border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/50 rounded-xl font-oswald uppercase transition-all flex items-center gap-2 shadow-lg"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/20">
                    <button
                        onClick={() => setActiveTab('players')}
                        className={`pb-3 px-4 font-oswald uppercase tracking-wider transition-colors relative font-bold text-lg ${activeTab === 'players' ? 'text-gold' : 'text-white/60 hover:text-white'}`}
                    >
                        Players
                        {activeTab === 'players' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-gold rounded-t-full shadow-[0_0_10px_rgba(255,215,0,0.8)]" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('matches')}
                        className={`pb-3 px-4 font-oswald uppercase tracking-wider transition-colors relative font-bold text-lg ${activeTab === 'matches' ? 'text-laser-blue' : 'text-white/60 hover:text-white'}`}
                    >
                        Matches
                        {activeTab === 'matches' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-laser-blue rounded-t-full shadow-[0_0_10px_rgba(0,255,255,0.8)]" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('auction')}
                        className={`pb-3 px-4 font-oswald uppercase tracking-wider transition-colors relative font-bold text-lg ${activeTab === 'auction' ? 'text-neon' : 'text-white/60 hover:text-white'}`}
                    >
                        Live Auction
                        {activeTab === 'auction' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-neon rounded-t-full shadow-[0_0_10px_rgba(57,255,20,0.8)]" />}
                    </button>
                </div>

                {/* Content Area */}
                {activeTab === 'players' ? (
                    <>
                        {/* Player Controls */}
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-neon transition-colors" size={24} />
                                <input
                                    type="text"
                                    placeholder="Search database..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full bg-black/60 backdrop-blur-md border-[1.5px] border-white/30 rounded-xl pl-12 pr-4 py-4 focus:border-neon focus:ring-2 focus:ring-neon/50 outline-none text-white font-rajdhani tracking-wide transition-all hover:border-white/50 text-xl font-bold placeholder:text-white/40 shadow-inner"
                                />
                            </div>
                            <div className="flex gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-xl border border-white/10 overflow-x-auto shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                                {['All', 'Pending', 'Ready', 'Sold', 'Alumni'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFilter(s)}
                                        className={`px-5 py-2.5 rounded-lg font-oswald uppercase transition-all whitespace-nowrap text-sm tracking-wide ${filter === s ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Players Table */}
                        <div className="bg-black/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/10 text-white/80 font-oswald uppercase text-sm tracking-widest border-b border-white/20 font-bold">
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
                                            <tr><td colSpan="6" className="p-12 text-center text-white/70 font-rajdhani text-lg">No players matching your criteria.</td></tr>
                                        ) : (
                                            filteredPlayers.map(player => (
                                                <tr key={player.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="p-4 pl-6 flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-black rounded-lg overflow-hidden border border-white/10 relative group-hover:border-white/30 transition-colors shadow-inner">
                                                            {player.photo_url ? (
                                                                <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" loading="lazy" />
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
                                                            <div className="font-bold text-white group-hover:text-gold transition-colors font-oswald tracking-wide text-lg drop-shadow-sm">{player.name}</div>
                                                            <div className="text-white/60 text-xs font-mono">{player.id.slice(0, 8)}...</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-white/90 font-rajdhani font-bold text-lg">{player.year}</td>
                                                    <td className="p-4">
                                                        <span className="bg-white/10 px-3 py-1.5 rounded text-sm font-mono text-white border border-white/20 font-bold shadow-sm">{player.position}</span>
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
                ) : activeTab === 'matches' ? (
                    /* Matches Table */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-white/70 font-rajdhani uppercase tracking-widest border-2 border-dashed border-white/20 rounded-xl font-bold text-xl drop-shadow-md">
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
                ) : activeTab === 'auction' ? (
                    /* Auction Tab Area */
                    <div className="flex flex-col gap-6 h-full min-h-[70vh]">
                        {/* Queue Management & PPTX Export */}
                        <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col h-full max-h-[80vh]">
                            <div className="flex justify-between items-end mb-4 gap-4 flex-wrap">
                                <div>
                                    <h2 className="font-bebas text-3xl text-white mb-2">Auction Queue Setup</h2>
                                    <p className="font-rajdhani text-sm text-white/50">Assign base prices and mystery flags. Players with 0 or empty base price will appear at the end.</p>
                                </div>
                                    <button
                                        onClick={async () => {
                                            if (!window.confirm("This will overwrite existing base prices with auction_order values. Proceed?")) return;
                                            try {
                                                toast.info("Migrating Data...");
                                                // Fetch all eligible players
                                                const { data: eligiblePlayers } = await supabase.from('players').select('id, auction_order').not('auction_order', 'is', null);
                                                if (eligiblePlayers && eligiblePlayers.length > 0) {
                                                    const updates = eligiblePlayers.map(p => ({
                                                        id: p.id,
                                                        base_price: p.auction_order,
                                                        auction_order: null // clear it out after migrating to prevent re-migration
                                                    }));
                                                    
                                                    const { error } = await supabase.from('players').upsert(updates);
                                                    if (error) throw error;
                                                    
                                                    toast.success(`Migrated ${eligiblePlayers.length} players successfully!`);
                                                    fetchPlayers(true);
                                                } else {
                                                    toast.info("No players with auction orders to migrate.");
                                                }
                                            } catch (e) {
                                                console.error(e);
                                                toast.error("Migration failed.");
                                            }
                                        }}
                                        className="px-6 py-3 bg-gradient-to-r from-yellow-500/80 to-gold/80 hover:from-yellow-500 hover:to-gold text-black font-oswald uppercase tracking-widest text-sm rounded transition-all shadow-lg flex items-center gap-2"
                                    >
                                        Migrate Data
                                    </button>
                                    <button
                                        onClick={async () => {
                                            try {
                                                toast.info("Generating Presentation...");
                                                const { exportAuctionPptx } = await import('../lib/exportAuctionPptx');
                                                await exportAuctionPptx(players);
                                                toast.success("Presentation ready!");
                                            } catch (e) {
                                                console.error(e);
                                                toast.error("Export failed.");
                                            }
                                        }}
                                        className="px-6 py-3 bg-gradient-to-r from-laser-blue/80 to-purple-500/80 hover:from-laser-blue hover:to-purple-500 text-white font-oswald uppercase tracking-widest text-sm rounded transition-all shadow-lg flex items-center gap-2"
                                    >
                                        <Download size={18} />
                                        Generate PPTX Deck
                                    </button>
                                </div>

                            <input
                                type="text"
                                placeholder="Search Approved Players..."
                                value={auctionSearch}
                                onChange={e => setAuctionSearch(e.target.value)}
                                className="w-full max-w-md bg-black/50 border border-white/20 rounded p-3 text-sm mb-4 font-rajdhani focus:border-neon outline-none"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                                {players.filter(p => ['Ready', 'approved', 'Approved'].includes(p.status) && p.name.toLowerCase().includes(auctionSearch.toLowerCase()))
                                .sort((a, b) => {
                                        const priceA = a.base_price;
                                        const priceB = b.base_price;
                                        if (priceA === null || priceA === undefined || priceA === 0) return 1; // Send zeroes/nulls to back
                                        if (priceB === null || priceB === undefined || priceB === 0) return -1;
                                        return priceB - priceA; // Highest price first
                                    })
                                    .map(p => (
                                        <div key={p.id} className={`p-4 rounded-xl border flex gap-4 items-center transition-all ${p.is_mystery ? 'border-[#ff2200]/50 bg-gradient-to-r from-[#ff2200]/10 to-transparent' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                                            <div className="w-16 h-16 bg-black rounded overflow-hidden flex-shrink-0 border-2 border-white/5">
                                                {p.photo_url ? <img src={p.photo_url} alt={p.name} className={`w-full h-full object-cover ${p.is_mystery ? 'brightness-50 grayscale' : ''}`} loading="lazy" /> : <div className="text-white/20 text-center pt-4 font-bebas text-2xl">?</div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bebas text-white truncate text-2xl tracking-wide">{p.name}</div>
                                                <div className="text-sm font-rajdhani tracking-widest text-laser-blue uppercase">{p.position} • ₹{p.base_price || 2000}</div>
                                            </div>
                                            <div className="flex flex-col gap-2 items-end">
                                                <div className="bg-black/40 px-2 py-1 rounded border border-white/10 flex items-center gap-2">
                                                    <span className="text-[10px] text-white/40 tracking-widest font-rajdhani uppercase">Base Price</span>
                                                    <input
                                                        type="number"
                                                        defaultValue={p.base_price || ''}
                                                        placeholder="—"
                                                        onBlur={(e) => updateAuctionStatus(p.id, { base_price: parseInt(e.target.value) || 0 })}
                                                        className="w-16 bg-transparent border-b border-white/30 text-center text-sm font-mono text-neon outline-none focus:border-neon"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => updateAuctionStatus(p.id, { is_mystery: !p.is_mystery })}
                                                    className={`w-full py-1 rounded text-xs uppercase tracking-widest font-bold font-rajdhani transition-colors border ${p.is_mystery ? 'bg-[#ff2200] text-white border-[#ff2200] shadow-[0_0_10px_rgba(255,34,0,0.4)]' : 'bg-transparent text-white/40 border-white/20 hover:text-white hover:border-white/50'}`}
                                                >
                                                    Mystery
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                ) : null}
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
