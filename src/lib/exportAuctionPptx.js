import PptxGenJS from 'pptxgenjs'
import { renderPlayerCardToCanvas } from '../utils/playerCardRenderer'

/** Upscale card to 2× for quality/size balance */
const renderFullCardHighRes = async (player) => {
    const SCALE = 2
    const base64_1x = await renderPlayerCardToCanvas(player)
    return new Promise((resolve, reject) => {
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
    })
}


export const exportAuctionPptx = async (players, options = {}) => {
    const fileName = options.fileName || 'NCL_Auction_2025.pptx';
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

    // --- CUSTOM ROUND-WISE SORTING ---
    const shuffle = (array) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    let pool1500 = [], pool1000 = [], pool500 = [], pool300 = [], pool100 = [], poolMystery = [], others = [];
    approved.forEach(p => {
        if (p.is_mystery) poolMystery.push(p);
        else if (p.base_price === 1500) pool1500.push(p);
        else if (p.base_price === 1000) pool1000.push(p);
        else if (p.base_price === 500) pool500.push(p);
        else if (p.base_price === 300) pool300.push(p);
        else if (p.base_price === 100) pool100.push(p);
        else others.push(p);
    });

    shuffle(pool1500);
    shuffle(pool1000);
    shuffle(pool500);
    shuffle(pool300);
    shuffle(pool100);
    shuffle(poolMystery);
    shuffle(others);

    const pullPlayers = (arr, count) => arr.splice(0, count);

    let finalOrder = [];

    // Round 1: 4 1500, 4 1000, 1 mystery, 6 500
    finalOrder.push(...pullPlayers(pool1500, 4));
    finalOrder.push(...pullPlayers(pool1000, 4));
    finalOrder.push(...pullPlayers(poolMystery, 1));
    finalOrder.push(...pullPlayers(pool500, 6));

    // Round 2: 3 1500, 5 1000, 2 mystery, 10 500, 10 300 (fallback to 100 if user meant bronze)
    finalOrder.push(...pullPlayers(pool1500, 3));
    finalOrder.push(...pullPlayers(pool1000, 5));
    finalOrder.push(...pullPlayers(poolMystery, 2));
    finalOrder.push(...pullPlayers(pool500, 10));
    let r2_300 = pullPlayers(pool300, 10);
    finalOrder.push(...r2_300);
    if (r2_300.length < 10) {
        finalOrder.push(...pullPlayers(pool100, 10 - r2_300.length));
    }

    // Round 3: 4 1000, 3 mystery, 10 500, 10 300 (fallback to 100 if user meant bronze)
    finalOrder.push(...pullPlayers(pool1000, 4));
    finalOrder.push(...pullPlayers(poolMystery, 3));
    finalOrder.push(...pullPlayers(pool500, 10));
    let r3_300 = pullPlayers(pool300, 10);
    finalOrder.push(...r3_300);
    if (r3_300.length < 10) {
        finalOrder.push(...pullPlayers(pool100, 10 - r3_300.length));
    }

    // Round 4 (rest of the players)
    let remaining = [...pool1500, ...pool1000, ...pool500, ...pool300, ...pool100, ...poolMystery, ...others];
    // Sort remaining by base price descending so top players don't get lost
    remaining.sort((a, b) => {
        const pA = a.base_price || 0;
        const pB = b.base_price || 0;
        return pB - pA;
    });
    
    finalOrder.push(...remaining);

    // Apply the sorted and structured array
    approved = finalOrder;

    if (!approved.length) { alert('No approved players found to export.'); return }

    // Helper to build an Intro slide (Card only, centered)
    const buildIntroSlide = (isTeaser, cardData) => {
        const slide = pptx.addSlide()

        // Background image (User will place stadium_bg.jpg in public/assests)
        slide.background = { path: '/assests/stadium_bg1.png' }

        // ── CENTER: large card ──
        const cardW = 4.26
        const cardH = 6.4
        const cardX = (13.33 - cardW) / 2
        const cardY = (7.5 - cardH) / 2

        if (isTeaser) {
            slide.addShape(pptx.ShapeType.rect, {
                x: cardX, y: cardY, w: cardW, h: cardH,
                fill: { color: '000000' }, line: { color: 'FF2200', width: 4 }
            })
            slide.addText('?', {
                x: cardX, y: cardY, w: cardW, h: cardH,
                fontSize: 180, color: 'FF2200', bold: true, align: 'center', valign: 'middle', fontFace: 'Arial Black'
            })
        } else if (cardData) {
            slide.addImage({
                data: cardData,
                x: cardX, y: cardY, w: cardW, h: cardH,
                sizing: { type: 'contain', w: cardW, h: cardH }
            })
        }
    }

    // Helper to build a detailed slide (either Real or Mystery Teaser)
    const buildSlide = async (player, isTeaser, cardData) => {
        const slide = pptx.addSlide()

        // ── Full slide background image ──
        slide.background = { path: '/assests/stadium_bg_detailed.png' }

        // ── LEFT PANEL: grunge-textured white area ──
        const panelW = 5.6

        // Base white panel with grunge texture overlay
        slide.addShape(pptx.ShapeType.rect, {
            x: 0, y: 0, w: panelW, h: '100%',
            fill: { color: 'F0EDE8' }, line: 'none'
        })
        // Grunge texture overlay (user places grunge_texture.png in public/assests)
        slide.addImage({
            path: '/assests/grunge_texture.png',
            x: 0, y: 0, w: panelW, h: 7.5,
            sizing: { type: 'cover', w: panelW, h: 7.5 }
        })

        // Thin decorative border on the right edge of left panel
        slide.addShape(pptx.ShapeType.rect, {
            x: panelW - 0.04, y: 0, w: 0.06, h: '100%',
            fill: { color: '333333', transparency: 60 }, line: 'none'
        })

        // ── LEFT: player card ──
        const cardW = 3.8
        const cardH = 5.7
        const cardX = (panelW - cardW) / 2
        const cardY = 0.25

        if (isTeaser) {
            slide.addShape(pptx.ShapeType.rect, {
                x: cardX, y: cardY, w: cardW, h: cardH,
                fill: { color: '000000' }, line: { color: 'FF2200', width: 4 }
            })
            slide.addText('?', {
                x: cardX, y: cardY, w: cardW, h: cardH,
                fontSize: 160, color: 'FF2200', bold: true, align: 'center', valign: 'middle', fontFace: 'Arial Black'
            })
        } else if (cardData) {
            slide.addImage({
                data: cardData,
                x: cardX, y: cardY, w: cardW, h: cardH,
                sizing: { type: 'contain', w: cardW, h: cardH }
            })
        }

        // ── BASE PRICE BOX (below card) ──
        const bpY = cardY + cardH + 0.15
        const bpW = cardW
        const bpX = cardX
        const bpH = 0.95

        // Dark box with blue border
        slide.addShape(pptx.ShapeType.rect, {
            x: bpX, y: bpY, w: bpW, h: bpH,
            fill: { color: '0B0E20' }, line: { color: BLUE, width: 2 }
        })
        // Blue header strip
        slide.addShape(pptx.ShapeType.rect, {
            x: bpX, y: bpY, w: bpW, h: 0.28,
            fill: { color: BLUE }, line: 'none'
        })
        slide.addText('BASE PRICE', {
            x: bpX, y: bpY, w: bpW, h: 0.28,
            fontSize: 12, color: WHITE, bold: true,
            align: 'center', valign: 'middle', fontFace: 'Arial Black', charSpacing: 6
        })
        slide.addText(`₹  ${player.base_price?.toLocaleString() || '2000'}`, {
            x: bpX + 0.1, y: bpY + 0.3, w: bpW - 0.2, h: 0.6,
            fontSize: 36, color: WHITE, bold: true,
            align: 'center', valign: 'middle', fontFace: 'Arial Black'
        })

        // ── RIGHT PANEL: player details over stadium background ──
        const rx = 5.9
        const rw = 7.1
        let ry = 0.3

        // Semi-transparent dark overlay for readability on right side
        slide.addShape(pptx.ShapeType.rect, {
            x: panelW, y: 0, w: 13.33 - panelW, h: '100%',
            fill: { color: '050A18', transparency: 30 }, line: 'none'
        })

        // ── Thin top accent line across slide ──
        slide.addShape(pptx.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: 0.04,
            fill: { color: BLUE }, line: 'none'
        })
        // Thin bottom accent line
        slide.addShape(pptx.ShapeType.rect, {
            x: 0, y: 7.46, w: '100%', h: 0.04,
            fill: { color: BLUE }, line: 'none'
        })

        // ── Player Name ──
        const displayName = isTeaser ? 'MYSTERY PLAYER' : (player.name || 'UNKNOWN').toUpperCase()
        slide.addText(displayName, {
            x: rx, y: ry, w: 7.3, h: 1.3,
            fontSize: isTeaser ? 54 : 54, bold: true, color: isTeaser ? 'FF2200' : WHITE,
            fontFace: 'Times New Roman', shrinkText: true, breakLine: false
        })
        ry += 1.15

        // ── Sub-line (Position • Branch • Year) ──
        const sub = isTeaser
            ? 'IDENTITY CLASSIFIED'
            : [player.position, player.branch, player.year ? `${player.year} Year` : ''].filter(Boolean).join('   •   ')
        slide.addText(sub.toUpperCase(), {
            x: rx, y: ry, w: rw, h: 0.45,
            fontSize: 20, color: isTeaser ? 'FF5555' : '66AAFF', bold: true,
            fontFace: 'Algerian', charSpacing: 3
        })
        ry += 0.6

        // ── Separator line ──
        slide.addShape(pptx.ShapeType.line, {
            x: rx, y: ry, w: rw - 0.3, h: 0,
            line: { color: '3355CC', width: 1, dashType: 'solid' }
        })
        ry += 0.25

        // ── Detail Rows ──
        const addRow = (label, value, baseHeight = 0.55) => {
            if (!value || !value.trim()) return
            const displayVal = isTeaser ? '?????????????????' : value

            // Blue accent bar
            slide.addShape(pptx.ShapeType.rect, {
                x: rx, y: ry + 0.03, w: 0.07, h: baseHeight - 0.06,
                fill: { color: isTeaser ? 'FF2200' : '3366FF' }, line: 'none'
            })
            // Section label
            slide.addText(label.toUpperCase(), {
                x: rx + 0.2, y: ry, w: rw - 0.2, h: 0.22,
                fontSize: 12, color: '88AAEE', bold: true,
                fontFace: 'Arial Black', charSpacing: 5
            })
            // Section value
            slide.addText(displayVal, {
                x: rx + 0.2, y: ry + 0.22, w: rw - 0.2, h: baseHeight - 0.22,
                fontSize: 18, color: isTeaser ? 'FF5555' : WHITE, fontFace: 'Arial',
                bold: true, shrinkText: true, valign: 'top'
            })
            ry += baseHeight + 0.1
        }

        addRow('Key Achievements', player.key_achievements, 1.2)
        addRow('Notable Stats', player.notable_stats, 0.9)
        addRow('Player Traits', player.player_traits, 0.9)
        addRow('Preferred Foot', player.preferred_foot, 0.6)

        // ── Decorative diamond accent (bottom-right) ──
        slide.addText('◆', {
            x: 12.6, y: 7.0, w: 0.3, h: 0.3,
            fontSize: 12, color: '3344AA', align: 'center', valign: 'middle', fontFace: 'Arial'
        })

        // ── Watermark ──
        slide.addText('NCL  •  NITRR FC  •  2025', {
            x: rx, y: 7.05, w: rw - 0.5, h: 0.3,
            fontSize: 9, color: '#F75F4B', align: 'right',
            fontFace: 'Arial', charSpacing: 3, transparency: 40
        })
    }

    for (const player of approved) {
        let cardData = null;
        try {
            cardData = await renderFullCardHighRes(player)
        } catch (e) {
            console.error(`Card render failed for ${player.name}:`, e)
        }

        if (player.is_mystery) {
            // 1. Generate Teaser Intro (Silhouette only)
            buildIntroSlide(true, null)
            // 2. Generate Teaser Details
            await buildSlide(player, true, null)
        }

        // 3. Generate Real Intro (Card only)
        buildIntroSlide(false, cardData)
        // 4. Generate Real Details
        await buildSlide(player, false, cardData)
    }

    await pptx.writeFile({ fileName })
}
