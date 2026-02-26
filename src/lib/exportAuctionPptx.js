import PptxGenJS from 'pptxgenjs'
import { renderPlayerCardToCanvas } from '../utils/playerCardRenderer'

/** Upscale card to 2× for quality/size balance */
const renderFullCardHighRes = (player) =>
    new Promise(async (resolve, reject) => {
        try {
            const SCALE = 2
            const base64_1x = await renderPlayerCardToCanvas(player)
            const img = new Image()
            img.onload = () => {
                const hiRes = document.createElement('canvas')
                hiRes.width = 400 * SCALE
                hiRes.height = 600 * SCALE
                const ctx = hiRes.getContext('2d')
                ctx.imageSmoothingEnabled = true
                ctx.imageSmoothingQuality = 'high'
                ctx.drawImage(img, 0, 0, hiRes.width, hiRes.height)
                resolve(hiRes.toDataURL('image/png'))
            }
            img.onerror = reject
            img.src = base64_1x
        } catch (err) { reject(err) }
    })

const getOverall = (player) => {
    if (player.stats && typeof player.stats === 'object') {
        const vals = Object.values(player.stats).map(Number).filter(v => !isNaN(v))
        if (vals.length) return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
    }
    const flat = [player.pace, player.shooting, player.passing, player.dribbling, player.defending, player.physical]
        .map(Number).filter(v => !isNaN(v))
    return flat.length ? Math.round(flat.reduce((a, b) => a + b, 0) / flat.length) : 0
}

