import React, { useState } from 'react';
import { TEMPLATES, ICON_PATHS, TRANSLATIONS } from '../constants';
import { CanvasElement, Language } from '../types';

// Special 3D Render Component with Annotations
const ExplodedView: React.FC<{ elements: CanvasElement[], settings: any }> = ({ elements, settings }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Calculate depth based on element type and z-index
    // ADJUSTED: Reduced scaling factors for a less aggressive, smoother expansion
    const getDepth = (type: string, zIndex: number = 0) => {
        let base = 0;
        // Base layers
        if (type === 'box') base = 0;
        
        // Content layers
        if (['image', 'progress-bar', 'sparkline', 'circular-progress'].includes(type)) base = 25;
        if (type === 'icon') base = 40;
        if (type === 'text') base = 55;

        // Add z-index factor (Reduced from 15 to 10 for tighter cluster)
        const zFactor = zIndex * 10;
        
        // Expansion multiplier (Reduced from 2.5 to 1.6 for gentler movement)
        const expansion = isHovered ? 1.6 : 0.6; 
        
        return (base + zFactor) * expansion;
    };

    return (
        <div 
            className="w-[320px] h-[190px] relative preserve-3d cursor-pointer" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                 transformStyle: 'preserve-3d', 
                 transform: 'rotateX(20deg) rotateY(-20deg)',
                 transition: 'transform 0.6s ease-out'
             }}
        >
            
            {/* Base Card Layer */}
            <div 
                className="absolute inset-0 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] border border-slate-300 bg-white transition-all duration-700 ease-out"
                style={{
                    backgroundColor: settings.backgroundColor,
                    // Subtle scale down on hover to emphasize the floating elements
                    transform: `translateZ(0px) scale(${isHovered ? 0.98 : 1})`, 
                }}
            >
                 {/* HTML Tag Annotation */}
                 <div className={`absolute -left-32 top-1/2 -translate-y-1/2 flex items-center transition-all duration-500 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                    <span className="text-[10px] text-slate-500 font-bold font-mono mr-3 bg-white px-2 py-1 rounded shadow-md border border-slate-200">div.card-container</span>
                    <div className="w-20 h-[2px] bg-slate-300"></div>
                </div>
            </div>

            {/* Elements Floating */}
            {elements.map((el, i) => {
                const z = getDepth(el.type, typeof el.style.zIndex === 'number' ? el.style.zIndex : 0);
                
                return (
                    <div 
                        key={el.id}
                        // CHANGED: Removed elastic bezier, using standard ease-out for smoother feel
                        className="absolute flex items-center justify-center transition-all duration-700 ease-out"
                        style={{
                            left: el.style.left,
                            top: el.style.top,
                            width: el.style.width,
                            height: el.style.height,
                            transform: `translateZ(${z}px)`,
                            // Apply styles directly
                            color: el.style.color,
                            fontSize: el.style.fontSize,
                            fontWeight: el.style.fontWeight,
                            backgroundColor: el.style.backgroundColor !== 'transparent' ? el.style.backgroundColor : undefined,
                            borderRadius: el.style.borderRadius,
                            border: el.style.border,
                            // Add a subtle white backdrop to text to ensure readability if it flies off the card
                            textShadow: el.type === 'text' ? '0 2px 10px rgba(255,255,255,0.8)' : undefined,
                            filter: isHovered ? `drop-shadow(0 10px 10px rgba(0,0,0,0.1))` : `drop-shadow(0 2px 2px rgba(0,0,0,0.05))`
                        }}
                    >
                         {el.type === 'text' && (
                             <span style={{ fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', letterSpacing: 'normal' }}>
                                 {el.content}
                             </span>
                         )}
                         {el.type === 'icon' && (
                             <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
                                <path d={ICON_PATHS[el.content || 'star'] || ''} />
                             </svg>
                         )}
                         
                         {/* Connecting Guide Lines (Visible on Hover) */}
                         <div 
                            className={`absolute top-1/2 left-1/2 w-[1px] bg-blue-400/40 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                            style={{ 
                                height: `${z}px`, 
                                transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(-${z/2}px)`,
                                transformOrigin: 'center center'
                            }} 
                         />
                         
                         {/* Element Type Label (Visible on Hover) */}
                         <div className={`absolute -right-24 top-1/2 -translate-y-1/2 flex items-center transition-all duration-500 delay-75 pointer-events-none z-50 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                             <div className="w-6 h-[2px] bg-blue-400/50 mr-2"></div>
                             <span className="text-[9px] text-blue-600 font-bold font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200 shadow-sm">
                                 {el.type}
                             </span>
                         </div>
                    </div>
                );
            })}
        </div>
    );
};

