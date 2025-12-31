import React from 'react';
import { Translation } from '../../types';

interface FakeEditorProps {
    t: Translation;
    children: React.ReactNode; 
    activeTargetId: string | null; 
    accentColor: string;
    textOverrides?: Record<string, string>;
}

export const FakeEditor: React.FC<FakeEditorProps> = ({ t, children, activeTargetId, accentColor, textOverrides }) => {
    
    const ToolBtn = ({ id, icon, label }: { id: string, icon: string, label: string }) => (
        <div 
            className={`w-full h-12 mb-2 rounded-xl border flex items-center px-4 transition-all duration-300 ${activeTargetId === id ? 'bg-blue-50 border-blue-200 text-blue-600 scale-105 shadow-md' : 'bg-white border-slate-200 text-slate-500'}`}
        >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center mr-3 ${activeTargetId === id ? 'bg-blue-100' : 'bg-slate-50'}`}>
                 <span className="material-symbols-outlined text-[18px]">{icon}</span>
            </div>
            <span className="text-xs font-bold">{label}</span>
        </div>
    );

    // Determine what is currently being typed based on overrides
    // We check if rt-label or rt-val are being modified
    const currentText = textOverrides?.['rt-label'] || textOverrides?.['rt-val'] || 'Total Revenue';
    
    return (
        <div className="w-full h-full flex flex-col bg-gray-50 text-gray-900 font-sans overflow-hidden">
            
            {/* HEADER */}
            <header className="h-16 bg-[#0a0a0a] border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-30">
                <div className="flex items-center">
                    <div className="text-gray-400 mr-4 bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </div>
                    <div className="h-8 w-px bg-white/10 mr-4"></div>
                    <h1 className="font-bold text-lg text-white flex items-center tracking-tight">
                        <span className="material-symbols-outlined mr-2 text-blue-500">dashboard_customize</span>
                        {t.editorTitle}
                    </h1>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-white/5 text-blue-400 px-4 py-2 rounded-xl text-xs font-bold border border-white/10">Play</div>
                    <div className="w-px h-8 bg-white/10 mx-1"></div>
                    {/* EXPORT BUTTON */}
                    <div 
                        id="btn-export"
                        className={`bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/50 flex items-center transition-all duration-300 ease-out origin-right
                        ${activeTargetId === 'btn-export' ? 'scale-125 ring-4 ring-white shadow-[0_0_40px_rgba(37,99,235,0.6)] z-50' : ''}`}
                    >
                        <span className="material-symbols-outlined text-[20px] mr-2">code</span>{t.export}
                    </div>
                </div>
            </header>

            {/* BODY */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* LEFT TOOLBAR */}
                <aside className="w-48 bg-white border-r border-slate-200 flex flex-col p-3 z-20">
                    <div className="mb-2 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Basic</div>
                    <ToolBtn id="btn-text" icon="title" label="Add Text" />
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-2 mb-2">
                        <div className="text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">Shapes</div>
                        <div className="flex space-x-1">
                            <div className="flex-1 h-8 bg-white border border-slate-200 rounded"></div>
                            <div className="flex-1 h-8 bg-white border border-slate-200 rounded"></div>
                        </div>
                    </div>
                    <ToolBtn id="btn-icon" icon="star" label="Add Icon" />
                    <div className="w-full h-px bg-slate-200 my-4"></div>
                    <div className="mb-2 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data</div>
                    <ToolBtn id="btn-progress" icon="linear_scale" label="Progress" />
                    <ToolBtn id="btn-chart" icon="show_chart" label="Sparkline" />
                </aside>

                {/* CANVAS AREA */}
                <div className="flex-1 relative bg-slate-100 overflow-hidden flex items-center justify-center">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-[0.4]" 
                        style={{ 
                            backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', 
                            backgroundSize: `40px 40px`
                        }} 
                    />
                    {/* Children are rendered via DemoOverlay absolute positioning to allow transitions, but conceptually live here */}
                    <div className="relative z-10 w-full h-full">
                        {children}
                    </div>
                </div>

                {/* RIGHT PROPERTIES */}
                <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 z-20">
                    <div className="flex border-b border-slate-100 bg-white">
                        <div className="flex-1 py-3 text-xs font-bold text-center text-blue-600 bg-slate-50 border-b-2 border-blue-600">{t.properties}</div>
                        <div className="flex-1 py-3 text-xs font-bold text-center text-slate-400">{t.animations}</div>
                    </div>
                    <div className="p-5 space-y-6">
                        {/* Fake Controls */}
                        <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Selected Element</div>
                            <div className="w-full h-10 bg-white border border-slate-200 rounded-lg flex items-center px-3 text-xs font-bold text-slate-700">
                                Label
                            </div>
                        </div>

                        <hr className="border-slate-100"/>
                        
                        {/* TEXT CONTENT INPUT */}
                        <div id="prop-content-input" className={`transition-all duration-300 p-2 -m-2 rounded-lg ${activeTargetId === 'prop-content-input' ? 'bg-blue-50 ring-2 ring-blue-400' : ''}`}>
                             <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Text Content</div>
                             <div className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 min-h-[40px] text-slate-800 font-medium shadow-sm flex items-center">
                                 {/* Show current text being typed or default */}
                                 {currentText}
                                 {activeTargetId === 'prop-content-input' && <span className="w-0.5 h-3 bg-blue-500 ml-1 animate-pulse"></span>}
                             </div>
                        </div>

                        <hr className="border-slate-100"/>

                        <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Appearance</div>
                            <div className="flex space-x-2 mb-2">
                                <div className="flex-1 h-10 rounded-lg border border-slate-200 flex items-center px-2">
                                    <div className="w-6 h-6 rounded-full mr-2 shadow-sm" style={{ backgroundColor: accentColor }}></div>
                                    <span className="text-xs font-mono text-slate-600">{accentColor}</span>
                                </div>
                            </div>
                            
                            {/* Color Palettes - Targeted by Script IDs */}
                            <div className="grid grid-cols-4 gap-2">
                                {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'].map(c => {
                                    const id = `color-${c}`;
                                    const isActive = activeTargetId === id;
                                    return (
                                        <div 
                                            key={c}
                                            id={id}
                                            className={`h-8 rounded-md cursor-pointer transition-all duration-300 ease-out relative
                                                ${isActive 
                                                    ? 'scale-150 ring-4 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] z-50' 
                                                    : 'hover:scale-105'}
                                            `}
                                            style={{ backgroundColor: c }}
                                        ></div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
};