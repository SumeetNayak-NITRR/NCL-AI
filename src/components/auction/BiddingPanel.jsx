import React, { useState } from 'react'

const BiddingPanel = ({ teams, onSold, disabled }) => {
    const [selectedTeamId, setSelectedTeamId] = useState('')
    const [bidAmount, setBidAmount] = useState('')

    const handleSold = () => {
        if (!selectedTeamId || !bidAmount) return alert("Select team and enter bid amount")

        // Validation
        const team = teams.find(t => t.id === selectedTeamId)
        if (parseInt(bidAmount) > team.budget) return alert("Insufficient budget!")

        onSold(selectedTeamId, parseInt(bidAmount))
        setBidAmount('')
        setSelectedTeamId('')
    }

    return (
        <div className="w-1/4 h-full bg-black/50 border-l border-white/10 p-6 flex flex-col">
            <h2 className="text-2xl font-oswald text-gold mb-8 uppercase text-right">Control Panel</h2>

            <div className="space-y-6 flex-1">
                <div>
                    <label className="block text-sm font-oswald uppercase text-white/50 mb-2">Winning Team</label>
                    <select
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                        disabled={disabled}
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-neon outline-none"
                    >
                        <option value="">Select Team</option>
                        {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name} (₹{t.budget})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-oswald uppercase text-white/50 mb-2">Bid Amount</label>
                    <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        disabled={disabled}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-neon outline-none text-right font-mono text-xl"
                    />
                </div>
            </div>

            <button
                onClick={handleSold}
                disabled={disabled || !selectedTeamId || !bidAmount}
                className="w-full py-6 bg-neon text-black font-oswald text-3xl uppercase tracking-widest rounded shadow-lg hover:shadow-neon/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
            >
                SOLD
            </button>
        </div>
    )
}

export default BiddingPanel
