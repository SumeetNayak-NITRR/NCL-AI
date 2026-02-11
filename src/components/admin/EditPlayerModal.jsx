import React, { useState, useEffect } from 'react'
import { X, Save, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const statsLabels = ['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defending', 'Physical']

const EditPlayerModal = ({ player, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...player })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleStatChange = (stat, value) => {
        setFormData({ ...formData, [stat.toLowerCase()]: parseInt(value) })
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const { error } = await supabase
                .from('players')
                .update({
                    name: formData.name,
                    pace: formData.pace,
                    shooting: formData.shooting,
                    passing: formData.passing,
                    dribbling: formData.dribbling,
                    defending: formData.defending,
                    physical: formData.physical,
                    position: formData.position,
                    year: formData.year
                })
                .eq('id', player.id)

            if (error) throw error
            onUpdate()
            onClose()
        } catch (err) {
            console.error("Error updating:", err)
            alert("Failed to update player")
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async () => {
        if (!window.confirm("Approve this player for the auction?")) return
        setLoading(true)
        try {
            const { error } = await supabase
                .from('players')
                .update({ status: 'Ready' })
                .eq('id', player.id)

            if (error) throw error
            onUpdate()
            onClose()
        } catch (err) {
            console.error("Error approving:", err)
            alert("Failed to approve player")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-white/20 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-oswald text-gold">Edit Player: {player.name}</h2>
                    <button onClick={onClose}><X className="text-white hover:text-red-500" /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <img src={player.photo_url} alt={player.name} className="w-full h-64 object-cover rounded-lg mb-4" />
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="bg-black border border-white/20 p-2 rounded text-white"
                                placeholder="Name"
                            />
                            <select
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="bg-black border border-white/20 p-2 rounded text-white"
                            >
                                {['ST', 'CB', 'CM', 'GK'].map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-oswald text-neon">Stats</h3>
                        {statsLabels.map(stat => (
                            <div key={stat} className="flex items-center gap-2">
                                <label className="w-24 text-sm uppercase text-gray-400">{stat}</label>
                                <input
                                    type="number"
                                    min="1" max="99"
                                    value={formData[stat.toLowerCase()]}
                                    onChange={(e) => handleStatChange(stat, e.target.value)}
                                    className="bg-black border border-white/20 p-1 rounded text-white w-16 text-center"
                                />
                                <input
                                    type="range"
                                    min="1" max="99"
                                    value={formData[stat.toLowerCase()]}
                                    onChange={(e) => handleStatChange(stat, e.target.value)}
                                    className="flex-1 accent-gold"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
                    {player.status === 'Pending' && (
                        <button
                            onClick={handleApprove}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-neon text-black font-oswald uppercase rounded hover:bg-neon/80"
                        >
                            <Check size={18} /> Approve
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black font-oswald uppercase rounded hover:bg-gray-200"
                    >
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditPlayerModal
