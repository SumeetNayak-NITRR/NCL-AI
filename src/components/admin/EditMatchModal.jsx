import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Trash2, Calendar, MapPin, Shield, Flag } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const EditMatchModal = ({ match, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        team1: match?.team1 || 'Team Alpha',
        team2: match?.team2 || 'Team Beta',
        date: match?.date ? new Date(match.date).toISOString().slice(0, 16) : '',
        venue: match?.venue || 'Main Stadium',
        category: match?.category || 'League',
        status: match?.status || 'Scheduled'
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                team1: formData.team1,
                team2: formData.team2,
                date: new Date(formData.date).toISOString(),
                venue: formData.venue,
                category: formData.category,
                status: formData.status
            }

            if (match?.id) {
                // Update existing
                const { error } = await supabase
                    .from('matches')
                    .update(payload)
                    .eq('id', match.id)
                if (error) throw error
            } else {
                // Insert new
                const { error } = await supabase
                    .from('matches')
                    .insert([payload])
                if (error) throw error
            }

            onUpdate()
            onClose()
        } catch (error) {
            console.error('Error saving match:', error)
            alert('Error saving match: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this match?')) return
        setLoading(true)
        try {
            const { error } = await supabase
                .from('matches')
                .delete()
                .eq('id', match.id)
            if (error) throw error
            onUpdate()
            onClose()
        } catch (error) {
            console.error('Error deleting match:', error)
            alert('Error deleting match')
        } finally {
            setLoading(false)
        }
    }

    const categories = ['League', 'Friendly', 'Tournament', 'Social']
    const statuses = ['Scheduled', 'Live', 'Completed']

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-black/90 border border-white/20 w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl relative"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="text-2xl font-oswald text-white uppercase tracking-wide">
                        {match?.id ? 'Edit Match' : 'Schedule Match'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} className="text-white/60 hover:text-white" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto max-h-[80vh]">
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Teams */}
                        <div className="grid grid-cols-2 gap-8 relative">
                            {/* VS Badge */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-laser-blue flex items-center justify-center rounded-full font-black text-black z-10 border-4 border-black">VS</div>

                            {/* Team 1 */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm uppercase text-gray-400 font-rajdhani font-bold hover:text-laser-blue transition-colors">
                                    <Shield size={16} /> Home Team
                                </label>
                                <input
                                    type="text"
                                    name="team1"
                                    value={formData.team1}
                                    onChange={handleChange}
                                    placeholder="Enter Home Team Name"
                                    className="w-full bg-black border border-white/20 p-4 rounded-lg text-white font-oswald text-xl focus:border-laser-blue focus:ring-1 focus:ring-laser-blue outline-none transition-all placeholder:text-white/20"
                                />
                            </div>

                            {/* Team 2 */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm uppercase text-gray-400 font-rajdhani font-bold hover:text-red-500 transition-colors">
                                    <Shield size={16} /> Away Team
                                </label>
                                <input
                                    type="text"
                                    name="team2"
                                    value={formData.team2}
                                    onChange={handleChange}
                                    placeholder="Enter Away Team Name"
                                    className="w-full bg-black border border-white/20 p-4 rounded-lg text-white font-oswald text-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-white/20"
                                />
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                            {/* Date */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm uppercase text-gray-400 font-rajdhani font-bold">
                                    <Calendar size={16} /> Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black border border-white/20 p-3 rounded-lg text-white font-rajdhani focus:border-gold outline-none"
                                />
                            </div>

                            {/* Venue */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm uppercase text-gray-400 font-rajdhani font-bold">
                                    <MapPin size={16} /> Venue
                                </label>
                                <input
                                    type="text"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    placeholder="e.g. Main Stadium"
                                    className="w-full bg-black border border-white/20 p-3 rounded-lg text-white focus:border-gold outline-none"
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm uppercase text-gray-400 font-rajdhani font-bold">
                                    <Flag size={16} /> Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-white/20 p-3 rounded-lg text-white focus:border-gold outline-none"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm uppercase text-gray-400 font-rajdhani font-bold">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-white/20 p-3 rounded-lg text-white focus:border-gold outline-none"
                                >
                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-6">
                            {match?.id && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 text-red-500 hover:text-red-400 px-4 py-2 hover:bg-red-500/10 rounded transition-colors font-oswald uppercase"
                                >
                                    <Trash2 size={18} /> Delete Match
                                </button>
                            )}
                            <div className="flex gap-4 ml-auto">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2 border border-white/20 rounded text-white hover:bg-white/5 transition-colors font-oswald uppercase"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-8 py-2 bg-gradient-to-r from-laser-blue to-blue-600 text-white rounded font-oswald uppercase font-bold tracking-wider hover:brightness-110 transition-all shadow-lg shadow-laser-blue/20"
                                >
                                    {loading ? 'Saving...' : (
                                        <>
                                            <Save size={18} /> Save Match
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default EditMatchModal
