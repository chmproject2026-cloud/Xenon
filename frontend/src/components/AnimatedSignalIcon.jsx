import React, { useState, useEffect } from 'react';

const AnimatedSignalIcon = ({ size = 18, isConnected = true }) => {
    const [level, setLevel] = useState(0);

    useEffect(() => {
        if (isConnected) return;
        const interval = setInterval(() => {
            setLevel((prev) => (prev + 1) % 4);
        }, 400);
        return () => clearInterval(interval);
    }, [isConnected]);

    // Dynamic color classes based on connection status
    const colorClass = isConnected ? "text-emerald-500" : "text-red-500";
    const shadowClass = isConnected ? "drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]" : "drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]";

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${colorClass} ${shadowClass} transition-all duration-500`}
        >
            <path d="M12 20h.01" className={`transition-all duration-300 ease-in-out ${isConnected || level >= 0 ? 'opacity-100 blur-[0.5px]' : 'opacity-20 blur-none'}`} />
            <path d="M8.5 16.5a5 5 0 0 1 7 0" className={`transition-all duration-300 ease-in-out ${isConnected || level >= 1 ? 'opacity-100 blur-[0.5px]' : 'opacity-20 blur-none'}`} />
            <path d="M5 12.5a10 10 0 0 1 14 0" className={`transition-all duration-300 ease-in-out ${isConnected || level >= 2 ? 'opacity-100 blur-[0.5px]' : 'opacity-20 blur-none'}`} />
            <path d="M1.5 9a15 15 0 0 1 21 0" className={`transition-all duration-300 ease-in-out ${isConnected || level >= 3 ? 'opacity-100 blur-[0.5px]' : 'opacity-20 blur-none'}`} />
        </svg>
    );
};

export default AnimatedSignalIcon;
