import React, { useState, useEffect } from 'react'
import TeamSidebar from '../components/auction/TeamSidebar'
import PlayerStage from '../components/auction/PlayerStage'
import BiddingPanel from '../components/auction/BiddingPanel'
import { supabase } from '../lib/supabase'

const Auction = () => {
    const [teams, setTeams] = useState([])
    const [currentPlayer, setCurrentPlayer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isSold, setIsSold] = useState(false)

    // Fetch initial data
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const { data: teamsData } = await supabase.from('teams').select('*').order('name')
            setTeams(teamsData || [])

            // Get next ready player
            fetchNextPlayer()
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const fetchNextPlayer = async () => {
        const { data } = await supabase
            .from('players')
            .select('*')
            .eq('status', 'Ready')
            .order('created_at', { ascending: true }) // Oldest first
            .limit(1)

        if (data && data.length > 0) {
            setCurrentPlayer(data[0])
            setIsSold(false)
        } else {
            setCurrentPlayer(null)
        }
    }

    const handleSold = async (teamId, amount) => {
        if (!currentPlayer) return

        // 1. Optimistic UI update
        setIsSold(true)

        // 2. Perform updates in Supabase
        try {
            // Update Player
            const { error: playerError } = await supabase
                .from('players')
                .update({
                    status: 'Sold',
                    assigned_team_id: teamId
                })
                .eq('id', currentPlayer.id)

            if (playerError) throw playerError

            // Update Team (Fetch current team data first to ensure atomic-like correctness if possible, but simple update is fine for MVP)
            // Better: supabase rpc function, but simple update:
            const team = teams.find(t => t.id === teamId)
            const { error: teamError } = await supabase
                .from('teams')
                .update({
                    budget: team.budget - amount,
                    player_count: team.player_count + 1
                })
                .eq('id', teamId)

            if (teamError) throw teamError

            // 3. Wait for animation then load next
            setTimeout(() => {
                fetchData() // Refresh teams and get next player
            }, 3000)

        } catch (e) {
            console.error("Auction Error:", e)
            alert("Transaction failed!")
            setIsSold(false)
        }
    }

    return (
        <div className="h-screen bg-background flex overflow-hidden">
            {/* Left: Teams */}
            <TeamSidebar teams={teams} />

            {/* Center: Stage */}
            <div className="flex-1 bg-black/80 flex flex-col border-r border-white/10 relative">
                <h1 className="absolute top-8 left-0 right-0 text-center font-oswald text-4xl text-gold/50 tracking-[1em] opacity-30 select-none pointer-events-none">
                    LIVE AUCTION
                </h1>
                <PlayerStage player={currentPlayer} isSold={isSold} />
            </div>

            {/* Right: Controls */}
            <BiddingPanel
                teams={teams}
                onSold={handleSold}
                disabled={!currentPlayer || isSold || loading}
            />
        </div>
    )
}

export default Auction
