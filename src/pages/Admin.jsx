import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import EditPlayerModal from '../components/admin/EditPlayerModal'
import PlayerCardPreview from '../components/admin/PlayerCardPreview'
import { Lock, Search, Filter, RefreshCw, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

const Admin = () => {
    const [pin, setPin] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState('All')
    const [search, setSearch] = useState('')
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const [selectedCardPlayer, setSelectedCardPlayer] = useState(null)

    const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '1234'

    useEffect(() => {
        if (isAuthenticated) fetchPlayers()
    }, [isAuthenticated])

    const fetchPlayers = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('players')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) console.error('Error fetching players:', error)
        else setPlayers(data || [])
        setLoading(false)
    }

    const handleLogin = (e) => {
        e.preventDefault()
        if (pin === ADMIN_PIN) setIsAuthenticated(true)
        else alert('Invalid PIN')
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

    if (!isAuthenticated) {
        return (
            <div className="h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="bg-white/5 p-8 rounded-xl border border-white/10 w-full max-w-md text-center">
                    <Lock className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h1 className="text-3xl font-oswald text-white mb-6">Admin Access</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={pin}
                            onChange={e => setPin(e.target.value)}
                            placeholder="Enter PIN"
                            className="w-full bg-black/50 border border-white/20 p-3 rounded text-center text-white text-xl tracking-widest focus:border-gold outline-none"
                        />
                        <button type="submit" className="w-full bg-gold text-black font-oswald uppercase py-3 rounded hover:bg-gold/80">
                            Unlock
                        </button>
                        <Link to="/" className="block text-white/50 text-sm hover:text-white mt-4">Return Home</Link>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-white p-6">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                    <h1 className="text-4xl font-oswald text-gold">Admin Dashboard</h1>
                    <div className="flex gap-4">
                        <button onClick={fetchPlayers} className="p-2 bg-white/5 rounded hover:bg-white/10 text-white"><RefreshCw size={20} /></button>
                        <Link to="/" className="px-4 py-2 border border-white/20 rounded hover:bg-white/10 text-white font-oswald uppercase">Logout</Link>
                    </div>
                </header>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search players..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:border-neon outline-none text-white"
                        />
                    </div>
                    <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                        {['All', 'Pending', 'Ready', 'Sold'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-2 rounded font-oswald uppercase transition-colors ${filter === s ? 'bg-gold text-black' : 'text-white/60 hover:text-white'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-black/30 text-white/50 font-oswald uppercase text-sm">
                            <tr>
                                <th className="p-4">Player</th>
                                <th className="p-4">Year</th>
                                <th className="p-4">Position</th>
                                <th className="p-4">Stats (Avg)</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-white/50">Loading matches...</td></tr>
                            ) : filteredPlayers.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-white/50">No players found.</td></tr>
                            ) : (
                                filteredPlayers.map(player => (
                                    <tr key={player.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                                                {player.photo_url && <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" />}
                                            </div>
                                            <span className="font-bold">{player.name}</span>
                                        </td>
                                        <td className="p-4 text-white/70">{player.year}</td>
                                        <td className="p-4 text-white/70">{player.position}</td>
                                        <td className="p-4 font-mono text-neon">
                                            {Math.round((player.pace + player.shooting + player.passing + player.dribbling + player.defending + player.physical) / 6)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-oswald uppercase border ${getStatusColor(player.status)}`}>
                                                {player.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setSelectedCardPlayer(player)}
                                                    className="flex items-center gap-1 text-neon hover:text-white font-oswald uppercase text-sm transition-colors"
                                                    title="View Player Card"
                                                >
                                                    <Eye size={16} />
                                                    View Card
                                                </button>
                                                <button
                                                    onClick={() => setSelectedPlayer(player)}
                                                    className="text-gold hover:text-white font-oswald uppercase text-sm underline"
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

            {selectedPlayer && (
                <EditPlayerModal
                    player={selectedPlayer}
                    onClose={() => setSelectedPlayer(null)}
                    onUpdate={fetchPlayers}
                />
            )}

            {selectedCardPlayer && (
                <PlayerCardPreview
                    player={selectedCardPlayer}
                    onClose={() => setSelectedCardPlayer(null)}
                />
            )}
        </div>
    )
}

export default Admin
