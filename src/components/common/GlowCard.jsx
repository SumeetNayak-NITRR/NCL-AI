import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion';

const GlowCard = ({ children, className = "", glowColor = "#39ff14", ...props }) => {
    const cardRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const opacity = useMotionValue(0);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
        opacity.set(1);
    };

    const handleMouseLeave = () => {
        animate(opacity, 0, { duration: 0.3 });
    };

    const gradientBg = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${glowColor}15, transparent 40%)`;
    const gradientBorder = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${glowColor}40, transparent 40%)`;

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`}
            {...props}
        >
            {/* Glow Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                style={{
                    opacity,
                    background: gradientBg
                }}
            />

            {/* Border Glow */}
            <motion.div
                className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                style={{
                    opacity,
                    background: gradientBorder,
                    maskImage: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    padding: '1px'
                }}
            />

            <div className="relative h-full">
                {children}
            </div>
        </div>
    );
};

export default GlowCard;
