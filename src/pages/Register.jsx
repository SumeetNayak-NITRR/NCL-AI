import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ImageUpload from '../components/register/ImageUpload'
import { Info, ArrowLeft, Calendar } from 'lucide-react'
import SEO from '../components/common/SEO'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import { toast } from 'sonner'
import imageCompression from 'browser-image-compression'
import { REGISTRATION_CONFIG } from '../config/registration'

const positions = ['ST', 'CF', 'LW', 'RW', 'LM', 'RM', 'CAM', 'CM', 'CDM', 'LB', 'RB', 'CB', 'GK']
const years = ['1st', '2nd', '3rd', '4th', '5th']
const statsLabels = ['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defending', 'Physical']

// SVG Pitch lines pattern for the hero
const PitchPattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {/* Centre circle */}
        <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="0.5" fill="white" />
        {/* Centre line */}
        <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.5" />
        {/* Outer boundary */}
        <rect x="5" y="5" width="90" height="90" fill="none" stroke="white" strokeWidth="0.5" />
        {/* Left penalty box */}
        <rect x="5" y="30" width="12" height="40" fill="none" stroke="white" strokeWidth="0.4" />
        {/* Right penalty box */}
        <rect x="83" y="30" width="12" height="40" fill="none" stroke="white" strokeWidth="0.4" />
        {/* Left goal box */}
        <rect x="5" y="42" width="4" height="16" fill="none" stroke="white" strokeWidth="0.4" />
        {/* Right goal box */}
        <rect x="91" y="42" width="4" height="16" fill="none" stroke="white" strokeWidth="0.4" />
        {/* Corner arcs */}
        <path d="M 5 10 A 5 5 0 0 1 10 5" fill="none" stroke="white" strokeWidth="0.4" />
        <path d="M 90 5 A 5 5 0 0 1 95 10" fill="none" stroke="white" strokeWidth="0.4" />
        <path d="M 5 90 A 5 5 0 0 0 10 95" fill="none" stroke="white" strokeWidth="0.4" />
        <path d="M 95 90 A 5 5 0 0 0 90 95" fill="none" stroke="white" strokeWidth="0.4" />
    </svg>
)

