import React from 'react'
import PlayerCardBase from './PlayerCardBase'
import { motion } from 'framer-motion'

/**
 * PlayerCard - Wrapper for PlayerCardBase
 * Handles scaling and hover effects.
 * 
 * @param {Object} player - Player data object
 * @param {boolean} showSoldBadge - Optional sold badge
 * @param {string} size - Card size: 'small', 'medium', 'large', 'modal'
 * @param {boolean} animated - Whether to animate elements on load
 */
const PlayerCard = ({ player, showSoldBadge = false, size = 'medium', animated = true }) => {
    if (!player) {
        return (
            <div className="flex items-center justify-center text-white/20 font-oswald text-2xl p-8">
                No player data
            </div>
        )
    }

    // Fixed Base Dimensions
    const BASE_WIDTH = 400
    const BASE_HEIGHT = 600

    // Size Configurations (Scale factors)
    const sizeConfig = {
        small: {
            scale: 0.6, // 240x360
            width: 240,
            height: 360
        },
        medium: {
            scale: 0.9, // 360x540
            width: 360,
            height: 540
        },
        large: {
            scale: 1.1, // 440x660
            width: 440,
            height: 660
        },
        modal: {
            scale: 0.7,
            width: 280,
            height: 420
        }
    }

    const config = sizeConfig[size] || sizeConfig.medium

    return (
        <div
            className="relative flex justify-center items-center"
            style={{
                width: `${config.width}px`,
                height: `${config.height}px`
            }}
        >
            <motion.div
                style={{
                    width: `${BASE_WIDTH}px`,
                    height: `${BASE_HEIGHT}px`,
                    transformOrigin: 'center center',
                    // Apply scale to the wrapper
                    transform: `scale(${config.scale})`
                }}
                whileHover={animated ? { scale: config.scale * 1.02 } : {}}
                transition={{ duration: 0.3 }}
            >
                <div className="w-full h-full">
                    <PlayerCardBase
                        player={player}
                        showSoldBadge={showSoldBadge}
                        animated={animated}
                    />
                </div>
            </motion.div>
        </div>
    )
}

export default PlayerCard

