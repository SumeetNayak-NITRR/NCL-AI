import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const Navigation = () => {
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const links = [
        { path: '/', label: 'Home' },
        { path: '/ncl', label: 'NCL' },
        { path: '/team', label: 'Teams' },
        { path: '/achievements', label: 'History' },
        { path: '/events', label: 'Events' },
        { path: '/about', label: 'About' },
        { path: '/register', label: 'Register' },
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 mix-blend-difference' : 'py-8'}`}>
            <div className="max-w-[95vw] mx-auto flex justify-between items-center px-4">

                {/* Logo - Top Left Corner */}
                <Link to="/" className="group relative z-50 flex items-center gap-3">
                    {/* Placeholder for actual logo - User to replace with <img src="/logo.webp" /> */}
                    {/* Circular Logo Frame */}
                    <div className="w-14 h-14 relative flex items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm overflow-hidden shadow-[0_0_15px_rgba(0,34,255,0.3)] group-hover:border-laser-blue/50 transition-all duration-300">
                        <div className="absolute inset-0 bg-laser-blue opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <img
                            src="/logo.webp"
                            alt="NITRR FC"
                            className="w-full h-full object-contain p-1 transform group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="hidden absolute inset-0 bg-white/5 items-center justify-center">
                            <span className="font-bebas text-xs text-white">LOGO</span>
                        </div>
                    </div>

                    <div className="flex flex-col leading-none">
                        <span className="font-bebas text-2xl md:text-4xl text-white tracking-tighter group-hover:text-transparent group-hover:text-outline-active transition-all duration-300">
                            NITRR FC
                        </span>
                        <span className="hidden md:block font-rajdhani text-[0.6rem] tracking-[0.4em] text-white/60 uppercase group-hover:text-laser-blue transition-colors">
                            NIT Raipur Football Club
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu - Spread Out */}
                <div className="hidden md:flex items-center gap-12">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="relative group overflow-hidden"
                        >
                            <span className={`font-rajdhani uppercase text-sm tracking-widest transition-all duration-300 ${location.pathname === link.path ? 'text-white' : 'text-white/50 hover:text-white'
                                }`}>
                                {link.label}
                            </span>
                            <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-laser-blue transform transition-transform duration-300 origin-left ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                }`} />
                        </Link>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden z-50 text-white mix-blend-difference p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed inset-0 bg-background z-40 md:hidden flex flex-col justify-center items-center"
                        >
                            <div className="bg-noise absolute inset-0 opacity-[0.05]"></div>
                            <div className="flex flex-col gap-8 text-center relative z-10">
                                {links.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className="text-4xl font-bebas text-white hover:text-outline-active transition-all"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    )
}

export default Navigation