export const exportAuctionPptx = async (players) => {
    const pptx = new PptxGenJS()
    pptx.layout = 'LAYOUT_WIDE' // 13.33 × 7.5 in

    const BLUE = '0022FF'
    const WHITE = 'FFFFFF'
    const OFF_W = 'CDD0E8'
    const MUTED = '6670AA'
    const BORDER = '1A1D35'

    let approved = players.filter(p =>
        p.status === 'Ready' || p.status === 'approved' || p.status === 'Approved'
    )

    // Sort by auction_order. Nulls/0s go to the end.
    approved.sort((a, b) => {
        const orderA = a.auction_order;
        const orderB = b.auction_order;
        if (!orderA) return 1;
        if (!orderB) return -1;
        return orderA - orderB;
    });

    if (!approved.length) { alert('No approved players found to export.'); return }

    // Helper to build a slide (either Real or Mystery Teaser)
    const buildSlide = async (player, isTeaser) => {
        const slide = pptx.addSlide()

        // ── Solid dark background ──
        slide.background = { color: '060810' }

        // Left panel — clean white
        slide.addShape(pptx.ShapeType.rect, {
            x: 0, y: 0, w: 5.85, h: '100%',
            fill: { color: 'FFFFFF' }, line: 'none'
        })

        // Top / bottom blue bars
        slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.05, fill: { color: BLUE }, line: 'none' })
        slide.addShape(pptx.ShapeType.rect, { x: 0, y: 7.45, w: '100%', h: 0.05, fill: { color: BLUE }, line: 'none' })
        // Left accent bar
        slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.05, h: '100%', fill: { color: BLUE }, line: 'none' })
        // Vertical divider
        slide.addShape(pptx.ShapeType.line, { x: 5.85, y: 0.08, w: 0, h: 7.34, line: { color: BORDER, width: 1.5 } })

        // ── LEFT: medium card ──
        const cardW = 3.5
        const cardH = 5.25
        const cardX = 0.1 + (5.65 - cardW) / 2
        const cardY = 0.3

        if (isTeaser) {
            // Mystery Silhouette Placeholder
            slide.addShape(pptx.ShapeType.rect, {
                x: cardX, y: cardY, w: cardW, h: cardH,
                fill: { color: '000000' }, line: { color: 'FF2200', width: 4 }
            })
            slide.addText('?', {
                x: cardX, y: cardY, w: cardW, h: cardH,
                fontSize: 150, color: 'FF2200', bold: true, align: 'center', valign: 'middle', fontFace: 'Arial Black'
            })
        } else {
            // Real Card
            try {
                const cardData = await renderFullCardHighRes(player)
                slide.addImage({
                    data: cardData,
                    x: cardX, y: cardY, w: cardW, h: cardH,
                    sizing: { type: 'contain', w: cardW, h: cardH }
                })
            } catch (e) { console.error('Card render failed:', player.name, e) }
        }

        // ── BASE PRICE BOX ──
        const bpY = cardY + cardH + 0.2
        const bpW = cardW + 0.2
        const bpX = cardX - 0.1
        const bpH = 1.0

        slide.addShape(pptx.ShapeType.rect, {
            x: bpX, y: bpY, w: bpW, h: bpH,
            fill: { color: '0B0E20' }, line: { color: BLUE, width: 2 }
        })
        slide.addShape(pptx.ShapeType.rect, {
            x: bpX, y: bpY, w: bpW, h: 0.28,
            fill: { color: BLUE }, line: 'none'
        })
        slide.addText('BASE PRICE', {
            x: bpX, y: bpY, w: bpW, h: 0.28,
            fontSize: 10, color: WHITE, bold: true,
            align: 'center', valign: 'middle', fontFace: 'Arial', charSpacing: 5
        })
        slide.addText(`₹  ${player.base_price?.toLocaleString() || '2000'}`, {
            x: bpX + 0.1, y: bpY + 0.3, w: bpW - 0.2, h: 0.65,
            fontSize: 28, color: WHITE, bold: true,
            align: 'center', valign: 'middle', fontFace: 'Arial Black'
        })

        // ── RIGHT: player details ──
        const rx = 6.05
        const rw = 6.95
        let ry = 0.42

        // Name
        const displayName = isTeaser ? 'MYSTERY PLAYER' : (player.name || 'UNKNOWN').toUpperCase()
        slide.addText(displayName, {
            x: rx, y: ry, w: rw, h: 1.2,
            fontSize: isTeaser ? 48 : 52, bold: true, color: isTeaser ? 'FF2200' : WHITE,
            fontFace: 'Arial Black', shrinkText: true, breakLine: false
        })
        ry += 1.05

        // Sub-line
        const sub = isTeaser ? 'IDENTITY CLASSIFIED' : [player.position, player.branch, player.year ? `${player.year} Year` : ''].filter(Boolean).join('   •   ')
        slide.addText(sub.toUpperCase(), {
            x: rx, y: ry, w: rw, h: 0.38,
            fontSize: 13, color: isTeaser ? 'FF5555' : '5577FF', fontFace: 'Arial', charSpacing: 1
        })
        ry += 0.5

        // ── OVR CHIP ──
        const ovr = isTeaser ? '??' : getOverall(player)
        const chipH = 0.65
        const chipW = 1.8

        slide.addShape(pptx.ShapeType.rect, {
            x: rx, y: ry, w: chipW, h: chipH,
            fill: { color: '0E1228' }, line: { color: BORDER, width: 1 }
        })
        slide.addShape(pptx.ShapeType.rect, {
            x: rx, y: ry, w: 0.05, h: chipH,
            fill: { color: isTeaser ? 'FF2200' : BLUE }, line: 'none'
        })
        slide.addText(String(ovr), {
            x: rx + 0.12, y: ry, w: 0.9, h: chipH,
            fontSize: 30, bold: true, color: WHITE,
            valign: 'middle', fontFace: 'Arial Black', align: 'left'
        })
        slide.addText('OVR', {
            x: rx + 1.0, y: ry, w: 0.75, h: chipH,
            fontSize: 9, color: MUTED, bold: true,
            valign: 'middle', fontFace: 'Arial', charSpacing: 1, align: 'left'
        })
        ry += 0.85

        // Separator
        slide.addShape(pptx.ShapeType.line, {
            x: rx, y: ry, w: rw, h: 0,
            line: { color: BORDER, width: 1 }
        })
        ry += 0.28

        // Rows helper
        const addRow = (label, value, baseHeight = 0.55) => {
            if (!value || !value.trim()) return
            const displayVal = isTeaser ? '?????????????????' : value

            slide.addShape(pptx.ShapeType.rect, {
                x: rx, y: ry + 0.02, w: 0.05, h: baseHeight - 0.05,
                fill: { color: isTeaser ? 'FF2200' : BLUE }, line: 'none'
            })
            slide.addText(label.toUpperCase(), {
                x: rx + 0.15, y: ry, w: rw - 0.15, h: 0.15,
                fontSize: 8, color: MUTED, bold: true,
                fontFace: 'Arial', charSpacing: 3
            })
            slide.addText(displayVal, {
                x: rx + 0.15, y: ry + 0.15, w: rw - 0.15, h: baseHeight - 0.15,
                fontSize: 13, color: isTeaser ? 'FF5555' : OFF_W, fontFace: 'Arial', shrinkText: true, valign: 'top'
            })
            ry += baseHeight + 0.08
        }

        addRow('Key Achievements', player.key_achievements, 1.1)
        addRow('Notable Stats', player.notable_stats, 0.85)
        addRow('Player Traits', player.player_traits, 0.5)
        addRow('Preferred Foot', player.preferred_foot, 0.45)

        // Watermark
        slide.addText('NCL  •  NITRR FC  •  2025', {
            x: rx, y: 7.1, w: rw, h: 0.3,
            fontSize: 9, color: '1E2240', align: 'right',
            fontFace: 'Arial', charSpacing: 3
        })
    }

    for (const player of approved) {
        if (player.is_mystery) {
            // 1. Generate Teaser Slide
            await buildSlide(player, true)
        }
        // 2. Generate Real Slide
        await buildSlide(player, false)
    }

    await pptx.writeFile({ fileName: 'NCL_Auction_2025.pptx' })
}
