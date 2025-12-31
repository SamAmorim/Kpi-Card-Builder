import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CanvasElement, CanvasSettings, Translation, ConditionalRule, AnimationConfig, AnimationType, AnimationEasing, GlassSettings } from '../types';
import { FONTS, ICONS, ICON_PATHS, GRADIENTS } from '../constants';
import LayersPanel from './LayersPanel';

interface PropertiesPanelProps {
  selectedElement: CanvasElement | undefined;
  selectedIds: string[]; // NEW: Multi-select support
  elements: CanvasElement[];
  canvasSettings: CanvasSettings;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onUpdateCanvas: (updates: Partial<CanvasSettings>) => void;
  onDelete: (id: string) => void;
  onSelect: (ids: string[]) => void; // UPDATED signature
  onReorder: (draggedId: string, targetId: string) => void;
  t: Translation;
}

// ... (Rest of the file imports and helper functions remain unchanged)
// To keep the response concise, I am preserving all helper components and logic above PropertiesPanel component definition.
// Assume all helper components (AccordionSection, Label, ScrubbableInput, etc.) are present here identically.

// --- VISUAL HELPERS & STYLES ---

const PREVIEW_STYLES = `
  /* ENTRY PREVIEWS (Looping for demonstration) */
  @keyframes ui-fade { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
  @keyframes ui-slide-up { 0%, 100% { transform: translateY(8px); opacity: 0; } 50% { transform: translateY(0); opacity: 1; } }
  @keyframes ui-slide-down { 0%, 100% { transform: translateY(-8px); opacity: 0; } 50% { transform: translateY(0); opacity: 1; } }
  @keyframes ui-slide-left { 0%, 100% { transform: translateX(8px); opacity: 0; } 50% { transform: translateX(0); opacity: 1; } }
  @keyframes ui-slide-right { 0%, 100% { transform: translateX(-8px); opacity: 0; } 50% { transform: translateX(0); opacity: 1; } }
  @keyframes ui-scale { 0%, 100% { transform: scale(0.5); opacity: 0; } 50% { transform: scale(1); opacity: 1; } }
  @keyframes ui-bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-6px);} 60% {transform: translateY(-3px);} }
  @keyframes ui-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes ui-rotate { 0% { transform: rotate(0deg); } 25% { transform: rotate(-15deg); } 75% { transform: rotate(15deg); } 100% { transform: rotate(0deg); } }

  /* IDLE PREVIEWS */
  @keyframes ui-float-idle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
  @keyframes ui-breathing-idle { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
  @keyframes ui-heartbeat-idle { 0% { transform: scale(1); } 14% { transform: scale(1.2); } 28% { transform: scale(1); } 42% { transform: scale(1.2); } 70% { transform: scale(1); } }
  @keyframes ui-shimmer-idle { 0%, 100% { opacity: 1; filter: brightness(1); } 50% { filter: brightness(1.5); } }
  @keyframes ui-shake-idle { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
  @keyframes ui-wiggle-idle { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
  @keyframes ui-pulse-idle { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes ui-spin-idle { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes ui-carousel-fade-idle { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
`;

const getPreviewAnimation = (type: string, isIdle: boolean) => {
    if (type === 'none') return 'none';
    const prefix = isIdle ? '-idle' : '';
    // Entry animations use a specific duration to look like "ping-pong" previews
    const dur = isIdle ? '2s' : '1.5s'; 
    return `ui-${type}${prefix} ${dur} ease-in-out infinite`;
};

// ... Include all helper components: AccordionSection, Label, ScrubbableInput, SmartColorPicker, DataGuide, AnimationControl ...
// (Omitting full definitions for brevity as they are unchanged, but they must be present in the final file)
// FOR THE SAKE OF CORRECT XML OUTPUT, I WILL INCLUDE THE FULL FILE CONTENT BELOW.

