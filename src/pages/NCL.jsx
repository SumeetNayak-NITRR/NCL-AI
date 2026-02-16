import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import CaptainsShowcase from '../components/ncl/CaptainsShowcase'
import Features from '../components/landing/Features'
import Highlights from '../components/landing/Highlights'
import ParticleBackground from '../components/landing/ParticleBackground'
import TournamentLeaderboard from '../components/ncl/TournamentLeaderboard'
import SEO from '../components/common/SEO'

const NCL = () => {
    return (
        <div className="min-h-screen">
            <SEO
                title="The League"
                description="NCL Season 2k26 - Explore teams, match highlights, and the official tournament leaderboard."
            />
            <Navigation />

            {/* Minimal Hero for NCL Page */}
            <section className="relative h-[60vh] flex flex-col justify-center items-center overflow-hidden px-6 pt-20">
                <ParticleBackground />
                <div className="relative z-10 text-center">
                    <h2 className="text-sm md:text-base font-rajdhani tracking-[0.5em] text-laser-blue uppercase mb-4">
                        The League
                    </h2>
                    <h1 className="text-6xl md:text-9xl font-bebas text-white leading-[0.85] tracking-tighter mb-8">
                        NCL <span className="text-outline-active">SEASON 2K26</span>
                    </h1>
                </div>
            </section>

            <CaptainsShowcase />
            <Features />
            <Highlights />
            <TournamentLeaderboard />

            <Footer />
        </div>
    )
}

export default NCL
