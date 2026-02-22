import { CARD_LAYOUT_DEFAULTS } from '../config/cardLayout';

/**
 * Renders a player card to a canvas and returns a data URL.
 * @param {Object} player - The player data object.
 * @returns {Promise<string>} - A promise that resolves to the data URL of the rendered image.
 */
export const renderPlayerCardToCanvas = async (player) => {
    return new Promise(async (resolve, reject) => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');

            // 1. Load Fonts
            await document.fonts.load('68px "Bebas Neue"');
            await document.fonts.load('24px "Bebas Neue"');
            await document.fonts.load('52px "Bebas Neue"');
            await document.fonts.load('32px "Bebas Neue"');
            await document.fonts.load('15px "Rajdhani"');

            // 2. Determine Variant & Background
            let variant = player.card_variant || 'standard';
            if (!player.card_variant && player.photo_url && player.photo_url.includes('?')) {
                try {
                    const params = new URLSearchParams(player.photo_url.split('?')[1])
                    variant = params.get('variant') || 'standard'
                } catch (e) { }
            }


            // Constants for Variants
            const variants = {
                gold: {
                    border: '#d4af37', // Gold-ish
                    gradientStart: '#000000',
                    gradientEnd: 'rgba(212, 175, 55, 0.2)', // Gold/20
                    accent: '#d4af37',
                    nameGradient: ['#000000', 'rgba(212, 175, 55, 0.1)', 'transparent']
                },
                silver: {
                    border: '#c0c0c0',
                    gradientStart: '#ffffff', // White
                    gradientEnd: 'rgba(192, 192, 192, 0.2)',
                    accent: '#1a1a1a', // Dark text
                    nameGradient: ['transparent', 'transparent', 'transparent']
                },
                neon: {
                    border: '#39ff14',
                    gradientStart: '#000000',
                    gradientEnd: 'rgba(57, 255, 20, 0.2)',
                    accent: '#39ff14',
                    nameGradient: ['#000000', 'rgba(57, 255, 20, 0.1)', 'transparent']
                },
                standard: {
                    border: 'rgba(0, 212, 255, 0.3)', // electric-blue/30
                    gradientStart: '#0a192f', // dark-navy
                    gradientEnd: '#000000',
                    accent: '#00d4ff', // electric-blue
                    nameGradient: ['transparent', 'transparent', 'transparent'] // Match PlayerCardBase
                }
            };

            const style = variants[variant] || variants.standard;

            // 3. Draw Background
            // Handle Custom Background Image logic UP FRONT
            const getCardStyle = (year) => {
                const y = String(year)
                if (y.includes('1')) return { bg: '/cards/year1.png', isCustom: true }
                if (y.includes('2')) return { bg: '/cards/year2.png', isCustom: true }
                if (y.includes('3')) return { bg: '/cards/year3.png', isCustom: true }
                if (y.includes('4')) return { bg: '/cards/year4.png', isCustom: true }
                if (y.includes('5')) return { bg: '/cards/year5.png', isCustom: true }
                if (y.includes('Alumni')) return { bg: '/cards/Alumni.png', isCustom: true }
                if (y.includes('M.Tech') || y.includes('Masters')) return { bg: '/cards/year5.png', isCustom: true }
                if (y.includes('PhD')) return { bg: '/cards/year5.png', isCustom: true }
                return { isCustom: false }
            }
            const cardStyle = player ? getCardStyle(player.year) : { isCustom: false };

            // Draw Base Gradient only if NOT custom
            if (!cardStyle.isCustom) {
                const bgGradient = ctx.createLinearGradient(0, 0, 0, 600);
                bgGradient.addColorStop(0, style.gradientStart);
                if (variant === 'standard') {
                    bgGradient.addColorStop(0.5, '#020c1b');
                }
                bgGradient.addColorStop(1, style.gradientEnd);

                ctx.fillStyle = bgGradient;
                ctx.fillRect(0, 0, 400, 600);
            }

            // Draw Border - ONLY if NOT Custom Background
            if (!cardStyle.isCustom) {
                ctx.strokeStyle = style.border;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(1.5, 1.5, 397, 597, 24);
                ctx.stroke();
            }

            if (cardStyle.isCustom) {
                try {
                    const bgImg = await loadImage(cardStyle.bg);
                    // Draw cover
                    const ratio = Math.max(400 / bgImg.width, 600 / bgImg.height);
                    const centerShift_x = (400 - bgImg.width * ratio) / 2;
                    const centerShift_y = (600 - bgImg.height * ratio) / 2;
                    ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, centerShift_x, centerShift_y, bgImg.width * ratio, bgImg.height * ratio);
                } catch (e) {
                    console.error('Failed to load custom background', e);
                }
            } else {
                // Draw Standard Overlay (Gradient)
                const overlayGradient = ctx.createLinearGradient(0, 0, 400, 600);
                overlayGradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
                overlayGradient.addColorStop(0.5, 'transparent');
                overlayGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
                ctx.fillStyle = overlayGradient;
                ctx.fillRect(0, 0, 400, 600);
            }

            // 4. Draw Player Image
            if (player.photo_url) {
                try {
                    const img = await loadImage(player.photo_url);

                    // Parse transform params
                    let scale = player.image_scale;
                    let x = player.image_x;
                    let y = player.image_y;

                    if ((scale === undefined || x === undefined || y === undefined) && player.photo_url.includes('?')) {
                        const params = new URLSearchParams(player.photo_url.split('?')[1]);
                        if (scale === undefined) scale = parseFloat(params.get('scale')) || 1;
                        if (x === undefined) x = parseInt(params.get('x')) || 0;
                        if (y === undefined) y = parseInt(params.get('y')) || 0;
                    }

                    scale = scale || 1;
                    x = x || 0;
                    y = y || 0;

                    // Canvas Transformation for Image
                    ctx.save();

                    // The HTML implementation essentially positions the image at bottom center of visual area
                    // Parent container: top 40px, left 0, width 400, height 460.
                    // Image style: height 100%, width auto, transform-origin bottom center.
                    // Flex align-items: flex-end.

                    // Canvas equivalent:
                    // 1. Clip to the image container area? (Optional but good practice)
                    ctx.beginPath();
                    ctx.rect(0, 40, 400, 460);
                    // ctx.clip(); // Only clip if we want to validly hide outlying parts, but HTML implementation relies on overflow-hidden on the main card.
                    // Main card clip:
                    ctx.beginPath();
                    ctx.roundRect(0, 0, 400, 600, 24);
                    ctx.clip(); // Clip everything to card border


                    // 2. Translate to image base position (bottom center of the container area)
                    // Container bottom is 40 + 460 = 500px. Center X is 200.
                    ctx.translate(200, 500);

                    // 3. Apply User Transforms
                    ctx.translate(x, y);
                    ctx.scale(scale, scale);

                    // 4. Draw Image anchored at bottom center
                    // We need to know aspect ratio to draw 'height: 100%' aka 460px height
                    const imgHeight = 460;
                    const imgWidth = img.width * (imgHeight / img.height);

                    // Draw centered horizontally, anchored bottom
                    ctx.drawImage(img, -imgWidth / 2, -imgHeight, imgWidth, imgHeight);

                    ctx.restore();

                } catch (e) {
                    console.error('Failed to load player image', e);
                }
            }

            // 5. Text & Stats Drawing

            // Helper for Text Shadows and Strokes
            const drawTextWithShadow = (text, x, y, font, color, align = 'center', hasShadow = false) => {
                ctx.save();
                ctx.font = font;
                ctx.textAlign = align;

                if (hasShadow) {
                    // Draw outer shadow (0 0 8px rgba(0,0,0,0.6))
                    ctx.shadowColor = 'rgba(0,0,0,0.6)';
                    ctx.shadowBlur = 8;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.fillStyle = color;
                    ctx.fillText(text, x, y);

                    // Draw inner shadow (0 4px 12px rgba(0,0,0,0.9))
                    ctx.shadowColor = 'rgba(0,0,0,0.9)';
                    ctx.shadowBlur = 12;
                    ctx.shadowOffsetY = 4;
                    ctx.shadowOffsetX = 0;
                    ctx.fillText(text, x, y);
                }

                // Draw actual text without mutating shadow further
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;
                ctx.fillStyle = color;
                ctx.fillText(text, x, y);

                ctx.restore();
            };

            // Calculate Average
            const average = Math.round((parseInt(player.pace) + parseInt(player.shooting) + parseInt(player.passing) + parseInt(player.dribbling) + parseInt(player.defending) + parseInt(player.physical)) / 6);

            // Parse Layout Params
            let layout = {
                name_x: parseInt(player.name_x) || CARD_LAYOUT_DEFAULTS.NAME_X,
                name_y: parseInt(player.name_y) || CARD_LAYOUT_DEFAULTS.NAME_Y,
                name_size: parseInt(player.name_size) || CARD_LAYOUT_DEFAULTS.NAME_SIZE,
                stats_x: parseInt(player.stats_x) || CARD_LAYOUT_DEFAULTS.STATS_X,
                stats_y: parseInt(player.stats_y) || CARD_LAYOUT_DEFAULTS.STATS_Y,
                rating_x: parseInt(player.rating_x) || CARD_LAYOUT_DEFAULTS.RATING_X,
                rating_y: parseInt(player.rating_y) || CARD_LAYOUT_DEFAULTS.RATING_Y,
                position_x: parseInt(player.position_x) || CARD_LAYOUT_DEFAULTS.POSITION_X,
                position_y: parseInt(player.position_y) || CARD_LAYOUT_DEFAULTS.POSITION_Y,
                position_size: parseInt(player.position_size) || CARD_LAYOUT_DEFAULTS.POSITION_SIZE,
                branch_x: parseInt(player.branch_x) || CARD_LAYOUT_DEFAULTS.BRANCH_X,
                branch_y: parseInt(player.branch_y) || CARD_LAYOUT_DEFAULTS.BRANCH_Y,
                branch_size: parseInt(player.branch_size) || CARD_LAYOUT_DEFAULTS.BRANCH_SIZE,
            };

            // Fallback to URL params if not provided in player object
            if (player.photo_url && player.photo_url.includes('?')) {
                try {
                    const p = new URLSearchParams(player.photo_url.split('?')[1]);
                    if (player.name_x === undefined && p.get('name_x')) layout.name_x = parseInt(p.get('name_x'));
                    if (player.name_y === undefined && p.get('name_y')) layout.name_y = parseInt(p.get('name_y'));
                    if (player.name_size === undefined && p.get('name_size')) layout.name_size = parseInt(p.get('name_size'));
                    if (player.stats_x === undefined && p.get('stats_x')) layout.stats_x = parseInt(p.get('stats_x'));
                    if (player.stats_y === undefined && p.get('stats_y')) layout.stats_y = parseInt(p.get('stats_y'));
                    if (player.rating_x === undefined && p.get('rating_x')) layout.rating_x = parseInt(p.get('rating_x'));
                    if (player.rating_y === undefined && p.get('rating_y')) layout.rating_y = parseInt(p.get('rating_y'));
                    if (player.position_x === undefined && p.get('position_x')) layout.position_x = parseInt(p.get('position_x'));
                    if (player.position_y === undefined && p.get('position_y')) layout.position_y = parseInt(p.get('position_y'));
                    if (player.position_size === undefined && p.get('position_size')) layout.position_size = parseInt(p.get('position_size'));
                    if (player.branch_x === undefined && p.get('branch_x')) layout.branch_x = parseInt(p.get('branch_x'));
                    if (player.branch_y === undefined && p.get('branch_y')) layout.branch_y = parseInt(p.get('branch_y'));
                    if (player.branch_size === undefined && p.get('branch_size')) layout.branch_size = parseInt(p.get('branch_size'));
                } catch (e) { }
            }

            // Font Color Support
            const getHexFromColorName = (colorName) => {
                switch (colorName) {
                    case 'laser-blue': return '#00d4ff'
                    case 'neon': return '#39ff14'
                    case 'gold': return '#FFD700'
                    case 'black': return '#000000'
                    case 'white': return '#ffffff'
                    default: return null
                }
            }

            let explicitFontColor = player.font_color ? getHexFromColorName(player.font_color) : null;
            if (!explicitFontColor && player.photo_url && player.photo_url.includes('?')) {
                try {
                    const params = new URLSearchParams(player.photo_url.split('?')[1])
                    if (params.get('font_color')) {
                        explicitFontColor = getHexFromColorName(params.get('font_color'))
                    }
                } catch (e) { }
            }

            let defaultVariantTextColor = (variant === 'gold' || variant === 'brown' || variant === 'silver') ?
                (variant === 'gold' ? '#3E2723' : variant === 'brown' ? '#54462B' : '#1a1a1a') : '#ffffff';

            let textColor = explicitFontColor || defaultVariantTextColor;
            let useShadow = !(variant === 'gold' || variant === 'brown' || variant === 'silver');

            // A. Rating (Top Left)
            // Position: absolute, top 50, left 40, width 100.
            // Center of width 100 starting at 40 is x=90.

            // Rating
            drawTextWithShadow(
                average.toString(),
                90 + layout.rating_x,
                115 + layout.rating_y, // Baseline adjusted to match DOM (top:50px + font:68px)
                'bold 68px "Bebas Neue"',
                textColor,
                'center',
                useShadow
            );

            // Position (Independent)
            drawTextWithShadow(
                player.position,
                90 + layout.position_x,
                115 + layout.position_size + layout.position_y, // Baseline adjusted to match DOM
                `600 ${layout.position_size}px "Bebas Neue"`,
                textColor,
                'center',
                useShadow
            );

            // Branch (Independent)
            if (player.branch) {
                drawTextWithShadow(
                    player.branch,
                    90 + layout.branch_x,
                    145 + layout.branch_size + layout.branch_y, // Baseline adjusted to match DOM
                    `500 ${layout.branch_size}px "Bebas Neue"`,
                    textColor,
                    'center',
                    useShadow
                );
            }

            // B. Name Section (Bottom)
            // Gradient Background
            // Top: 438px
            // Gradient Background - only if not Gold (Gold uses clean gradient defined in styles usually or just transparent)
            if (variant !== 'gold') {
                const nameGradient = ctx.createLinearGradient(0, 570, 0, 430); // Approximate based on css
                nameGradient.addColorStop(0, style.nameGradient[0]);
                nameGradient.addColorStop(0.5, style.nameGradient[1]);
                nameGradient.addColorStop(1, style.nameGradient[2]);
                ctx.fillStyle = nameGradient;
                ctx.fillRect(0, 460 + layout.name_y, 400, 140); // Fill bottom area
            }

            // Name Text
            // Top: 438px generally. Font 52px.
            drawTextWithShadow(
                player.name.toUpperCase(),
                200 + layout.name_x,
                485 + layout.name_y, // Approx baseline
                `bold ${layout.name_size}px "Bebas Neue"`,
                textColor,
                'center',
                useShadow
            );

            // C. Stats Row
            // Container Top: 510px.
            // Flex items.
            const stats = [
                { l: 'PAC', v: player.pace },
                { l: 'SHO', v: player.shooting },
                { l: 'PAS', v: player.passing },
                { l: 'DRI', v: player.dribbling },
                { l: 'DEF', v: player.defending },
                { l: 'PHY', v: player.physical }
            ];

            const startX = 35; // Approx start centered
            const gap = 10;
            const itemWidth = 45;

            // Total width = 6*45 + 5*10 = 270 + 50 = 320.
            // Center is 200. Start X should be 200 - 160 = 40.

            let currentX = 40;

            // Draw Background Pill for Stats
            ctx.save();
            const statsWidth = 340; // Approx 6 items + gaps + padding
            const statsHeight = 70; // Approx height
            const pillX = 200 - (statsWidth / 2) + layout.stats_x;
            const pillY = 500 + layout.stats_y; // Moved up to 500 to align with text (Text/Icon starts ~525)

            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.roundRect(pillX, pillY, statsWidth, statsHeight, 12);
            ctx.fill();
            ctx.restore();

            stats.forEach(stat => {
                const centerX = currentX + itemWidth / 2 + layout.stats_x;

                // Label
                drawTextWithShadow(
                    stat.l,
                    centerX,
                    525 + layout.stats_y,
                    'bold 15px "Rajdhani"',
                    textColor,
                    'center',
                    false
                );

                // Value
                drawTextWithShadow(
                    stat.v.toString(),
                    centerX,
                    555 + layout.stats_y,
                    'bold 32px "Bebas Neue"',
                    textColor,
                    'center',
                    false
                );

                currentX += itemWidth + gap;
            });

            resolve(canvas.toDataURL('image/png'));

        } catch (error) {
            reject(error);
        }
    });
};

const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};
