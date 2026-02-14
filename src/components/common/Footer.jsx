import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gradient-to-b from-background to-dark-navy border-t border-electric-blue/10 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-12 h-12 bg-black border border-white/20 rounded-full flex items-center justify-center p-1 shadow-[0_0_15px_rgba(0,34,255,0.3)]">
                                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-white font-bebas text-xl uppercase tracking-wider">
                                NITRR FC
                            </span>
                        </div>
                        <p className="text-white/60 text-sm font-rajdhani">
                            Official Football Club of NIT Raipur. Building champions on and off the field.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bebas uppercase text-lg mb-4">Quick Links</h3>
                        <div className="space-y-2">
                            <Link to="/about" className="block text-white/60 hover:text-electric-blue transition-colors text-sm font-rajdhani">
                                About Us
                            </Link>
                            <Link to="/team" className="block text-white/60 hover:text-electric-blue transition-colors text-sm font-rajdhani">
                                Our Team
                            </Link>
                            <Link to="/achievements" className="block text-white/60 hover:text-electric-blue transition-colors text-sm font-rajdhani">
                                Achievements
                            </Link>
                            <Link to="/register" className="block text-white/60 hover:text-electric-blue transition-colors text-sm font-rajdhani">
                                Join NCL
                            </Link>
                        </div>
                    </div>

                    {/* Social & Contact */}
                    <div>
                        <h3 className="text-white font-bebas uppercase text-lg mb-4">Connect</h3>
                        <div className="flex gap-4 mb-4">
                            <a href="javascript:void(0)" className="text-white/60 hover:text-electric-blue transition-colors" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="javascript:void(0)" className="text-white/60 hover:text-electric-blue transition-colors" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="javascript:void(0)" className="text-white/60 hover:text-electric-blue transition-colors" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="mailto:contact@nitrrfc.com" className="text-white/60 hover:text-electric-blue transition-colors" aria-label="Email">
                                <Mail size={20} />
                            </a>
                        </div>
                        <p className="text-white/60 text-sm font-rajdhani">
                            NIT Raipur, G.E. Road<br />
                            Raipur, Chhattisgarh 492010
                        </p>
                    </div>
                </div>

                <div className="border-t border-electric-blue/10 mt-12 pt-8 relative overflow-hidden">
                    {/* Alive Background Effect */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent shadow-[0_0_10px_#00d4ff]"></div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left relative z-10">
                        <p className="text-white/40 text-xs font-rajdhani">
                            © {currentYear} . All rights reserved.
                        </p>

                        <div className="flex items-center gap-2 text-white/80 text-xs font-rajdhani bg-black/30 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm hover:border-white/20 transition-all hover:bg-black/50 hover:shadow-[0_0_15px_rgba(0,212,255,0.1)] group cursor-default">
                            <span>Made with</span>
                            <span className="text-red-500 animate-pulse text-sm">❤️</span>
                            {/* <span>&</span>
                            <span className="text-gold animate-bounce text-sm">⚡</span> */}
                            <span>by</span>
                            <span className="text-white font-bold tracking-wider group-hover:text-neon transition-colors">SUMEET</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                to="/admin"
                                className="text-white/20 hover:text-white/60 text-[10px] font-oswald uppercase tracking-widest transition-colors flex items-center gap-1"
                            >
                                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                                System Status: Online
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