const LandingDemoSection: React.FC<{ lang: Language }> = ({ lang }) => {
  const [activeStep, setActiveStep] = useState(0);
  const t = TRANSLATIONS[lang];

  // Using TEMPLATES[5] (SaaS Growth) as it's visually rich and clean (White/Purple)
  const templateIndex = 5; 

  const steps = [
    {
      title: "1. " + t.demoStep1Title,
      desc: t.demoStep1Desc,
      component: <ExplodedView elements={TEMPLATES[templateIndex].elements} settings={TEMPLATES[templateIndex].canvasSettings} />
    },
    {
      title: "2. " + t.demoStep2Title,
      desc: t.demoStep2Desc,
      component: (
         <div className="w-[380px] h-[240px] bg-[#1a1b26] rounded-xl border border-blue-500/30 p-6 font-mono text-[10px] text-gray-300 relative overflow-hidden group shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
             {/* Window Controls */}
             <div className="absolute top-3 left-4 flex space-x-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
             </div>
             
             <div className="absolute top-0 left-0 w-full h-8 bg-white/5 border-b border-white/5"></div>

             {/* Code Lines - Matching the SaaS Template */}
             <div className="space-y-2.5 opacity-100 leading-relaxed mt-6 font-medium">
                 <p><span className="text-purple-400">KPI_Retention</span> = </p>
                 <p className="pl-4 text-gray-500">-- Generated by KPI Builder</p>
                 <p className="pl-4"><span className="text-cyan-400">VAR</span> _Bg = <span className="text-green-400">"background-color:#fdfbfc;..."</span></p>
                 <p className="pl-4"><span className="text-cyan-400">VAR</span> _Val = <span className="text-yellow-300">FORMAT([Retention Rate], "0.0%")</span></p>
                 <p className="pl-4"><span className="text-cyan-400">VAR</span> _Churn = <span className="text-yellow-300">[Monthly Churn]</span></p>
                 <p className="pl-4"><span className="text-cyan-400">RETURN</span></p>
                 <p className="pl-8 text-gray-400">"&lt;div style='" & _Bg & "'&gt;" & </p>
                 <p className="pl-8 text-gray-400">"&lt;span class='value'&gt;" & _Val & "&lt;/span&gt;" &</p>
                 <p className="pl-8 text-gray-400">"&lt;/div&gt;"</p>
             </div>
             
             {/* Fake Cursor */}
             <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-blue-400 animate-pulse"></div>
             
             {/* Scanline */}
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent h-[15%] animate-[beam-scan_3s_linear_infinite] pointer-events-none"></div>
         </div>
      )
    }
  ];

  return (
    <section className="relative py-32 border-t border-white/5 bg-[#050505] overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#111_0%,_transparent_60%)] opacity-80 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                
                {/* Left: Text & Navigation */}
                <div>
                    <div className="inline-flex items-center space-x-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="text-blue-400 font-mono text-xs tracking-widest uppercase">Engine Architecture</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-none">
                        {t.demoTitle}
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-lg">
                        {t.demoSubtitle}
                    </p>

                    <div className="space-y-4">
                         {steps.map((s, i) => (
                             <button 
                                key={i}
                                onClick={() => setActiveStep(i)}
                                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${activeStep === i ? 'bg-white/5 border-blue-500/40 shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]' : 'border-white/5 hover:bg-white/5 hover:border-white/10'}`}
                             >
                                 <div className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-500 transition-transform duration-300 ${activeStep === i ? 'scale-y-100' : 'scale-y-0'}`}></div>
                                 <div className="flex items-center justify-between mb-2">
                                    <h4 className={`font-bold text-lg ${activeStep === i ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{s.title}</h4>
                                 </div>
                                 <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors pl-0">{s.desc}</p>
                             </button>
                         ))}
                     </div>
                </div>

                {/* Right: Visualization Stage (Clean Room Theme with Thicker Grid) */}
                <div className="relative h-[600px] w-full bg-[#eef0f5] rounded-[40px] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl ring-4 ring-white/5">
                    
                    {/* Grid Background - Thicker Lines (2px) and slightly darker for visibility */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.06)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.06)_2px,transparent_2px)] bg-[size:40px_40px]"></div>
                    
                    {/* Vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.08)_100%)] pointer-events-none"></div>

                    {/* Animated Component */}
                    <div className="relative z-10 transition-all duration-700 ease-out transform perspective-1000">
                        {steps[activeStep].component}
                    </div>
                    
                    <div className="absolute bottom-8 left-0 w-full text-center">
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center justify-center font-bold">
                            <span className="material-symbols-outlined text-sm mr-2 text-slate-500 animate-spin-slow">settings</span>
                            Interactive Engine Preview
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
};

export default LandingDemoSection;