import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { removeBackground } from '../lib/removeBackground'
import ImageUpload from '../components/register/ImageUpload'
import { Info, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const positions = ['ST', 'CB', 'CM', 'GK', 'CDM', 'Winger', 'Fullback']
const years = ['1st', '2nd', '3rd', '4th', '5th']
const statsLabels = ['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defending', 'Physical']

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        year: '',
        position: '',
        stats: {
            pace: 50,
            shooting: 50,
            passing: 50,
            dribbling: 50,
            defending: 50,
            physical: 50
        }
    })
    const [imageFile, setImageFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [processingStatus, setProcessingStatus] = useState('') // For user feedback
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleStatChange = (stat, value) => {
        setFormData({
            ...formData,
            stats: { ...formData.stats, [stat.toLowerCase()]: parseInt(value) }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (!imageFile) {
            setError("Please upload a photo.")
            setLoading(false)
            return
        }

        try {
            // Background removal disabled - users should upload pre-processed PNG files
            // If you want to enable automatic background removal, uncomment the lines below
            // and make sure VITE_REMOVE_BG_API_KEY is set in .env

            // setProcessingStatus('Removing background...')
            // const processedImage = await removeBackground(imageFile)

            // Upload Image (accepts PNG with transparency)
            setProcessingStatus('Uploading image...')
            const fileExt = 'png' // Supports transparency
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('player-photos')
                .upload(filePath, imageFile) // Upload user's file directly

            if (uploadError) throw uploadError

            // 3. Get Public URL
            setProcessingStatus('Saving player data...')
            const { data: { publicUrl } } = supabase.storage
                .from('player-photos')
                .getPublicUrl(filePath)

            // 3. Insert Player Data
            const { error: insertError } = await supabase
                .from('players')
                .insert([{
                    name: formData.name,
                    year: formData.year,
                    position: formData.position,
                    pace: formData.stats.pace,
                    shooting: formData.stats.shooting,
                    passing: formData.stats.passing,
                    dribbling: formData.stats.dribbling,
                    defending: formData.stats.defending,
                    physical: formData.stats.physical,
                    photo_url: publicUrl,
                    status: 'Pending'
                }])

            if (insertError) throw insertError

            navigate('/')
            alert('Registration successful! Waiting for approval.')

        } catch (err) {
            console.error('Error submitting form:', err)
            setError(err.message || "An error occurred during registration.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-white p-4 pb-20">
            <div className="max-w-2xl mx-auto">
                <Link to="/" className="inline-flex items-center text-white/50 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="mr-2" /> Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-oswald text-white mb-2 flex items-center gap-4">
                    <div className="w-12 h-12 relative rounded-full border border-white/20 bg-black/40 overflow-hidden flex-shrink-0">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
                    </div>
                    Player Registration
                </h1>
                <p className="text-white/60 mb-8 font-light">Join the draft. Prove your worth.</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Details */}
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h2 className="text-2xl font-oswald text-neon mb-6">Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-oswald uppercase text-white/70 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-neon focus:outline-none transition-colors"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-oswald uppercase text-white/70 mb-1">Academic Year</label>
                                    <select
                                        name="year"
                                        required
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-neon focus:outline-none transition-colors appearance-none"
                                    >
                                        <option value="" disabled>Select Year</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-oswald uppercase text-white/70 mb-1">Position</label>
                                    <select
                                        name="position"
                                        required
                                        value={formData.position}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-neon focus:outline-none transition-colors appearance-none"
                                    >
                                        <option value="" disabled>Select Position</option>
                                        {positions.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h2 className="text-2xl font-oswald text-neon mb-6">Player Card Photo</h2>
                        <p className="text-sm text-white/90 mb-4 flex items-center gap-2">
                            <Info size={26} />
                            Upload a PNG image with transparent background removed (use remove.bg or similar tools). This creates the FIFA-style card effect.
                        </p>
                        <ImageUpload onImageSelected={setImageFile} />
                    </div>

                    {/* Stats */}
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h2 className="text-2xl font-oswald text-neon mb-6">Self-Rated Stats</h2>
                        <p className="text-sm text-white/50 mb-6 flex items-center gap-2"><Info size={16} /> Be honest. Admin will verify these.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {statsLabels.map(stat => (
                                <div key={stat}>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-sm font-oswald uppercase text-white/70">{stat}</label>
                                        <span className="text-white/80 font-bold">{formData.stats[stat.toLowerCase()]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="99"
                                        value={formData.stats[stat.toLowerCase()]}
                                        onChange={(e) => handleStatChange(stat, e.target.value)}
                                        className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-neon"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-oswald font-bold uppercase text-xl py-4 rounded-lg shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:shadow-[0_0_50px_rgba(255,215,0,0.7)] disabled:opacity-50 disabled:cursor-not-allowed transition-all border-2 border-gold/50"
                    >
                        {loading ? (processingStatus || 'Submitting...') : 'Submit Registration'}
                    </motion.button>
                </form>
            </div>
        </div>
    )
}

export default Register
