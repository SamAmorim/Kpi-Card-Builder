import React from 'react';

export const GhostCursor: React.FC<{ x: number; y: number; isDown: boolean }> = ({ x, y, isDown }) => {
    return (
        <div 
            className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out will-change-transform"
            style={{ 
                left: 0, 
                top: 0,
                transform: `translate3d(${x}px, ${y}px, 0) scale(${isDown ? 0.8 : 1})`
            }}
        >
            <div className="relative">
                {/* Cursor Body */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                    <path d="M5.5 3.5L19 16.5L11.5 17L15 23L12.5 24.5L8.5 18L3 21.5V3.5Z" fill="white" stroke="black" strokeWidth="1.5"/>
                </svg>
                
                {/* Click Ripple Effect */}
                {isDown && (
                    <div className="absolute top-0 left-0 -ml-6 -mt-6 w-20 h-20 rounded-full border-4 border-blue-400/50 animate-ping opacity-75"></div>
                )}
                
                {/* Subtle Trail / Ring */}
                <div className="absolute top-0 left-0 -ml-1 -mt-1 w-10 h-10 rounded-full border border-white/20 opacity-0 transition-opacity duration-300" style={{ opacity: isDown ? 0 : 0.2 }}></div>
            </div>
        </div>
    );
};