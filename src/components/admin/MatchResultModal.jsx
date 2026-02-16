import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Plus, Trash2, Award, Zap, AlertTriangle, ShieldOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const MatchResultModal = ({ match, players, onClose, onUpdate }) => {
    const [homeScore, setHomeScore] = useState(match?.home_score || 0)
    const [awayScore, setAwayScore] = useState(match?.away_score || 0)
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)
    const [newEvent, setNewEvent] = useState({
        player_id: '',
        event_type: 'goal',
        minute: ''
    })

    useEffect(() => {
        fetchEvents()
    }, [match.id])

    const fetchEvents = async () => {
        const { data, error } = await supabase
            .from('match_events')
            .select('*')
            .eq('match_id', match.id)
            .order('created_at', { ascending: true })

        if (error) console.error('Error fetching events:', error)
        else setEvents(data || [])
    }

    const handleAddEvent = async (e) => {
        e.preventDefault()
        if (!newEvent.player_id) return alert('Select a player')

        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('match_events')
                .insert([{
                    match_id: match.id,
                    player_id: newEvent.player_id,
                    event_type: newEvent.event_type,
                    minute: newEvent.minute ? parseInt(newEvent.minute) : null
                }])
                .select()

            if (error) throw error

            setEvents([...events, data[0]])
            setNewEvent({ ...newEvent, minute: '' }) // Reset minute, keep player/type for speed
        } catch (err) {
            alert('Error adding event: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteEvent = async (eventId) => {
        if (!confirm('Remove this event? Stats will be recalculated.')) return
        setLoading(true)
        try {
            const { error } = await supabase
                .from('match_events')
                .delete()
                .eq('id', eventId)

            if (error) throw error
            setEvents(events.filter(e => e.id !== eventId))
        } catch (err) {
            alert('Error deleting event: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleFinishMatch = async () => {
        if (!confirm('Mark match as Completed? Leaderboard will be final.')) return
        setLoading(true)
        try {
            let winner = null
            if (homeScore > awayScore) winner = match.team1
            else if (awayScore > homeScore) winner = match.team2
            else winner = 'Draw'

            const { error } = await supabase
                .from('matches')
                .update({
                    home_score: homeScore,
                    away_score: awayScore,
                    status: 'Completed',
                    winner_team: winner
                })
                .eq('id', match.id)

            if (error) throw error
            onUpdate()
            onClose()
        } catch (err) {
            alert('Error finishing match: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const getEventIcon = (type) => {
        switch (type) {
            case 'goal': return <Zap size={16} className="text-gold" />
            case 'assist': return <Zap size={16} className="text-laser-blue" />
            case 'yellow_card': return <AlertTriangle size={16} className="text-yellow-500" />
            case 'red_card': return <AlertTriangle size={16} className="text-red-500" />
            case 'clean_sheet': return <ShieldOff size={16} className="text-gray-400" />
            case 'mom': return <Award size={16} className="text-purple-500" />
            default: return <Zap size={16} />
        }
    }

    // Filter players (optional: could sort by team if we had team assignments)
    const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name))

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/90 border border-white/20 w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-2xl font-oswald text-white uppercase tracking-wide">Match Result</h2>
                        <p className="text-white/40 text-sm font-rajdhani uppercase">{match.team1} vs {match.team2}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} className="text-white/60 hover:text-white" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {/* Scoreboard */}
                    <div className="flex justify-center items-center gap-8 mb-10">
                        <div className="text-center">
                            <h3 className="text-xl font-oswald text-white mb-2">{match.team1}</h3>
                            <input
                                type="number"
                                min="0"
                                value={homeScore}
                                onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
                                className="w-24 h-24 bg-black border-2 border-white/20 rounded-xl text-center text-5xl font-bebas text-white focus:border-laser-blue outline-none"
                            />
                        </div>
                        <div className="text-4xl font-bebas text-white/20">:</div>
                        <div className="text-center">
                            <h3 className="text-xl font-oswald text-white mb-2">{match.team2}</h3>
                            <input
                                type="number"
                                min="0"
                                value={awayScore}
                                onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
                                className="w-24 h-24 bg-black border-2 border-white/20 rounded-xl text-center text-5xl font-bebas text-white focus:border-red-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Event Feed */}
                        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                            <h3 className="text-gold font-oswald uppercase mb-4 flex items-center gap-2">
                                <Zap size={16} /> Match Events
                            </h3>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {events.length === 0 ? (
                                    <div className="text-center text-white/30 py-8 font-rajdhani italic">No events recorded</div>
                                ) : (
                                    events.map(event => {
                                        const player = players.find(p => p.id === event.player_id)
                                        return (
                                            <div key={event.id} className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-white/40 font-mono text-xs w-8 text-right">{event.minute}'</span>
                                                    <div className="w-8 h-8 rounded bg-black border border-white/10 overflow-hidden">
                                                        {player?.photo_url && <img src={player.photo_url} className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-rajdhani font-bold leading-none">{player?.name || 'Unknown'}</div>
                                                        <div className="text-xs text-white/50 uppercase">{event.event_type.replace('_', ' ')}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getEventIcon(event.event_type)}
                                                    <button onClick={() => handleDeleteEvent(event.id)} className="text-white/20 hover:text-red-500 ml-2">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>

                        {/* Add Event Form */}
                        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                            <h3 className="text-laser-blue font-oswald uppercase mb-4 flex items-center gap-2">
                                <Plus size={16} /> Add Event
                            </h3>
                            <form onSubmit={handleAddEvent} className="space-y-4">
                                <div>
                                    <label className="text-xs text-white/50 uppercase font-rajdhani">Player</label>
                                    <select
                                        value={newEvent.player_id}
                                        onChange={(e) => setNewEvent({ ...newEvent, player_id: e.target.value })}
                                        className="w-full bg-black border border-white/20 p-2 rounded text-white font-rajdhani focus:border-laser-blue outline-none"
                                    >
                                        <option value="">Select Player...</option>
                                        {sortedPlayers.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.position})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-white/50 uppercase font-rajdhani">Event Type</label>
                                        <select
                                            value={newEvent.event_type}
                                            onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
                                            className="w-full bg-black border border-white/20 p-2 rounded text-white font-rajdhani focus:border-laser-blue outline-none"
                                        >
                                            <option value="goal">Goal ⚽</option>
                                            <option value="assist">Assist 👟</option>
                                            <option value="yellow_card">Yellow Card 🟨</option>
                                            <option value="red_card">Red Card 🟥</option>
                                            <option value="clean_sheet">Clean Sheet 🛡️</option>
                                            <option value="mom">Man of Match 🏆</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-white/50 uppercase font-rajdhani">Minute</label>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={newEvent.minute}
                                            onChange={(e) => setNewEvent({ ...newEvent, minute: e.target.value })}
                                            className="w-full bg-black border border-white/20 p-2 rounded text-white font-rajdhani focus:border-laser-blue outline-none"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !newEvent.player_id}
                                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded font-oswald uppercase tracking-wider transition-all border border-white/10 hover:border-white/30"
                                >
                                    Log Event
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded text-white/60 hover:text-white font-oswald uppercase"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleFinishMatch}
                        disabled={loading}
                        className="px-8 py-2 bg-gradient-to-r from-gold to-orange-500 text-black font-oswald font-bold uppercase rounded shadow-lg hover:shadow-gold/20 hover:scale-105 transition-all"
                    >
                        Finish Match & Update Leaderboard
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default MatchResultModal
