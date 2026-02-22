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

    const approved = players.filter(p =>
        p.status === 'Ready' || p.status === 'approved' || p.status === 'Approved'
    )
    if (!approved.length) { alert('No approved players found to export.'); return }

    for (const player of approved) {
        const slide = pptx.addSlide()

        // ── Solid dark background (no transparency tricks) ──
        slide.background = { color: '060810' }

        // Left panel — clean white (card sits on white)
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

        try {
            const cardData = await renderFullCardHighRes(player)
            slide.addImage({
                data: cardData,
                x: cardX, y: cardY, w: cardW, h: cardH,
                sizing: { type: 'contain', w: cardW, h: cardH }
            })
        } catch (e) { console.error('Card render failed:', player.name, e) }

        // ── BASE PRICE BOX — below card, no dashes ──
        const bpY = cardY + cardH + 0.2
        const bpW = cardW + 0.2
        const bpX = cardX - 0.1
        const bpH = 1.0

        // Box
        slide.addShape(pptx.ShapeType.rect, {
            x: bpX, y: bpY, w: bpW, h: bpH,
            fill: { color: '0B0E20' }, line: { color: BLUE, width: 2 }
        })
        // Blue header strip inside box
        slide.addShape(pptx.ShapeType.rect, {
            x: bpX, y: bpY, w: bpW, h: 0.28,
            fill: { color: BLUE }, line: 'none'
        })
        // Label
        slide.addText('BASE PRICE', {
            x: bpX, y: bpY, w: bpW, h: 0.28,
            fontSize: 10, color: WHITE, bold: true,
            align: 'center', valign: 'middle', fontFace: 'Arial', charSpacing: 5
        })
        // ₹ + XXXX placeholder — click to replace in PowerPoint
        slide.addText('₹  XXXX', {
            x: bpX + 0.1, y: bpY + 0.3, w: bpW - 0.2, h: 0.65,
            fontSize: 28, color: WHITE, bold: true,
            align: 'center', valign: 'middle', fontFace: 'Arial Black'
        })

        // ── RIGHT: player details ──
        const rx = 6.05
        const rw = 6.95
        let ry = 0.42

        // Name
        slide.addText((player.name || 'UNKNOWN').toUpperCase(), {
            x: rx, y: ry, w: rw, h: 1.2,
            fontSize: 52, bold: true, color: WHITE,
            fontFace: 'Arial Black', shrinkText: true, breakLine: false
        })
        ry += 1.05

        // Sub-line
        const sub = [player.position, player.branch, player.year ? `${player.year} Year` : '']
            .filter(Boolean).join('   •   ')
        slide.addText(sub.toUpperCase(), {
            x: rx, y: ry, w: rw, h: 0.38,
            fontSize: 13, color: '5577FF', fontFace: 'Arial', charSpacing: 1
        })
        ry += 0.5

        // ── OVR CHIP — fixed size, single row layout ──
        const ovr = getOverall(player)
        const chipH = 0.65
        const chipW = 1.8

        slide.addShape(pptx.ShapeType.rect, {
            x: rx, y: ry, w: chipW, h: chipH,
            fill: { color: '0E1228' }, line: { color: BORDER, width: 1 }
        })
        // Blue left bar
        slide.addShape(pptx.ShapeType.rect, {
            x: rx, y: ry, w: 0.05, h: chipH,
            fill: { color: BLUE }, line: 'none'
        })
        // OVR number — left portion of chip
        slide.addText(String(ovr), {
            x: rx + 0.12, y: ry, w: 0.9, h: chipH,
            fontSize: 30, bold: true, color: WHITE,
            valign: 'middle', fontFace: 'Arial Black', align: 'left'
        })
        // "OVERALL" label — right portion
        slide.addText('OVERALL', {
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
        const addRow = (label, value) => {
            if (!value || !value.trim()) return
            // Left blue accent bar
            slide.addShape(pptx.ShapeType.rect, {
                x: rx, y: ry + 0.02, w: 0.05, h: 0.65,
                fill: { color: BLUE }, line: 'none'
            })
            slide.addText(label.toUpperCase(), {
                x: rx + 0.15, y: ry, w: rw - 0.15, h: 0.24,
                fontSize: 8, color: MUTED, bold: true,
                fontFace: 'Arial', charSpacing: 3
            })
            slide.addText(value, {
                x: rx + 0.15, y: ry + 0.24, w: rw - 0.15, h: 0.4,
                fontSize: 14, color: OFF_W, fontFace: 'Arial', shrinkText: true
            })
            ry += 0.72
        }

        addRow('Key Achievements', player.key_achievements)
        addRow('Notable Stats', player.notable_stats)
        addRow('Player Traits', player.player_traits)
        addRow('Preferred Foot', player.preferred_foot)

        // Watermark
        slide.addText('NCL  •  NITRR FC  •  2025', {
            x: rx, y: 7.1, w: rw, h: 0.3,
            fontSize: 9, color: '1E2240', align: 'right',
            fontFace: 'Arial', charSpacing: 3
        })
    }

    await pptx.writeFile({ fileName: 'NCL_Auction_2025.pptx' })
}
