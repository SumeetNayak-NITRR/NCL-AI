import React, { useRef } from 'react'
import { X, Download } from 'lucide-react'
import html2canvas from 'html2canvas'
import PlayerCard from '../common/PlayerCard'

const PlayerCardPreview = ({ player, onClose }) => {
    const cardRef = useRef(null)

    const handleDownload = async () => {
        if (!cardRef.current) return

        try {
            // Capture the card element as a canvas
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#000000',
                scale: 2, // Higher resolution
                logging: false,
                useCORS: true // Enable CORS for images
            })

            // Convert canvas to blob and download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `${player.name.replace(/\s+/g, '_')}_card.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
            }, 'image/png')
        } catch (error) {
            console.error('Error downloading card:', error)
            alert('Failed to download card. Please try again.')
        }
    }

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
            <div className="relative">
                {/* Header Controls */}
                <div className="absolute -top-16 left-0 right-0 flex justify-between items-center px-4">
                    <h2 className="text-2xl font-oswald text-white">Card Preview</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-oswald uppercase rounded hover:bg-gold/80 transition-colors"
                        >
                            <Download size={18} />
                            Download Card
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/10 rounded hover:bg-white/20 text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Card Container - Matches PlayerCard aspect ratio (3:4.2) */}
                <div ref={cardRef} className="bg-black rounded-xl overflow-hidden w-[450px] h-[630px] flex">
                    <PlayerCard player={player} size="large" showSoldBadge={player.status === 'Sold'} />
                </div>

                {/* Footer Info */}
                <div className="absolute -bottom-12 left-0 right-0 text-center">
                    <p className="text-white/50 text-sm">
                        Right-click the card to copy • Use Download button to save as PNG
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PlayerCardPreview