const AccordionSection: React.FC<{ 
    title: string; 
    icon: string; 
    children: React.ReactNode; 
    defaultOpen?: boolean;
}> = ({ title, icon, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-slate-100 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors group"
            >
                <div className="flex items-center">
                    <span className={`material-symbols-outlined text-base mr-2 transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
                    <span className={`text-xs font-bold transition-colors ${isOpen ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-700'}`}>{title}</span>
                </div>
                <span className={`material-symbols-outlined text-sm text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                </span>
            </button>
            {isOpen && (
                <div className="px-5 pb-5 pt-1 animate-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};

const Label: React.FC<{ children: React.ReactNode, className?: string, onMouseDown?: (e: React.MouseEvent) => void, title?: string }> = ({ children, className = '', onMouseDown, title }) => (
    <label 
        className={`block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 select-none ${className}`}
        onMouseDown={onMouseDown}
        title={title}
    >
        {children}
    </label>
);

const ScrubbableInput: React.FC<{ 
    label?: string, 
    value: number, 
    onChange: (val: number) => void, 
    unit?: string, 
    min?: number, 
    max?: number, 
    step?: number,
    icon?: string
}> = ({ label, value, onChange, unit, min, max, step = 1, icon }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [inputValue, setInputValue] = useState<string>(value.toString());
    const startX = useRef(0);
    const startVal = useRef(0);

    useEffect(() => {
        if (!isDragging && document.activeElement !== document.getElementById(`input-${label}`)) {
            setInputValue(value.toString());
        }
    }, [value, isDragging, label]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        startX.current = e.clientX;
        startVal.current = value;
        document.body.style.cursor = 'ew-resize';
        
        const handleMouseMove = (mv: MouseEvent) => {
            const delta = mv.clientX - startX.current;
            const multiplier = mv.shiftKey ? 10 : (mv.altKey ? 0.1 : 1);
            let newVal = startVal.current + (delta * step * multiplier);
            
            if (min !== undefined) newVal = Math.max(min, newVal);
            if (max !== undefined) newVal = Math.min(max, newVal);
            
            newVal = Math.round(newVal * 100) / 100;
            
            onChange(newVal);
            setInputValue(newVal.toString());
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = 'default';
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [value, onChange, min, max, step]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
            return;
        }
        
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const dir = e.key === 'ArrowUp' ? 1 : -1;
            const multiplier = e.shiftKey ? 10 : 1;
            let newVal = parseFloat(inputValue || '0') + (step * dir * multiplier);
            
            if (min !== undefined) newVal = Math.max(min, newVal);
            if (max !== undefined) newVal = Math.min(max, newVal);
            
            newVal = Math.round(newVal * 100) / 100;
            onChange(newVal);
            setInputValue(newVal.toString());
        }
    };

    const handleBlur = () => {
        let finalVal = parseFloat(inputValue);
        if (isNaN(finalVal)) finalVal = value; 
        if (min !== undefined) finalVal = Math.max(min, finalVal);
        if (max !== undefined) finalVal = Math.min(max, finalVal);
        
        onChange(finalVal);
        setInputValue(finalVal.toString());
    };

    return (
        <div className="flex-1 min-w-[70px]">
            {label && (
                <Label 
                    className="cursor-ew-resize hover:text-blue-500 transition-colors flex items-center gap-1 group"
                    onMouseDown={handleMouseDown}
                    title="Drag to adjust"
                >
                    {icon && <span className="material-symbols-outlined text-[10px] text-slate-400 group-hover:text-blue-500">{icon}</span>}
                    {label}
                </Label>
            )}
            <div className={`flex items-center bg-white border rounded-lg transition-all shadow-sm h-8
                ${isDragging ? 'border-blue-500 ring-1 ring-blue-500/30' : 'border-slate-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50'}
            `}>
                <input
                    id={`input-${label}`}
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    step={step}
                    className="w-full bg-transparent text-xs px-2 outline-none text-slate-700 font-medium font-mono"
                />
                {unit && <span className="text-[9px] text-slate-400 pr-2 select-none font-bold">{unit}</span>}
            </div>
        </div>
    );
};

const SmartColorPicker: React.FC<{ label: string, value: string, onChange: (val: string) => void, allowGradient?: boolean }> = ({ label, value, onChange, allowGradient = true }) => {
    const isGradientValue = value && (value.includes('gradient') || value.includes('url'));
    const [mode, setMode] = useState<'solid' | 'gradient'>(isGradientValue ? 'gradient' : 'solid');

    const handleModeSwitch = (m: 'solid' | 'gradient') => {
        setMode(m);
    };

    useEffect(() => {
        const isGrad = value && (value.includes('gradient') || value.includes('url'));
        if (isGrad && mode === 'solid') setMode('gradient');
        if (!isGrad && mode === 'gradient') setMode('solid');
    }, [value]);

    return (
        <div className="flex-1 mb-3">
            <div className="flex justify-between items-center mb-1.5">
                <Label>{label}</Label>
                {allowGradient && (
                    <div className="flex bg-slate-100 rounded p-0.5">
                        <button onClick={() => handleModeSwitch('solid')} className={`px-2 py-0.5 text-[9px] font-bold rounded ${mode === 'solid' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>Solid</button>
                        <button onClick={() => handleModeSwitch('gradient')} className={`px-2 py-0.5 text-[9px] font-bold rounded ${mode === 'gradient' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>Grad</button>
                    </div>
                )}
            </div>
            
            {mode === 'solid' ? (
                <div className="flex items-center space-x-2">
                    <div className="relative w-8 h-8 rounded-full border border-slate-200 overflow-hidden shadow-sm flex-shrink-0 cursor-pointer hover:scale-105 transition-transform bg-white">
                        <input
                            type="color"
                            value={!isGradientValue ? (value || '#ffffff') : '#ffffff'}
                            onChange={(e) => onChange(e.target.value)}
                            className="absolute inset-0 w-[150%] h-[150%] -top-1 -left-1 cursor-pointer p-0 border-none"
                        />
                    </div>
                    <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 hover:border-slate-300 transition-all">
                        <span className="text-slate-400 text-xs mr-1 select-none">#</span>
                        <input 
                            type="text" 
                            value={!isGradientValue ? (value || '').replace('#', '') : 'FFFFFF'}
                            onChange={(e) => {
                                const clean = e.target.value.replace(/#/g, '');
                                onChange(`#${clean}`);
                            }}
                            className="w-full bg-transparent text-xs outline-none font-medium uppercase text-slate-700"
                            maxLength={7}
                        />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-6 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 max-h-32 overflow-y-auto custom-scrollbar">
                    {GRADIENTS.map((g, i) => (
                        <button
                            key={i}
                            onClick={() => onChange(g.value)}
                            className={`w-6 h-6 rounded-full border transition-all ${value === g.value ? 'border-blue-500 ring-2 ring-blue-200 scale-110' : 'border-slate-200 hover:scale-110'}`}
                            style={{ background: g.value }}
                            title={g.name}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const DataGuide: React.FC<{ type: string; t: Translation }> = ({ type, t }) => {
    let desc = "";
    if (type === 'text') desc = t.dataGuide_text_desc;
    else if (type === 'progress-bar' || type === 'circular-progress') desc = t.dataGuide_progress_desc;
    else if (type === 'image') desc = t.dataGuide_image_desc;
    else if (['bar-chart', 'column-chart', 'area-chart', 'sparkline'].includes(type)) desc = t.dataGuide_chart_desc;

    if (!desc) return null;

    return (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded text-[10px] text-blue-700 flex items-start">
            <span className="material-symbols-outlined text-sm mr-1.5 mt-0.5">info</span>
            <span className="leading-tight">{desc}</span>
        </div>
    );
};

const AnimationControl: React.FC<{ 
    title: string; 
    config: AnimationConfig; 
    onChange: (cfg: AnimationConfig) => void; 
    types: string[]; 
    isIdle?: boolean 
}> = ({ title, config, onChange, types, isIdle }) => {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
             <div className="flex justify-between items-center mb-2">
                 <Label>{title}</Label>
                 {config.type !== 'none' && (
                     <button onClick={() => onChange({ ...config, type: 'none' })} className="text-[10px] text-red-500 hover:underline">Remove</button>
                 )}
             </div>
             
             <div className="grid grid-cols-4 gap-2 mb-3">
                 {types.map(t => {
                     const isSelected = config.type === t;
                     return (
                        <button
                            key={t}
                            onClick={() => onChange({ ...config, type: t as any })}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${isSelected ? 'bg-white border-blue-500 ring-1 ring-blue-500/50 shadow-md' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                            title={t}
                        >
                            <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 mb-1 flex items-center justify-center overflow-hidden">
                                {t === 'none' ? (
                                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                ) : (
                                    <div 
                                        className="w-4 h-4 bg-blue-500 rounded-sm"
                                        style={{ animation: getPreviewAnimation(t, !!isIdle) }}
                                    ></div>
                                )}
                            </div>
                            <span className={`text-[9px] font-bold truncate w-full text-center ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                                {t.replace('-', ' ')}
                            </span>
                        </button>
                     )
                 })}
             </div>

             {config.type !== 'none' && (
                 <div className="space-y-3 animate-in fade-in slide-in-from-top-1 bg-white p-3 rounded border border-slate-100">
                     <div className="grid grid-cols-2 gap-3">
                         <ScrubbableInput label="Duration" value={config.duration} onChange={(v) => onChange({ ...config, duration: v })} unit="s" step={0.1} />
                         <ScrubbableInput label="Delay" value={config.delay} onChange={(v) => onChange({ ...config, delay: v })} unit="s" step={0.1} />
                     </div>
                     <div>
                         <div className="flex justify-between items-center mb-1">
                            <Label>Intensity</Label>
                            <span className="text-[10px] text-slate-400 font-mono">{config.intensity}%</span>
                         </div>
                         <input 
                            type="range" min="0" max="100" value={config.intensity} 
                            onChange={(e) => onChange({ ...config, intensity: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div>
                             <Label>Easing</Label>
                             <select 
                                value={config.easing} 
                                onChange={(e) => onChange({ ...config, easing: e.target.value as any })}
                                className="w-full text-xs border border-slate-200 rounded-lg p-1.5 bg-white outline-none focus:border-blue-500 cursor-pointer"
                             >
                                 {['linear', 'ease', 'ease-out', 'ease-in-out', 'elastic', 'bounce-out'].map(e => <option key={e} value={e}>{e}</option>)}
                             </select>
                        </div>
                     </div>
                 </div>
             )}
        </div>
    );
};

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedElement,
  selectedIds,
  elements,
  canvasSettings,
  onUpdateElement, 
  onUpdateCanvas,
  onDelete,
  onSelect,
  onReorder,
  t 
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'layers' | 'animations'>('properties');
  const [newRule, setNewRule] = useState<Partial<ConditionalRule>>({
     targetProperty: 'color', operator: '>', value: 0, outputColor: '#ff0000'
  });
  
  const [glowColor, setGlowColor] = useState('#3b82f6');
  const [glowBlur, setGlowBlur] = useState(20);

  // ... (Event handlers handleStyleChange, etc. remain unchanged)
  // Re-implementing them here for completeness since they use selectedElement
  const handleStyleChange = (key: keyof React.CSSProperties, value: any) => {
    if (!selectedElement) return;
    
    if (key === 'color') {
        const isGradient = value.includes('gradient');
        if (isGradient) {
            onUpdateElement(selectedElement.id, {
                style: {
                    ...selectedElement.style,
                    backgroundImage: value,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent'
                }
            });
        } else {
            const newStyle = { ...selectedElement.style, color: value };
            delete (newStyle as any).backgroundImage;
            delete (newStyle as any).WebkitBackgroundClip;
            delete (newStyle as any).backgroundClip;
            delete (newStyle as any).WebkitTextFillColor;
            
            onUpdateElement(selectedElement.id, { style: newStyle });
        }
        return;
    }

    if (key === 'backgroundColor' && typeof value === 'string' && value.includes('gradient')) {
        onUpdateElement(selectedElement.id, {
            style: { ...selectedElement.style, background: value, backgroundColor: undefined }
        });
    } else if (key === 'backgroundColor' && typeof value === 'string' && !value.includes('gradient')) {
        const newStyle = { ...selectedElement.style, backgroundColor: value };
        if ('background' in newStyle) delete (newStyle as any).background;
        onUpdateElement(selectedElement.id, { style: newStyle });
    } else {
        onUpdateElement(selectedElement.id, {
            style: { ...selectedElement.style, [key]: value }
        });
    }
  };

  const glass = selectedElement?.glass || { enabled: false, blur: 5, opacity: 20 };

  const handleRotationChange = (deg: number) => {
    if (!selectedElement) return;
    onUpdateElement(selectedElement.id, {
        style: { ...selectedElement.style, transform: `rotate(${deg}deg)` }
    });
  };
  
  const getRotation = (transform: string | undefined): number => {
      if (!transform) return 0;
      const match = transform.match(/rotate\(([-]?\d+)deg\)/);
      return match ? parseInt(match[1]) : 0;
  };

  const handleCenterElement = () => {
      if (!selectedElement) return;
      const w = parseInt(selectedElement.style.width?.toString() || '0');
      const h = parseInt(selectedElement.style.height?.toString() || '0');
      const left = (canvasSettings.width - w) / 2;
      const top = (canvasSettings.height - h) / 2;
      onUpdateElement(selectedElement.id, {
          style: { ...selectedElement.style, left, top }
      });
  };

  const handleChartPropChange = (key: string, value: any) => {
      if (!selectedElement) return;
      onUpdateElement(selectedElement.id, {
          chartProps: { ...selectedElement.chartProps, [key]: value }
      });
  };

  const handleGlassChange = (updates: Partial<GlassSettings>) => {
      if (!selectedElement) return;
      onUpdateElement(selectedElement.id, {
          glass: { ...glass, ...updates }
      });
  };

  const addConditionalRule = () => {
      if (!selectedElement) return;
      const rule: ConditionalRule = {
          id: uuidv4(),
          targetProperty: newRule.targetProperty || 'color',
          operator: newRule.operator || '>',
          value: newRule.value || 0,
          outputColor: newRule.outputColor || '#ff0000'
      };
      const existing = selectedElement.conditionalFormatting || [];
      onUpdateElement(selectedElement.id, {
          conditionalFormatting: [...existing, rule]
      });
  };

  const removeConditionalRule = (ruleId: string) => {
      if (!selectedElement) return;
      const existing = selectedElement.conditionalFormatting || [];
      onUpdateElement(selectedElement.id, {
          conditionalFormatting: existing.filter(r => r.id !== ruleId)
      });
  };

  const handleAnimationChange = (key: 'entry' | 'hover' | 'idle', config: AnimationConfig) => {
      if (!selectedElement) return;
      onUpdateElement(selectedElement.id, {
          animation: { ...selectedElement.animation, [key]: config }
      });
  };
  
  const applyGlow = () => {
      if (!selectedElement) return;
      const shadow = `0 0 ${glowBlur}px ${glowColor}`;
      onUpdateElement(selectedElement.id, {
          style: { ...selectedElement.style, boxShadow: shadow }
      });
  };
  
  const removeGlow = () => {
      if (!selectedElement) return;
      onUpdateElement(selectedElement.id, {
          style: { ...selectedElement.style, boxShadow: 'none' }
      });
  };

  const renderCanvasSettings = () => (
      <div className="p-5 space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg mb-2">
              <Label className="mb-0 text-blue-800">Auto-Fit to Visual</Label>
              <div className="relative inline-block w-8 align-middle select-none transition duration-200 ease-in">
                  <input 
                      type="checkbox" 
                      name="toggleResponsive" 
                      id="toggleResponsive"
                      checked={canvasSettings.isResponsive || false}
                      onChange={(e) => onUpdateCanvas({ isResponsive: e.target.checked })}
                      className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 border-blue-200 appearance-none cursor-pointer checked:right-0 right-4"
                  />
                  <label htmlFor="toggleResponsive" className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer ${canvasSettings.isResponsive ? 'bg-blue-600' : 'bg-slate-300'}`}></label>
              </div>
          </div>
          {canvasSettings.isResponsive && (
              <div className="text-[10px] text-blue-600 italic bg-blue-50 p-2 rounded border border-blue-100 mb-2">
                  Generated code will set width/height to 100% to fill the Power BI visual container. Use dimensions below for design reference only.
              </div>
          )}

          <div className="grid grid-cols-2 gap-3">
              <ScrubbableInput label={t.width} value={canvasSettings.width} onChange={(v) => onUpdateCanvas({ width: v })} unit="px" />
              <ScrubbableInput label={t.height} value={canvasSettings.height} onChange={(v) => onUpdateCanvas({ height: v })} unit="px" />
          </div>
          <div>
            <SmartColorPicker 
                key="canvas-bg" 
                label="Background Color" 
                value={(canvasSettings as any).background || canvasSettings.backgroundColor} 
                onChange={(v) => {
                    if (v.includes('gradient')) onUpdateCanvas({ background: v, backgroundColor: undefined });
                    else onUpdateCanvas({ backgroundColor: v, background: undefined });
                }} 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
             <ScrubbableInput label={t.borderRadius} value={canvasSettings.borderRadius} onChange={(v) => onUpdateCanvas({ borderRadius: v })} unit="px" />
             <ScrubbableInput label={t.borderWidth} value={canvasSettings.borderWidth} onChange={(v) => onUpdateCanvas({ borderWidth: v })} unit="px" />
          </div>
          <SmartColorPicker key="canvas-border" label={t.borderColor} value={canvasSettings.borderColor} onChange={(v) => onUpdateCanvas({ borderColor: v })} allowGradient={false} />
          
          <div className="flex items-center justify-between">
              <Label>{t.showShadow}</Label>
              <input type="checkbox" checked={canvasSettings.showShadow} onChange={(e) => onUpdateCanvas({ showShadow: e.target.checked })} className="w-4 h-4" />
          </div>
      </div>
  );

  const renderElementProperties = () => {
    if (!selectedElement) return null;
    
    const currentForegroundColor = (selectedElement.style as any).backgroundImage 
        ? (selectedElement.style as any).backgroundImage 
        : selectedElement.style.color || '#000000';

    const supportsShape = ['box', 'image', 'icon', 'progress-bar', 'table'].includes(selectedElement.type);
    
    return (
        <div className="space-y-0 pb-20">
            <div className="p-5 border-b border-slate-100">
                <Label>Power BI Variable Name</Label>
                <input
                    type="text"
                    value={selectedElement.name}
                    onChange={(e) => onUpdateElement(selectedElement.id, { name: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-slate-900 font-bold focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-sm placeholder-slate-400"
                    placeholder="e.g. TotalSales"
                />
                <DataGuide type={selectedElement.type} t={t} />
            </div>

            {selectedElement.type === 'text' && (
                <AccordionSection title={t.typography} icon="text_fields">
                    <div className="space-y-4">
                        <div>
                            <Label>Text Content</Label>
                            <textarea
                                value={selectedElement.content}
                                onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 min-h-[60px] text-slate-800 font-medium shadow-sm resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Font Family</Label>
                                <select 
                                    value={selectedElement.style.fontFamily?.toString().split(',')[0].replace(/['"]/g, '') || 'Inter'}
                                    onChange={(e) => handleStyleChange('fontFamily', `'${e.target.value}', sans-serif`)}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none text-slate-700 font-medium shadow-sm focus:border-blue-500"
                                >
                                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                            <ScrubbableInput label="Size" value={parseInt(selectedElement.style.fontSize?.toString() || '16')} onChange={(v) => handleStyleChange('fontSize', v)} unit="px" />
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                {['left', 'center', 'right'].map((align) => (
                                <button
                                    key={align}
                                    onClick={() => handleStyleChange('textAlign', align)}
                                    className={`px-3 py-2 hover:bg-slate-50 transition-colors ${selectedElement.style.textAlign === align ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">format_align_{align}</span>
                                </button>
                                ))}
                            </div>
                            <button
                                onClick={() => handleStyleChange('fontWeight', selectedElement.style.fontWeight === 'bold' ? 'normal' : 'bold')}
                                className={`px-4 py-2 rounded-lg border text-xs font-bold transition-colors shadow-sm ${selectedElement.style.fontWeight === 'bold' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}
                            >
                                Bold
                            </button>
                        </div>
                    </div>
                </AccordionSection>
            )}
            
             {selectedElement.type === 'icon' && (
                <AccordionSection title={t.selectIcon} icon="star">
                    <div className="grid grid-cols-6 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 max-h-48 overflow-y-auto custom-scrollbar">
                        {ICONS.map(iconKey => (
                            <button 
                                key={iconKey}
                                onClick={() => onUpdateElement(selectedElement.id, { content: iconKey })}
                                className={`aspect-square flex items-center justify-center rounded hover:bg-white hover:shadow-sm transition-all ${selectedElement.content === iconKey ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                                title={iconKey}
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                    <path d={ICON_PATHS[iconKey]} />
                                </svg>
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                            <Label>Or type Icon ID (Google Fonts)</Label>
                            <a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-500 hover:underline flex items-center font-bold">
                                Find ID <span className="material-symbols-outlined text-[10px] ml-0.5">open_in_new</span>
                            </a>
                        </div>
                        <input 
                            type="text" 
                            value={selectedElement.content || ''} 
                            onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                            placeholder="e.g. rocket_launch"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none text-slate-700 font-mono focus:border-blue-500 shadow-sm"
                        />
                    </div>
                </AccordionSection>
             )}

            {(selectedElement.type === 'progress-bar' || selectedElement.type === 'circular-progress') && (
                 <AccordionSection title="Progress Settings" icon="linear_scale">
                    <div className="space-y-4">
                         <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                             <input type="range" min="0" max="100" value={selectedElement.chartProps?.value || 0} onChange={(e) => handleChartPropChange('value', parseInt(e.target.value))} className="flex-1 accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                             <span className="text-xs font-mono w-10 text-right font-bold text-blue-600">{selectedElement.chartProps?.value}%</span>
                         </div>
                         <div className="space-y-3">
                             <SmartColorPicker key={`${selectedElement.id}-chart-fill`} label="Fill Color" value={selectedElement.chartProps?.color || '#000000'} onChange={(v) => handleChartPropChange('color', v)} />
                             <SmartColorPicker key={`${selectedElement.id}-chart-track`} label="Track Color" value={selectedElement.chartProps?.backgroundColor || '#e0e0e0'} onChange={(v) => handleChartPropChange('backgroundColor', v)} />
                         </div>
                         {selectedElement.type === 'circular-progress' && (
                             <ScrubbableInput label="Thickness" value={selectedElement.chartProps?.strokeWidth || 8} onChange={(v) => handleChartPropChange('strokeWidth', v)} unit="px" min={1} max={50} step={1} />
                         )}
                    </div>
                 </AccordionSection>
            )}
            
            {(selectedElement.type === 'sparkline' || selectedElement.type === 'bar-chart' || selectedElement.type === 'area-chart' || selectedElement.type === 'column-chart') && (
                 <AccordionSection title="Chart Data" icon="insert_chart">
                    <div className="space-y-3">
                         <div>
                            <Label>Data Points (Static Preview)</Label>
                            <input 
                                type="text"
                                value={selectedElement.chartProps?.dataPoints?.join(', ') || ''}
                                onChange={(e) => {
                                    const points = e.target.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
                                    handleChartPropChange('dataPoints', points);
                                }}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-slate-700 font-mono shadow-sm focus:border-blue-500"
                                placeholder="10, 20, 15..."
                            />
                         </div>
                         <div className="space-y-3">
                             <SmartColorPicker key={`${selectedElement.id}-chart-color`} label="Color" value={selectedElement.chartProps?.color || '#3b82f6'} onChange={(v) => handleChartPropChange('color', v)} />
                         </div>
                    </div>
                 </AccordionSection>
            )}
            
             {selectedElement.type === 'image' && (
                <AccordionSection title="Image Source" icon="image">
                    <Label>{t.imageUrl}</Label>
                    <input
                        type="text"
                        value={selectedElement.chartProps?.imageUrl || ''}
                        onChange={(e) => handleChartPropChange('imageUrl', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-slate-700 mb-3 shadow-sm focus:border-blue-500"
                        placeholder="https://..."
                    />
                </AccordionSection>
            )}

            <AccordionSection title={t.appearance} icon="brush">
                 <div className="space-y-4 mb-4">
                     {(selectedElement.type === 'text' || selectedElement.type === 'icon') && (
                         <SmartColorPicker 
                            key={`${selectedElement.id}-fg`}
                            label="Foreground" 
                            value={currentForegroundColor} 
                            onChange={(v) => handleStyleChange('color', v)} 
                         />
                     )}
                     
                     <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <Label>Background</Label>
                            <button 
                                onClick={() => handleStyleChange('backgroundColor', 'transparent')}
                                className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors flex items-center ${selectedElement.style.backgroundColor === 'transparent' ? 'bg-blue-50 text-blue-600 border-blue-200 font-bold' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                title="Set Transparent"
                            >
                                <span className="material-symbols-outlined text-[10px] mr-1">grid_off</span> None
                            </button>
                        </div>
                        <SmartColorPicker 
                            key={`${selectedElement.id}-bg`}
                            label="" 
                            value={(selectedElement.style as any).background || selectedElement.style.backgroundColor?.toString() || '#ffffff'}
                            onChange={(v) => {
                                handleStyleChange('backgroundColor', v); 
                            }} 
                        />
                     </div>
                 </div>
                 
                 {supportsShape && (
                     <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                         <div className="flex justify-between items-center mb-2">
                             <Label>Shape & Border</Label>
                         </div>
                         
                         <div className="mb-3">
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-slate-500">Corner Radius</span>
                                <span className="text-[10px] font-bold text-slate-700">{parseInt(selectedElement.style.borderRadius?.toString() || '0')}px</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={parseInt(selectedElement.style.borderRadius?.toString() || '0')}
                                    onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
                                    className="flex-1 accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                 />
                                 <div className="flex bg-white rounded border border-slate-200">
                                     <button onClick={() => handleStyleChange('borderRadius', 0)} className="p-1 hover:bg-slate-50" title="Square"><div className="w-2 h-2 border border-slate-400"></div></button>
                                     <button onClick={() => handleStyleChange('borderRadius', 999)} className="p-1 hover:bg-slate-50" title="Circle"><div className="w-2 h-2 border border-slate-400 rounded-full"></div></button>
                                 </div>
                             </div>
                         </div>

                         <div className="grid grid-cols-2 gap-2">
                             <ScrubbableInput label="Border Width" value={parseInt(selectedElement.style.borderWidth?.toString() || '0')} onChange={(v) => {
                                 if (v > 0) handleStyleChange('borderStyle', 'solid');
                                 handleStyleChange('borderWidth', v);
                             }} unit="px" />
                             <SmartColorPicker key={`${selectedElement.id}-border-col`} label="Border Color" value={selectedElement.style.borderColor?.toString() || '#e2e8f0'} onChange={(v) => handleStyleChange('borderColor', v)} allowGradient={false} />
                         </div>

                         {selectedElement.type === 'image' && (
                             <div className="mt-3">
                                 <Label>Image Fit</Label>
                                 <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                     {['cover', 'contain', 'fill'].map((fit) => (
                                         <button
                                             key={fit}
                                             onClick={() => handleStyleChange('objectFit', fit)}
                                             className={`flex-1 py-1.5 text-[10px] uppercase font-bold transition-colors ${selectedElement.style.objectFit === fit ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:bg-slate-50'}`}
                                         >
                                             {fit}
                                         </button>
                                     ))}
                                 </div>
                             </div>
                         )}
                     </div>
                 )}

                 <div className="mb-4">
                     <Label>Quick Shadows</Label>
                     <div className="flex space-x-2">
                         {[
                             { name: 'None', val: 'none', bg: '#f1f5f9' },
                             { name: 'Soft', val: '0 4px 6px -1px rgba(0,0,0,0.1)', shadow: '0 2px 4px rgba(0,0,0,0.1)' },
                             { name: 'Mid', val: '0 10px 15px -3px rgba(0,0,0,0.1)', shadow: '0 4px 8px rgba(0,0,0,0.15)' },
                             { name: 'Hard', val: '4px 4px 0px rgba(0,0,0,1)', shadow: '2px 2px 0px black' },
                             { name: 'Glow', val: '0 0 15px rgba(59, 130, 246, 0.5)', shadow: '0 0 8px rgba(59,130,246,0.6)' }
                         ].map(p => (
                             <button
                                key={p.name}
                                onClick={() => handleStyleChange('boxShadow', p.val)}
                                className="flex-1 h-10 rounded border border-slate-200 hover:border-blue-400 bg-white flex items-center justify-center transition-all group relative overflow-hidden"
                                title={p.name}
                             >
                                 <div 
                                    className="w-4 h-4 bg-white rounded border border-slate-200" 
                                    style={{ boxShadow: p.shadow, backgroundColor: p.bg || 'white' }} 
                                 />
                             </button>
                         ))}
                     </div>
                 </div>

                 <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                     <div className="flex items-center justify-between mb-2">
                        <Label>Advanced Effects</Label>
                        <button 
                            onClick={removeGlow}
                            className="text-[9px] text-slate-400 hover:text-red-500"
                            title="Remove Effects"
                        >
                            Reset
                        </button>
                     </div>
                     <div className="grid grid-cols-2 gap-3 mb-2">
                         <SmartColorPicker key={`${selectedElement.id}-glow`} label="Glow Color" value={glowColor} onChange={setGlowColor} allowGradient={false} />
                         <ScrubbableInput label="Blur (px)" value={glowBlur} onChange={setGlowBlur} min={0} max={100} />
                     </div>
                     <button 
                         onClick={applyGlow}
                         className="w-full bg-white border border-slate-200 text-slate-600 text-[10px] font-bold py-1.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                     >
                         Apply Glow / Shadow
                     </button>
                 </div>

                 <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                     <div className="flex items-center justify-between mb-3">
                        <Label>{t.glassEffect}</Label>
                        <div className="relative inline-block w-8 mr-1 align-middle select-none transition duration-200 ease-in">
                            <input 
                                type="checkbox" 
                                name="toggleGlass" 
                                id="toggleGlass"
                                checked={glass.enabled}
                                onChange={(e) => handleGlassChange({ enabled: e.target.checked })}
                                className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 border-slate-300 appearance-none cursor-pointer checked:right-0 right-4"
                            />
                            <label htmlFor="toggleGlass" className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer ${glass.enabled ? 'bg-blue-600' : 'bg-slate-300'}`}></label>
                        </div>
                     </div>
                     
                     {glass.enabled && (
                         <div className="space-y-3 animate-in slide-in-from-top-2 fade-in">
                             <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-slate-500">{t.blur}</span>
                                    <span className="text-[10px] text-slate-700 font-bold">{glass.blur}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={glass.blur}
                                    onChange={(e) => handleGlassChange({ blur: parseInt(e.target.value) })}
                                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                             </div>
                             <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-slate-500">{t.glassOpacity}</span>
                                    <span className="text-[10px] text-slate-700 font-bold">{glass.opacity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={glass.opacity}
                                    onChange={(e) => handleGlassChange({ opacity: parseInt(e.target.value) })}
                                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                             </div>
                         </div>
                     )}
                 </div>
                 
                 <div>
                    <div className="flex justify-between items-center mb-1">
                        <Label>{t.opacity}</Label>
                        <span className="text-[10px] text-slate-600 font-bold">{Math.round((parseFloat(selectedElement.style.opacity?.toString() || '1') * 100))}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={(parseFloat(selectedElement.style.opacity?.toString() || '1') * 100)}
                        onChange={(e) => handleStyleChange('opacity', parseInt(e.target.value) / 100)}
                        className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                 </div>
            </AccordionSection>

            <AccordionSection title={t.layout} icon="open_with">
                <div className="mb-4">
                    <div className="text-[9px] text-slate-400 font-bold uppercase mb-2">Position</div>
                    <div className="grid grid-cols-2 gap-3">
                        <ScrubbableInput label="X" value={parseInt(selectedElement.style.left?.toString() || '0')} onChange={(v) => handleStyleChange('left', v)} icon="east" />
                        <ScrubbableInput label="Y" value={parseInt(selectedElement.style.top?.toString() || '0')} onChange={(v) => handleStyleChange('top', v)} icon="south" />
                    </div>
                </div>

                <div className="mb-4">
                    <div className="text-[9px] text-slate-400 font-bold uppercase mb-2">Dimensions</div>
                    <div className="grid grid-cols-2 gap-3">
                        <ScrubbableInput label="W" value={parseInt(selectedElement.style.width?.toString() || '0')} onChange={(v) => handleStyleChange('width', v)} icon="width" />
                        <ScrubbableInput label="H" value={parseInt(selectedElement.style.height?.toString() || '0')} onChange={(v) => handleStyleChange('height', v)} icon="height" />
                    </div>
                </div>

                <div className="mb-4">
                    <div className="text-[9px] text-slate-400 font-bold uppercase mb-2">Transform</div>
                    <div className="grid grid-cols-2 gap-3">
                        <ScrubbableInput label="Rotation" value={getRotation(selectedElement.style.transform?.toString())} onChange={handleRotationChange} unit="°" icon="rotate_right" />
                    </div>
                </div>

                <button onClick={handleCenterElement} className="w-full flex items-center justify-center p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 text-[10px] font-bold transition-colors" title="Center on Canvas">
                    <span className="material-symbols-outlined text-sm mr-1">center_focus_strong</span> Center
                </button>
            </AccordionSection>

            {(selectedElement.type === 'text' || selectedElement.type === 'progress-bar' || selectedElement.type === 'icon' || selectedElement.type === 'circular-progress') && (
                <AccordionSection title={t.conditionalLogic} icon="rule" defaultOpen={false}>
                     <div className="flex items-center justify-between mb-3">
                         <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-200">{selectedElement.conditionalFormatting?.length || 0} Rules Active</span>
                     </div>
                     <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 mb-3">
                        <div className="flex space-x-2 mb-2">
                             <select className="flex-1 text-[10px] border border-slate-200 rounded-lg bg-white p-1.5 text-slate-700 font-medium outline-none focus:border-blue-500" value={newRule.operator} onChange={(e) => setNewRule({...newRule, operator: e.target.value as any})}>
                                 <option>{'>'}</option><option>{'<'}</option><option>{'='}</option>
                             </select>
                             <input type="number" className="w-14 text-[10px] border border-slate-200 rounded-lg p-1.5 text-center bg-white text-slate-700 font-medium outline-none focus:border-blue-500" value={newRule.value} onChange={(e) => setNewRule({...newRule, value: parseFloat(e.target.value)})} />
                             <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0">
                                <input type="color" className="absolute -top-2 -left-2 w-[200%] h-[200%] cursor-pointer p-0 m-0" value={newRule.outputColor} onChange={(e) => setNewRule({...newRule, outputColor: e.target.value})} />
                             </div>
                        </div>
                        <button onClick={addConditionalRule} className="w-full bg-white border border-slate-200 text-slate-600 text-[10px] font-bold py-2 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex justify-center items-center">
                            <span className="material-symbols-outlined text-sm mr-1">add</span> {t.addRule}
                        </button>
                     </div>
                     <div className="space-y-2">
                         {selectedElement.conditionalFormatting?.map(rule => (
                             <div key={rule.id} className="flex items-center justify-between text-xs bg-white border border-slate-200 p-2 rounded-lg shadow-sm">
                                 <span className="font-mono text-slate-600 font-bold ml-1">{rule.operator} {rule.value}</span>
                                 <div className="flex items-center space-x-3">
                                     <div className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" style={{backgroundColor: rule.outputColor}}></div>
                                     <button onClick={() => removeConditionalRule(rule.id)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-base">close</span></button>
                                 </div>
                             </div>
                         ))}
                     </div>
                </AccordionSection>
            )}
        </div>
    );
  };

  return (
    <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 z-20 shadow-xl">
        <style>{PREVIEW_STYLES}</style>
        
        <div className="flex border-b border-slate-100 bg-white">
           {(['properties', 'animations', 'layers'] as const).map(tab => (
               <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? 'text-blue-600 bg-slate-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
               >
                   {tab === 'properties' ? t.properties : tab === 'animations' ? t.animations : t.layers}
                   {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
               </button>
           ))}
       </div>

       <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
           {activeTab === 'layers' && (
               <LayersPanel 
                   elements={elements} 
                   selectedIds={selectedIds} // Updated Prop
                   onSelect={onSelect} 
                   onReorder={onReorder} 
                   onDelete={onDelete} 
                   t={t} 
               />
           )}

           {activeTab === 'properties' && (
               <>
                   {!selectedElement ? (
                       <>
                           <div className="p-4 bg-blue-50 border-b border-blue-100">
                               <h3 className="text-xs font-bold text-blue-600 flex items-center">
                                   <span className="material-symbols-outlined text-base mr-2">settings</span>
                                   {t.canvasSettings}
                               </h3>
                           </div>
                           {renderCanvasSettings()}
                       </>
                   ) : (
                       <>
                           <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
                               <div className="flex items-center">
                                   <span className="material-symbols-outlined text-slate-400 mr-2 text-lg">
                                       {selectedElement.type === 'text' ? 'title' : selectedElement.type === 'box' ? 'check_box_outline_blank' : selectedElement.type === 'image' ? 'image' : 'star'}
                                   </span>
                                   <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{selectedElement.name}</span>
                               </div>
                               <button onClick={() => onDelete(selectedElement.id)} className="text-slate-400 hover:text-red-500 transition-colors" title="Delete Element">
                                   <span className="material-symbols-outlined text-lg">delete</span>
                               </button>
                           </div>
                           {renderElementProperties()}
                       </>
                   )}
               </>
           )}

           {activeTab === 'animations' && (
               <div className="p-5">
                   {!selectedElement ? (
                       <div className="text-center py-10 text-slate-400">
                           <span className="material-symbols-outlined text-3xl mb-2">animation</span>
                           <p className="text-xs">{t.noSelection}</p>
                       </div>
                   ) : (
                       <div className="space-y-6">
                           <AnimationControl 
                               key={`${selectedElement.id}-entry`}
                               title={t.entryAnimation} 
                               config={selectedElement.animation?.entry || { type: 'none', duration: 0.5, delay: 0, easing: 'ease-out', intensity: 50 }} 
                               onChange={(cfg) => handleAnimationChange('entry', cfg)} 
                               types={['none', 'fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'scale', 'bounce', 'spin']}
                           />

                           <AnimationControl 
                               key={`${selectedElement.id}-hover`}
                               title={t.hoverEffect} 
                               config={selectedElement.animation?.hover || { type: 'none', duration: 0.3, delay: 0, easing: 'ease', intensity: 50 }} 
                               onChange={(cfg) => handleAnimationChange('hover', cfg)} 
                               types={['none', 'scale', 'slide-up', 'slide-right', 'rotate']}
                           />
                           
                           <AnimationControl 
                               key={`${selectedElement.id}-idle`}
                               title="Idle / Loop" 
                               config={selectedElement.animation?.idle || { type: 'none', duration: 2, delay: 0, easing: 'linear', intensity: 50, infinite: true }} 
                               onChange={(cfg) => handleAnimationChange('idle', cfg)} 
                               types={['none', 'float', 'breathing', 'heartbeat', 'shimmer', 'shake', 'wiggle', 'pulse', 'spin']} 
                               isIdle
                           />
                       </div>
                   )}
               </div>
           )}
       </div>
    </div>
  );
};

export default PropertiesPanel;