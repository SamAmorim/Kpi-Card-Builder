import React, { useState } from 'react';
import { TEMPLATES } from '../constants';
import { CanvasElement } from '../types';
import { ICON_PATHS } from '../constants';

interface DemoModalProps {
  onClose: () => void;
}

// Special 3D Render Component with Annotations
const ExplodedView: React.FC<{ elements: CanvasElement[], settings: any }> = ({ elements, settings }) => {
    // We categorize elements to give them depth
    const getDepth = (type: string, zIndex: number = 0) => {
        let base = 0;
        if (type === 'box') base = 0;
        if (type === 'image') base = 40;
        if (type === 'text') base = 80;
        if (type === 'icon') base = 100;
        if (['progress-bar', 'sparkline', 'circular-progress'].includes(type)) base = 60;
        return base + (zIndex * 5);
    };

    return (
        <div className="w-[300px] h-[180px] relative preserve-3d animate-float-3d" 
             style={{ 
                 transformStyle: 'preserve-3d', 
                 transform: 'rotateX(15deg) rotateY(-15deg)'
             }}>
            
            {/* Base Card Layer */}
            <div 
                className="absolute inset-0 rounded-2xl shadow-2xl border border-white/20 group"
                style={{
                    backgroundColor: settings.backgroundColor,
                    transform: 'translateZ(0px)',
                    opacity: 0.95
                }}
            >
                <div className="absolute -left-20 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] text-gray-400 font-mono mr-2">Card Base</span>
                    <div className="w-8 h-px bg-gray-600"></div>
                </div>
            </div>

            {/* Elements Floating */}
            {elements.map((el, i) => {
                const z = getDepth(el.type, typeof el.style.zIndex === 'number' ? el.style.zIndex : 0);
                
                return (
                    <div 
                        key={el.id}
                        className="absolute flex items-center justify-center transition-all duration-500 group"
                        style={{
                            left: el.style.left,
                            top: el.style.top,
                            width: el.style.width,
                            height: el.style.height,
                            transform: `translateZ(${z}px)`,
                            color: el.style.color,
                            fontSize: el.style.fontSize,
                            fontWeight: el.style.fontWeight,
                            backgroundColor: el.style.backgroundColor !== 'transparent' ? el.style.backgroundColor : undefined,
                            borderRadius: el.style.borderRadius,
                            border: el.style.border,
                            filter: `drop-shadow(0 15px 15px rgba(0,0,0,0.3))`
                        }}
                    >
                         {el.type === 'text' && (
                             <span style={{ fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
                                 {el.content}
                             </span>
                         )}
                         {el.type === 'icon' && (
                             <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
                                <path d={ICON_PATHS[el.content || 'star'] || ''} />
                             </svg>
                         )}
                         
                         {/* Connecting Line (Beam) */}
                         <div 
                            className="absolute top-1/2 left-1/2 w-[1px] bg-gradient-to-t from-blue-500/0 via-blue-500/30 to-blue-500/0" 
                            style={{ 
                                height: `${z}px`, 
                                transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(-${z/2}px)`,
                                transformOrigin: 'center center'
                            }} 
                         />
                         
                         {/* Layer Annotation (Visible on Hover) */}
                         <div className="absolute -right-24 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                             <div className="w-6 h-px bg-blue-500/50 mr-2"></div>
                             <span className="text-[9px] text-blue-300 font-mono bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-500/30">
                                 {el.type} (z:{Math.round(z)})
                             </span>
                         </div>
                    </div>
                );
            })}
        </div>
    );
};

const DemoModal: React.FC<DemoModalProps> = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Layer Architecture",
      desc: "Our engine separates styling from logic. Hover over layers to see the DOM structure generated.",
      component: <ExplodedView elements={TEMPLATES[4].elements} settings={TEMPLATES[4].canvasSettings} />
    },
    {
      title: "Compiled DAX",
      desc: "Visual properties are baked into DAX variables. Pure code, zero images.",
      component: (
         <div className="w-full h-full bg-[#0d1117] rounded-xl border border-gray-800 p-6 font-mono text-[10px] text-gray-300 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
             <div className="space-y-2 opacity-90 leading-relaxed">
                 <p><span className="text-purple-400">Measure</span> = </p>
                 <p className="pl-4"><span className="text-gray-500">-- Generated by KPI Builder</span></p>
                 <p className="pl-4"><span className="text-blue-400">VAR</span> _BaseStyle = <span className="text-green-400">"position:relative;..."</span></p>
                 <p className="pl-4"><span className="text-blue-400">VAR</span> _Val = <span className="text-yellow-400">FORMAT([Sales], "$0.0")</span></p>
                 <p className="pl-4"><span className="text-blue-400">RETURN</span></p>
                 <p className="pl-8">"&lt;div style='" & _BaseStyle & "'&gt;" & </p>
                 <p className="pl-8">"&lt;span&gt;" & _Val & "&lt;/span&gt;" &</p>
                 <p className="pl-8">"&lt;/div&gt;"</p>
             </div>
             
             {/* Fake Cursor */}
             <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-blue-400 animate-pulse"></div>
         </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-500"></div>

      <div 
        className="bg-[#050505] w-full max-w-5xl h-[600px] rounded-3xl shadow-2xl flex overflow-hidden relative z-10 border border-white/10 animate-in zoom-in-95 duration-300" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
        >
            <span className="material-symbols-outlined">close</span>
        </button>

        {/* Content Split */}
        <div className="flex w-full">
            
            {/* Left: Text & Nav */}
            <div className="w-1/3 p-10 flex flex-col justify-center border-r border-white/5 bg-[#0a0a0a]">
                 <div className="mb-10">
                     <span className="text-blue-500 font-mono text-xs tracking-widest uppercase mb-2 block">Technology Preview</span>
                     <h2 className="text-3xl font-bold text-white mb-4 tracking-tight leading-tight">Rendering <br/>Engine v2</h2>
                     <p className="text-gray-400 text-sm leading-relaxed">
                         Experience a new way to build Power BI visuals. We bridge the gap between Figma design and DAX execution.
                     </p>
                 </div>

                 <div className="space-y-2">
                     {steps.map((s, i) => (
                         <button 
                            key={i}
                            onClick={() => setActiveStep(i)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${activeStep === i ? 'bg-white/5 border-blue-500/50' : 'border-transparent hover:bg-white/5'}`}
                         >
                             <div className="flex items-center justify-between mb-1">
                                <h4 className={`font-bold text-sm ${activeStep === i ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{s.title}</h4>
                                {activeStep === i && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
                             </div>
                             <p className="text-xs text-gray-500 leading-snug">{s.desc}</p>
                         </button>
                     ))}
                 </div>
            </div>

            {/* Right: The Stage */}
            <div className="w-2/3 relative bg-black flex items-center justify-center perspective-1000 overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#222_1px,_transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)] opacity-30"></div>
                
                {/* Spotlight */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

                {/* Rendered Component */}
                <div className="relative z-10 scale-125 transition-all duration-700">
                    {steps[activeStep].component}
                </div>
                
                <div className="absolute bottom-8 left-0 w-full text-center">
                    <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Interactive 3D Preview</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;