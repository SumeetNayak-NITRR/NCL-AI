import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Navigation = () => {
    return (
        <section className="min-h-[50vh] bg-background flex flex-col items-center justify-center pb-20">
            <h2 className="text-4xl font-oswald text-white mb-10">Choose Your Path</h2>
            <div className="flex flex-col md:flex-row gap-6">
                <LinkButton to="/register" color="bg-neon text-black">
                    Enter the Draft
                </LinkButton>
                <LinkButton to="/admin" color="bg-white/10 text-white hover:bg-white/20">
                    Admin Access
                </LinkButton>
                <LinkButton to="/auction" color="bg-gold text-black">
                    Live Auction
                </LinkButton>
            </div>
        </section>
    )
}

const LinkButton = ({ to, children, color }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <Link
            to={to}
            className={`px-8 py-4 rounded-full font-oswald text-xl uppercase tracking-wider ${color} transition-all shadow-lg hover:shadow-neon/20 block text-center min-w-[200px]`}
        >
            {children}
        </Link>
    </motion.div>
)

export default Navigation
