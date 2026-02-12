import React, { useState, useEffect, useRef } from 'react'
import { X, Save, Check, Download } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AbstractPlayerCard from '../common/AbstractPlayerCard'
import PlayerCard from '../common/PlayerCard'
import html2canvas from 'html2canvas'

const statsLabels = ['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defending', 'Physical']

const EditPlayerModal = ({ player, onClose, onUpdate }) => {
    // Helper to extract params from URL for initial state
    const getInitialState = () => {
        const state = { ...player }
        let url = state.photo_url || ''

        // Parse params from URL if columns don't exist
        if (url.includes('?')) {
            try {
                const [cleanUrl, queryString] = url.split('?')
                const params = new URLSearchParams(queryString)

                state.photo_url = cleanUrl
                if (!state.image_scale) state.image_scale = parseFloat(params.get('scale')) || 1
                if (!state.image_x) state.image_x = parseInt(params.get('x')) || 0
                if (!state.image_y) state.image_y = parseInt(params.get('y')) || 0
                if (!state.card_variant) state.card_variant = params.get('variant') || 'standard'
            } catch (e) {
                console.error("Error parsing URL params", e)
            }
        }

        // Defaults
        if (!state.image_scale) state.image_scale = 1
        if (!state.image_x) state.image_x = 0
        if (!state.image_y) state.image_y = 0
        if (!state.card_variant) state.card_variant = state.status === 'Alumni' ? 'gold' : 'standard'

        return state
    }

    const [formData, setFormData] = useState(getInitialState())
    const [loading, setLoading] = useState(false)
    // Default to 'auction' style if not Alumni status
    const [previewType, setPreviewType] = useState(formData.status === 'Alumni' ? 'classic' : 'auction')
    const cardRef = useRef(null)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleStatChange = (stat, value) => {
        setFormData({ ...formData, [stat.toLowerCase()]: parseInt(value) })
    }

    const handleDownload = async () => {
        if (!cardRef.current) return
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 3, // High resolution for auction quality
                logging: false,
                useCORS: true
            })
            const link = document.createElement('a')
            link.download = `${formData.name.replace(/\s+/g, '_')}_card.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
        } catch (error) {
            console.error('Download error:', error)
            alert('Failed to generate card image')
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            // Construct URL with params for persistence without schema changes
            let saveUrl = formData.photo_url
            if (saveUrl) {
                // Remove existing params if any (from paste)
                saveUrl = saveUrl.split('?')[0]
                // Append current settings
                saveUrl += `?scale=${formData.image_scale}&x=${formData.image_x}&y=${formData.image_y}&variant=${formData.card_variant}`
            }

            const payload = {
                name: formData.name,
                pace: formData.pace,
                shooting: formData.shooting,
                passing: formData.passing,
                dribbling: formData.dribbling,
                defending: formData.defending,
                physical: formData.physical,
                position: formData.position,
                year: formData.year,
                is_main_team: formData.is_main_team,
                status: formData.status,
                photo_url: saveUrl
                // Exclude image_scale, image_x, image_y, card_variant from payload
            }

            if (player.id) {
                const { error } = await supabase
                    .from('players')
                    .update(payload)
                    .eq('id', player.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('players')
                    .insert([payload])
                if (error) throw error
            }

            onUpdate()
            onClose()
        } catch (err) {
            console.error("Error saving:", err)
            alert("Failed to save player. Check console for details.")
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

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this player? This cannot be undone.")) return
        setLoading(true)
        try {
            const { error } = await supabase
                .from('players')
                .delete()
                .eq('id', player.id)

            if (error) throw error
            onUpdate()
            onClose()
        } catch (err) {
            console.error("Error deleting:", err)
            alert("Failed to delete player")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-white/20 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-oswald text-gold">
                        {player.id ? `Edit Player: ${player.name}` : 'Add New Player'}
                    </h2>
                    <button onClick={onClose}><X className="text-white hover:text-red-500" /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div>
                        {/* Live Card Preview */}
                        <div className="w-full max-w-[280px] mx-auto mb-4">
                            {/* Preview Toggle */}
                            <div className="flex justify-center gap-2 mb-4 bg-black/40 p-1 rounded-lg w-fit mx-auto border border-white/10">
                                <button
                                    onClick={() => setPreviewType('auction')}
                                    className={`text-[10px] px-3 py-1 rounded transition-colors uppercase font-oswald ${previewType === 'auction' ? 'bg-gold text-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    Auction Style
                                </button>
                                <button
                                    onClick={() => setPreviewType('classic')}
                                    className={`text-[10px] px-3 py-1 rounded transition-colors uppercase font-oswald ${previewType === 'classic' ? 'bg-gold text-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    Alumni Style
                                </button>
                            </div>

                            <div ref={cardRef} className="transform hover:scale-105 transition-transform duration-300">
                                {previewType === 'auction' ? (
                                    <PlayerCard
                                        player={{
                                            ...formData,
                                            pace: parseInt(formData.pace),
                                            shooting: parseInt(formData.shooting),
                                            passing: parseInt(formData.passing),
                                            dribbling: parseInt(formData.dribbling),
                                            defending: parseInt(formData.defending),
                                            physical: parseInt(formData.physical),
                                            image_scale: parseFloat(formData.image_scale),
                                            image_x: parseInt(formData.image_x),
                                            image_y: parseInt(formData.image_y)
                                        }}
                                        size="medium"
                                    />
                                ) : (
                                    <AbstractPlayerCard
                                        player={{
                                            ...formData,
                                            pace: parseInt(formData.pace),
                                            shooting: parseInt(formData.shooting),
                                            passing: parseInt(formData.passing),
                                            dribbling: parseInt(formData.dribbling),
                                            defending: parseInt(formData.defending),
                                            physical: parseInt(formData.physical),
                                            image_scale: parseFloat(formData.image_scale),
                                            image_x: parseInt(formData.image_x),
                                            image_y: parseInt(formData.image_y),
                                            card_variant: formData.card_variant
                                        }}
                                    />
                                )}
                            </div>
                            <p className="text-center text-xs text-white/40 mt-2 font-rajdhani uppercase tracking-widest">Live Preview</p>
                        </div>

                        {/* Download & Actions */}
                        <div className="flex justify-center mb-6">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-oswald uppercase rounded transition-colors"
                            >
                                <Download size={14} /> Download PNG
                            </button>
                        </div>

                        {/* Image Controls */}
                        <div className="bg-black/40 p-3 rounded-lg mb-4 border border-white/10 space-y-2">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs uppercase text-gray-400">Card Design</h4>
                                <select
                                    name="card_variant"
                                    value={formData.card_variant}
                                    onChange={handleChange}
                                    className="bg-black border border-white/20 text-white text-[10px] p-1 rounded uppercase"
                                >
                                    <option value="standard">Standard</option>
                                    <option value="gold">Gold (Alumni)</option>
                                    <option value="silver">Silver</option>
                                    <option value="neon">Neon Special</option>
                                </select>
                            </div>

                            <div className="border-t border-white/5 my-2"></div>

                            <div className="flex items-center gap-2">
                                <label className="text-[10px] w-12 text-white/60">Zoom</label>
                                <input type="range" min="0.5" max="2" step="0.1" name="image_scale" value={formData.image_scale} onChange={handleChange} className="flex-1 accent-white h-1 bg-white/20 rounded-lg appearance-none cursor-pointer" />
                                <span className="text-[10px] w-8 text-right text-white/60">{parseFloat(formData.image_scale).toFixed(1)}x</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-[10px] w-12 text-white/60">X-Pos</label>
                                <input type="range" min="-100" max="100" step="5" name="image_x" value={formData.image_x} onChange={handleChange} className="flex-1 accent-white h-1 bg-white/20 rounded-lg appearance-none cursor-pointer" />
                                <span className="text-[10px] w-8 text-right text-white/60">{formData.image_x}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-[10px] w-12 text-white/60">Y-Pos</label>
                                <input type="range" min="-100" max="100" step="5" name="image_y" value={formData.image_y} onChange={handleChange} className="flex-1 accent-white h-1 bg-white/20 rounded-lg appearance-none cursor-pointer" />
                                <span className="text-[10px] w-8 text-right text-white/60">{formData.image_y}</span>
                            </div>
                        </div>

                    </div>

                    <div className="space-y-4">
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
                                {['ST', 'CB', 'CM', 'GK', 'CDM', 'Winger', 'Fullback'].map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>

                        {/* Status Dropdown */}
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-black border border-white/20 p-2 rounded text-white"
                            >
                                {['Pending', 'Ready', 'Sold', 'Alumni'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* Photo URL Input */}
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Photo URL</label>
                            <input
                                name="photo_url"
                                value={formData.photo_url || ''}
                                onChange={handleChange}
                                className="w-full bg-black border border-white/20 p-2 rounded text-white text-xs mb-1"
                                placeholder="Paste Supabase URL here"
                            />
                            <p className="text-[10px] text-white/40 leading-tight">
                                To add Alumni photos: Upload image to Supabase 'player-photos' bucket, copy Public URL, and paste here.
                            </p>
                        </div>

                        <h3 className="font-oswald text-neon mt-6">Stats</h3>
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

                        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                            <label className="text-white font-oswald uppercase">Main Squad Member?</label>
                            <input
                                type="checkbox"
                                checked={formData.is_main_team || false}
                                onChange={(e) => setFormData({ ...formData, is_main_team: e.target.checked })}
                                className="w-5 h-5 accent-gold cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-6">
                    <div>
                        {player.id && (
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/50 font-oswald uppercase rounded hover:bg-red-500 hover:text-white transition-colors text-sm"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                    <div className="flex gap-4">
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
        </div >
    )
}

export default EditPlayerModal
