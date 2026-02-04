import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ZPlusLogo() {
    const [plusRotation, setPlusRotation] = useState(0);

    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i) => {
            const delay = i * 0.4; // Faster delay for logo
            return {
                pathLength: 1,
                opacity: 1,
                transition: {
                    pathLength: {
                        delay,
                        duration: 0.8,
                        ease: [0.65, 0, 0.35, 1],
                    },
                    opacity: { delay, duration: 0.01 },
                },
            };
        },
    };

    const handlePlusClick = (e) => {
        if (e) e.preventDefault();
        setPlusRotation((prev) => prev + 360);
    };

    useEffect(() => {
        const handleCustomEvent = () => handlePlusClick();
        window.addEventListener("z-plus-rotate", handleCustomEvent);
        return () => window.removeEventListener("z-plus-rotate", handleCustomEvent);
    }, []);

    return (
        <div className="z-plus-logo-container">
            <motion.svg
                width="100%"
                height="100%"
                viewBox="0 0 700 600"
                initial="hidden"
                animate="visible"
                style={{
                    overflow: "visible",
                }}
            >
                {/* Z - Top stroke */}
                <motion.line
                    x1="100"
                    y1="150"
                    x2="300"
                    y2="150"
                    stroke="currentColor"
                    strokeWidth="60"
                    strokeLinecap="round"
                    fill="none"
                    variants={draw}
                    custom={0}
                />

                {/* Z - Diagonal stroke */}
                <motion.line
                    x1="300"
                    y1="150"
                    x2="100"
                    y2="400"
                    stroke="currentColor"
                    strokeWidth="60"
                    strokeLinecap="round"
                    fill="none"
                    variants={draw}
                    custom={1}
                />

                {/* Z - Bottom stroke */}
                <motion.line
                    x1="100"
                    y1="400"
                    x2="300"
                    y2="400"
                    stroke="currentColor"
                    strokeWidth="60"
                    strokeLinecap="round"
                    fill="none"
                    variants={draw}
                    custom={2}
                />

                {/* Plus sign group - clickable and rotatable */}
                <motion.g
                    onClick={handlePlusClick}
                    animate={{ rotate: plusRotation }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{
                        cursor: "pointer",
                        transformOrigin: "400px 275px",
                        transformBox: "fill-box",
                    }}
                >
                    {/* Plus - Vertical stroke */}
                    <motion.line
                        x1="400"
                        y1="200"
                        x2="400"
                        y2="350"
                        stroke="currentColor"
                        strokeWidth="60"
                        strokeLinecap="round"
                        fill="none"
                        variants={draw}
                        custom={3}
                    />

                    {/* Plus - Horizontal stroke */}
                    <motion.line
                        x1="325"
                        y1="275"
                        x2="475"
                        y2="275"
                        stroke="currentColor"
                        strokeWidth="60"
                        strokeLinecap="round"
                        fill="none"
                        variants={draw}
                        custom={4}
                    />
                </motion.g>
            </motion.svg>
        </div>
    );
}
