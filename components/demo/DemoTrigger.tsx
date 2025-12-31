import React, { useEffect, useState } from 'react';
import { DemoOverlay } from './DemoOverlay';

export const DemoTrigger: React.FC = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [buffer, setBuffer] = useState('');

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            // Append key to buffer
            const char = e.key.toLowerCase();
            // Only allow letters
            if (!/^[a-z]$/.test(char)) return;
            
            setBuffer(prev => {
                const next = (prev + char).slice(-5); // Keep last 5 chars
                if (next === 'start') {
                    setIsEnabled(true);
                    return ''; // Reset
                }
                return next;
            });
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    if (!isEnabled) return null;

    return <DemoOverlay onExit={() => setIsEnabled(false)} />;
};
