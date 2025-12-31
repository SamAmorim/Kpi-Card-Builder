import React, { useState, useEffect } from 'react';
import { TEMPLATES, ICON_PATHS, TRANSLATIONS } from '../constants';
import { CanvasElement, Language, Template } from '../types';

// Helper to generate chart paths (copied logic for standalone demo)
const getSparklinePath = (data: number[], width: number, height: number, closeLoop = false) => {
    if (!data || data.length === 0) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1 || 1);
    const h = height; 
    let path = 'M ' + data.map((val, i) => {
      const x = i * stepX;
      const y = h - ((val - min) / range) * h; 
      // Add slight padding to y to avoid clipping
      const paddedY = y * 0.8 + (h * 0.1); 
      return `${x},${paddedY}`;
    }).join(' L ');
    
    if (closeLoop) {
        path += ` L ${width},${height} L 0,${height} Z`;
    }
    return path;
};

// Special 3D Render Component with Annotations
const ExplodedView: React.FC<{ elements: CanvasElement[], settings: any }> = ({ elements, settings }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Calculate depth based on element type and z-index
    const getDepth = (type: string, zIndex: number = 0) => {
        let base = 0;
        // Base layers
        if (type === 'box') base = 10;
        
        // Content layers
        if (['image', 'progress-bar', 'sparkline', 'circular-progress', 'area-chart', 'bar-chart'].includes(type)) base = 35;
        if (type === 'icon') base = 50;
        if (type === 'text') base = 65;

        // Add z-index factor 
        const zFactor = zIndex * 5;
        
        // Expansion multiplier - RESTORED TO 2.2 as requested
        const expansion = isHovered ? 2.2 : 0.8; 
        
        return (base + zFactor) * expansion;
    };

    return (
        <div 
            className="w-[340px] h-[180px] relative preserve-3d cursor-pointer group" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                 transformStyle: 'preserve-3d', 
                 // Continuous floating animation when not hovered
                 animation: isHovered ? 'none' : 'demo-card-float 12s ease-in-out infinite',
                 // Specific viewing angle when hovered for better readability
                 transform: isHovered ? 'rotateX(5deg) rotateY(0deg) scale(1.05)' : undefined, 
                 transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
             }}
        >
            <style>{`
                @keyframes demo-card-float {
                    0% { transform: rotateX(20deg) rotateY(-20deg); }
                    25% { transform: rotateX(25deg) rotateY(-10deg); }
                    50% { transform: rotateX(15deg) rotateY(-25deg); }
                    75% { transform: rotateX(22deg) rotateY(-15deg); }
                    100% { transform: rotateX(20deg) rotateY(-20deg); }
                }
            `}</style>
            
            {/* Deep Shadow Layer (Floor Shadow) */}
            <div 
                className="absolute inset-0 rounded-3xl bg-black/40 blur-2xl transition-all duration-700 ease-out"
                style={{
                    transform: `translateZ(-60px) translateY(60px) scale(${isHovered ? 0.8 : 1})`,
                    opacity: isHovered ? 0.2 : 0.4
                }}
            />

            {/* Base Card Layer */}
            <div 
                className="absolute inset-0 rounded-3xl border border-slate-200/50 bg-white transition-all duration-700 ease-out"
                style={{
                    backgroundColor: settings.backgroundColor,
                    // FIX: Gradient Support
                    background: settings.background || settings.backgroundColor,
                    // Dynamic shadow that reacts to hover lift
                    boxShadow: isHovered 
                        ? '0 20px 40px -10px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.5)' 
                        : '0 5px 15px -5px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.5)',
                    transform: `translateZ(0px)`, 
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
                
                // FIX: Element Gradient Support
                const bgStyle: any = {};
                if ((el.style as any).background) {
                    bgStyle.background = (el.style as any).background;
                }

                // Handle Text Gradients in 3D View
                const isTextGradient = (el.style as any).WebkitBackgroundClip === 'text';
                const textGradientStyle = isTextGradient ? {
                    backgroundImage: (el.style as any).backgroundImage,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                } : {};

                return (
                    <div 
                        key={el.id}
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
                            ...bgStyle,
                            // Remove background if it's a text gradient to prevent clipping/box rendering
                            ...(isTextGradient ? { background: 'transparent' } : {}),
                            borderRadius: el.style.borderRadius,
                            border: el.style.border,
                            // Enhanced 3D shadow for floating elements
                            filter: isHovered 
                                ? `drop-shadow(0 ${z/3}px ${z/4}px rgba(0,0,0,0.15))` 
                                : `drop-shadow(0 2px 2px rgba(0,0,0,0.05))`,
                            backfaceVisibility: 'hidden' // Optimize performance
                        }}
                    >
                         {el.type === 'text' && (
                             <span style={{ 
                                 fontFamily: 'Inter, sans-serif', 
                                 whiteSpace: 'nowrap', 
                                 letterSpacing: 'normal',
                                 ...textGradientStyle
                             }}>
                                 {el.content}
                             </span>
                         )}
                         {el.type === 'icon' && (
                             <div style={{
                                width: '100%', 
                                height: '100%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                ...textGradientStyle // Use same logic for icon gradients
                             }}>
                                 {ICON_PATHS[el.content || ''] ? (
                                     <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
                                        <path d={ICON_PATHS[el.content || 'star'] || ''} />
                                     </svg>
                                 ) : (
                                     <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>{el.content}</span>
                                 )}
                             </div>
                         )}
                         
                         {/* --- CHART RENDERING LOGIC --- */}
                         {(el.type === 'sparkline' || el.type === 'area-chart') && (
                             <svg width="100%" height="100%" viewBox={`0 0 ${parseInt(el.style.width?.toString() || '100')} ${parseInt(el.style.height?.toString() || '50')}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                {el.type === 'area-chart' && (
                                    <path 
                                        d={getSparklinePath(el.chartProps?.dataPoints || [], parseInt(el.style.width?.toString() || '100'), parseInt(el.style.height?.toString() || '50'), true)} 
                                        fill={el.chartProps?.backgroundColor || '#dbeafe'} 
                                        stroke="none" 
                                        style={{ opacity: 0.5 }}
                                    />
                                )}
                                <path 
                                    d={getSparklinePath(el.chartProps?.dataPoints || [], parseInt(el.style.width?.toString() || '100'), parseInt(el.style.height?.toString() || '50'))} 
                                    fill="none" 
                                    stroke={el.chartProps?.color || '#3b82f6'} 
                                    strokeWidth={el.chartProps?.strokeWidth || 2} 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                />
                             </svg>
                         )}

                         {el.type === 'progress-bar' && (
                            <div style={{ width: '100%', height: '100%', backgroundColor: el.chartProps?.backgroundColor || '#e2e8f0', borderRadius: el.style.borderRadius, overflow: 'hidden' }}>
                                <div style={{ width: `${el.chartProps?.value || 50}%`, height: '100%', backgroundColor: el.chartProps?.color || '#3b82f6', borderRadius: el.style.borderRadius }} />
                            </div>
                         )}

                         {el.type === 'circular-progress' && (
                             <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="50" cy="50" r="40" fill="none" stroke={el.chartProps?.backgroundColor || '#e2e8f0'} strokeWidth={el.chartProps?.strokeWidth || 8} />
                                <circle cx="50" cy="50" r="40" fill="none" stroke={el.chartProps?.color || '#3b82f6'} strokeWidth={el.chartProps?.strokeWidth || 8} strokeDasharray="251" strokeDashoffset={251 - (251 * (el.chartProps?.value || 0)) / 100} strokeLinecap="round" />
                             </svg>
                         )}

                         {el.type === 'image' && (
                             <img 
                                src={el.chartProps?.imageUrl} 
                                alt="" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: el.style.borderRadius }} 
                             />
                         )}

                         {el.type === 'bar-chart' && (
                             <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', height: '100%' }}>
                                 {(el.chartProps?.dataPoints || [30, 50, 40, 70, 60]).map((val, idx) => (
                                     <div key={idx} style={{ 
                                         width: '12%', 
                                         height: `${val}%`, 
                                         backgroundColor: el.chartProps?.color || '#3b82f6', 
                                         borderRadius: 2,
                                         opacity: 0.8
                                     }} />
                                 ))}
                             </div>
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

  // --- AUTOMATIC TEMPLATE ROTATION LOGIC ---
  const [templateIdx, setTemplateIdx] = useState(0);
  
  // Select distinct high-quality templates for the carousel
  // 1. HR Retention (Green, Donut) - REQUESTED
  // 2. Neon Glass (Cyberpunk, Glass, Glow) - REPLACES 'Command Center'
  // 3. Project Sprint (Blue, Progress/Avatars) - UI Variety
  // 4. Ecommerce Product (Orange, Image) - Image capability
  const demoTemplates: Template[] = [
      TEMPLATES.find(t => t.id === 'hr-retention') || TEMPLATES[0],
      TEMPLATES.find(t => t.id === 'neon-glass') || TEMPLATES[0],
      TEMPLATES.find(t => t.id === 'project-sprint') || TEMPLATES[0],
      TEMPLATES.find(t => t.id === 'ecommerce-prod') || TEMPLATES[0]
  ];

  useEffect(() => {
      // Only rotate if we are on step 0 (Visual Architecture)
      if (activeStep !== 0) return;

      const timer = setInterval(() => {
          setTemplateIdx(prev => (prev + 1) % demoTemplates.length);
      }, 6000); // Rotate every 6 seconds

      return () => clearInterval(timer);
  }, [activeStep]);

  const currentTemplate = demoTemplates[templateIdx];

  const steps = [
    {
      title: "1. " + t.demoStep1Title,
      desc: t.demoStep1Desc,
      component: (
        // Added key to trigger remount animation on template change
        <div key={currentTemplate.id} className="animate-in fade-in zoom-in-95 duration-700">
            <ExplodedView elements={currentTemplate.elements} settings={currentTemplate.canvasSettings} />
        </div>
      )
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

             {/* Code Lines - Revenue Trend specific Logic */}
             <div className="space-y-2.5 opacity-100 leading-relaxed mt-6 font-medium">
                 <p><span className="text-purple-400">KPI_Visual</span> = </p>
                 <p className="pl-4 text-gray-500">-- Generated by KPI Builder</p>
                 <p className="pl-4"><span className="text-cyan-400">VAR</span> _Bg = <span className="text-green-400">"background-color:..."</span></p>
                 <p className="pl-4"><span className="text-cyan-400">VAR</span> _Val = <span className="text-yellow-300">FORMAT([Measure], "0")</span></p>
                 <p className="pl-4"><span className="text-cyan-400">VAR</span> _HTML = </p>
                 <p className="pl-4"><span className="text-cyan-400">RETURN</span></p>
                 <p className="pl-8 text-gray-400">"&lt;div style='" & _Bg & "'&gt;" & </p>
                 <p className="pl-8 text-gray-400">"&lt;span class='val'&gt;" & _Val & "&lt;/span&gt;" &</p>
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
                {/* UPDATED: Removed 'overflow-hidden' from main container, added it to a specific background wrapper */}
                <div className="relative h-[600px] w-full flex items-center justify-center shadow-2xl flex-col z-20">
                    
                    {/* Background Wrapper: Clipped to Rounded Corners */}
                    <div className="absolute inset-0 rounded-[40px] border border-white/10 overflow-hidden bg-[#eef0f5] ring-4 ring-white/5 pointer-events-none">
                        {/* Grid Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.06)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.06)_2px,transparent_2px)] bg-[size:40px_40px]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.08)_100%)]"></div>
                    </div>

                    {/* Content: Free to float outside */}
                    <div className="relative z-10 transition-all duration-700 ease-out transform perspective-1000 mb-10">
                        {steps[activeStep].component}
                    </div>
                    
                    {/* Active Template Indicator (The "Setinha"/Arrow Logic) */}
                    {activeStep === 0 && (
                        <div className="absolute bottom-12 flex items-center space-x-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-lg animate-in slide-in-from-bottom-4 duration-500 z-30">
                            <button 
                                onClick={() => setTemplateIdx(prev => (prev + 1) % demoTemplates.length)}
                                className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg animate-pulse">arrow_forward</span>
                            </button>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Previewing Template</span>
                                <span className="text-xs font-bold text-slate-700 w-32 truncate">{currentTemplate.name}</span>
                            </div>
                            <div className="flex space-x-1">
                                {demoTemplates.map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === templateIdx ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Static Text for Step 2 */}
                    {activeStep === 1 && (
                        <div className="absolute bottom-12 text-center z-30">
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center justify-center font-bold">
                                <span className="material-symbols-outlined text-sm mr-2 text-slate-500 animate-spin-slow">settings</span>
                                DAX Compilation
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    </section>
  );
};

export default LandingDemoSection;