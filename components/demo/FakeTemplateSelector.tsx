import React from 'react';
import { TEMPLATES } from '../../constants';
import MiniPreview from '../MiniPreview';

interface FakeTemplateSelectorProps {
    activeTargetId: string | null;
}

export const FakeTemplateSelector: React.FC<FakeTemplateSelectorProps> = ({ activeTargetId }) => {
    // Select specific templates by ID to prevent index shifting issues
    const displayTemplates = [
        TEMPLATES[0], // Keep Simple KPI as first
        TEMPLATES.find(t => t.id === 'revenue-trend') || TEMPLATES[3], // Ensure Revenue Trend is present
        TEMPLATES.find(t => t.id === 'saas-growth') || TEMPLATES[5],
        TEMPLATES.find(t => t.id === 'ecommerce-prod') || TEMPLATES[6]
    ];

    return (
        <div className="w-full h-full bg-[#050505] font-sans text-white relative flex flex-col overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_#1a1a1a_0%,_#050505_40%)] pointer-events-none"></div>

            {/* Sidebar Fake */}
            <div className="flex flex-1 overflow-hidden relative z-10">
                <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col shrink-0">
                    <div className="p-6">
                        <div className="flex items-center text-xl font-bold mb-6">
                            <span className="material-symbols-outlined mr-2">dashboard</span> Library
                        </div>
                        <div className="space-y-2">
                             <div className="px-3 py-2 bg-white/10 rounded-lg text-sm font-medium">All Templates</div>
                             <div className="px-3 py-2 text-gray-500 text-sm">Executive</div>
                             <div className="px-3 py-2 text-gray-500 text-sm">Analytics</div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-bold mb-2">Select a Template</h1>
                    <p className="text-gray-500 mb-8">Start with a pre-built design.</p>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayTemplates.map((t) => {
                            if (!t) return null;
                            const isTarget = activeTargetId === `tpl-${t.id}`;
                            return (
                                <div 
                                    key={t.id}
                                    id={`tpl-${t.id}`}
                                    className={`
                                        group relative bg-[#0a0a0a] rounded-2xl border overflow-hidden transition-all duration-500 ease-out
                                        ${isTarget 
                                            ? 'border-blue-500 ring-4 ring-blue-500/50 shadow-[0_0_60px_rgba(59,130,246,0.4)] scale-110 z-20' 
                                            : 'border-white/5 opacity-80'}
                                    `}
                                >
                                    <div className="h-32 bg-[#111] relative flex items-center justify-center overflow-hidden">
                                        <div className="scale-75">
                                            <MiniPreview elements={t.elements} settings={t.canvasSettings} />
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className={`font-bold text-sm ${isTarget ? 'text-blue-400' : 'text-white'}`}>{t.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{t.category}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
};