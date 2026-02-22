import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { X, Save, Check, Download } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AbstractPlayerCard from '../common/AbstractPlayerCard'
import PlayerCard from '../common/PlayerCard'
import { CARD_LAYOUT_DEFAULTS } from '../../config/cardLayout'


import { renderPlayerCardToCanvas } from '../../utils/playerCardRenderer'

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

                // Layout Params
                state.name_x = parseInt(params.get('name_x')) || CARD_LAYOUT_DEFAULTS.NAME_X
                state.name_y = parseInt(params.get('name_y')) || CARD_LAYOUT_DEFAULTS.NAME_Y
                state.name_size = parseInt(params.get('name_size')) || CARD_LAYOUT_DEFAULTS.NAME_SIZE
                state.stats_x = parseInt(params.get('stats_x')) || CARD_LAYOUT_DEFAULTS.STATS_X
                state.stats_y = parseInt(params.get('stats_y')) || CARD_LAYOUT_DEFAULTS.STATS_Y
                state.rating_x = parseInt(params.get('rating_x')) || CARD_LAYOUT_DEFAULTS.RATING_X
                state.rating_y = parseInt(params.get('rating_y')) || CARD_LAYOUT_DEFAULTS.RATING_Y
                state.position_x = parseInt(params.get('position_x')) || CARD_LAYOUT_DEFAULTS.POSITION_X
                state.position_y = parseInt(params.get('position_y')) || CARD_LAYOUT_DEFAULTS.POSITION_Y
                state.position_size = parseInt(params.get('position_size')) || CARD_LAYOUT_DEFAULTS.POSITION_SIZE
                state.branch_x = parseInt(params.get('branch_x')) || CARD_LAYOUT_DEFAULTS.BRANCH_X
                state.branch_y = parseInt(params.get('branch_y')) || CARD_LAYOUT_DEFAULTS.BRANCH_Y
                state.branch_size = parseInt(params.get('branch_size')) || CARD_LAYOUT_DEFAULTS.BRANCH_SIZE
                state.year_x = parseInt(params.get('year_x')) || CARD_LAYOUT_DEFAULTS.YEAR_X
                state.year_y = parseInt(params.get('year_y')) || CARD_LAYOUT_DEFAULTS.YEAR_Y
                state.year_size = parseInt(params.get('year_size')) || CARD_LAYOUT_DEFAULTS.YEAR_SIZE
            } catch (e) {
                console.error("Error parsing URL params", e)
            }
        }

        // Auction Info Defaults
        if (state.key_achievements === undefined) state.key_achievements = ''
        if (state.preferred_foot === undefined) state.preferred_foot = ''
        if (state.notable_stats === undefined) state.notable_stats = ''
        if (state.player_traits === undefined) state.player_traits = ''
        if (state.base_price === undefined) state.base_price = 0

        // Defaults
        if (!state.image_scale) state.image_scale = 1
        if (!state.image_x) state.image_x = 0
        if (!state.image_y) state.image_y = 0
        if (!state.card_variant) state.card_variant = 'standard'

        // Tournament Stats Defaults
        if (state.goals === undefined) state.goals = 0
        if (state.assists === undefined) state.assists = 0
        if (state.clean_sheets === undefined) state.clean_sheets = 0
        if (state.yellow_cards === undefined) state.yellow_cards = 0
        if (state.red_cards === undefined) state.red_cards = 0
        if (state.matches_played === undefined) state.matches_played = 0
        if (state.mom_awards === undefined) state.mom_awards = 0

        // Layout Defaults
        if (state.name_x === undefined) state.name_x = CARD_LAYOUT_DEFAULTS.NAME_X
        if (state.name_y === undefined) state.name_y = CARD_LAYOUT_DEFAULTS.NAME_Y
        if (state.name_size === undefined) state.name_size = CARD_LAYOUT_DEFAULTS.NAME_SIZE
        if (state.stats_x === undefined) state.stats_x = CARD_LAYOUT_DEFAULTS.STATS_X
        if (state.stats_y === undefined) state.stats_y = CARD_LAYOUT_DEFAULTS.STATS_Y
        if (state.rating_x === undefined) state.rating_x = CARD_LAYOUT_DEFAULTS.RATING_X
        if (state.rating_y === undefined) state.rating_y = CARD_LAYOUT_DEFAULTS.RATING_Y
        if (state.position_x === undefined) state.position_x = CARD_LAYOUT_DEFAULTS.POSITION_X
        if (state.position_y === undefined) state.position_y = CARD_LAYOUT_DEFAULTS.POSITION_Y
        if (state.position_size === undefined) state.position_size = CARD_LAYOUT_DEFAULTS.POSITION_SIZE
        if (state.branch_x === undefined) state.branch_x = CARD_LAYOUT_DEFAULTS.BRANCH_X
        if (state.branch_y === undefined) state.branch_y = CARD_LAYOUT_DEFAULTS.BRANCH_Y
        if (state.branch_size === undefined) state.branch_size = CARD_LAYOUT_DEFAULTS.BRANCH_SIZE
        if (state.year_x === undefined) state.year_x = CARD_LAYOUT_DEFAULTS.YEAR_X
        if (state.year_y === undefined) state.year_y = CARD_LAYOUT_DEFAULTS.YEAR_Y
        if (state.year_size === undefined) state.year_size = CARD_LAYOUT_DEFAULTS.YEAR_SIZE

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
        try {
            // Prepare player data - similar to how it was constructed for preview
            const playerData = {
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
                // Layout params
                name_x: parseInt(formData.name_x),
                name_y: parseInt(formData.name_y),
                name_size: parseInt(formData.name_size),
                stats_x: parseInt(formData.stats_x),
                stats_y: parseInt(formData.stats_y),
                rating_x: parseInt(formData.rating_x),
                rating_y: parseInt(formData.rating_y),
                position_x: parseInt(formData.position_x),
                position_y: parseInt(formData.position_y),
                position_size: parseInt(formData.position_size),
                branch_x: parseInt(formData.branch_x),
                branch_y: parseInt(formData.branch_y),
                branch_size: parseInt(formData.branch_size),
                year_x: parseInt(formData.year_x),
                year_y: parseInt(formData.year_y),
                year_size: parseInt(formData.year_size),
                // Ensure photo_url is available
                branch: formData.branch,
                photo_url: formData.photo_url,
                card_variant: formData.card_variant // Ensure variant is passed
            }

            const dataUrl = await renderPlayerCardToCanvas(playerData);

            const link = document.createElement('a')
            link.download = `${formData.name.replace(/\s+/g, '_')}_card.png`
            link.href = dataUrl
            link.click()
            toast.success("Card downloaded successfully")
        } catch (error) {
            console.error('Download error:', error)
            toast.error('Failed to generate card image')
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
                // Append layout settings
                saveUrl += `&name_x=${formData.name_x}&name_y=${formData.name_y}&name_size=${formData.name_size}`
                saveUrl += `&stats_x=${formData.stats_x}&stats_y=${formData.stats_y}`
                saveUrl += `&rating_x=${formData.rating_x}&rating_y=${formData.rating_y}`
                saveUrl += `&position_x=${formData.position_x}&position_y=${formData.position_y}&position_size=${formData.position_size}`
                saveUrl += `&branch_x=${formData.branch_x}&branch_y=${formData.branch_y}&branch_size=${formData.branch_size}`
                saveUrl += `&year_x=${formData.year_x}&year_y=${formData.year_y}&year_size=${formData.year_size}`
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
                branch: formData.branch,
                year: formData.year,
                is_main_team: formData.is_main_team,
                status: formData.status,
                photo_url: saveUrl,
                // Auction Info
                key_achievements: formData.key_achievements,
                preferred_foot: formData.preferred_foot,
                notable_stats: formData.notable_stats,
                player_traits: formData.player_traits,
                base_price: parseInt(formData.base_price) || 0,
                // Tournament Stats
                goals: parseInt(formData.goals) || 0,
                assists: parseInt(formData.assists) || 0,
                clean_sheets: parseInt(formData.clean_sheets) || 0,
                yellow_cards: parseInt(formData.yellow_cards) || 0,
                red_cards: parseInt(formData.red_cards) || 0,
                matches_played: parseInt(formData.matches_played) || 0,
                mom_awards: parseInt(formData.mom_awards) || 0
                // Exclude params from payload columns
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
            toast.success("Player saved successfully")
        } catch (err) {
            console.error("Error saving:", err)
            toast.error("Failed to save player. Check console for details.")
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
            toast.success("Player approved successfully")
        } catch (err) {
            console.error("Error approving:", err)
            toast.error("Failed to approve player")
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
            toast.success("Player deleted successfully")
        } catch (err) {
            console.error("Error deleting:", err)
            toast.error("Failed to delete player")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md">
            <div className="bg-black/70 border border-white/10 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
                    <div>
                        <h2 className="text-2xl font-oswald text-gold uppercase tracking-wide">
                            {player.id ? 'Edit Player Profile' : 'New Player Entry'}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-white/40 font-rajdhani uppercase tracking-wider mt-1">
                            <span>ID: {player.id ? player.id.slice(0, 8) : 'NEW'}</span>
                            <span>•</span>
                            <span>DATABASE RECORD</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                        <X className="text-white/60 group-hover:text-red-500 transition-colors" />
                    </button>
                </div>

                {/* Content - Flex Layout for Sticky Preview */}
                <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">

                    {/* LEFT COLUMN: LIVE PREVIEW (Sticky/Static Side) */}
                    <div className="lg:w-[400px] xl:w-[480px] bg-black/20 border-b lg:border-b-0 lg:border-r border-white/5 p-6 flex flex-col items-center justify-start overflow-y-auto scrollbar-thin shrink-0">
                        <div className="w-full max-w-[340px] flex flex-col gap-6">
                            {/* Card Preview Container */}
                            <div className="relative group perspective-1000">
                                <div className="relative z-10 transition-transform duration-500 transform group-hover:rotate-y-12 group-hover:rotate-x-12 preserve-3d">
                                    <div className="relative shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[24px]">
                                        {/* Background Glow */}
                                        <div className={`absolute inset-0 bg-gradient-to-tr ${formData.card_variant === 'gold' ? 'from-gold/20 via-transparent to-gold/10' :
                                            formData.card_variant === 'silver' ? 'from-white/10 via-transparent to-white/5' :
                                                formData.card_variant === 'neon' ? 'from-neon/20 via-transparent to-neon/10' :
                                                    'from-laser-blue/20 via-transparent to-laser-blue/10'
                                            } blur-xl opacity-50`}></div>

                                        {/* Card Render */}
                                        <div ref={cardRef} className="relative z-20">
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
                                                        image_y: parseInt(formData.image_y),
                                                        name_x: parseInt(formData.name_x),
                                                        name_y: parseInt(formData.name_y),
                                                        name_size: parseInt(formData.name_size),
                                                        stats_x: parseInt(formData.stats_x),
                                                        stats_y: parseInt(formData.stats_y),
                                                        rating_x: parseInt(formData.rating_x),
                                                        rating_y: parseInt(formData.rating_y),
                                                        position_x: parseInt(formData.position_x),
                                                        position_y: parseInt(formData.position_y),
                                                        position_size: parseInt(formData.position_size),
                                                        branch_x: parseInt(formData.branch_x),
                                                        branch_y: parseInt(formData.branch_y),
                                                        branch_size: parseInt(formData.branch_size)
                                                    }}
                                                    size="modal"
                                                    animated={false}
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
                                                        name_x: parseInt(formData.name_x),
                                                        name_y: parseInt(formData.name_y),
                                                        name_size: parseInt(formData.name_size),
                                                        stats_x: parseInt(formData.stats_x),
                                                        stats_y: parseInt(formData.stats_y),
                                                        rating_x: parseInt(formData.rating_x),
                                                        rating_y: parseInt(formData.rating_y),
                                                        position_x: parseInt(formData.position_x),
                                                        position_y: parseInt(formData.position_y),
                                                        position_size: parseInt(formData.position_size),
                                                        branch_x: parseInt(formData.branch_x),
                                                        branch_y: parseInt(formData.branch_y),
                                                        branch_size: parseInt(formData.branch_size)
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Controls */}
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setPreviewType('auction')}
                                    className={`px-4 py-2 rounded text-xs uppercase font-oswald tracking-wider transition-all ${previewType === 'auction' ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
                                        }`}
                                >
                                    Classic Card
                                </button>
                                <button
                                    onClick={() => setPreviewType('abstract')}
                                    className={`px-4 py-2 rounded text-xs uppercase font-oswald tracking-wider transition-all ${previewType === 'abstract' ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
                                        }`}
                                >
                                    Abstract Art
                                </button>
                            </div>

                            <div className="text-center">
                                <p className="text-[10px] text-white/20 uppercase font-rajdhani tracking-widest">
                                    Changes update in real-time
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FORM (Scrollable Side) */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <div className="flex flex-col gap-6">

                            {/* 1. General Info Panel */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-colors">
                                <h3 className="text-sm font-oswald text-gold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-gold block"></span>
                                    Player Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Full Name</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-gold/50 outline-none transition-colors font-rajdhani"
                                            placeholder="Enter name"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Position</label>
                                            <select
                                                name="position"
                                                value={formData.position}
                                                onChange={handleChange}
                                                className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-gold/50 outline-none transition-colors font-rajdhani appearance-none"
                                            >
                                                {['ST', 'CF', 'LW', 'RW', 'LM', 'RM', 'CAM', 'CM', 'CDM', 'LB', 'RB', 'CB', 'GK'].map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Year</label>
                                            <select
                                                name="year"
                                                value={formData.year}
                                                onChange={handleChange}
                                                className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-gold/50 outline-none transition-colors font-rajdhani appearance-none"
                                            >
                                                {['1st', '2nd', '3rd', '4th', '5th', 'Alumni', 'M.Tech', 'PhD'].map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Branch</label>
                                        <select
                                            name="branch"
                                            value={formData.branch || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-gold/50 outline-none transition-colors font-rajdhani appearance-none"
                                        >
                                            <option value="" disabled>Select Branch</option>
                                            {['CSE', 'IT', 'ECE', 'EE', 'MECH', 'CIVIL', 'META', 'CHEM', 'MINING', 'BIOTECH', 'ARCH', 'MCA', 'BIOMED', 'MSC'].map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Status</label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-gold/50 outline-none transition-colors font-rajdhani appearance-none"
                                            >
                                                {['Pending', 'Ready', 'Sold', 'Alumni'].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-end pb-2">
                                            <label className="flex items-center gap-2 cursor-pointer group w-full">
                                                <div className={`w-4 h-4 border border-white/20 rounded flex items-center justify-center transition-colors ${formData.is_main_team ? 'bg-gold border-gold' : 'bg-black/50 group-hover:border-white/40'}`}>
                                                    {formData.is_main_team && <Check size={12} className="text-black" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_main_team || false}
                                                    onChange={(e) => setFormData({ ...formData, is_main_team: e.target.checked })}
                                                    className="hidden"
                                                />
                                                <span className="text-xs text-white/60 font-rajdhani uppercase tracking-wider group-hover:text-white transition-colors">Main Squad</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Image Control Panel */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-colors">
                                <h3 className="text-sm font-oswald text-laser-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-laser-blue block"></span>
                                    Image Settings
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-1 relative">
                                        <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Photo URL</label>
                                        <input
                                            name="photo_url"
                                            value={formData.photo_url || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-xs font-mono focus:border-laser-blue/50 outline-none transition-colors truncate"
                                            placeholder="https://..."
                                        />
                                        <div className="absolute right-2 top-[26px] pointer-events-none text-[10px] text-white/20">SUPABASE STORAGE</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Scale */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                <span>Scale</span>
                                                <span className="text-white">{parseFloat(formData.image_scale).toFixed(2)}x</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="2"
                                                step="0.01"
                                                name="image_scale"
                                                value={formData.image_scale}
                                                onChange={handleChange}
                                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                                            />
                                        </div>

                                        {/* Variant Selector */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                <span>Card Style</span>
                                            </div>
                                            <select
                                                name="card_variant"
                                                value={formData.card_variant || 'standard'}
                                                onChange={handleChange}
                                                className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white focus:outline-none focus:border-white/30 font-rajdhani uppercase appearance-none"
                                            >
                                                <option value="standard">Standard (Blue)</option>
                                                <option value="neon">Neon (Glitch)</option>
                                                <option value="gold">Gold (Prestige)</option>
                                                <option value="silver">Silver (Alumni)</option>
                                                <option value="brown">Brown (Vintage)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6 pt-2">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                <span>Zoom</span>
                                                <span className="text-white">{parseFloat(formData.image_scale).toFixed(1)}x</span>
                                            </div>
                                            <input type="range" min="0.5" max="2" step="0.1" name="image_scale" value={formData.image_scale} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-laser-blue" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                <span>Horizontal (X)</span>
                                                <span className="text-white">{formData.image_x}px</span>
                                            </div>
                                            <input type="range" min="-100" max="100" step="5" name="image_x" value={formData.image_x} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-laser-blue" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                <span>Vertical (Y)</span>
                                                <span className="text-white">{formData.image_y}px</span>
                                            </div>
                                            <input type="range" min="-100" max="100" step="5" name="image_y" value={formData.image_y} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-laser-blue" />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex items-center gap-3">
                                            <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider whitespace-nowrap">Card Variant:</label>
                                            <div className="flex gap-2">
                                                {['standard', 'gold', 'silver', 'neon'].map(v => (
                                                    <button
                                                        key={v}
                                                        onClick={() => setFormData({ ...formData, card_variant: v })}
                                                        className={`text-[10px] px-2 py-0.5 rounded border uppercase font-rajdhani transition-all ${formData.card_variant === v ? 'border-white text-white bg-white/10' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                                                    >
                                                        {v}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* 3. Stats Panel */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-colors flex-1">
                                <h3 className="text-sm font-oswald text-neon uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-neon block"></span>
                                    Performance Stats
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                    {statsLabels.map(stat => (
                                        <div key={stat} className="flex items-center gap-4">
                                            <label className="w-16 text-xs uppercase text-white/60 font-rajdhani tracking-wider text-right">{stat}</label>
                                            <div className="flex-1 flex items-center gap-3">
                                                <input
                                                    type="range"
                                                    min="1" max="99"
                                                    value={formData[stat.toLowerCase()]}
                                                    onChange={(e) => handleStatChange(stat, e.target.value)}
                                                    className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon"
                                                />
                                                <input
                                                    type="number"
                                                    min="1" max="99"
                                                    value={formData[stat.toLowerCase()]}
                                                    onChange={(e) => handleStatChange(stat, e.target.value)}
                                                    className="w-10 bg-black/50 border border-white/10 rounded text-center text-white text-sm font-bebas focus:border-neon/50 outline-none"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3.5. Tournament Stats Panel (New) */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-colors flex-1">
                                <h3 className="text-sm font-oswald text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-white block"></span>
                                    Tournament Stats
                                </h3>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Goals</label>
                                        <input type="number" name="goals" value={formData.goals} onChange={handleChange} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-white/50 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Assists</label>
                                        <input type="number" name="assists" value={formData.assists} onChange={handleChange} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-white/50 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Clean Sheets</label>
                                        <input type="number" name="clean_sheets" value={formData.clean_sheets} onChange={handleChange} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-white/50 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Matches</label>
                                        <input type="number" name="matches_played" value={formData.matches_played} onChange={handleChange} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-white/50 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-yellow-500/60 font-rajdhani tracking-wider">Yellow Cards</label>
                                        <input type="number" name="yellow_cards" value={formData.yellow_cards} onChange={handleChange} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-yellow-500/50 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-red-500/60 font-rajdhani tracking-wider">Red Cards</label>
                                        <input type="number" name="red_cards" value={formData.red_cards} onChange={handleChange} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-red-500/50 outline-none" />
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-[10px] uppercase text-neon/60 font-rajdhani tracking-wider">Man of the Match</label>
                                        <input type="number" name="mom_awards" value={formData.mom_awards} onChange={handleChange} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-neon/50 outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* 3.6. Auction Info Panel (New) */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-colors flex-1">
                                <h3 className="text-sm font-oswald text-gold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-gold block"></span>
                                    Auction & Player Info
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Key Achievements</label>
                                        <textarea name="key_achievements" value={formData.key_achievements || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-gold/50 outline-none min-h-[80px]" placeholder="e.g. Golden Boot 2023" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Player Traits</label>
                                        <textarea name="player_traits" value={formData.player_traits || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-gold/50 outline-none min-h-[80px]" placeholder="e.g. Clinical Finisher" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Notable Stats</label>
                                        <input type="text" name="notable_stats" value={formData.notable_stats || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-gold/50 outline-none" placeholder="e.g. 5 goals in last 3 matches" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Preferred Foot</label>
                                            <select name="preferred_foot" value={formData.preferred_foot || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-gold/50 outline-none appearance-none">
                                                <option value="" disabled>Select Foot</option>
                                                <option value="Right">Right</option>
                                                <option value="Left">Left</option>
                                                <option value="Both">Both</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-gold/60 font-rajdhani tracking-wider">Base Price</label>
                                            <input type="number" name="base_price" value={formData.base_price || 0} onChange={handleChange} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded text-white text-sm focus:border-gold/50 outline-none" placeholder="e.g. 100000" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Advanced Layout Panel */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-colors">
                                <h3 className="text-sm font-oswald text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-white/60 block"></span>
                                    Advanced Layout
                                </h3>

                                <div className="space-y-6">
                                    {/* Name Controls */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Name Position & Size</h4>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                    <span>X-Pos</span>
                                                    <span className="text-white">{formData.name_x || 0}px</span>
                                                </div>
                                                <input type="range" min="-100" max="100" step="1" name="name_x" value={formData.name_x || 0} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                    <span>Y-Pos</span>
                                                    <span className="text-white">{formData.name_y || 0}px</span>
                                                </div>
                                                <input type="range" min="-100" max="100" step="1" name="name_y" value={formData.name_y || 0} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                    <span>Size</span>
                                                    <span className="text-white">{formData.name_size || 52}px</span>
                                                </div>
                                                <input type="range" min="30" max="80" step="1" name="name_size" value={formData.name_size || 52} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Controls */}
                                    <div className="space-y-2 pt-2 border-t border-white/5">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Stats Position</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                    <span>X-Pos</span>
                                                    <span className="text-white">{formData.stats_x || 0}px</span>
                                                </div>
                                                <input type="range" min="-100" max="100" step="1" name="stats_x" value={formData.stats_x || 0} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                    <span>Y-Pos</span>
                                                    <span className="text-white">{formData.stats_y || 0}px</span>
                                                </div>
                                                <input type="range" min="-170" max="100" step="1" name="stats_y" value={formData.stats_y || 0} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Block Controls */}
                                    <div className="space-y-4 pt-2 border-t border-white/5">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[10px] uppercase text-white/40 font-rajdhani tracking-wider">Info Block Position</h4>
                                        </div>

                                        {/* Rating */}
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-white/20 font-rajdhani">Rating (Main Anchor)</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                        <span>X-Pos</span>
                                                        <span className="text-white">{formData.rating_x || 0}px</span>
                                                    </div>
                                                    <input type="range" min="-100" max="100" step="1" name="rating_x" value={formData.rating_x || 0} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                        <span>Y-Pos</span>
                                                        <span className="text-white">{formData.rating_y || 0}px</span>
                                                    </div>
                                                    <input type="range" min="-100" max="100" step="1" name="rating_y" value={formData.rating_y || 0} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Position */}
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-white/20 font-rajdhani">Position Text</label>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                        <span>X-Pos</span>
                                                        <span className="text-white">{formData.position_x || 0}px</span>
                                                    </div>
                                                    <input type="range" min="-100" max="100" step="1" name="position_x" value={formData.position_x || 0} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                        <span>Y-Pos</span>
                                                        <span className="text-white">{formData.position_y || 0}px</span>
                                                    </div>
                                                    <input type="range" min="-100" max="100" step="1" name="position_y" value={formData.position_y || 0} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                        <span>Size</span>
                                                        <span className="text-white">{formData.position_size || 28}px</span>
                                                    </div>
                                                    <input type="range" min="10" max="60" step="1" name="position_size" value={formData.position_size || 28} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Branch */}
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-white/20 font-rajdhani">Branch Text</label>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                        <span>X-Pos</span>
                                                        <span className="text-white">{formData.branch_x || 0}px</span>
                                                    </div>
                                                    <input type="range" min="-100" max="600" step="1" name="branch_x" value={formData.branch_x || 0} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                        <span>Y-Pos</span>
                                                        <span className="text-white">{formData.branch_y || 0}px</span>
                                                    </div>
                                                    <input type="range" min="-100" max="600" step="1" name="branch_y" value={formData.branch_y || 0} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                        <span>Size</span>
                                                        <span className="text-white">{formData.branch_size || 18}px</span>
                                                    </div>
                                                    <input type="range" min="10" max="40" step="1" name="branch_size" value={formData.branch_size || 18} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Year */}
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-white/20 font-rajdhani">Year Text</label>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                        <span>X-Pos</span>
                                                        <span className="text-white">{formData.year_x || 0}px</span>
                                                    </div>
                                                    <input type="range" min="-100" max="600" step="1" name="year_x" value={formData.year_x || 0} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                        <span>Y-Pos</span>
                                                        <span className="text-white">{formData.year_y || 0}px</span>
                                                    </div>
                                                    <input type="range" min="-100" max="600" step="1" name="year_y" value={formData.year_y || 0} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] text-white/40 font-rajdhani uppercase">
                                                        <span>Size</span>
                                                        <span className="text-white">{formData.year_size || 18}px</span>
                                                    </div>
                                                    <input type="range" min="10" max="60" step="1" name="year_size" value={formData.year_size || 18} onChange={handleChange} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-white/10 bg-black/60 flex justify-between items-center backdrop-blur-xl">
                    <div>
                        {player.id && (
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 text-xs font-oswald uppercase tracking-wider rounded transition-all flex items-center gap-2"
                            >
                                <X size={14} /> Delete Entry
                            </button>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-white/40 hover:text-white text-xs font-oswald uppercase tracking-wider transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDownload}
                            className="px-6 py-2 text-white/60 hover:text-white text-xs font-oswald uppercase tracking-wider transition-colors flex items-center gap-2"
                        >
                            <Download size={16} /> Download
                        </button>
                        {player.status === 'Pending' && (
                            <button
                                onClick={handleApprove}
                                disabled={loading}
                                className="px-6 py-2 bg-neon/10 hover:bg-neon/20 text-neon border border-neon/50 rounded text-xs font-oswald uppercase tracking-wider shadow-[0_0_15px_rgba(57,255,20,0.1)] hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all flex items-center gap-2"
                            >
                                <Check size={16} /> Approve
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-8 py-2 bg-gold hover:bg-gold/90 text-black rounded text-xs font-bold font-oswald uppercase tracking-wider shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all flex items-center gap-2"
                        >
                            {loading ? <span className="animate-spin">⌛</span> : <><Save size={16} /> Save Changes</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EditPlayerModal
