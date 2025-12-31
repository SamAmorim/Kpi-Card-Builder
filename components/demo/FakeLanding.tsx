import React from 'react';
import { Translation } from '../../types';

interface FakeLandingProps {
    t: Translation;
    activeTargetId: string | null;
}

export const FakeLanding: React.FC<FakeLandingProps> = ({ t, activeTargetId }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative bg-transparent text-white font-sans overflow-hidden">
            {/* Background identical to main app */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-transparent to-transparent z-0 opacity-80"></div>

            {/* Navbar Clone */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="font-extrabold text-xl tracking-tighter flex items-center text-white/90">
                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        <span className="material-symbols-outlined text-black text-lg">dashboard</span>
                    </div>
                    KPI Card Builder
                </div>
                <div className="text-xs font-bold text-gray-400 border border-white/10 px-3 py-1.5 rounded-full bg-black/50">EN</div>
            </nav>

            {/* Hero Clone */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl px-4 mt-[-50px]">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 text-blue-400 rounded-full text-[10px] font-mono mb-8 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    <span>DAX GENERATOR ENGINE ACTIVE</span>
                </div>

                <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 tracking-tight leading-[0.95] drop-shadow-2xl">
                    {t.heroTitleStart} <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">{t.heroTitleEnd}</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed font-light">
                    {t.heroSubtitle}
                </p>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div 
                        id="btn-launch"
                        className={`group relative px-8 py-4 font-bold rounded-full transition-all duration-300 ease-out overflow-hidden
                            ${activeTargetId === 'btn-launch' 
                                ? 'bg-white text-black scale-125 ring-4 ring-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.6)] z-50' 
                                : 'bg-white text-black hover:scale-105'}
                        `}
                    >
                        <span className="relative z-10 flex items-center">{t.ctaStart} <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};