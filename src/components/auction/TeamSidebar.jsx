import React from 'react'

const TeamSidebar = ({ teams }) => {
    return (
        <div className="w-1/4 h-full bg-black/50 border-r border-white/10 p-6 flex flex-col gap-4 overflow-y-auto">
            <h2 className="text-2xl font-oswald text-gold mb-4 uppercase">Teams</h2>
            {teams.map(team => (
                <div key={team.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h3 className="text-xl font-oswald text-white mb-1">{team.name}</h3>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white/50">Budget</span>
                        <span className="text-neon font-mono font-bold">₹{team.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-white/50">Players</span>
                        <span className="text-white font-mono">{team.player_count}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TeamSidebar