const Register = () => {
    const navigate = useNavigate()
    const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

    const scrollToSection = (i) => {
        sectionRefs[i].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    const [formData, setFormData] = useState({
        name: '',
        roll_number: '',
        year: '',
        branch: '',
        position: '',
        key_achievements: '',
        preferred_foot: '',
        notable_stats: '',
        player_traits: '',
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
    const [processingStatus, setProcessingStatus] = useState('')
    const [error, setError] = useState(null)

    const overallRating = Math.round(
        Object.values(formData.stats).reduce((a, b) => a + b, 0) / 6
    )

    // Section completion tracking
    const sectionDone = [
        // 01 Personal: name, roll_number, year, branch, position
        !!(formData.name && formData.roll_number.length === 8 && formData.year && formData.branch && formData.position),
        // 02 Photo
        !!imageFile,
        // 03 Stats: all non-default (any stat adjusted away from 50)
        Object.values(formData.stats).some(v => v !== 50),
        // 04 Auction: achievements, traits, and preferred foot all filled
        !!(formData.key_achievements && formData.player_traits && formData.preferred_foot),
    ]
    const totalDone = sectionDone.filter(Boolean).length

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleStatChange = (stat, value) => {
        setFormData({
            ...formData,
            stats: { ...formData.stats, [stat.toLowerCase()]: parseInt(value) }
        })
    }

    // Helper to check if an image has transparency
    const checkImageTransparency = (file) => {
        return new Promise((resolve) => {
            const url = URL.createObjectURL(file)
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0)
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data

                let hasTransparentPixels = false
                // Check every 4th byte (Alpha channel)
                for (let i = 3; i < imageData.length; i += 4) {
                    if (imageData[i] < 255) { // If alpha is less than fully opaque
                        hasTransparentPixels = true
                        break
                    }
                }
                URL.revokeObjectURL(url)
                resolve(hasTransparentPixels)
            }
            img.onerror = () => resolve(true) // If error reading, bypass check rather than block
            img.src = url
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (formData.roll_number.length !== 8 || isNaN(formData.roll_number)) {
            const msg = "Roll Number must be exactly 8 digits."
            setError(msg); toast.error(msg); setLoading(false); return
        }
        if (isCropping) {
            const msg = "Please click 'Confirm Crop' on your photo before submitting."
            setError(msg); toast.warning(msg); setLoading(false); return
        }
        if (!imageFile) {
            const msg = "Please upload a photo."
            setError(msg); toast.error(msg)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setLoading(false); return
        }
        if (!formData.key_achievements.trim()) {
            const msg = "Please fill in your Key Achievements."
            setError(msg); toast.error(msg)
            scrollToSection(3)
            setLoading(false); return
        }
        if (!formData.player_traits.trim()) {
            const msg = "Please fill in your Player Traits."
            setError(msg); toast.error(msg)
            scrollToSection(3)
            setLoading(false); return
        }
        if (imageFile.size > 10 * 1024 * 1024) {
            const msg = "File too large. Maximum raw size is 10MB."
            setError(msg); toast.error(msg)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setLoading(false); return
        }
        if (imageFile.type !== 'image/png') {
            const msg = "Invalid format. Please upload a PNG file."
            setError(msg); toast.error(msg)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setLoading(false); return
        }

        setProcessingStatus('Checking image background...')
        const isTransparent = await checkImageTransparency(imageFile)
        if (!isTransparent) {
            const msg = "BACKGROUND DETECTED! You MUST remove the background from your photo before uploading. Use remove.bg or Adobe Express."
            setError(msg); toast.error(msg)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setLoading(false); return
        }

        try {
            setProcessingStatus('Compressing image...')
            let compressedFile;
            try {
                // Disabled webworker as it may get killed by browser watchdogs or adblockers causing abort signals
                const options = { maxSizeMB: 2, maxWidthOrHeight: 1920, useWebWorker: false, fileType: 'image/png' }
                compressedFile = await imageCompression(imageFile, options)
            } catch (compressionErr) {
                console.error('Image compression failed:', compressionErr);
                throw new Error("Unable to compress image. Please try a different photo or lower resolution.");
            }

            setProcessingStatus('Uploading image...')
            const fileName = `${formData.roll_number}_${Date.now()}.png`

            let uploadError = null;
            try {
                const { error } = await supabase.storage.from('player-photos').upload(fileName, compressedFile)
                uploadError = error;
            } catch (fetchErr) {
                uploadError = fetchErr;
            }

            if (uploadError) {
                console.error("Upload error:", uploadError);
                let errMsg = uploadError.message || "Network error or timeout.";
                if (errMsg.includes('signal is aborted') || uploadError.name === 'AbortError') {
                    errMsg = "Network timeout while uploading. Your connection might be unstable or the file is too large.";
                }
                throw new Error(errMsg);
            }

            setProcessingStatus('Saving player data...')
            const { data: { publicUrl } } = supabase.storage.from('player-photos').getPublicUrl(fileName)

            const { data: rpcData, error: rpcError } = await supabase.rpc('register_player', {
                p_name: formData.name,
                p_roll_number: formData.roll_number,
                p_year: formData.year,
                p_branch: formData.branch,
                p_position: formData.position,
                p_stats: formData.stats,
                p_photo_url: publicUrl,
                p_key_achievements: formData.key_achievements,
                p_preferred_foot: formData.preferred_foot,
                p_notable_stats: formData.notable_stats,
                p_player_traits: formData.player_traits
            })
            if (rpcError) throw rpcError

            const successMsg = rpcData.status === 'updated'
                ? 'Profile updated! Pending admin re-approval.'
                : 'Registration successful! Pending admin approval.'
            navigate('/')
            toast.success(successMsg, { duration: 5000 })

        } catch (err) {
            console.error("Registration error:", err);
            const msg = err.message || "An error occurred during registration."
            setError(msg); toast.error(msg)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "w-full bg-transparent border-b border-white/30 focus:border-laser-blue outline-none py-3 text-white font-rajdhani text-lg tracking-wide transition-colors duration-300 placeholder:text-white/30"
    const selectClass = "w-full bg-transparent border-b border-white/30 focus:border-laser-blue outline-none py-3 text-white font-rajdhani text-lg tracking-wide transition-colors duration-300 appearance-none cursor-pointer"
    const labelClass = "block text-xs font-rajdhani tracking-[0.4em] text-white/70 uppercase mb-2"

    const sectionVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
    }

    return (
        <div className="min-h-screen bg-background text-white">
            <SEO
                title="Register"
                description="Join the NITRR FC squad. Submit your player profile for the NCL draft."
            />
            <Navigation />

            {/* ── HERO ── */}
            <section className="relative min-h-[60vh] flex flex-col justify-end overflow-hidden px-6 pb-16 pt-32">
                {/* Pitch pattern */}
                <PitchPattern />
                {/* Grass-green tint at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                {/* Left vertical text stripe — matches Landing */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4 border-l border-white/10 pl-4">
                    <span className="text-vertical text-xs font-rajdhani tracking-[0.3em] text-white/40 uppercase">NITRR FC • NCL 2025</span>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto w-full">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="text-sm font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-4"
                    >
                        Season Draft — Open Now
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-[10vw] font-bebas leading-[0.85] tracking-tighter text-white mb-6 mix-blend-difference"
                    >
                        JOIN NCL <span className="text-outline-active">2025</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-white/50 font-rajdhani tracking-widest uppercase text-sm max-w-md"
                    >
                        Fill out your player profile. Get verified. Compete in the auction.
                    </motion.p>
                </div>
            </section>

            {/* ── FLOATING SECTION NAVIGATOR (right side vertical) ── */}
            {REGISTRATION_CONFIG.isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}

                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1.5 bg-background/90 backdrop-blur-xl border border-white/10 px-2.5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
            >
                <span className="font-rajdhani text-[9px] tracking-[0.2em] text-white/30 uppercase mb-1">
                    {totalDone}/4
                </span>
                {[
                    { n: '01', label: 'Personal' },
                    { n: '02', label: 'Photo' },
                    { n: '03', label: 'Stats' },
                    { n: '04', label: 'Auction' },
                ].map(({ n, label }, i) => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => scrollToSection(i)}
                        title={`Go to ${label}`}
                        className={`flex flex-col items-center gap-0.5 px-2 py-2 border font-bebas text-sm tracking-wider transition-all duration-300 w-full ${sectionDone[i]
                            ? 'bg-laser-blue border-laser-blue text-white'
                            : 'border-white/15 text-white/30 hover:border-white/50 hover:text-white/70'
                            }`}
                    >
                        {n}
                        <span className={`font-rajdhani text-[8px] tracking-widest uppercase ${sectionDone[i] ? 'text-white/70' : 'text-white/20'}`}>
                            {label.slice(0, 4)}
                        </span>
                    </button>
                ))}
                </motion.div>
            )}

            {/* ── FORM ── */}
            <section className="max-w-5xl mx-auto px-6 md:px-8 pb-40">

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-signal-red/10 border border-signal-red/30 text-signal-red p-4 mb-10 flex items-start gap-3 font-rajdhani text-sm tracking-wide"
                    >
                        <Info size={18} className="flex-shrink-0 mt-0.5" />
                        {error}
                    </motion.div>
                )}

                {REGISTRATION_CONFIG.isOpen ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* ── Section 01: Personal ── */}
                    <motion.div ref={sectionRefs[0]} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="border border-white/10 bg-white/[0.02] p-8 md:p-10">
                        <div className="flex items-start gap-6 mb-10 pb-8 border-b border-white/10">
                            <span className="font-bebas text-5xl text-laser-blue/30 leading-none select-none">01</span>
                            <div>
                                <h2 className="font-bebas text-2xl tracking-wider text-white mb-1">PERSONAL DETAILS</h2>
                                <p className="text-white/40 font-rajdhani text-sm tracking-widest uppercase">Identity & Academic Info • 5 fields</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                            <div>
                                <label className={labelClass}>Full Name</label>
                                <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" />
                            </div>
                            <div>
                                <label className={labelClass}>Roll Number</label>
                                <input type="text" name="roll_number" required maxLength="8" pattern="\d{8}" value={formData.roll_number} onChange={handleChange} className={`${inputClass} tracking-[0.3em] font-mono`} placeholder="22115045" title="Exactly 8 digits" />
                            </div>
                            <div>
                                <label className={labelClass}>Academic Year</label>
                                <select name="year" required value={formData.year} onChange={handleChange} className={selectClass}>
                                    <option value="" disabled className="bg-background">Select Year</option>
                                    {years.map(y => <option key={y} value={y} className="bg-background">{y}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Branch</label>
                                <select name="branch" required value={formData.branch} onChange={handleChange} className={selectClass}>
                                    <option value="" disabled className="bg-background">Select Branch</option>
                                    {['CSE', 'IT', 'ECE', 'EE', 'MECH', 'CIVIL', 'META', 'CHEM', 'MINING', 'BIOTECH', 'ARCH', 'MCA', 'BIOMED', 'MSC'].map(b => <option key={b} value={b} className="bg-background">{b}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Playing Position</label>
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {positions.map(p => (
                                        <button
                                            key={p} type="button"
                                            onClick={() => setFormData({ ...formData, position: p })}
                                            className={`px-5 py-2 font-bebas text-lg tracking-wider border transition-all duration-200 ${formData.position === p
                                                ? 'bg-laser-blue border-laser-blue text-white'
                                                : 'border-white/20 text-white/60 hover:border-white/60 hover:text-white'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                {!formData.position && <input type="text" className="sr-only" required value={formData.position} readOnly tabIndex={-1} />}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Section 02: Photo Upload ── */}
                    <motion.div ref={sectionRefs[1]} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="border border-white/10 bg-white/[0.02] p-8 md:p-10">
                        <div className="flex items-start gap-6 mb-10 pb-8 border-b border-white/10">
                            <span className="font-bebas text-5xl text-laser-blue/30 leading-none select-none">02</span>
                            <div>
                                <h2 className="font-bebas text-2xl tracking-wider text-white mb-1">PLAYER CARD PHOTO</h2>
                                <p className="text-white/40 font-rajdhani text-sm tracking-widest uppercase">Your card image • 1 upload</p>
                            </div>
                        </div>

                        {/* Refined Guidelines */}
                        <div className="flex items-start gap-4 mb-10 border-l-2 border-laser-blue pl-5 bg-gradient-to-r from-laser-blue/5 to-transparent p-4 rounded-r-lg">
                            <div className="font-rajdhani text-sm text-white/80 tracking-wide leading-relaxed space-y-2">
                                <div className="flex items-center gap-2 text-laser-blue mb-1">
                                    <Info size={16} />
                                    <p className="font-bebas tracking-widest text-lg leading-none mt-1">BACKGROUND REMOVAL REQUIRED</p>
                                </div>
                                <p>Our automated system requires a clean, transparent PNG to generate your player card. Photos with backgrounds will be blocked.</p>
                                <p className="pt-2 text-white/50 text-xs uppercase tracking-widest">• Max Size: 2MB • Format: PNG</p>
                                <p className="pt-1 text-xs text-white/70 animate-pulse font-bold tracking-wide">
                                    Pro Tip: Use <a href="https://www.remove.bg" target="_blank" rel="noopener noreferrer" className="text-[#ff2200] hover:text-white underline decoration-[#ff2200]/50 underline-offset-4 transition-colors">remove.bg</a> or <a href="https://www.adobe.com/express/feature/image/remove-background" target="_blank" rel="noopener noreferrer" className="text-[#ff2200] hover:text-white underline decoration-[#ff2200]/50 underline-offset-4 transition-colors">Adobe Express</a> to clear your background instantly before uploading.
                                </p>
                            </div>
                        </div>

                        <ImageUpload onImageSelected={setImageFile} onCropPending={setIsCropping} />
                    </motion.div>

                    {/* ── Section 03: Self-Rated Stats ── */}
                    <motion.div ref={sectionRefs[2]} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="border border-white/10 bg-white/[0.02] p-8 md:p-10">
                        <div className="flex items-start gap-6 mb-10 pb-8 border-b border-white/10">
                            <span className="font-bebas text-5xl text-laser-blue/30 leading-none select-none">03</span>
                            <div className="flex-1 flex items-start justify-between">
                                <div>
                                    <h2 className="font-bebas text-2xl tracking-wider text-white mb-1">SELF-RATED STATS</h2>
                                    <p className="text-white/40 font-rajdhani text-sm tracking-widest uppercase flex items-center gap-2">
                                        <Info size={13} className="text-neon" /> 6 attributes — be honest, admin verifies
                                    </p>
                                </div>
                                {/* Live OVR */}
                                <div className="text-right">
                                    <div className="font-bebas text-6xl leading-none text-white">{overallRating}</div>
                                    <div className="font-rajdhani text-xs tracking-[0.4em] text-white/40 uppercase">OVR</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                            {statsLabels.map(stat => (
                                <div key={stat}>
                                    <div className="flex justify-between items-baseline mb-3">
                                        <label className="font-bebas text-xl tracking-wider text-white/80">{stat}</label>
                                        <span className="font-bebas text-3xl text-laser-blue leading-none">{formData.stats[stat.toLowerCase()]}</span>
                                    </div>
                                    <div className="relative">
                                        <div className="h-px w-full bg-white/10 absolute top-1/2 -translate-y-1/2" />
                                        <input
                                            type="range" min="1" max="99"
                                            value={formData.stats[stat.toLowerCase()]}
                                            onChange={(e) => handleStatChange(stat, e.target.value)}
                                            className="relative w-full h-1 bg-transparent appearance-none cursor-pointer accent-laser-blue focus:outline-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── Section 04: Auction Profile ── */}
                    <motion.div ref={sectionRefs[3]} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="border border-white/10 bg-white/[0.02] p-8 md:p-10">
                        <div className="flex items-start gap-6 mb-10 pb-8 border-b border-white/10">
                            <span className="font-bebas text-5xl text-laser-blue/30 leading-none select-none">04</span>
                            <div>
                                <h2 className="font-bebas text-2xl tracking-wider text-white mb-1">AUCTION PROFILE</h2>
                                <p className="text-white/40 font-rajdhani text-sm tracking-widest uppercase">What you bring to the pitch • 4 fields</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                            <div>
                                <label className={labelClass}>Key Achievements</label>
                                <textarea name="key_achievements" required value={formData.key_achievements} onChange={handleChange}
                                    className={`${inputClass} resize-none border-b min-h-[90px]`}
                                    placeholder="e.g. Golden Boot 2023, Captained CSE" />
                            </div>
                            <div>
                                <label className={labelClass}>Player Traits</label>
                                <textarea name="player_traits" required value={formData.player_traits} onChange={handleChange}
                                    className={`${inputClass} resize-none border-b min-h-[90px]`}
                                    placeholder="e.g. Clinical Finisher, Set-Piece Specialist" />
                            </div>
                            <div>
                                <label className={labelClass}>Notable Stats</label>
                                <input type="text" name="notable_stats" value={formData.notable_stats} onChange={handleChange}
                                    className={inputClass} placeholder="e.g. 5 Goals in last 3 matches" />
                            </div>
                            <div>
                                <label className={labelClass}>Preferred Foot</label>
                                <div className="flex gap-4 pt-2">
                                    {['Right', 'Left', 'Both'].map(foot => (
                                        <button key={foot} type="button"
                                            onClick={() => setFormData({ ...formData, preferred_foot: foot })}
                                            className={`px-5 py-2 font-bebas text-lg tracking-wider border transition-all duration-200 ${formData.preferred_foot === foot ? 'bg-gold border-gold text-black' : 'border-white/20 text-white/60 hover:border-white/60 hover:text-white'}`}
                                        >
                                            {foot}
                                        </button>
                                    ))}
                                </div>
                                {!formData.preferred_foot && <input type="text" className="sr-only" required value={formData.preferred_foot} readOnly tabIndex={-1} />}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Submit ── */}
                    <motion.div
                        variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        className="border-t border-white/10 pt-12 pb-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                            type="submit" disabled={loading}
                            className="group relative w-full px-8 py-6 bg-off-white text-black font-bebas text-2xl tracking-[0.2em] uppercase overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <span className="relative z-10 group-hover:text-off-white transition-colors duration-300">
                                {loading ? (processingStatus || 'Submitting...') : 'Sign the Contract — Submit'}
                            </span>
                            <div className="absolute inset-0 bg-laser-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </motion.button>
                        <p className="text-center text-white/30 font-rajdhani text-xs tracking-widest uppercase mt-6">
                            Your profile will be reviewed before appearing in the squad list.
                        </p>
                    </motion.div>

                </form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center justify-center py-20 text-center border border-white/10 bg-white/[0.02] p-8 md:p-16 rounded-2xl relative overflow-hidden"
                    >
                        {/* Background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-lg bg-laser-blue/5 rounded-full blur-[100px] pointer-events-none" />
                        
                        <div className="w-20 h-20 bg-laser-blue/10 rounded-full flex items-center justify-center mb-10 border border-laser-blue/30 shadow-[0_0_30px_rgba(0,255,255,0.2)] relative z-10">
                            <Info className="w-10 h-10 text-laser-blue" />
                        </div>
                        
                        <h2 className="font-bebas text-5xl md:text-6xl tracking-wider text-white mb-6 relative z-10 drop-shadow-lg">
                            REGISTRATION <span className="text-signal-red">CLOSED</span>
                        </h2>
                        
                        <p className="text-white/70 font-rajdhani text-lg md:text-xl tracking-wide max-w-2xl mx-auto mb-14 leading-relaxed relative z-10">
                            {REGISTRATION_CONFIG.message}
                        </p>
                        
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl max-w-md w-full relative overflow-hidden group shadow-2xl z-10">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-laser-blue/50 to-transparent opacity-50 transition-opacity duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-r from-laser-blue/0 via-laser-blue/5 to-laser-blue/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            
                            <div className="flex items-center justify-center gap-3 mb-4 text-laser-blue">
                                <Calendar size={20} />
                                <h3 className="font-rajdhani text-sm tracking-[0.3em] uppercase font-bold text-white/90">Upcoming Auction</h3>
                            </div>
                            
                            <p className="font-bebas text-4xl text-white drop-shadow-md">{REGISTRATION_CONFIG.auctionDate}</p>
                        </div>
                        
                        <Link to="/" className="mt-16 group relative px-8 py-4 bg-white/5 border border-white/20 hover:border-laser-blue/50 rounded-xl text-white font-rajdhani font-bold text-sm tracking-[0.2em] uppercase transition-all overflow-hidden flex items-center gap-3 z-10 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="relative z-10 transition-colors duration-300">Return to Field</span>
                            <div className="absolute inset-0 bg-laser-blue/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                    </motion.div>
                )}
            </section>

            <Footer />
        </div>
    )
}

export default Register
