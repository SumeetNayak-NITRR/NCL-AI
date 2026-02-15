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
            if (player.status === 'Alumni') variant = 'gold';

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
                    gradientStart: '#000000',
                    gradientEnd: 'rgba(192, 192, 192, 0.2)',
                    accent: '#c0c0c0',
                    nameGradient: ['#000000', 'rgba(192, 192, 192, 0.1)', 'transparent']
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
                    nameGradient: ['#000000', 'rgba(0, 30, 60, 0.4)', 'transparent'] // dark-blue/40 approx
                }
            };

            const style = variants[variant] || variants.standard;

            // 3. Draw Background
            // Create Gradient
            const bgGradient = ctx.createLinearGradient(0, 0, 0, 600);
            bgGradient.addColorStop(0, style.gradientStart);
            if (variant === 'standard') {
                bgGradient.addColorStop(0.5, '#020c1b'); // Midpoint for standard
            }
            bgGradient.addColorStop(1, style.gradientEnd);

            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, 400, 600);

            // Draw Border
            ctx.strokeStyle = style.border;
            ctx.lineWidth = 3;
            // Draw rounded rect border manually or just rect for now (Simulated border)
            // Ideally: roundedRect
            ctx.beginPath();
            ctx.roundRect(1.5, 1.5, 397, 597, 24); // inset half linewidth
            ctx.stroke();

            // Handle Custom Background Image (Year 1 / Year 2)
            const getCardStyle = (year) => {
                const y = String(year).toLowerCase()
                if (y.includes('1')) return { bg: '/cards/year1.png', isCustom: true }
                if (y.includes('2')) return { bg: '/cards/year2.png', isCustom: true }
                return { isCustom: false }
            }
            const cardStyle = player ? getCardStyle(player.year) : { isCustom: false };

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
            const drawTextWithShadow = (text, x, y, font, color, align = 'center', shadowBlur = 0, shadowColor = 'transparent', strokeColor = null, strokeWidth = 0) => {
                ctx.save();
                ctx.font = font;
                ctx.textAlign = align;

                // Shadow
                if (shadowBlur > 0) {
                    ctx.shadowColor = shadowColor;
                    ctx.shadowBlur = shadowBlur;
                }

                // Stroke (Border) - Draw first so fill goes over it
                if (strokeColor && strokeWidth > 0) {
                    ctx.lineWidth = strokeWidth;
                    ctx.strokeStyle = strokeColor;
                    ctx.strokeText(text, x, y);
                }

                // Fill
                ctx.fillStyle = color;
                ctx.fillText(text, x, y);
                ctx.restore();
            };

            // Calculate Average
            const average = Math.round((parseInt(player.pace) + parseInt(player.shooting) + parseInt(player.passing) + parseInt(player.dribbling) + parseInt(player.defending) + parseInt(player.physical)) / 6);

            // A. Rating (Top Left)
            // Position: absolute, top 50, left 40, width 100.
            // Text: 68px Bebas, line height 0.9.
            // Center of width 100 starting at 40 is x=90.
            // Y position needs to be baseline. 50 (top) + ~55 (approx cap height/ascent).

            // Rating
            drawTextWithShadow(
                average.toString(),
                90,
                105, // Approximation for baseline
                'bold 68px "Bebas Neue"',
                '#ffffff',
                'center',
                20, // Stronger blur
                'rgba(0, 0, 0, 0.8)', // Dark shadow for visibility
                null, 0 // No Hard Border
            );

            // Position
            drawTextWithShadow(
                player.position,
                90,
                135,
                '600 24px "Bebas Neue"',
                '#ffffff',
                'center',
                15,
                'rgba(0, 0, 0, 0.8)', // Dark shadow
                null, 0 // No Hard Border
            );

            // B. Name Section (Bottom)
            // Gradient Background
            // Top: 438px
            const nameGradient = ctx.createLinearGradient(0, 570, 0, 430); // Approximate based on css
            nameGradient.addColorStop(0, style.nameGradient[0]);
            nameGradient.addColorStop(0.5, style.nameGradient[1]);
            nameGradient.addColorStop(1, style.nameGradient[2]);
            ctx.fillStyle = nameGradient;
            ctx.fillRect(0, 460, 400, 140); // Fill bottom area

            // Name Text
            // Top: 438px generally. Font 52px.
            // Text Shadow: 0 4px 8px rgba(0,0,0,0.5).
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowOffsetY = 4;
            ctx.shadowBlur = 8;
            drawTextWithShadow(
                player.name.toUpperCase(),
                200,
                485, // Approx baseline
                'bold 52px "Bebas Neue"',
                '#ffffff'
            );
            ctx.restore();

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

            stats.forEach(stat => {
                const centerX = currentX + itemWidth / 2;

                // Label
                drawTextWithShadow(
                    stat.l,
                    centerX,
                    525,
                    '15px "Rajdhani"',
                    '#ffffff' // Force white
                );

                // Value
                ctx.save();
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 4;
                drawTextWithShadow(
                    stat.v.toString(),
                    centerX,
                    555,
                    'bold 32px "Bebas Neue"',
                    '#ffffff' // Force white
                );
                ctx.restore();

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
