import Hero from '../components/landing/Hero'
import Moments from '../components/landing/Moments'
import Overview from '../components/landing/Overview'
import AuctionPreview from '../components/landing/AuctionPreview'
import Navigation from '../components/landing/Navigation'

const Landing = () => {
    return (
        <div className="bg-background overflow-x-hidden">
            <Hero />
            <Moments />
            <Overview />
            <AuctionPreview />
            <Navigation />
        </div>
    )
}

export default Landing
