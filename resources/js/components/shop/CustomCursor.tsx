import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * CustomCursor - A smooth-following cursor circle like realteakfurniture.com
 * Uses framer-motion spring physics for smooth lag effect
 */
export const CustomCursor = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // Mouse position with raw values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring-based smooth following (creates the lag effect)
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Check if device supports hover (not touch device)
        const mediaQuery = window.matchMedia('(hover: hover)');
        if (!mediaQuery.matches) return;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        // Track hovering on interactive elements
        const handleElementHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = Boolean(
                target.tagName === 'A' ||
                    target.tagName === 'BUTTON' ||
                    target.closest('a') ||
                    target.closest('button') ||
                    target.closest('[role="button"]') ||
                    target.classList.contains('cursor-pointer'),
            );
            setIsHovering(isInteractive);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseover', handleElementHover);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseover', handleElementHover);
        };
    }, [isVisible, mouseX, mouseY]);

    // Don't render on touch devices or when not visible
    if (typeof window === 'undefined') return null;

    return (
        <motion.div
            className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
            style={{
                x: cursorX,
                y: cursorY,
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{ duration: 0.15 }}
                className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            >
                {/* Outer circle */}
                <div
                    className={`rounded-full border-2 transition-all duration-200 ${
                        isHovering
                            ? 'h-12 w-12 border-white bg-white/20'
                            : 'h-8 w-8 border-white bg-transparent'
                    }`}
                />
            </motion.div>
        </motion.div>
    );
};

export default CustomCursor;
