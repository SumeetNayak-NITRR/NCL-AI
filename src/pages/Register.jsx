import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { removeBackground } from '../lib/removeBackground'
import ImageUpload from '../components/register/ImageUpload'
import { Info, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'

const positions = ['ST', 'CB', 'CM', 'GK', 'CDM', 'Winger', 'Fullback']
const years = ['1st', '2nd', '3rd', '4th', '5th']
const statsLabels = ['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defending', 'Physical']

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        roll_number: '',
        year: '',
        branch: '',
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
    const [isCropping, setIsCropping] = useState(false)
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

        // Basic Validation
        if (formData.roll_number.length !== 8 || isNaN(formData.roll_number)) {
            const msg = "Roll Number must be exactly 8 digits."
            setError(msg)
            alert(msg)
            setLoading(false)
            return
        }

        if (isCropping) {
            const msg = "Please click 'Confirm Crop' on your photo before submitting."
            setError(msg)
            alert(msg)
            setLoading(false)
            return
        }

        if (!imageFile) {
            const msg = "Please upload a photo."
            setError(msg)
            alert(msg)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setLoading(false)
            return
        }

        // VALIDATION: Check file size (2MB) and type (PNG)
        if (imageFile.size > 2 * 1024 * 1024) {
            const msg = "File too large. Maximum size is 2MB."
            setError(msg)
            alert(msg)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setLoading(false)
            return
        }

        if (imageFile.type !== 'image/png') {
            const msg = "Invalid format. Please upload a PNG file."
            setError(msg)
            alert(msg)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setLoading(false)
            return
        }

        try {
            // Upload Image
            setProcessingStatus('Uploading image...')
            const fileExt = 'png'
            const fileName = `${formData.roll_number}_${Date.now()}.${fileExt}` // Use Roll No in filename for organization
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('player-photos')
                .upload(filePath, imageFile)

            if (uploadError) throw uploadError

            // Get Public URL
            setProcessingStatus('Saving player data...')
            const { data: { publicUrl } } = supabase.storage
                .from('player-photos')
                .getPublicUrl(filePath)

            // Calculate Overall Rating for visual feedback or just verification
            // const overall = Math.round(Object.values(formData.stats).reduce((a, b) => a + b, 0) / 6)

            // CALL SECURE RPC FUNCTION
            const { data: rpcData, error: rpcError } = await supabase
                .rpc('register_player', {
                    p_name: formData.name,
                    p_roll_number: formData.roll_number,
                    p_year: formData.year,
                    p_branch: formData.branch,
                    p_position: formData.position,
                    p_stats: formData.stats,
                    p_photo_url: publicUrl
                })

            if (rpcError) throw rpcError

            const successMsg = rpcData.status === 'updated'
                ? 'Profile updated successfully! Pending admin re-approval.'
                : 'Registration successful! Waiting for approval.'

            navigate('/')
            alert(successMsg)

        } catch (err) {
            console.error('Error submitting form:', err)
            const msg = err.message || "An error occurred during registration."
            setError(msg)
            alert(msg)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-white p-4 pb-20">
            <SEO
                title="Register"
                description="Join the NITRR FC league. Create your player card and submit your profile for the draft."
            />
            <div className="max-w-2xl mx-auto">
                <Link to="/" className="inline-flex items-center text-white/50 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="mr-2" /> Back to Home
                </Link>

                <h1 className="text-3xl md:text-5xl font-oswald text-white mb-2 flex items-center gap-4">
                    <div className="w-12 h-12 relative rounded-full border border-white/20 bg-black/40 overflow-hidden flex-shrink-0">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
                    </div>
                    Player Registration
                </h1>
                <p className="text-white/60 mb-8 font-light">Join the draft. Prove your worth.</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-center gap-2">
                        <Info size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Details */}
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h2 className="text-2xl font-oswald text-neon mb-6">Details</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-oswald uppercase text-white/70 mb-1">Full Name</label>
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
                                <div>
                                    <label className="block text-sm font-oswald uppercase text-white/70 mb-1">Roll Number (8 Digits)</label>
                                    <input
                                        type="text"
                                        name="roll_number"
                                        required
                                        maxLength="8"
                                        pattern="\d{8}"
                                        value={formData.roll_number}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-neon focus:outline-none transition-colors tracking-widest font-mono"
                                        placeholder="e.g. 22115045"
                                        title="Please enter exactly 8 digits"
                                    />
                                </div>
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
                                <div className="col-span-2">
                                    <label className="block text-sm font-oswald uppercase text-white/70 mb-1">Branch</label>
                                    <select
                                        name="branch"
                                        required
                                        value={formData.branch}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-neon focus:outline-none transition-colors appearance-none"
                                    >
                                        <option value="" disabled>Select Branch</option>
                                        {['CSE', 'IT', 'ECE', 'EE', 'MECH', 'CIVIL', 'META', 'MINING', 'BIOTECH', 'ARCH', 'MCA', 'BIOMED', 'MSC'].map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h2 className="text-2xl font-oswald text-neon mb-6">Player Card Photo</h2>
                        <div className="bg-laser-blue/10 border border-laser-blue/20 p-4 rounded-lg mb-6">
                            <h3 className="text-laser-blue font-oswald uppercase mb-2 flex items-center gap-2">
                                <Info size={16} /> Strict Upload Guidelines
                            </h3>
                            <ul className="text-sm text-white/80 space-y-1 list-disc list-inside font-rajdhani">
                                <li><strong>Format:</strong> PNG Only (Transparent Background)</li>
                                <li><strong>Max Size:</strong> 2MB</li>
                                <li>Use <a href="https://www.remove.bg" target="_blank" rel="noreferrer" className="text-laser-blue hover:underline">remove.bg</a> or similar tools before uploading.</li>
                            </ul>
                        </div>
                        <ImageUpload onImageSelected={setImageFile} onCropPending={setIsCropping} />
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
                </form >
            </div >
        </div >
    )
}

export default Register
